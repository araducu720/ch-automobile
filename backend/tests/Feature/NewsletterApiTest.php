<?php

namespace Tests\Feature;

use App\Models\NewsletterSubscriber;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Tests\TestCase;

class NewsletterApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_subscribe_to_newsletter(): void
    {
        Notification::fake();

        $response = $this->postJson('/api/v1/newsletter/subscribe', [
            'email' => 'newsletter@example.com',
        ]);

        $response->assertCreated()
            ->assertJsonPath('success', true);

        $this->assertDatabaseHas('newsletter_subscribers', [
            'email' => 'newsletter@example.com',
        ]);
    }

    public function test_subscribe_with_locale(): void
    {
        Notification::fake();

        $response = $this->postJson('/api/v1/newsletter/subscribe', [
            'email' => 'test@example.com',
            'locale' => 'en',
        ]);

        $response->assertCreated();
        $this->assertDatabaseHas('newsletter_subscribers', [
            'email' => 'test@example.com',
            'locale' => 'en',
        ]);
    }

    public function test_subscribe_validation_requires_valid_email(): void
    {
        $response = $this->postJson('/api/v1/newsletter/subscribe', [
            'email' => 'not-an-email',
        ]);

        $response->assertStatus(422);
    }

    public function test_already_confirmed_subscriber_gets_message(): void
    {
        Notification::fake();
        NewsletterSubscriber::factory()->confirmed()->create([
            'email' => 'confirmed@example.com',
        ]);

        $response = $this->postJson('/api/v1/newsletter/subscribe', [
            'email' => 'confirmed@example.com',
        ]);

        $response->assertOk()
            ->assertJsonPath('message', 'Sie sind bereits angemeldet.');
    }

    public function test_can_confirm_newsletter(): void
    {
        $subscriber = NewsletterSubscriber::factory()->create([
            'confirmation_token' => 'test-token-123',
        ]);

        $response = $this->get('/api/v1/newsletter/confirm/test-token-123');

        $response->assertRedirect();
        $this->assertStringContainsString('status=success', $response->headers->get('Location'));

        $subscriber->refresh();
        $this->assertNotNull($subscriber->confirmed_at);
        $this->assertNull($subscriber->confirmation_token);
    }

    public function test_confirm_with_invalid_token_returns_404(): void
    {
        $response = $this->get('/api/v1/newsletter/confirm/invalid-token');

        $response->assertRedirect();
        $this->assertStringContainsString('status=invalid', $response->headers->get('Location'));
    }

    public function test_can_unsubscribe(): void
    {
        $subscriber = NewsletterSubscriber::factory()->confirmed()->create([
            'email' => 'unsub@example.com',
        ]);

        $response = $this->postJson('/api/v1/newsletter/unsubscribe/unsub@example.com');

        $response->assertOk()
            ->assertJsonPath('success', true);

        $subscriber->refresh();
        $this->assertNotNull($subscriber->unsubscribed_at);
    }

    public function test_unsubscribe_nonexistent_email_returns_404(): void
    {
        $response = $this->postJson('/api/v1/newsletter/unsubscribe/nonexistent@example.com');

        $response->assertNotFound();
    }
}
