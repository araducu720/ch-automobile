<?php

namespace App\Filament\Resources\VehicleResource\RelationManagers;

use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables;
use Filament\Tables\Table;

class ReservationsRelationManager extends RelationManager
{
    protected static string $relationship = 'reservations';

    protected static ?string $title = 'Reservierungen';

    protected static ?string $recordTitleAttribute = 'payment_reference';

    public function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('payment_reference')->label('Referenz')->searchable(),
                Tables\Columns\TextColumn::make('customer_name')->label('Kunde'),
                Tables\Columns\TextColumn::make('deposit_amount')->label('Anzahlung')->money('EUR', locale: 'de'),
                Tables\Columns\TextColumn::make('purchase_step')->label('Schritt')
                    ->badge()->color(fn (string $state) => match ($state) {
                        'details' => 'gray', 'invoice' => 'info',
                        'signature' => 'warning', 'payment' => 'primary',
                        'completed' => 'success', default => 'gray',
                    }),
                Tables\Columns\TextColumn::make('bank_transfer_status')->label('Status')
                    ->badge()->color(fn (string $state) => match ($state) {
                        'pending' => 'warning', 'confirmed' => 'success',
                        'cancelled' => 'danger', 'expired' => 'gray',
                        'refunded' => 'info', default => 'gray',
                    }),
                Tables\Columns\TextColumn::make('created_at')->label('Datum')->dateTime('d.m.Y')->sortable(),
            ])
            ->defaultSort('created_at', 'desc');
    }
}
