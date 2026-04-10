<?php

namespace App\Filament\Widgets;

use App\Models\KycVerification;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class KycStatsWidget extends BaseWidget
{
    protected static ?int $sort = 1;
    protected int | string | array $columnSpan = 'full';

    protected function getStats(): array
    {
        return [
            Stat::make('Total KYC Verifications', KycVerification::count())
                ->description('All time')
                ->descriptionIcon('heroicon-m-identification')
                ->color('primary'),

            Stat::make('Pending Review', KycVerification::whereIn('status', ['pending', 'documents_uploaded'])->count())
                ->description('Awaiting review')
                ->descriptionIcon('heroicon-m-clock')
                ->color('warning'),

            Stat::make('In Review', KycVerification::where('status', 'in_review')->count())
                ->description('Currently being reviewed')
                ->descriptionIcon('heroicon-m-eye')
                ->color('info'),

            Stat::make('Approved', KycVerification::where('status', 'approved')->count())
                ->description('Successfully verified')
                ->descriptionIcon('heroicon-m-check-circle')
                ->color('success'),

            Stat::make('Rejected', KycVerification::where('status', 'rejected')->count())
                ->description('Verification failed')
                ->descriptionIcon('heroicon-m-x-circle')
                ->color('danger'),

            Stat::make('Today', KycVerification::whereDate('created_at', today())->count())
                ->description('Submitted today')
                ->descriptionIcon('heroicon-m-calendar')
                ->color('gray'),
        ];
    }
}
