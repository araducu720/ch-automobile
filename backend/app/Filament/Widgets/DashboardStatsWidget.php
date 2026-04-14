<?php

namespace App\Filament\Widgets;

use App\Models\BlogPost;
use App\Models\Inquiry;
use App\Models\NewsletterSubscriber;
use App\Models\Reservation;
use App\Models\Review;
use App\Models\Vehicle;
use Filament\Widgets\StatsOverviewWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class DashboardStatsWidget extends StatsOverviewWidget
{
    protected static ?int $sort = 1;

    protected function getColumns(): int
    {
        return 3;
    }

    protected function getStats(): array
    {
        return [
            Stat::make(__('admin.dashboard.vehicles_available'), Vehicle::available()->count())
                ->description(__('admin.dashboard.total_stock').Vehicle::count())
                ->descriptionIcon('heroicon-m-truck')
                ->color('success')
                ->chart([7, 3, 4, 5, 6, 3, 5, 3])
                ->chartColor('success'),
            Stat::make(__('admin.dashboard.new_inquiries'), Inquiry::new()->count())
                ->description(__('admin.dashboard.today').Inquiry::whereDate('created_at', today())->count())
                ->descriptionIcon('heroicon-m-inbox')
                ->color('danger')
                ->chart([3, 5, 2, 8, 4, 6, 3, 7])
                ->chartColor('danger'),
            Stat::make(__('admin.dashboard.open_reservations'), Reservation::pending()->count())
                ->description(__('admin.dashboard.confirmed').Reservation::where('bank_transfer_status', 'confirmed')->count())
                ->descriptionIcon('heroicon-m-bookmark')
                ->color('warning')
                ->chart([2, 4, 3, 5, 4, 6, 5, 4])
                ->chartColor('warning'),
            Stat::make(__('admin.dashboard.reviews'), Review::approved()->count())
                ->description('⭐ '.number_format(Review::approved()->avg('rating') ?? 0, 1).' '.__('admin.dashboard.average'))
                ->descriptionIcon('heroicon-m-star')
                ->color('primary')
                ->chart([4, 3, 5, 4, 6, 5, 4, 5])
                ->chartColor('primary'),
            Stat::make('Blog Posts', BlogPost::where('is_published', true)->count())
                ->description('Views: '.number_format(BlogPost::sum('views_count')))
                ->descriptionIcon('heroicon-m-document-text')
                ->color('info')
                ->chart([5, 4, 6, 3, 7, 5, 6, 4])
                ->chartColor('info'),
            Stat::make('Newsletter', NewsletterSubscriber::confirmed()->count())
                ->description('Bestätigte Abonnenten')
                ->descriptionIcon('heroicon-m-envelope')
                ->color('success')
                ->chart([2, 3, 4, 3, 5, 4, 6, 5])
                ->chartColor('success'),
        ];
    }
}
