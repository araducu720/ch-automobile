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

    public function test_can_retrieve_reservation_by_reference(): void
    {
        Notification::fake();
        $vehicle = Vehicle::factory()->available()->create(['price' => 20000]);

        $createResponse = $this->postJson('/api/v1/reservations', [
            'vehicle_id' => $vehicle->id,
            'customer_name' => 'Erika Mustermann',
            'customer_email' => 'erika@example.com',
            'customer_phone' => '+49 171 9876543',
        ]);
        $createResponse->assertCreated();
        $reference = $createResponse->json('data.payment_reference');

        $response = $this->getJson("/api/v1/reservations/{$reference}");

        $response->assertOk()
            ->assertJsonStructure([
                'success',
                'data' => [
                    'payment_reference', 'purchase_step', 'deposit_amount',
                    'expires_at', 'customer_name', 'customer_email',
                    'has_signature', 'has_payment_proof', 'has_contract',
                    'bank_details', 'vehicle',
                ],
            ])
            ->assertJsonPath('data.payment_reference', $reference)
            ->assertJsonPath('data.customer_name', 'Erika Mustermann');
    }

    public function test_show_reservation_returns_404_for_unknown_reference(): void
    {
        $response = $this->getJson('/api/v1/reservations/RES-XXXX-NOTEXIST');
        $response->assertNotFound();
    }

    public function test_confirm_invoice_advances_purchase_step(): void
    {
        Notification::fake();
        $vehicle = Vehicle::factory()->available()->create(['price' => 20000]);

        $createResponse = $this->postJson('/api/v1/reservations', [
            'vehicle_id' => $vehicle->id,
            'customer_name' => 'Karl Müller',
            'customer_email' => 'karl@example.com',
            'customer_phone' => '+49 172 1234567',
        ]);
        $reference = $createResponse->json('data.payment_reference');

        $response = $this->postJson("/api/v1/reservations/{$reference}/confirm-invoice");

        $response->assertOk()
            ->assertJsonPath('data.purchase_step', 'signature');

        $this->assertDatabaseHas('reservations', [
            'payment_reference' => $reference,
            'purchase_step' => 'signature',
        ]);
    }

    public function test_confirm_invoice_returns_410_for_expired_reservation(): void
    {
        Notification::fake();
        $vehicle = Vehicle::factory()->available()->create(['price' => 10000]);

        $createResponse = $this->postJson('/api/v1/reservations', [
            'vehicle_id' => $vehicle->id,
            'customer_name' => 'Test User',
            'customer_email' => 'test@example.com',
            'customer_phone' => '+49 170 0000000',
        ]);
        $reference = $createResponse->json('data.payment_reference');

        // Manually expire the reservation
        \App\Models\Reservation::where('payment_reference', $reference)
            ->update(['reservation_expires_at' => now()->subDay()]);

        $response = $this->postJson("/api/v1/reservations/{$reference}/confirm-invoice");

        $response->assertStatus(410);
    }

    public function test_upload_signature_advances_to_payment_step(): void
    {
        Notification::fake();
        $vehicle = Vehicle::factory()->available()->create(['price' => 20000]);

        $createResponse = $this->postJson('/api/v1/reservations', [
            'vehicle_id' => $vehicle->id,
            'customer_name' => 'Sig Test',
            'customer_email' => 'sig@example.com',
            'customer_phone' => '+49 173 1234567',
        ]);
        $reference = $createResponse->json('data.payment_reference');

        // Advance to signature step first
        $this->postJson("/api/v1/reservations/{$reference}/confirm-invoice");

        // Create a fake image file for upload
        $fakeFile = \Illuminate\Http\UploadedFile::fake()->image('signature.jpg', 200, 100);

        $response = $this->postJson("/api/v1/reservations/{$reference}/signature", [
            'signature' => $fakeFile,
        ]);

        $response->assertOk()
            ->assertJsonPath('data.purchase_step', 'payment');

        $this->assertDatabaseHas('reservations', [
            'payment_reference' => $reference,
            'purchase_step' => 'payment',
        ]);
    }

    public function test_upload_payment_proof_advances_to_completed(): void
    {
        Notification::fake();
        $vehicle = Vehicle::factory()->available()->create(['price' => 20000]);

        $createResponse = $this->postJson('/api/v1/reservations', [
            'vehicle_id' => $vehicle->id,
            'customer_name' => 'Payment Test',
            'customer_email' => 'payment@example.com',
            'customer_phone' => '+49 174 1234567',
        ]);
        $reference = $createResponse->json('data.payment_reference');

        // Walk through the purchase flow
        $this->postJson("/api/v1/reservations/{$reference}/confirm-invoice");

        $sigFile = \Illuminate\Http\UploadedFile::fake()->image('sig.jpg');
        $this->postJson("/api/v1/reservations/{$reference}/signature", ['signature' => $sigFile]);

        $proofFile = \Illuminate\Http\UploadedFile::fake()->image('proof.jpg');
        $response = $this->postJson("/api/v1/reservations/{$reference}/payment-proof", [
            'payment_proof' => $proofFile,
        ]);

        $response->assertOk()
            ->assertJsonPath('data.purchase_step', 'completed');

        $this->assertDatabaseHas('reservations', [
            'payment_reference' => $reference,
            'purchase_step' => 'completed',
        ]);
    }

    public function test_upload_payment_proof_rejects_wrong_step(): void
    {
        Notification::fake();
        $vehicle = Vehicle::factory()->available()->create(['price' => 20000]);

        $createResponse = $this->postJson('/api/v1/reservations', [
            'vehicle_id' => $vehicle->id,
            'customer_name' => 'Step Test',
            'customer_email' => 'step@example.com',
            'customer_phone' => '+49 175 1234567',
        ]);
        $reference = $createResponse->json('data.payment_reference');
        // Still in 'invoice' step — cannot upload payment proof yet

        $proofFile = \Illuminate\Http\UploadedFile::fake()->image('proof.jpg');
        $response = $this->postJson("/api/v1/reservations/{$reference}/payment-proof", [
            'payment_proof' => $proofFile,
        ]);

        $response->assertStatus(422);
    }

    public function test_reservation_honeypot_returns_fake_success(): void
    {
        $vehicle = Vehicle::factory()->available()->create(['price' => 15000]);

        $response = $this->postJson('/api/v1/reservations', [
            'vehicle_id' => $vehicle->id,
            'customer_name' => 'Bot',
            'customer_email' => 'bot@spam.com',
            'customer_phone' => '+49 0000 000000',
            'website_url' => 'https://spam.com',
        ]);

        // Honeypot returns fake 201
        $response->assertStatus(201)
            ->assertJsonPath('success', true);

        // Vehicle should NOT be reserved
        $this->assertDatabaseHas('vehicles', [
            'id' => $vehicle->id,
            'status' => 'available',
        ]);
    }
}
