<?php

namespace App\Jobs\Facebook;

use App\Models\Car;
use App\Services\Facebook\CatalogService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

/**
 * SyncCatalogJob — hourly reconciliation of all active cars with the FB Commerce Catalog.
 *
 * - Publishes any car that is published but not yet in the catalog.
 * - Updates cars whose details have changed.
 * - Marks sold cars as OUT_OF_STOCK.
 */
class SyncCatalogJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /** @var int */
    public int $tries = 1;

    /** @var int */
    public int $timeout = 600;

    /**
     * Execute the job.
     */
    public function handle(CatalogService $catalog): void
    {
        $cars = Car::whereIn('status', ['published', 'sold'])->get();

        $upserted = 0;
        $failed   = 0;

        foreach ($cars as $car) {
            try {
                $catalog->upsertVehicle($car);
                $upserted++;
            } catch (\Throwable $e) {
                $failed++;
                Log::error("[SyncCatalogJob] Failed to sync car #{$car->id}: {$e->getMessage()}");
            }
        }

        Log::info("[SyncCatalogJob] Synced {$upserted} cars ({$failed} failed).");
    }
}
