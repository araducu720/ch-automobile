<?php

namespace App\Filament\Pages;

use Filament\Pages\Dashboard as BaseDashboard;

class Dashboard extends BaseDashboard
{
    protected static ?string $navigationIcon = 'heroicon-o-home';

    protected static ?int $navigationSort = -2;

    public function getWidgets(): array
    {
        return [
            \App\Filament\Widgets\KycStatsWidget::class,
            \App\Filament\Widgets\LiveOrdersWidget::class,
            \App\Filament\Widgets\BrandActivityWidget::class,
        ];
    }

    public function getColumns(): int | string | array
    {
        return 2;
    }
}
