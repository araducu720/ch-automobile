<?php

namespace App\Jobs\Facebook;

use App\Models\Car;
use App\Models\FacebookPost;
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
 * RepostStaleListingsJob — weekly job that re-posts unsold cars older than 14 days.
 *
 * Uses a different angle from the original post
 * (e.g., "still available", "price improvement").
 */
class RepostStaleListingsJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /** @var int */
    public int $tries = 1;

    /** @var int */
    public int $timeout = 600;

    /**
     * Execute the job.
     */
    public function handle(
        OllamaClient $ollama,
        PromptBuilder $prompts,
        PageService $page
    ): void {
        $staleDays = 14;

        $staleCars = Car::where('status', 'published')
            ->where('created_at', '<=', now()->subDays($staleDays))
            ->get();

        foreach ($staleCars as $car) {
            $locales = $car->getEffectiveLocales();

            foreach ($locales as $locale) {
                try {
                    $this->repostCar($car, $locale, $ollama, $prompts, $page);
                } catch (\Throwable $e) {
                    Log::error("[RepostStaleListingsJob] Failed for car #{$car->id}, locale={$locale}: {$e->getMessage()}");
                }
            }
        }
    }

    // -------------------------------------------------------------------------
    // Helpers
    // -------------------------------------------------------------------------

    /** Generate a fresh-angle post and publish it. */
    private function repostCar(
        Car $car,
        string $locale,
        OllamaClient $ollama,
        PromptBuilder $prompts,
        PageService $page
    ): void {
        $model  = config('facebook.ai_model');
        $tone   = 'still-available';

        $prompt  = $prompts->fbPostListing($car, $locale, $tone);
        $aiData  = $ollama->generate($model, $prompt, 'json');
        $text    = ($aiData['variants'][0]['text'] ?? '') ?: ($aiData['post_text'] ?? '');
        $hashtags = implode(' ', $aiData['hashtags'] ?? []);
        $message  = trim("{$text}\n\n{$hashtags}");

        $imageUrls = $car->photos()->orderBy('sort_order')->limit(5)->pluck('url')->toArray();
        $url       = url('/cars/' . $car->id);

        $response = !empty($imageUrls)
            ? $page->createPhotoCarousel($imageUrls, $message, $url)
            : $page->createTextPost($message, $url);

        FacebookPost::create([
            'car_id'       => $car->id,
            'fb_object_id' => $response['id'] ?? null,
            'type'         => 'repost',
            'locale'       => $locale,
            'content'      => $message,
            'raw_response' => $response,
            'posted_at'    => now(),
        ]);

        Log::info("[RepostStaleListingsJob] Reposted car #{$car->id} locale={$locale}");
    }
}
