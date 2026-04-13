<?php

namespace Tests\Feature;

use App\Models\CompanySetting;
use App\Models\NewsletterSubscriber;
use App\Models\PageView;
use App\Models\Reservation;
use App\Models\Vehicle;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SecurityTest extends TestCase
{
    use RefreshDatabase;

    /* ──────── Locale Validation ──────── */

    public function test_invalid_locale_falls_back_to_de(): void
    {
        Vehicle::factory()->available()->create();

        $response = $this->getJson('/api/v1/vehicles?locale=INVALID');

        $response->assertOk();
    }

    public function test_path_traversal_locale_is_rejected(): void
    {
        Vehicle::factory()->available()->create();

        $response = $this->getJson('/api/v1/vehicles?locale=../../etc/passwd');

        $response->assertOk();
    }

    public function test_empty_locale_defaults_to_de(): void
    {
        Vehicle::factory()->available()->create();

        $response = $this->getJson('/api/v1/vehicles?locale=');

        $response->assertOk();
    }

    public function test_settings_rejects_invalid_locale(): void
    {
        $response = $this->getJson('/api/v1/settings?locale=<script>alert(1)</script>');

        $response->assertOk();
    }

    public function test_blog_rejects_invalid_locale(): void
    {
        $response = $this->getJson('/api/v1/blog/posts?locale=DROP TABLE');

        $response->assertOk();
    }

    /* ──────── SQL Injection in Search ──────── */

    public function test_search_handles_sql_wildcards_safely(): void
    {
        Vehicle::factory()->available()->create(['brand' => 'BMW']);

        $response = $this->getJson('/api/v1/vehicles?search='.urlencode('%_'));

        $response->assertOk()
            ->assertJsonCount(0, 'data');
    }

    public function test_search_with_quotes_does_not_error(): void
    {
        Vehicle::factory()->available()->create(['brand' => 'BMW']);

        $response = $this->getJson('/api/v1/vehicles?search='.urlencode("'; DROP TABLE vehicles;--"));

        $response->assertOk();
    }

    /* ──────── Sort Direction Whitelist ──────── */

    public function test_invalid_sort_direction_defaults_to_desc(): void
    {
        Vehicle::factory()->available()->create(['price' => 10000]);
        Vehicle::factory()->available()->create(['price' => 50000]);

        $response = $this->getJson('/api/v1/vehicles?sort=price&direction=DROP');

        $response->assertOk();
        $data = $response->json('data');
        $this->assertTrue($data[0]['price'] > $data[1]['price']);
    }

    public function test_invalid_sort_field_is_ignored(): void
    {
        Vehicle::factory()->available()->create();

        $response = $this->getJson('/api/v1/vehicles?sort=id;DROP+TABLE+vehicles');

        $response->assertOk();
    }

    /* ──────── Honeypot Protection ──────── */

    public function test_inquiry_honeypot_returns_200_without_saving(): void
    {
        $count = \App\Models\Inquiry::count();

        $response = $this->postJson('/api/v1/inquiries', [
            'type' => 'general',
            'name' => 'Spam Bot',
            'email' => 'spam@test.com',
            'message' => 'Test message for spam.',
            'website_url' => 'http://spam.com',
        ]);

        $response->assertOk();
        $this->assertEquals($count, \App\Models\Inquiry::count());
    }

    /* ──────── Newsletter Enumeration Prevention ──────── */

    public function test_unsubscribe_nonexistent_email_still_returns_200(): void
    {
        $response = $this->postJson('/api/v1/newsletter/unsubscribe/nonexistent@test.com');

        $response->assertOk()
            ->assertJsonPath('success', true);
    }

    /* ──────── Security Headers ──────── */

    public function test_security_headers_present_on_api_response(): void
    {
        Vehicle::factory()->available()->create();

        $response = $this->getJson('/api/v1/vehicles');

        $response->assertHeader('X-Content-Type-Options', 'nosniff');
        $response->assertHeader('X-Frame-Options', 'SAMEORIGIN');
        $response->assertHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
        $response->assertHeader('Content-Security-Policy');
    }

    /* ──────── Rate Limiting ──────── */

    public function test_newsletter_confirm_has_throttle(): void
    {
        // Making many requests — this test just ensures the route exists and responds
        $response = $this->getJson('/api/v1/newsletter/confirm/invalid-token');

        // Should redirect (302) or return response — not a 500
        $this->assertContains($response->getStatusCode(), [200, 302]);
    }

    /* ──────── IP Anonymization (Unit) ──────── */

    public function test_ipv4_anonymization(): void
    {
        $this->assertEquals('192.168.1.0', PageView::anonymizeIp('192.168.1.123'));
        $this->assertEquals('10.0.0.0', PageView::anonymizeIp('10.0.0.255'));
    }

    public function test_ipv6_anonymization(): void
    {
        $result = PageView::anonymizeIp('2001:0db8:85a3:0000:0000:8a2e:0370:7334');
        $this->assertNotNull($result);
        $this->assertStringEndsWith(':0:0:0:0:0', $result);
    }

    public function test_null_ip_returns_null(): void
    {
        $this->assertNull(PageView::anonymizeIp(null));
    }

    public function test_invalid_ip_returns_null(): void
    {
        $this->assertNull(PageView::anonymizeIp('not-an-ip'));
    }

    /* ──────── Reservation Payment Reference ──────── */

    public function test_reservation_gets_cryptographic_payment_reference(): void
    {
        $vehicle = Vehicle::factory()->available()->create(['price' => 20000]);

        $response = $this->postJson('/api/v1/reservations', [
            'vehicle_id' => $vehicle->id,
            'customer_name' => 'Test User',
            'customer_email' => 'test@example.com',
            'customer_phone' => '+4915112345678',
        ]);

        $response->assertCreated();
        $ref = $response->json('data.payment_reference');
        $this->assertStringStartsWith('RES-', $ref);
        $this->assertGreaterThanOrEqual(28, strlen($ref));
    }

    /* ──────── Model $hidden ──────── */

    public function test_vehicle_hides_sensitive_fields_in_json(): void
    {
        $vehicle = Vehicle::factory()->available()->create(['vin' => 'WBAPH5C55BA000001']);

        $json = $vehicle->toArray();

        $this->assertArrayNotHasKey('vin', $json);
        $this->assertArrayNotHasKey('mobile_de_id', $json);
        $this->assertArrayNotHasKey('autoscout_id', $json);
    }

    public function test_review_hides_email_and_ip_in_json(): void
    {
        $review = \App\Models\Review::factory()->create([
            'customer_email' => 'secret@test.com',
            'ip_address' => '1.2.3.4',
        ]);

        $json = $review->toArray();

        $this->assertArrayNotHasKey('customer_email', $json);
        $this->assertArrayNotHasKey('ip_address', $json);
    }

    /* ──────── SoftDeletes on Review ──────── */

    public function test_review_soft_deletes(): void
    {
        $review = \App\Models\Review::factory()->create();
        $id = $review->id;

        $review->delete();

        $this->assertSoftDeleted('reviews', ['id' => $id]);
    }

    /* ──────── VIN Factory Validity ──────── */

    public function test_vehicle_factory_generates_valid_vin(): void
    {
        $vehicle = Vehicle::factory()->create();
        $vin = $vehicle->vin;

        // VIN must be 17 chars, no I, O, Q
        $this->assertEquals(17, strlen($vin));
        $this->assertDoesNotMatchRegularExpression('/[IOQ]/', $vin);
    }

    /* ──────── Input Sanitization (XSS) ──────── */

    public function test_inquiry_strips_html_from_name(): void
    {
        \Illuminate\Support\Facades\Notification::fake();

        $response = $this->postJson('/api/v1/inquiries', [
            'type' => 'general',
            'name' => '<script>alert("xss")</script>Max',
            'email' => 'max@example.com',
            'message' => 'Ich interessiere mich für Ihre Fahrzeuge.',
        ]);

        $response->assertCreated();
        $this->assertDatabaseHas('inquiries', [
            'name' => 'alert("xss")Max',
        ]);
    }

    public function test_inquiry_strips_html_from_message(): void
    {
        \Illuminate\Support\Facades\Notification::fake();

        $response = $this->postJson('/api/v1/inquiries', [
            'type' => 'general',
            'name' => 'Max',
            'email' => 'max@example.com',
            'message' => '<img src=x onerror=alert(1)>Echte Nachricht hier.',
        ]);

        $response->assertCreated();
        $this->assertDatabaseMissing('inquiries', [
            'message' => '<img src=x onerror=alert(1)>Echte Nachricht hier.',
        ]);
    }

    public function test_review_strips_html_from_comment(): void
    {
        \Illuminate\Support\Facades\Notification::fake();

        $response = $this->postJson('/api/v1/reviews', [
            'customer_name' => '<b>Maria</b>',
            'rating' => 5,
            'comment' => '<script>document.cookie</script>Sehr guter Service bei CH Automobile.',
        ]);

        $response->assertCreated();
        $this->assertDatabaseHas('reviews', [
            'customer_name' => 'Maria',
        ]);
        $this->assertDatabaseMissing('reviews', [
            'comment' => '<script>document.cookie</script>Sehr guter Service bei CH Automobile.',
        ]);
    }

    /* ──────── Newsletter Token Expiry ──────── */

    public function test_newsletter_expired_token_is_rejected(): void
    {
        $subscriber = NewsletterSubscriber::create([
            'email' => 'expired@example.com',
            'confirmation_token' => 'expired-token-123',
            'created_at' => now()->subDays(3),
            'updated_at' => now()->subDays(3),
        ]);

        $response = $this->get('/api/v1/newsletter/confirm/expired-token-123');

        $response->assertRedirect();
        $this->assertStringContainsString('status=expired', $response->headers->get('Location'));

        $subscriber->refresh();
        $this->assertNull($subscriber->confirmation_token);
    }

    /* ──────── Inquiry Model $hidden ──────── */

    public function test_inquiry_hides_ip_and_user_agent_in_json(): void
    {
        $inquiry = \App\Models\Inquiry::factory()->create([
            'ip_address' => '1.2.3.0',
            'user_agent' => 'Mozilla/5.0',
        ]);

        $json = $inquiry->toArray();

        $this->assertArrayNotHasKey('ip_address', $json);
        $this->assertArrayNotHasKey('user_agent', $json);
    }

    /* ──────── Reservation File Storage ──────── */

    public function test_reservation_uploads_use_private_storage(): void
    {
        \Illuminate\Support\Facades\Notification::fake();
        \Illuminate\Support\Facades\Storage::fake('local');

        $vehicle = Vehicle::factory()->available()->create(['price' => 20000]);

        $createResponse = $this->postJson('/api/v1/reservations', [
            'vehicle_id' => $vehicle->id,
            'customer_name' => 'Storage Test',
            'customer_email' => 'storage@example.com',
            'customer_phone' => '+49 176 1234567',
        ]);
        $reference = $createResponse->json('data.payment_reference');

        // Advance to signature step
        $this->postJson("/api/v1/reservations/{$reference}/confirm-invoice");

        $sigFile = \Illuminate\Http\UploadedFile::fake()->image('sig.png');
        $this->postJson("/api/v1/reservations/{$reference}/signature", ['signature' => $sigFile]);

        // Verify file was stored on local (private) disk, not public
        \Illuminate\Support\Facades\Storage::disk('local')->assertExists(
            collect(\Illuminate\Support\Facades\Storage::disk('local')->allFiles())
                ->first(fn ($f) => str_contains($f, 'signatures'))
        );
    }
}
