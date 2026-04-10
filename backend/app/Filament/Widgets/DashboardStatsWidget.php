<?php

namespace App\Filament\Widgets;

use App\Models\Vehicle;
use App\Models\Inquiry;
use App\Models\Reservation;
use App\Models\Review;
use Filament\Widgets\StatsOverviewWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class DashboardStatsWidget extends StatsOverviewWidget
{
    protected static ?int $sort = 1;

    protected function getStats(): array
    {
        return [
            Stat::make(__('admin.dashboard.vehicles_available'), Vehicle::available()->count())
                ->description(__('admin.dashboard.total_stock') . Vehicle::count())
                ->descriptionIcon('heroicon-m-truck')
                ->color('success'),
            Stat::make(__('admin.dashboard.new_inquiries'), Inquiry::new()->count())
                ->description(__('admin.dashboard.today') . Inquiry::whereDate('created_at', today())->count())
                ->descriptionIcon('heroicon-m-inbox')
                ->color('danger'),
            Stat::make(__('admin.dashboard.open_reservations'), Reservation::pending()->count())
                ->description(__('admin.dashboard.confirmed') . Reservation::where('bank_transfer_status', 'confirmed')->count())
                ->descriptionIcon('heroicon-m-bookmark')
                ->color('warning'),
            Stat::make(__('admin.dashboard.reviews'), Review::approved()->count())
                ->description('⭐ ' . number_format(Review::approved()->avg('rating') ?? 0, 1) . ' ' . __('admin.dashboard.average'))
                ->descriptionIcon('heroicon-m-star')
                ->color('primary'),
        ];
    }
}
