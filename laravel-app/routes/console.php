<?php

use App\Jobs\Facebook\GenerateContentCalendarJob;
use App\Jobs\Facebook\InsightsAnalysisJob;
use App\Jobs\Facebook\RepostStaleListingsJob;
use App\Jobs\Facebook\SyncCatalogJob;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

/*
|--------------------------------------------------------------------------
| Task Schedule — Facebook AI Agent
|--------------------------------------------------------------------------
*/

// Hourly: reconcile all cars with the FB Commerce Catalog
Schedule::job(new SyncCatalogJob())
    ->hourly()
    ->name('sync-catalog')
    ->withoutOverlapping();

// Daily at 09:00: generate one content-calendar post
Schedule::job(new GenerateContentCalendarJob())
    ->dailyAt('09:00')
    ->name('content-calendar');

// Daily at 23:00: pull insights and ask AI for recommendations
Schedule::job(new InsightsAnalysisJob())
    ->dailyAt('23:00')
    ->name('insights-analysis');

// Weekly on Monday 08:00: repost stale listings (unsold > 14 days)
Schedule::job(new RepostStaleListingsJob())
    ->weeklyOn(1, '08:00')
    ->name('repost-stale-listings');

