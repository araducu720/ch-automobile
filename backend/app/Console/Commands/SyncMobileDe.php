<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use App\Models\Vehicle;

class SyncMobileDe extends Command
{
    protected $signature = 'mobile-de:sync {--dry-run : Preview changes without saving}';
    protected $description = 'Sync vehicle inventory from mobile.de API';

    public function handle(): int
    {
        $apiKey = config('services.mobile_de.api_key');
        $dealerId = config('services.mobile_de.dealer_id');

        if (!$apiKey || !$dealerId) {
            $this->error('mobile.de API credentials not configured.');
            return self::FAILURE;
        }

        $this->info('Starting mobile.de sync...');

        try {
            $response = Http::withHeaders([
                'Authorization' => "Bearer {$apiKey}",
                'Accept' => 'application/json',
            ])->get("https://services.mobile.de/search-api/search", [
                'dealerId' => $dealerId,
            ]);

            if (!$response->successful()) {
                $this->error('Failed to fetch data from mobile.de: ' . $response->status());
                return self::FAILURE;
            }

            $listings = $response->json('content', []);
            $synced = 0;
            $created = 0;

            foreach ($listings as $listing) {
                $mobileDeId = $listing['id'] ?? null;
                if (!$mobileDeId) continue;

                $vehicleData = $this->mapListingToVehicle($listing);

                if ($this->option('dry-run')) {
                    $this->line("[DRY RUN] {$vehicleData['brand']} {$vehicleData['model']} ({$vehicleData['year']}) - €{$vehicleData['price']}");
                    $synced++;
                    continue;
                }

                $vehicle = Vehicle::updateOrCreate(
                    ['mobile_de_id' => $mobileDeId],
                    $vehicleData
                );

                if ($vehicle->wasRecentlyCreated) {
                    $created++;
                }
                $synced++;
            }

            $this->info("Sync complete: {$synced} processed, {$created} new vehicles.");
            return self::SUCCESS;

        } catch (\Exception $e) {
            $this->error('Sync failed: ' . $e->getMessage());
            return self::FAILURE;
        }
    }

    private function mapListingToVehicle(array $listing): array
    {
        return [
            'brand' => $listing['make'] ?? 'Unknown',
            'model' => $listing['model'] ?? 'Unknown',
            'variant' => $listing['modelDescription'] ?? null,
            'year' => (int) ($listing['firstRegistration']['year'] ?? date('Y')),
            'price' => (float) ($listing['price']['amount'] ?? 0),
            'mileage' => (int) ($listing['mileage'] ?? 0),
            'fuel_type' => $this->mapFuelType($listing['fuel'] ?? ''),
            'transmission' => $this->mapTransmission($listing['gearbox'] ?? ''),
            'power_hp' => (int) ($listing['power'] ?? 0),
            'power_kw' => isset($listing['power']) ? (int) round($listing['power'] * 0.7355) : null,
            'color' => $listing['color'] ?? null,
            'body_type' => $this->mapBodyType($listing['category'] ?? ''),
            'condition' => $listing['damageUnrepaired'] ?? false ? 'used' : 'used',
            'status' => 'available',
            'description' => ['de' => $listing['description'] ?? ''],
        ];
    }

    private function mapFuelType(string $fuel): string
    {
        return match (strtolower($fuel)) {
            'petrol', 'benzin' => 'petrol',
            'diesel' => 'diesel',
            'electric', 'elektro' => 'electric',
            'hybrid' => 'hybrid',
            'lpg' => 'lpg',
            'cng' => 'cng',
            default => 'petrol',
        };
    }

    private function mapTransmission(string $gearbox): string
    {
        return match (strtolower($gearbox)) {
            'manual', 'schaltgetriebe' => 'manual',
            'automatic', 'automatik' => 'automatic',
            default => 'automatic',
        };
    }

    private function mapBodyType(string $category): string
    {
        return match (strtolower($category)) {
            'limousine', 'sedan' => 'sedan',
            'suv', 'geländewagen' => 'suv',
            'coupé', 'coupe' => 'coupe',
            'cabrio', 'cabriolet' => 'cabrio',
            'kombi', 'estate' => 'kombi',
            'van', 'kleinbus' => 'van',
            default => 'other',
        };
    }
}
