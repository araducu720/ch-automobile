<?php

namespace App\Console\Commands;

use App\Models\Vehicle;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

class ImportAutoScoutVehicles extends Command
{
    protected $signature = 'vehicles:import-autoscout
                            {path : Path to the cars autoscout directory}
                            {--limit=0 : Limit number of vehicles to import (0 = all)}
                            {--skip-images : Skip image import}
                            {--dry-run : Show what would be imported without saving}';

    protected $description = 'Import vehicles from AutoScout24 scraped data (folders with details.json + photos)';

    private int $imported = 0;
    private int $skipped = 0;
    private int $failed = 0;

    private const FUEL_MAP = [
        'B' => 'petrol',
        'Gasoline' => 'petrol',
        'D' => 'diesel',
        'Diesel' => 'diesel',
        'E' => 'electric',
        'Electric' => 'electric',
        'Electric/Gasoline' => 'hybrid',
        'Electric/Diesel' => 'hybrid',
        'H' => 'hybrid',
        'Hybrid' => 'hybrid',
        'Plug-in Hybrid' => 'plug_in_hybrid',
        'LPG' => 'lpg',
        'CNG' => 'cng',
        'Hydrogen' => 'hydrogen',
    ];

    private const TRANSMISSION_MAP = [
        'Manual' => 'manual',
        'Automatic' => 'automatic',
        'Semi-automatic' => 'semi_automatic',
    ];

    private const BODY_MAP = [
        'Sedan' => 'sedan',
        'SUV / Off-road Vehicle / Pickup Truck' => 'suv',
        'SUV' => 'suv',
        'Off-Road' => 'suv',
        'Coupe' => 'coupe',
        'Coupé' => 'coupe',
        'Convertible' => 'cabrio',
        'Cabriolet' => 'cabrio',
        'Station wagon' => 'kombi',
        'Estate Car' => 'kombi',
        'Kombi' => 'kombi',
        'Van' => 'van',
        'Transporter' => 'van',
        'Compact' => 'hatchback',
        'Small car' => 'hatchback',
        'Hatchback' => 'hatchback',
        'Pickup' => 'pickup',
        'Roadster' => 'roadster',
        'Limousine' => 'limousine',
        'Sports Car / Coupe' => 'coupe',
        'Minibus' => 'van',
        'Other' => 'other',
    ];

    public function handle(): int
    {
        $path = $this->argument('path');
        $limit = (int) $this->option('limit');
        $skipImages = $this->option('skip-images');
        $dryRun = $this->option('dry-run');

        if (!File::isDirectory($path)) {
            $this->error("Directory not found: {$path}");
            return 1;
        }

        $directories = collect(File::directories($path));
        $total = $directories->count();

        $this->info("Found {$total} vehicle folders in: {$path}");

        if ($limit > 0) {
            $directories = $directories->take($limit);
            $this->info("Limiting to {$limit} vehicles");
        }

        if ($dryRun) {
            $this->warn('DRY RUN - no data will be saved');
        }

        $bar = $this->output->createProgressBar($directories->count());
        $bar->start();

        foreach ($directories as $dir) {
            try {
                $this->importVehicle($dir, $skipImages, $dryRun);
            } catch (\Throwable $e) {
                $this->failed++;
                $this->newLine();
                $this->error("Failed: " . basename($dir) . " - " . $e->getMessage());
            }
            $bar->advance();
        }

        $bar->finish();
        $this->newLine(2);

        $this->info("Import complete:");
        $this->info("  Imported: {$this->imported}");
        $this->info("  Skipped (duplicate): {$this->skipped}");
        $this->info("  Failed: {$this->failed}");

        return 0;
    }

    private function importVehicle(string $dir, bool $skipImages, bool $dryRun): void
    {
        $detailsFile = $dir . '/details.json';

        if (!File::exists($detailsFile)) {
            $this->skipped++;
            return;
        }

        $raw = json_decode(File::get($detailsFile), true);
        if (!$raw) {
            $this->failed++;
            return;
        }

        $listing = $raw['props']['pageProps']['listingDetails'] ?? null;
        if (!$listing) {
            $this->failed++;
            return;
        }

        $autoscoutId = $listing['id'] ?? null;
        if (!$autoscoutId) {
            $this->failed++;
            return;
        }

        // Skip if already imported
        if (Vehicle::where('autoscout_id', $autoscoutId)->exists()) {
            $this->skipped++;
            return;
        }

        $vehicle = $listing['vehicle'] ?? [];
        $prices = $listing['prices']['public'] ?? $listing['prices']['dealer'] ?? [];

        $data = $this->mapVehicleData($listing, $vehicle, $prices, $autoscoutId);

        if ($dryRun) {
            $this->imported++;
            return;
        }

        $record = Vehicle::create($data);

        // Import photos
        if (!$skipImages) {
            $this->importPhotos($record, $dir);
        }

        $this->imported++;
    }

    private function mapVehicleData(array $listing, array $vehicle, array $prices, string $autoscoutId): array
    {
        $fuelRaw = $vehicle['fuelCategory']['raw'] ?? $vehicle['fuelCategory']['formatted'] ?? null;
        $fuelType = self::FUEL_MAP[$fuelRaw] ?? 'petrol';

        $transmissionRaw = $vehicle['transmissionType'] ?? 'Manual';
        $transmission = self::TRANSMISSION_MAP[$transmissionRaw] ?? 'manual';

        $bodyRaw = $vehicle['bodyType'] ?? 'Other';
        $bodyType = self::BODY_MAP[$bodyRaw] ?? 'other';

        $price = $prices['priceRaw'] ?? 0;
        $priceOnRequest = $price <= 0;

        $regDate = $vehicle['firstRegistrationDateRaw'] ?? null;
        $year = null;
        if ($regDate) {
            $year = (int) substr($regDate, 0, 4);
        }

        $description = $listing['description'] ?? '';
        // Strip HTML for clean storage
        $descClean = strip_tags(html_entity_decode($description, ENT_QUOTES | ENT_HTML5, 'UTF-8'));
        $descClean = trim(preg_replace('/\s+/', ' ', $descClean));

        // Consumption parsing
        $consumptionCombined = null;
        $consumptionUrban = null;
        $consumptionExtraUrban = null;

        $fc = $vehicle['fuelConsumptionCombined'] ?? [];
        if (is_array($fc) && isset($fc['formatted'])) {
            if (preg_match('/([\d.,]+)\s*(?:l\/100|kWh)/', $fc['formatted'], $m)) {
                $consumptionCombined = (float) str_replace(',', '.', $m[1]);
            }
        }

        $co2 = $vehicle['rawCo2EmissionInGPerKm'] ?? null;

        // Determine condition
        $condition = 'used';
        $mileage = $vehicle['mileageInKmRaw'] ?? 0;
        if ($mileage < 100 || ($listing['isNewVehicle'] ?? false)) {
            $condition = 'new';
        } elseif ($year && $year < 1990) {
            $condition = 'classic';
        }

        return [
            'brand' => $vehicle['make'] ?? 'Unknown',
            'model' => $vehicle['model'] ?? 'Unknown',
            'variant' => $vehicle['variant'] ?? $vehicle['modelVersionInput'] ?? null,
            'year' => $year ?? (int) date('Y'),
            'price' => max(0, $price),
            'price_on_request' => $priceOnRequest,
            'mileage' => $mileage,
            'fuel_type' => $fuelType,
            'transmission' => $transmission,
            'power_hp' => $vehicle['rawPowerInHp'] ?? null,
            'power_kw' => $vehicle['rawPowerInKw'] ?? null,
            'engine_displacement' => $vehicle['rawDisplacementInCCM'] ?? $vehicle['rawCylinderCapacity'] ?? null,
            'color' => $vehicle['bodyColor'] ?? $vehicle['bodyColorOriginal'] ?? null,
            'body_type' => $bodyType,
            'doors' => $vehicle['numberOfDoors'] ?? null,
            'seats' => $vehicle['numberOfSeats'] ?? null,
            'registration_date' => $regDate,
            'condition' => $condition,
            'description' => ['de' => $descClean],
            'status' => 'available',
            'is_featured' => false,
            'autoscout_id' => $autoscoutId,
            'co2_emissions' => $co2,
            'fuel_consumption_combined' => $consumptionCombined,
            'fuel_consumption_urban' => $consumptionUrban,
            'fuel_consumption_extra_urban' => $consumptionExtraUrban,
            'emission_class' => $vehicle['emissionClass'] ?? null,
            'emission_sticker' => $vehicle['emissionSticker'] ?? null,
            'previous_owners' => $vehicle['previousOwners'] ?? null,
        ];
    }

    private function importPhotos(Vehicle $record, string $dir): void
    {
        $photosDir = $dir . '/photos';
        if (!File::isDirectory($photosDir)) {
            return;
        }

        $files = collect(File::files($photosDir))
            ->filter(fn($f) => in_array(strtolower($f->getExtension()), ['jpg', 'jpeg', 'png', 'webp']))
            ->sortBy(fn($f) => $f->getFilename())
            ->take(30); // max 30 per vehicle

        foreach ($files as $file) {
            try {
                $record->addMedia($file->getPathname())
                    ->preservingOriginal()
                    ->toMediaCollection('images');
            } catch (\Throwable $e) {
                // Skip individual photo errors silently
                continue;
            }
        }
    }
}
