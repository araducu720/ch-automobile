<?php

namespace App\Filament\Widgets;

use App\Models\Order;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget as BaseWidget;

class LiveOrdersWidget extends BaseWidget
{
    protected static ?int $sort = 2;
    protected int | string | array $columnSpan = 'full';
    protected static ?string $heading = 'Latest Orders';

    public function table(Table $table): Table
    {
        return $table
            ->query(Order::query()->with('brand')->latest()->limit(10))
            ->columns([
                Tables\Columns\TextColumn::make('order_number')->copyable(),
                Tables\Columns\TextColumn::make('brand.name')->badge(),
                Tables\Columns\TextColumn::make('customer_name'),
                Tables\Columns\TextColumn::make('amount')
                    ->money(fn (Order $record) => $record->currency),
                Tables\Columns\TextColumn::make('status')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'pending' => 'gray',
                        'processing' => 'info',
                        'shipped' => 'warning',
                        'delivered' => 'success',
                        'cancelled' => 'danger',
                        default => 'gray',
                    }),
                Tables\Columns\TextColumn::make('created_at')->since(),
            ])
            ->poll('10s');
    }
}
