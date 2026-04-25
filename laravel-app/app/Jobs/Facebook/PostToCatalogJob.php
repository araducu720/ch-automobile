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
 * PostToCatalogJob — pushes a vehicle to the Facebook Commerce Catalog.
 *
 * The operation is idempotent: the car's primary-key ID is used as
 * `retailer_id`, so calling this job multiple times is safe.
 */
class PostToCatalogJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /** @var int */
    public int $tries = 3;

    /** @var int */
    public int $timeout = 60;

    public function __construct(public readonly Car $car) {}

    /**
     * Execute the job.
     */
    public function handle(CatalogService $catalog): void
    {
        $response = $catalog->upsertVehicle($this->car);

        Log::info("[PostToCatalogJob] Upserted car #{$this->car->id} to catalog.", [
            'response' => $response,
        ]);
    }
}
