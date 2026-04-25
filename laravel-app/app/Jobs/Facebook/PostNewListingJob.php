<?php

namespace App\Jobs\Facebook;

use App\Models\Car;
use App\Models\FacebookPost;
use App\Services\Facebook\CatalogService;
use App\Services\Facebook\PageService;
use App\Services\Ollama\OllamaClient;
use App\Services\Ollama\PromptBuilder;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

/**
 * PostNewListingJob — orchestrator for publishing a new car listing to Facebook.
 *
 * For each target locale of the car it:
 *  1. Renders the fb-post-listing prompt and sends it to Ollama.
 *  2. Creates a Page post (photo carousel + text + link).
 *  3. Pins the AI-generated comment.
 *  4. Dispatches PostToCatalogJob (Marketplace via Commerce Catalog).
 *  5. Schedules PostToGroupsJob with a 15-minute stagger per group.
 *  6. Persists a FacebookPost record.
 *
 * NOTE: Only Facebook is implemented in this iteration.
 *       Future channels (Instagram, AutoScout24, etc.) will be added via
 *       the MarketingChannel interface without modifying this job.
 */
class PostNewListingJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /** @var int Retry once on failure. */
    public int $tries = 2;

    /** @var int Timeout in seconds. */
    public int $timeout = 300;

    public function __construct(public readonly Car $car) {}

    /**
     * Execute the job.
     */
    public function handle(
        OllamaClient $ollama,
        PromptBuilder $prompts,
        PageService $page,
        CatalogService $catalog
    ): void {
        $locales = $this->car->getEffectiveLocales();
        $model   = config('facebook.ai_model');
        $tone    = config('facebook.tone', 'professional-friendly');

        foreach ($locales as $locale) {
            try {
                $this->processLocale($locale, $model, $tone, $ollama, $prompts, $page);
            } catch (\Throwable $e) {
                Log::error("[PostNewListingJob] Locale {$locale} failed for car #{$this->car->id}: {$e->getMessage()}");
            }
        }

        // Push to Commerce Catalog (idempotent, locale-agnostic)
        PostToCatalogJob::dispatch($this->car)->onQueue('facebook');

        // Schedule group posts (staggered 15 min apart)
        $this->scheduleGroupPosts();
    }

    // -------------------------------------------------------------------------
    // Private helpers
    // -------------------------------------------------------------------------

    /**
     * Generate and publish a Page post for one locale.
     */
    private function processLocale(
        string $locale,
        string $model,
        string $tone,
        OllamaClient $ollama,
        PromptBuilder $prompts,
        PageService $page
    ): void {
        $prompt = $prompts->fbPostListing($this->car, $locale, $tone);

        /** @var array $aiData */
        $aiData = $ollama->generate($model, $prompt, 'json');

        $variants    = $aiData['variants'] ?? [];
        $postText    = $variants[0]['text'] ?? ($aiData['post_text'] ?? '');
        $pinnedText  = $aiData['comment_pinned'] ?? '';
        $hashtags    = implode(' ', $aiData['hashtags'] ?? []);
        $fullMessage = trim("{$postText}\n\n{$hashtags}");

        // Build image URL list from car photos
        $imageUrls = $this->car->photos()
            ->orderBy('sort_order')
            ->limit(10)
            ->pluck('url')
            ->toArray();

        $canonicalUrl = url('/cars/' . $this->car->id);

        // Publish to Facebook Page
        if (!empty($imageUrls)) {
            $fbResponse = $page->createPhotoCarousel($imageUrls, $fullMessage, $canonicalUrl);
        } else {
            $fbResponse = $page->createTextPost($fullMessage, $canonicalUrl);
        }

        $fbObjectId = $fbResponse['id'] ?? null;

        // Pin the AI-generated comment
        if ($fbObjectId && $pinnedText) {
            try {
                $page->pinComment($fbObjectId, $pinnedText);
            } catch (\Throwable $e) {
                Log::warning("[PostNewListingJob] Could not pin comment for post {$fbObjectId}: {$e->getMessage()}");
            }
        }

        // Persist the record
        FacebookPost::create([
            'car_id'       => $this->car->id,
            'fb_object_id' => $fbObjectId,
            'type'         => 'new_listing',
            'locale'       => $locale,
            'content'      => $fullMessage,
            'raw_response' => $fbResponse,
            'posted_at'    => now(),
        ]);

        Log::info("[PostNewListingJob] Posted locale={$locale} for car #{$this->car->id}, fb_id={$fbObjectId}");
    }

    /**
     * Dispatch PostToGroupsJob for every eligible group, staggered 15 min apart.
     */
    private function scheduleGroupPosts(): void
    {
        $groups = \App\Models\FacebookGroup::where('manual_only', false)->get();

        $delay = 15; // minutes

        foreach ($groups as $group) {
            PostToGroupsJob::dispatch($this->car, $group)
                ->delay(now()->addMinutes($delay))
                ->onQueue('facebook');

            $delay += 15;
        }
    }
}
