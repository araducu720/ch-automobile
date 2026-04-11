<?php

namespace Tests\Feature;

use App\Models\Vehicle;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Tests\TestCase;

class ReservationApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_create_reservation(): void
    {
        Notification::fake();
        $vehicle = Vehicle::factory()->available()->create(['price' => 30000]);

        $response = $this->postJson('/api/v1/reservations', [
            'vehicle_id' => $vehicle->id,
            'customer_name' => 'Max Mustermann',
            'customer_email' => 'max@example.com',
            'customer_phone' => '+49 170 1234567',
        ]);

        $response->assertCreated()
            ->assertJsonStructure([
                'success',
                'data' => [
                    'payment_reference',
                    'deposit_amount',
                    'formatted_deposit',
                    'expires_at',
                    'bank_details' => ['bank_name', 'iban', 'bic', 'account_holder', 'reference', 'amount'],
                    'vehicle' => ['brand', 'model', 'year', 'price'],
                ],
                'message',
            ]);

        $this->assertDatabaseHas('reservations', [
            'vehicle_id' => $vehicle->id,
            'customer_name' => 'Max Mustermann',
        ]);

        // Deposit should be 10% of price = 3000
        $this->assertEquals(3000, $response->json('data.deposit_amount'));
    }

    public function test_reservation_minimum_deposit_is_500(): void
    {
        Notification::fake();
        $vehicle = Vehicle::factory()->available()->create(['price' => 3000]);

        $response = $this->postJson('/api/v1/reservations', [
            'vehicle_id' => $vehicle->id,
            'customer_name' => 'Max',
            'customer_email' => 'max@example.com',
            'customer_phone' => '+49 170 1234567',
        ]);

        $response->assertCreated();
        // 10% of 3000 = 300, but min is 500
        $this->assertEquals(500, $response->json('data.deposit_amount'));
    }

    public function test_cannot_reserve_unavailable_vehicle(): void
    {
        $vehicle = Vehicle::factory()->reserved()->create();

        $response = $this->postJson('/api/v1/reservations', [
            'vehicle_id' => $vehicle->id,
            'customer_name' => 'Max',
            'customer_email' => 'max@example.com',
            'customer_phone' => '+49 170 1234567',
        ]);

        $response->assertStatus(409);
    }

    public function test_reservation_validation_requires_customer_info(): void
    {
        $vehicle = Vehicle::factory()->available()->create();

        $response = $this->postJson('/api/v1/reservations', [
            'vehicle_id' => $vehicle->id,
        ]);

        $response->assertStatus(422);
    }

    public function test_reservation_validation_requires_valid_vehicle(): void
    {
        $response = $this->postJson('/api/v1/reservations', [
            'vehicle_id' => 99999,
            'customer_name' => 'Max',
            'customer_email' => 'max@example.com',
            'customer_phone' => '+49 170 1234567',
        ]);

        $response->assertStatus(422);
    }

    public function test_reservation_with_billing_address(): void
    {
        Notification::fake();
        $vehicle = Vehicle::factory()->available()->create();

        $response = $this->postJson('/api/v1/reservations', [
            'vehicle_id' => $vehicle->id,
            'customer_name' => 'Max Mustermann',
            'customer_email' => 'max@example.com',
            'customer_phone' => '+49 170 1234567',
            'billing_street' => 'Musterstraße 1',
            'billing_city' => 'Friedberg',
            'billing_postal_code' => '61169',
            'billing_country' => 'DE',
        ]);

        $response->assertCreated();
        $this->assertDatabaseHas('reservations', [
            'billing_street' => 'Musterstraße 1',
            'billing_city' => 'Friedberg',
        ]);
    }
}
