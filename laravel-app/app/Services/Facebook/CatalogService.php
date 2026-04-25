<?php

namespace App\Services\Facebook;

use App\Models\Car;
use GuzzleHttp\Exception\GuzzleException;

/**
 * Service for managing Facebook Commerce Catalog entries (Vehicles).
 *
 * Uses the Vehicles product feed schema (Commerce Catalog v21+).
 * All operations are idempotent: use the car's primary ID as retailer_id.
 *
 * Reference:
 *  https://developers.facebook.com/docs/marketing-api/catalog/reference/vehicle/
 */
class CatalogService
{
    public function __construct(protected GraphClient $graph) {}

    /**
     * Create or update a vehicle in the Commerce Catalog.
     *
     * The call uses `POST /{catalog_id}/vehicles` which is idempotent when
     * the same `retailer_id` is supplied (Meta upserts the record).
     *
     * @param  Car  $car
     * @return array  Meta API response.
     *
     * @throws GuzzleException
     */
    public function upsertVehicle(Car $car): array
    {
        $catalogId = config('facebook.catalog_id');

        $fuelMap = [
            'gasoline' => 'GASOLINE',
            'petrol'   => 'GASOLINE',
            'diesel'   => 'DIESEL',
            'electric' => 'ELECTRIC',
            'hybrid'   => 'HYBRID',
            'lpg'      => 'LPG',
            'cng'      => 'CNG',
        ];

        $transmissionMap = [
            'manual'    => 'MANUAL',
            'automatic' => 'AUTOMATIC',
        ];

        $bodyMap = [
            'sedan'       => 'SEDAN',
            'suv'         => 'SUV',
            'coupe'       => 'COUPE',
            'convertible' => 'CONVERTIBLE',
            'hatchback'   => 'HATCHBACK',
            'wagon'       => 'WAGON',
            'van'         => 'MINIVAN',
            'pickup'      => 'PICKUP',
            'truck'       => 'TRUCK',
        ];

        $price    = number_format($car->price / 100, 2, '.', '') . ' ' . ($car->currency ?? 'EUR');
        $fuelKey  = strtolower((string) $car->fuel);
        $transKey = strtolower((string) $car->transmission);
        $bodyKey  = strtolower((string) $car->body_style);

        $payload = [
            'retailer_id'   => (string) $car->id,
            'availability'  => $car->status === 'sold' ? 'OUT_OF_STOCK' : 'IN_STOCK',
            'condition'     => 'USED',
            'make'          => $car->brand,
            'model'         => $car->model,
            'year'          => (int) $car->year,
            'price'         => $price,
            'description'   => $this->buildDescription($car),
            'url'           => url('/cars/' . $car->id),
            'mileage'       => [
                'value' => (int) $car->km,
                'unit'  => 'KM',
            ],
        ];

        // Optional fields
        if ($car->vin) {
            $payload['vin'] = $car->vin;
        }

        if (isset($fuelMap[$fuelKey])) {
            $payload['fuel_type'] = $fuelMap[$fuelKey];
        }

        if (isset($transmissionMap[$transKey])) {
            $payload['transmission'] = $transmissionMap[$transKey];
        }

        if (isset($bodyMap[$bodyKey])) {
            $payload['body_style'] = $bodyMap[$bodyKey];
        }

        if ($car->hp) {
            $payload['engine_power'] = (int) $car->hp;
        }

        // Primary photo
        $firstPhoto = $car->photos()->orderBy('sort_order')->first();
        if ($firstPhoto) {
            $payload['image_url'] = $firstPhoto->url;
        }

        return $this->graph->post("{$catalogId}/vehicles", $payload);
    }

    /**
     * Remove a vehicle from the Commerce Catalog.
     *
     * @param  string  $retailerId  Corresponds to car.id.
     * @return array
     *
     * @throws GuzzleException
     */
    public function deleteVehicle(string $retailerId): array
    {
        $catalogId = config('facebook.catalog_id');

        return $this->graph->delete("{$catalogId}/vehicles/{$retailerId}");
    }

    // -------------------------------------------------------------------------
    // Helpers
    // -------------------------------------------------------------------------

    /** Build a plain-text description suitable for the catalog. */
    protected function buildDescription(Car $car): string
    {
        $parts = [
            "{$car->brand} {$car->model} {$car->year}",
            "{$car->km} km",
        ];

        if ($car->fuel) {
            $parts[] = ucfirst($car->fuel);
        }

        if ($car->transmission) {
            $parts[] = ucfirst($car->transmission);
        }

        if ($car->hp) {
            $parts[] = "{$car->hp} HP";
        }

        if ($car->highlights) {
            $parts[] = $car->highlights;
        }

        return implode(' · ', $parts);
    }
}
