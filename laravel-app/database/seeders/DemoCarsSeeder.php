<?php

namespace Database\Seeders;

use App\Models\Car;
use App\Models\CarPhoto;
use App\Models\FacebookGroup;
use Illuminate\Database\Seeder;

/**
 * DemoCarsSeeder — seeds 5 demo vehicles and 2 Facebook groups for testing.
 *
 * Run with: php artisan db:seed --class=DemoCarsSeeder
 * Or via:   php artisan migrate --seed (uses DatabaseSeeder)
 */
class DemoCarsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $cars = [
            [
                'brand'            => 'BMW',
                'model'            => '320d',
                'year'             => 2020,
                'km'               => 58000,
                'fuel'             => 'diesel',
                'transmission'     => 'automatic',
                'hp'               => 190,
                'body_style'       => 'sedan',
                'price'            => 2895000, // 28 950 EUR
                'currency'         => 'EUR',
                'location_city'    => 'München',
                'location_country' => 'Germany',
                'highlights'       => 'Full service history, parking sensors, heated seats, LED headlights',
                'status'           => 'published',
                'target_locales'   => ['de', 'en', 'ro'],
                'vin'              => 'WBA8E1C59HK123456',
            ],
            [
                'brand'            => 'Volkswagen',
                'model'            => 'Golf 8 R-Line',
                'year'             => 2022,
                'km'               => 24000,
                'fuel'             => 'gasoline',
                'transmission'     => 'automatic',
                'hp'               => 150,
                'body_style'       => 'hatchback',
                'price'            => 2450000, // 24 500 EUR
                'currency'         => 'EUR',
                'location_city'    => 'București',
                'location_country' => 'Romania',
                'highlights'       => 'Virtual cockpit, R-Line exterior, wireless CarPlay',
                'status'           => 'published',
                'target_locales'   => ['ro', 'de'],
                'vin'              => 'WVWZZZ3HZNM987654',
            ],
            [
                'brand'            => 'Mercedes-Benz',
                'model'            => 'C 220d AMG',
                'year'             => 2021,
                'km'               => 41000,
                'fuel'             => 'diesel',
                'transmission'     => 'automatic',
                'hp'               => 200,
                'body_style'       => 'sedan',
                'price'            => 3690000, // 36 900 EUR
                'currency'         => 'EUR',
                'location_city'    => 'Vienna',
                'location_country' => 'Austria',
                'highlights'       => 'AMG Sport package, Burmester sound, 360° camera',
                'status'           => 'published',
                'target_locales'   => ['de', 'en'],
                'vin'              => 'WDD2050471F111222',
            ],
            [
                'brand'            => 'Audi',
                'model'            => 'A4 Avant 2.0 TDI',
                'year'             => 2019,
                'km'               => 89000,
                'fuel'             => 'diesel',
                'transmission'     => 'automatic',
                'hp'               => 150,
                'body_style'       => 'wagon',
                'price'            => 1990000, // 19 900 EUR
                'currency'         => 'EUR',
                'location_city'    => 'Paris',
                'location_country' => 'France',
                'highlights'       => 'Matrix LED, quattro AWD, panoramic roof, navi plus',
                'status'           => 'published',
                'target_locales'   => ['fr', 'en'],
                'vin'              => 'WAUZZZ8K2KA334455',
            ],
            [
                'brand'            => 'Toyota',
                'model'            => 'RAV4 Hybrid',
                'year'             => 2023,
                'km'               => 12000,
                'fuel'             => 'hybrid',
                'transmission'     => 'automatic',
                'hp'               => 218,
                'body_style'       => 'suv',
                'price'            => 4190000, // 41 900 EUR
                'currency'         => 'EUR',
                'location_city'    => 'Milano',
                'location_country' => 'Italy',
                'highlights'       => 'AWD-i hybrid, JBL sound, Toyota Safety Sense, digital mirrors',
                'status'           => 'published',
                'target_locales'   => ['it', 'en'],
                'vin'              => 'JTMBWREV0PD123789',
            ],
        ];

        foreach ($cars as $data) {
            $car = Car::updateOrCreate(['vin' => $data['vin']], $data);

            // Add a placeholder photo for each car
            CarPhoto::firstOrCreate(
                ['car_id' => $car->id, 'sort_order' => 0],
                [
                    'url'      => "https://via.placeholder.com/800x600?text={$car->brand}+{$car->year}",
                    'ai_tags'  => null,
                ]
            );
        }

        // Demo Facebook groups
        $groups = [
            [
                'fb_group_id'      => '100000000000001',
                'name'             => 'Auto Second-Hand România',
                'language'         => 'ro',
                'max_per_day'      => 3,
                'allows_api_posts' => true,
                'manual_only'      => false,
            ],
            [
                'fb_group_id'      => '100000000000002',
                'name'             => 'Gebrauchtwagen Deutschland',
                'language'         => 'de',
                'max_per_day'      => 2,
                'allows_api_posts' => true,
                'manual_only'      => false,
            ],
        ];

        foreach ($groups as $group) {
            FacebookGroup::updateOrCreate(['fb_group_id' => $group['fb_group_id']], $group);
        }

        $this->command->info('✅ DemoCarsSeeder: 5 demo cars and 2 Facebook groups created.');
    }
}
