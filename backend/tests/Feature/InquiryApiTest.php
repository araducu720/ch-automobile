<?php

namespace Tests\Feature;

use App\Models\Vehicle;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Tests\TestCase;

class InquiryApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_submit_inquiry(): void
    {
        Notification::fake();

        $response = $this->postJson('/api/v1/inquiries', [
            'type' => 'general',
            'name' => 'Max Mustermann',
            'email' => 'max@example.com',
            'phone' => '+49 123 456789',
            'message' => 'Ich interessiere mich für Ihre Fahrzeuge.',
        ]);

        $response->assertCreated()
            ->assertJsonStructure(['success', 'reference_number', 'message']);

        $this->assertDatabaseHas('inquiries', [
            'name' => 'Max Mustermann',
            'email' => 'max@example.com',
            'type' => 'general',
        ]);
    }

    public function test_can_submit_inquiry_with_vehicle(): void
    {
        Notification::fake();
        $vehicle = Vehicle::factory()->available()->create();

        $response = $this->postJson('/api/v1/inquiries', [
            'type' => 'test_drive',
            'vehicle_id' => $vehicle->id,
            'name' => 'Max Mustermann',
            'email' => 'max@example.com',
            'message' => 'Ich möchte eine Probefahrt vereinbaren.',
            'preferred_date' => now()->addDays(3)->format('Y-m-d'),
            'preferred_time' => '14:00',
        ]);

        $response->assertCreated();
        $this->assertDatabaseHas('inquiries', [
            'vehicle_id' => $vehicle->id,
            'type' => 'test_drive',
        ]);
    }

    public function test_inquiry_validation_fails_without_name(): void
    {
        $response = $this->postJson('/api/v1/inquiries', [
            'type' => 'general',
            'email' => 'max@example.com',
            'message' => 'Test message that is long enough.',
        ]);

        $response->assertStatus(422)
            ->assertJsonPath('error', 'Validation failed');
    }

    public function test_inquiry_validation_fails_with_short_message(): void
    {
        $response = $this->postJson('/api/v1/inquiries', [
            'type' => 'general',
            'name' => 'Max',
            'email' => 'max@example.com',
            'message' => 'Kurz',
        ]);

        $response->assertStatus(422);
    }

    public function test_inquiry_honeypot_returns_fake_success(): void
    {
        $response = $this->postJson('/api/v1/inquiries', [
            'type' => 'general',
            'name' => 'Bot',
            'email' => 'bot@spam.com',
            'message' => 'Spam message that is long enough.',
            'website_url' => 'https://spam.com',
        ]);

        $response->assertOk()
            ->assertJsonPath('reference_number', 'SPAM');

        $this->assertDatabaseMissing('inquiries', ['email' => 'bot@spam.com']);
    }

    public function test_can_submit_trade_in(): void
    {
        Notification::fake();

        $response = $this->postJson('/api/v1/trade-in', [
            'name' => 'Hans Müller',
            'email' => 'hans@example.com',
            'phone' => '+49 170 1234567',
            'trade_brand' => 'BMW',
            'trade_model' => '320i',
            'trade_year' => 2018,
            'trade_mileage' => 85000,
            'trade_condition' => 'good',
            'trade_description' => 'Gut gepflegtes Fahrzeug',
        ]);

        $response->assertCreated()
            ->assertJsonStructure(['success', 'reference_number']);

        $this->assertDatabaseHas('inquiries', [
            'type' => 'trade_in',
            'name' => 'Hans Müller',
        ]);

        $this->assertDatabaseHas('trade_in_valuations', [
            'trade_brand' => 'BMW',
            'trade_model' => '320i',
        ]);
    }

    public function test_trade_in_validation_requires_vehicle_info(): void
    {
        $response = $this->postJson('/api/v1/trade-in', [
            'name' => 'Hans',
            'email' => 'hans@example.com',
            'phone' => '+49 170 1234567',
        ]);

        $response->assertStatus(422);
    }

    public function test_trade_in_honeypot_returns_fake_success(): void
    {
        $response = $this->postJson('/api/v1/trade-in', [
            'name' => 'Bot',
            'email' => 'bot@spam.com',
            'phone' => '+49 170 0000000',
            'trade_brand' => 'Spam',
            'trade_model' => 'Bot',
            'trade_year' => 2020,
            'trade_mileage' => 1000,
            'trade_condition' => 'good',
            'website_url' => 'https://spam.com',
        ]);

        $response->assertOk()
            ->assertJsonPath('reference_number', 'SPAM');
    }
}
