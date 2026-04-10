<?php

namespace Tests\Feature;

use App\Models\Vehicle;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class VehicleApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_list_vehicles(): void
    {
        Vehicle::factory()->available()->count(3)->create();
        Vehicle::factory()->draft()->create(); // should not appear

        $response = $this->getJson('/api/v1/vehicles');

        $response->assertOk()
            ->assertJsonCount(3, 'data')
            ->assertJsonStructure([
                'data' => [['id', 'brand', 'model', 'slug', 'price', 'fuel_type', 'thumbnail', 'main_image']],
                'meta' => ['current_page', 'last_page', 'total'],
            ]);
    }

    public function test_can_filter_vehicles_by_brand(): void
    {
        Vehicle::factory()->available()->create(['brand' => 'BMW']);
        Vehicle::factory()->available()->create(['brand' => 'Audi']);

        $response = $this->getJson('/api/v1/vehicles?brand=BMW');

        $response->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.brand', 'BMW');
    }

    public function test_can_filter_vehicles_by_fuel_type(): void
    {
        Vehicle::factory()->available()->create(['fuel_type' => 'diesel']);
        Vehicle::factory()->available()->create(['fuel_type' => 'electric']);

        $response = $this->getJson('/api/v1/vehicles?fuel_type=electric');

        $response->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.fuel_type', 'electric');
    }

    public function test_can_filter_vehicles_by_price_range(): void
    {
        Vehicle::factory()->available()->create(['price' => 10000]);
        Vehicle::factory()->available()->create(['price' => 30000]);
        Vehicle::factory()->available()->create(['price' => 50000]);

        $response = $this->getJson('/api/v1/vehicles?price_min=20000&price_max=40000');

        $response->assertOk()
            ->assertJsonCount(1, 'data');
    }

    public function test_can_search_vehicles(): void
    {
        Vehicle::factory()->available()->create(['brand' => 'BMW', 'model' => '320i']);
        Vehicle::factory()->available()->create(['brand' => 'Audi', 'model' => 'A4']);

        $response = $this->getJson('/api/v1/vehicles?search=BMW');

        $response->assertOk()
            ->assertJsonCount(1, 'data');
    }

    public function test_can_sort_vehicles(): void
    {
        Vehicle::factory()->available()->create(['price' => 50000]);
        Vehicle::factory()->available()->create(['price' => 10000]);

        $response = $this->getJson('/api/v1/vehicles?sort=price&direction=asc');

        $response->assertOk();
        $data = $response->json('data');
        $this->assertTrue($data[0]['price'] < $data[1]['price']);
    }

    public function test_can_show_vehicle_detail(): void
    {
        $vehicle = Vehicle::factory()->available()->create();

        $response = $this->getJson("/api/v1/vehicles/{$vehicle->slug}");

        $response->assertOk()
            ->assertJsonStructure([
                'data' => [
                    'id', 'brand', 'model', 'slug', 'price', 'description',
                    'features', 'equipment', 'images',
                    'engine_displacement', 'tuv_until', 'warranty',
                    'accident_free', 'non_smoker', 'garage_kept',
                ],
                'related',
            ]);
    }

    public function test_vehicle_detail_increments_views(): void
    {
        $vehicle = Vehicle::factory()->available()->create(['views_count' => 5]);

        $this->getJson("/api/v1/vehicles/{$vehicle->slug}");

        $this->assertDatabaseHas('vehicles', [
            'id' => $vehicle->id,
            'views_count' => 6,
        ]);
    }

    public function test_vehicle_detail_returns_404_for_draft(): void
    {
        $vehicle = Vehicle::factory()->draft()->create();

        $response = $this->getJson("/api/v1/vehicles/{$vehicle->slug}");

        $response->assertNotFound();
    }

    public function test_can_list_featured_vehicles(): void
    {
        Vehicle::factory()->featured()->count(3)->create();
        Vehicle::factory()->available()->create(['is_featured' => false]);

        $response = $this->getJson('/api/v1/vehicles/featured');

        $response->assertOk()
            ->assertJsonCount(3, 'data');
    }

    public function test_can_list_brands(): void
    {
        Vehicle::factory()->available()->create(['brand' => 'BMW']);
        Vehicle::factory()->available()->create(['brand' => 'BMW']);
        Vehicle::factory()->available()->create(['brand' => 'Audi']);

        $response = $this->getJson('/api/v1/vehicles/brands');

        $response->assertOk()
            ->assertJsonCount(2, 'data');
    }

    public function test_pagination_limits_per_page(): void
    {
        Vehicle::factory()->available()->count(5)->create();

        $response = $this->getJson('/api/v1/vehicles?per_page=2');

        $response->assertOk()
            ->assertJsonCount(2, 'data')
            ->assertJsonPath('meta.total', 5);
    }

    public function test_locale_parameter_accepted(): void
    {
        Vehicle::factory()->available()->create();

        $response = $this->getJson('/api/v1/vehicles?locale=en');

        $response->assertOk();
    }
}
