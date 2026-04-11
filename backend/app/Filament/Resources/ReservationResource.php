<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ReservationResource\Pages;
use App\Models\Reservation;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Support\Facades\Storage;

class ReservationResource extends Resource
{
    protected static ?string $model = Reservation::class;

    protected static ?string $navigationIcon = 'heroicon-o-bookmark';

    protected static ?int $navigationSort = 2;

    public static function getNavigationGroup(): ?string
    {
        return __('admin.nav.customer_service');
    }

    public static function getNavigationLabel(): string
    {
        return __('admin.reservation.nav');
    }

    public static function getModelLabel(): string
    {
        return __('admin.reservation.label');
    }

    public static function getPluralModelLabel(): string
    {
        return __('admin.reservation.plural');
    }

    public static function getNavigationBadge(): ?string
    {
        return static::getModel()::pending()->count() ?: null;
    }

    public static function form(Form $form): Form
    {
        return $form->schema([
            Forms\Components\Section::make(__('admin.reservation.section_customer'))->columns(2)->schema([
                Forms\Components\TextInput::make('customer_name')->label('Name')->required(),
                Forms\Components\TextInput::make('customer_email')->label('E-Mail')->required()->email(),
                Forms\Components\TextInput::make('customer_phone')->label(__('admin.reservation.phone'))->required(),
                Forms\Components\TextInput::make('payment_reference')->label(__('admin.reservation.payment_reference'))->disabled(),
            ]),
            Forms\Components\Section::make(__('admin.reservation.section_reservation'))->columns(2)->schema([
                Forms\Components\Select::make('vehicle_id')->label(__('admin.reservation.vehicle'))
                    ->relationship('vehicle', 'brand')
                    ->getOptionLabelFromRecordUsing(fn ($record) => "{$record->brand} {$record->model} ({$record->year})")
                    ->required(),
                Forms\Components\TextInput::make('deposit_amount')->label(__('admin.reservation.deposit_eur'))->numeric()->prefix('€'),
                Forms\Components\Select::make('bank_transfer_status')->label(__('admin.reservation.payment_status'))
                    ->options([
                        'pending' => __('admin.reservation.payment_pending'),
                        'confirmed' => __('admin.reservation.payment_confirmed'),
                        'cancelled' => __('admin.reservation.payment_cancelled'),
                        'expired' => __('admin.reservation.payment_expired'),
                        'refunded' => __('admin.reservation.payment_refunded'),
                    ]),
                Forms\Components\Select::make('purchase_step')->label('Kaufschritt')
                    ->options([
                        'details' => 'Persönliche Daten',
                        'invoice' => 'Rechnung',
                        'signature' => 'Vertrag / Unterschrift',
                        'payment' => 'Zahlungsnachweis',
                        'completed' => 'Abgeschlossen',
                    ])
                    ->disabled(),
                Forms\Components\DateTimePicker::make('reservation_expires_at')->label(__('admin.reservation.expiry_date')),
            ]),
            Forms\Components\Section::make('Dokumente')->columns(2)->schema([
                Forms\Components\Placeholder::make('contract_info')
                    ->label('Vertrag (PDF)')
                    ->content(function (Reservation $record): string {
                        if ($record->contract_path && Storage::disk('public')->exists($record->contract_path)) {
                            return '✅ Vertrag generiert am '.($record->contract_generated_at?->format('d.m.Y H:i') ?? '—');
                        }

                        return '⏳ Noch nicht generiert';
                    }),
                Forms\Components\Placeholder::make('signed_contract_info')
                    ->label('Unterschriebener Vertrag')
                    ->content(function (Reservation $record): string {
                        return $record->signed_contract_path ? '✅ Hochgeladen' : '⏳ Ausstehend';
                    }),
                Forms\Components\Placeholder::make('payment_proof_info')
                    ->label('Zahlungsnachweis')
                    ->content(function (Reservation $record): string {
                        return $record->payment_proof_path ? '✅ Hochgeladen' : '⏳ Ausstehend';
                    }),
                Forms\Components\Placeholder::make('admin_confirmed_info')
                    ->label('Admin-Bestätigung')
                    ->content(function (Reservation $record): string {
                        return $record->admin_confirmed_at
                            ? '✅ Bestätigt am '.$record->admin_confirmed_at->format('d.m.Y H:i')
                            : '⏳ Ausstehend';
                    }),
            ]),
            Forms\Components\Section::make(__('admin.reservation.section_notes'))->schema([
                Forms\Components\Textarea::make('admin_notes')->label(__('admin.reservation.internal_notes'))->rows(3),
            ]),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('payment_reference')->label(__('admin.reservation.reference'))->searchable(),
                Tables\Columns\TextColumn::make('customer_name')->label(__('admin.reservation.customer'))->searchable(),
                Tables\Columns\TextColumn::make('vehicle.brand')->label(__('admin.reservation.vehicle'))
                    ->formatStateUsing(fn ($record) => "{$record->vehicle->brand} {$record->vehicle->model}"),
                Tables\Columns\TextColumn::make('deposit_amount')->label(__('admin.reservation.deposit'))->money('EUR', locale: 'de'),
                Tables\Columns\TextColumn::make('purchase_step')->label('Schritt')
                    ->badge()->color(fn (string $state) => match ($state) {
                        'details' => 'gray', 'invoice' => 'info',
                        'signature' => 'warning', 'payment' => 'primary',
                        'completed' => 'success', default => 'gray',
                    }),
                Tables\Columns\TextColumn::make('bank_transfer_status')->label(__('admin.reservation.status'))
                    ->badge()->color(fn (string $state) => match ($state) {
                        'pending' => 'warning', 'confirmed' => 'success',
                        'cancelled' => 'danger', 'expired' => 'gray',
                        'refunded' => 'info', default => 'gray',
                    }),
                Tables\Columns\IconColumn::make('signed_contract_path')->label('Vertrag')
                    ->boolean()
                    ->trueIcon('heroicon-o-document-check')
                    ->falseIcon('heroicon-o-document')
                    ->trueColor('success')
                    ->falseColor('gray')
                    ->getStateUsing(fn ($record) => ! empty($record->signed_contract_path)),
                Tables\Columns\IconColumn::make('payment_proof_path')->label('Zahlung')
                    ->boolean()
                    ->trueIcon('heroicon-o-banknotes')
                    ->falseIcon('heroicon-o-clock')
                    ->trueColor('success')
                    ->falseColor('gray')
                    ->getStateUsing(fn ($record) => ! empty($record->payment_proof_path)),
                Tables\Columns\TextColumn::make('reservation_expires_at')->label(__('admin.reservation.expires'))
                    ->dateTime('d.m.Y H:i')->sortable(),
                Tables\Columns\TextColumn::make('created_at')->label(__('admin.reservation.created'))
                    ->dateTime('d.m.Y')->sortable(),
            ])
            ->defaultSort('created_at', 'desc')
            ->filters([
                Tables\Filters\SelectFilter::make('purchase_step')
                    ->label('Kaufschritt')
                    ->options([
                        'details' => 'Persönliche Daten',
                        'invoice' => 'Rechnung',
                        'signature' => 'Vertrag',
                        'payment' => 'Zahlung',
                        'completed' => 'Abgeschlossen',
                    ]),
                Tables\Filters\SelectFilter::make('bank_transfer_status')
                    ->label('Zahlungsstatus')
                    ->options([
                        'pending' => 'Ausstehend',
                        'confirmed' => 'Bestätigt',
                        'cancelled' => 'Storniert',
                        'expired' => 'Abgelaufen',
                        'refunded' => 'Erstattet',
                    ]),
                Tables\Filters\TernaryFilter::make('has_signed_contract')
                    ->label('Vertrag unterschrieben')
                    ->queries(
                        true: fn ($query) => $query->whereNotNull('signed_contract_path'),
                        false: fn ($query) => $query->whereNull('signed_contract_path'),
                    ),
            ])
            ->actions([
                Tables\Actions\ViewAction::make(),
                Tables\Actions\EditAction::make(),

                // Download generated contract
                Tables\Actions\Action::make('download_contract')
                    ->label('Vertrag PDF')
                    ->icon('heroicon-o-document-arrow-down')
                    ->color('info')
                    ->url(fn (Reservation $record) => $record->contract_path
                        ? Storage::disk('public')->url($record->contract_path)
                        : null)
                    ->openUrlInNewTab()
                    ->visible(fn (Reservation $record) => ! empty($record->contract_path)),

                // Download signed contract
                Tables\Actions\Action::make('download_signed')
                    ->label('Unterschr. Vertrag')
                    ->icon('heroicon-o-document-check')
                    ->color('warning')
                    ->url(fn (Reservation $record) => $record->signed_contract_path
                        ? Storage::disk('public')->url($record->signed_contract_path)
                        : null)
                    ->openUrlInNewTab()
                    ->visible(fn (Reservation $record) => ! empty($record->signed_contract_path)),

                // Download payment proof
                Tables\Actions\Action::make('download_payment_proof')
                    ->label('Zahlungsnachweis')
                    ->icon('heroicon-o-banknotes')
                    ->color('primary')
                    ->url(fn (Reservation $record) => $record->payment_proof_path
                        ? Storage::disk('public')->url($record->payment_proof_path)
                        : null)
                    ->openUrlInNewTab()
                    ->visible(fn (Reservation $record) => ! empty($record->payment_proof_path)),

                // Admin confirm purchase
                Tables\Actions\Action::make('admin_confirm')
                    ->label('Kauf bestätigen')
                    ->icon('heroicon-o-check-badge')
                    ->color('success')
                    ->requiresConfirmation()
                    ->modalHeading('Kaufbestätigung')
                    ->modalDescription('Sind Sie sicher, dass Sie diesen Kauf bestätigen möchten? Das Fahrzeug wird als "Verkauft" markiert.')
                    ->modalSubmitActionLabel('Ja, bestätigen')
                    ->action(function (Reservation $record) {
                        $record->update([
                            'bank_transfer_status' => 'confirmed',
                            'payment_confirmed_at' => now(),
                            'admin_confirmed_at' => now(),
                        ]);
                        if ($record->vehicle) {
                            $record->vehicle->update(['status' => 'sold']);
                        }
                    })
                    ->visible(fn (Reservation $record) => $record->purchase_step === 'completed'
                        && $record->isPending()
                        && empty($record->admin_confirmed_at)
                    ),

                // Legacy confirm payment
                Tables\Actions\Action::make('confirm_payment')
                    ->label(__('admin.reservation.action_confirm'))
                    ->icon('heroicon-o-check-circle')
                    ->color('success')
                    ->action(fn (Reservation $record) => $record->confirm())
                    ->requiresConfirmation()
                    ->visible(fn (Reservation $record) => $record->isPending()
                        && $record->purchase_step !== 'completed'
                    ),

                Tables\Actions\Action::make('cancel')
                    ->label(__('admin.reservation.action_cancel'))
                    ->icon('heroicon-o-x-circle')
                    ->color('danger')
                    ->action(fn (Reservation $record) => $record->cancel())
                    ->requiresConfirmation()
                    ->visible(fn (Reservation $record) => $record->isPending()),
            ])
            ->bulkActions([Tables\Actions\BulkActionGroup::make([Tables\Actions\DeleteBulkAction::make()])]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListReservations::route('/'),
            'view' => Pages\ViewReservation::route('/{record}'),
            'edit' => Pages\EditReservation::route('/{record}/edit'),
        ];
    }
}
