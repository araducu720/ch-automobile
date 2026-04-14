<?php

namespace App\Filament\Resources\VehicleResource\RelationManagers;

use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables;
use Filament\Tables\Table;

class InquiriesRelationManager extends RelationManager
{
    protected static string $relationship = 'inquiries';

    protected static ?string $title = 'Anfragen';

    protected static ?string $recordTitleAttribute = 'reference_number';

    public function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('reference_number')->label('Referenz')->searchable(),
                Tables\Columns\TextColumn::make('type')->label('Typ')->badge(),
                Tables\Columns\TextColumn::make('name')->label('Kunde'),
                Tables\Columns\TextColumn::make('email')->label('E-Mail'),
                Tables\Columns\TextColumn::make('status')->label('Status')
                    ->badge()->color(fn (string $state) => match ($state) {
                        'new' => 'danger', 'in_progress' => 'warning',
                        'completed' => 'success', 'archived' => 'gray', default => 'gray',
                    }),
                Tables\Columns\TextColumn::make('created_at')->label('Datum')->dateTime('d.m.Y H:i')->sortable(),
            ])
            ->defaultSort('created_at', 'desc');
    }
}
