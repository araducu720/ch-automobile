<?php

namespace Tests\Feature\Facebook;

use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

/**
 * Feature tests for the Facebook webhook endpoint.
 */
class WebhookTest extends TestCase
{
    use RefreshDatabase;

    // -------------------------------------------------------------------------
    // GET /webhooks/facebook  (Meta verification challenge)
    // -------------------------------------------------------------------------

    #[Test]
    public function it_accepts_valid_verification_challenge(): void
    {
        config(['facebook.verify_token' => 'test-verify-token-123']);

        $this->get('/webhooks/facebook?' . http_build_query([
            'hub_mode'         => 'subscribe',
            'hub_verify_token' => 'test-verify-token-123',
            'hub_challenge'    => 'CHALLENGE_STRING',
        ]))->assertOk()
           ->assertSee('CHALLENGE_STRING');
    }

    #[Test]
    public function it_rejects_verification_challenge_with_wrong_token(): void
    {
        config(['facebook.verify_token' => 'correct-token']);

        $this->get('/webhooks/facebook?' . http_build_query([
            'hub_mode'         => 'subscribe',
            'hub_verify_token' => 'wrong-token',
            'hub_challenge'    => 'CHALLENGE_STRING',
        ]))->assertStatus(403);
    }

    // -------------------------------------------------------------------------
    // POST /webhooks/facebook  (incoming events)
    // -------------------------------------------------------------------------

    #[Test]
    public function it_accepts_post_with_valid_hmac_signature(): void
    {
        config(['facebook.app_secret' => 'test-app-secret']);

        $payload = json_encode([
            'object' => 'page',
            'entry'  => [],
        ]);

        $signature = 'sha256=' . hash_hmac('sha256', $payload, 'test-app-secret');

        $this->withHeaders(['X-Hub-Signature-256' => $signature])
             ->postJson('/webhooks/facebook', json_decode($payload, true))
             ->assertOk()
             ->assertJson(['status' => 'ok']);
    }

    #[Test]
    public function it_rejects_post_with_invalid_hmac_signature(): void
    {
        config(['facebook.app_secret' => 'test-app-secret']);

        $this->withHeaders(['X-Hub-Signature-256' => 'sha256=invalidsignature'])
             ->postJson('/webhooks/facebook', ['object' => 'page', 'entry' => []])
             ->assertStatus(403);
    }

    #[Test]
    public function it_returns_ignored_for_non_page_objects(): void
    {
        config(['facebook.app_secret' => 'test-app-secret']);

        $payload   = json_encode(['object' => 'user', 'entry' => []]);
        $signature = 'sha256=' . hash_hmac('sha256', $payload, 'test-app-secret');

        $this->withHeaders(['X-Hub-Signature-256' => $signature])
             ->postJson('/webhooks/facebook', json_decode($payload, true))
             ->assertOk()
             ->assertJson(['status' => 'ignored']);
    }
}
