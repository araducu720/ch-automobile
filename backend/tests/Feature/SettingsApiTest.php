<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SettingsApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_get_settings(): void
    {
        // Settings use singleton pattern, creates record on demand
        $response = $this->getJson('/api/v1/settings');

        $response->assertOk()
            ->assertJsonStructure([
                'data' => [
                    'company_name',
                    'address' => ['street', 'city', 'postal_code', 'country'],
                    'phone',
                    'email',
                    'coordinates' => ['lat', 'lng'],
                    'opening_hours',
                    'social',
                ],
            ]);
    }

    public function test_can_get_settings_with_locale(): void
    {
        $response = $this->getJson('/api/v1/settings?locale=en');

        $response->assertOk();
    }

    public function test_can_get_legal_content(): void
    {
        $response = $this->getJson('/api/v1/legal/imprint');

        // May return 404 if not set yet, but shouldn't error
        $this->assertContains($response->status(), [200, 404]);
    }

    public function test_invalid_legal_type_returns_404(): void
    {
        $response = $this->getJson('/api/v1/legal/invalid-type');

        $response->assertNotFound();
    }
}
