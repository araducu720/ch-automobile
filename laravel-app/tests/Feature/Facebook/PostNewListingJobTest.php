<?php

namespace Tests\Feature\Facebook;

use App\Jobs\Facebook\PostNewListingJob;
use App\Jobs\Facebook\PostToCatalogJob;
use App\Jobs\Facebook\PostToGroupsJob;
use App\Models\Car;
use App\Services\Facebook\CatalogService;
use App\Services\Facebook\PageService;
use App\Services\Ollama\OllamaClient;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Queue;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

/**
 * Feature tests for PostNewListingJob.
 */
class PostNewListingJobTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function it_creates_a_page_post_and_catalog_entry_for_each_locale(): void
    {
        Queue::fake([PostToCatalogJob::class, PostToGroupsJob::class]);

        $car = Car::factory()->create([
            'brand'          => 'BMW',
            'model'          => '320d',
            'year'           => 2020,
            'km'             => 50000,
            'fuel'           => 'diesel',
            'transmission'   => 'automatic',
            'hp'             => 190,
            'price'          => 2895000,
            'currency'       => 'EUR',
            'status'         => 'published',
            'target_locales' => ['ro'],
        ]);

        // Mock OllamaClient: generate() returns valid AI data
        $ollamaMock = $this->createMock(OllamaClient::class);
        $ollamaMock->method('generate')
            ->willReturn([
                'variants'                => [['text' => 'Great BMW for sale!', 'tone_note' => 'professional']],
                'marketplace_title'       => 'BMW 320d 2020 Diesel',
                'marketplace_description' => 'Excellent condition',
                'comment_pinned'          => 'Contact us for a test drive!',
                'first_reply_template'    => 'Thank you for your interest.',
                'hashtags'                => ['#BMW', '#320d'],
            ]);

        $this->app->instance(OllamaClient::class, $ollamaMock);

        // Mock PageService
        $pageMock = $this->createMock(PageService::class);
        $pageMock->method('createTextPost')
            ->willReturn(['id' => 'PAGE_123_POST_456']);
        $pageMock->method('createPhotoCarousel')
            ->willReturn(['id' => 'PAGE_123_POST_456']);
        $pageMock->method('pinComment')
            ->willReturn(['id' => 'COMMENT_789']);

        $this->app->instance(PageService::class, $pageMock);

        // Mock CatalogService
        $catalogMock = $this->createMock(CatalogService::class);
        $catalogMock->method('upsertVehicle')
            ->willReturn(['id' => 'CATALOG_VEHICLE_001']);

        $this->app->instance(CatalogService::class, $catalogMock);

        // Dispatch the job synchronously
        PostNewListingJob::dispatchSync($car);

        // Assert a FacebookPost record was created
        $this->assertDatabaseHas('facebook_posts', [
            'car_id'       => $car->id,
            'fb_object_id' => 'PAGE_123_POST_456',
            'type'         => 'new_listing',
            'locale'       => 'ro',
        ]);

        // Assert downstream jobs were queued
        Queue::assertPushed(PostToCatalogJob::class, fn ($job) => $job->car->id === $car->id);
    }

    #[Test]
    public function it_skips_locale_if_ollama_returns_invalid_response(): void
    {
        Queue::fake();

        $car = Car::factory()->create([
            'status'         => 'published',
            'target_locales' => ['ro'],
        ]);

        $ollamaMock = $this->createMock(OllamaClient::class);
        $ollamaMock->method('generate')
            ->willThrowException(new \App\Exceptions\OllamaResponseException('Invalid JSON'));

        $this->app->instance(OllamaClient::class, $ollamaMock);

        $pageMock = $this->createMock(PageService::class);
        $pageMock->expects($this->never())->method('createTextPost');
        $pageMock->expects($this->never())->method('createPhotoCarousel');

        $this->app->instance(PageService::class, $pageMock);

        $catalogMock = $this->createMock(CatalogService::class);
        $this->app->instance(CatalogService::class, $catalogMock);

        // Should not throw — errors are logged and skipped
        PostNewListingJob::dispatchSync($car);

        $this->assertDatabaseMissing('facebook_posts', ['car_id' => $car->id, 'type' => 'new_listing']);
    }
}
