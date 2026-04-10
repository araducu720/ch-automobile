<?php

namespace App\Filament\Resources\ReservationResource\Pages;

use App\Filament\Resources\ReservationResource;
use App\Models\Reservation;
use Filament\Actions;
use Filament\Infolists\Components;
use Filament\Infolists\Infolist;
use Filament\Resources\Pages\ViewRecord;
use Filament\Notifications\Notification as FilamentNotification;
use Illuminate\Support\Facades\Storage;

class ViewReservation extends ViewRecord
{
    protected static string $resource = ReservationResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\EditAction::make(),

            Actions\Action::make('admin_confirm')
                ->label('Kauf bestätigen')
                ->icon('heroicon-o-check-badge')
                ->color('success')
                ->requiresConfirmation()
                ->modalHeading('Kaufbestätigung')
                ->modalDescription('Sind Sie sicher? Das Fahrzeug wird als "Verkauft" markiert.')
                ->modalSubmitActionLabel('Ja, bestätigen')
                ->action(function () {
                    $record = $this->getRecord();
                    $record->update([
                        'bank_transfer_status' => 'confirmed',
                        'payment_confirmed_at' => now(),
                        'admin_confirmed_at' => now(),
                    ]);
                    if ($record->vehicle) {
                        $record->vehicle->update(['status' => 'sold']);
                    }
                    FilamentNotification::make()
                        ->success()
                        ->title('Kauf bestätigt')
                        ->body('Fahrzeug wurde als verkauft markiert.')
                        ->send();
                    $this->redirect(static::getResource()::getUrl('view', ['record' => $record]));
                })
                ->visible(fn () =>
                    $this->getRecord()->purchase_step === 'completed'
                    && $this->getRecord()->isPending()
                    && empty($this->getRecord()->admin_confirmed_at)
                ),

            Actions\Action::make('cancel')
                ->label('Stornieren')
                ->icon('heroicon-o-x-circle')
                ->color('danger')
                ->requiresConfirmation()
                ->action(function () {
                    $record = $this->getRecord();
                    $record->cancel();
                    FilamentNotification::make()
                        ->warning()
                        ->title('Reservierung storniert')
                        ->send();
                    $this->redirect(static::getResource()::getUrl('view', ['record' => $record]));
                })
                ->visible(fn () => $this->getRecord()->isPending()),
        ];
    }

    public function infolist(Infolist $infolist): Infolist
    {
        return $infolist->schema([
            Components\Section::make('Kundendaten')->columns(3)->schema([
                Components\TextEntry::make('customer_name')->label('Name'),
                Components\TextEntry::make('customer_email')->label('E-Mail'),
                Components\TextEntry::make('customer_phone')->label('Telefon'),
                Components\TextEntry::make('billing_street')->label('Straße'),
                Components\TextEntry::make('billing_city')->label('Stadt'),
                Components\TextEntry::make('billing_postal_code')->label('PLZ'),
            ]),

            Components\Section::make('Fahrzeug & Preis')->columns(3)->schema([
                Components\TextEntry::make('vehicle.full_name')->label('Fahrzeug'),
                Components\TextEntry::make('vehicle.formatted_price')->label('Preis'),
                Components\TextEntry::make('deposit_amount')->label('Anzahlung')->money('EUR', locale: 'de'),
                Components\TextEntry::make('payment_reference')->label('Referenz')->copyable(),
                Components\TextEntry::make('reservation_expires_at')->label('Ablaufdatum')->dateTime('d.m.Y H:i'),
                Components\TextEntry::make('locale')->label('Sprache'),
            ]),

            Components\Section::make('Status')->columns(4)->schema([
                Components\TextEntry::make('purchase_step')->label('Kaufschritt')
                    ->badge()->color(fn (string $state) => match ($state) {
                        'details' => 'gray', 'invoice' => 'info',
                        'signature' => 'warning', 'payment' => 'primary',
                        'completed' => 'success', default => 'gray',
                    }),
                Components\TextEntry::make('bank_transfer_status')->label('Zahlungsstatus')
                    ->badge()->color(fn (string $state) => match ($state) {
                        'pending' => 'warning', 'confirmed' => 'success',
                        'cancelled' => 'danger', 'expired' => 'gray',
                        'refunded' => 'info', default => 'gray',
                    }),
                Components\TextEntry::make('payment_confirmed_at')->label('Zahlung bestätigt')
                    ->dateTime('d.m.Y H:i')
                    ->default('—'),
                Components\TextEntry::make('admin_confirmed_at')->label('Admin bestätigt')
                    ->dateTime('d.m.Y H:i')
                    ->default('—'),
            ]),

            Components\Section::make('Dokumente')->columns(2)->schema([
                Components\TextEntry::make('contract_path')->label('Kaufvertrag (PDF)')
                    ->formatStateUsing(function ($state, $record) {
                        if ($state && Storage::disk('public')->exists($state)) {
                            $date = $record->contract_generated_at?->format('d.m.Y H:i') ?? '';
                            return "✅ Generiert {$date}";
                        }
                        return '⏳ Nicht generiert';
                    })
                    ->url(fn ($record) => $record->contract_path
                        ? Storage::disk('public')->url($record->contract_path)
                        : null)
                    ->openUrlInNewTab(),

                Components\TextEntry::make('signed_contract_path')->label('Unterschriebener Vertrag')
                    ->formatStateUsing(fn ($state) => $state ? '✅ Hochgeladen' : '⏳ Ausstehend')
                    ->url(fn ($record) => $record->signed_contract_path
                        ? Storage::disk('public')->url($record->signed_contract_path)
                        : null)
                    ->openUrlInNewTab(),

                Components\TextEntry::make('payment_proof_path')->label('Zahlungsnachweis')
                    ->formatStateUsing(fn ($state) => $state ? '✅ Hochgeladen' : '⏳ Ausstehend')
                    ->url(fn ($record) => $record->payment_proof_path
                        ? Storage::disk('public')->url($record->payment_proof_path)
                        : null)
                    ->openUrlInNewTab(),
            ]),

            Components\Section::make('Notizen')->schema([
                Components\TextEntry::make('admin_notes')->label('Interne Notizen')
                    ->default('Keine Notizen.'),
            ]),
        ]);
    }
}
