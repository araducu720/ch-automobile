<?php

namespace Tests\Feature;

use App\Models\Review;
use App\Models\Vehicle;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Tests\TestCase;

class ReviewApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_list_reviews(): void
    {
        Review::factory()->approved()->count(3)->create();
        Review::factory()->create(); // unapproved, should not appear

        $response = $this->getJson('/api/v1/reviews');

        $response->assertOk()
            ->assertJsonStructure([
                'data' => [['id', 'customer_name', 'rating', 'comment', 'created_at']],
                'aggregate' => ['average_rating', 'total_count', 'breakdown'],
                'meta' => ['current_page', 'last_page', 'total'],
            ])
            ->assertJsonPath('aggregate.total_count', 3);
    }

    public function test_reviews_aggregate_is_correct(): void
    {
        Review::factory()->approved()->create(['rating' => 5]);
        Review::factory()->approved()->create(['rating' => 5]);
        Review::factory()->approved()->create(['rating' => 3]);

        $response = $this->getJson('/api/v1/reviews');

        $response->assertOk();
        $aggregate = $response->json('aggregate');
        $this->assertEquals(3, $aggregate['total_count']);
        $this->assertEquals(4.3, $aggregate['average_rating']); // (5+5+3)/3 = 4.33 rounded to 4.3
        $this->assertEquals(2, $aggregate['breakdown'][5]);
        $this->assertEquals(1, $aggregate['breakdown'][3]);
    }

    public function test_can_submit_review(): void
    {
        Notification::fake();

        $response = $this->postJson('/api/v1/reviews', [
            'customer_name' => 'Maria Schmidt',
            'customer_email' => 'maria@example.com',
            'rating' => 5,
            'title' => 'Excellent service',
            'comment' => 'Sehr guter Service, schnelle und freundliche Beratung bei CH Automobile.',
        ]);

        $response->assertCreated()
            ->assertJsonPath('success', true);

        $this->assertDatabaseHas('reviews', [
            'customer_name' => 'Maria Schmidt',
            'rating' => 5,
            'is_approved' => false, // new reviews need approval
        ]);
    }

    public function test_review_with_vehicle(): void
    {
        Notification::fake();
        $vehicle = Vehicle::factory()->available()->create();

        $response = $this->postJson('/api/v1/reviews', [
            'customer_name' => 'Maria',
            'rating' => 4,
            'comment' => 'Tolles Fahrzeug, kann ich nur weiterempfehlen! Perfekter Zustand.',
            'vehicle_id' => $vehicle->id,
        ]);

        $response->assertCreated();
        $this->assertDatabaseHas('reviews', [
            'vehicle_id' => $vehicle->id,
        ]);
    }

    public function test_review_validation_requires_minimum_comment(): void
    {
        $response = $this->postJson('/api/v1/reviews', [
            'customer_name' => 'Maria',
            'rating' => 5,
            'comment' => 'Kurz', // too short
        ]);

        $response->assertStatus(422);
    }

    public function test_review_validation_requires_rating(): void
    {
        $response = $this->postJson('/api/v1/reviews', [
            'customer_name' => 'Maria',
            'comment' => 'This is a long enough comment for the review.',
        ]);

        $response->assertStatus(422);
    }

    public function test_review_honeypot_blocks_spam(): void
    {
        $response = $this->postJson('/api/v1/reviews', [
            'customer_name' => 'Bot',
            'rating' => 5,
            'comment' => 'Spam review that is long enough to pass.',
            'website_url' => 'https://spam.site',
        ]);

        $response->assertOk()
            ->assertJsonPath('success', true);

        $this->assertDatabaseMissing('reviews', ['customer_name' => 'Bot']);
    }
}
