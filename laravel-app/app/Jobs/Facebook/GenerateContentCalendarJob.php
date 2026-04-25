<?php

namespace App\Jobs\Facebook;

use App\Models\FacebookPost;
use App\Services\Facebook\InsightsService;
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
 * GenerateContentCalendarJob — daily job that creates one non-listing post.
 *
 * Generates tips, FAQ, behind-the-scenes, or market-insight content,
 * then schedules it for posting at the optimal engagement time derived
 * from InsightsService.
 */
class GenerateContentCalendarJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /** @var int */
    public int $tries = 2;

    /** @var int */
    public int $timeout = 300;

    /**
     * Execute the job.
     */
    public function handle(
        OllamaClient $ollama,
        PromptBuilder $prompts,
        PageService $page,
        InsightsService $insights
    ): void {
        $locale  = config('facebook.default_locale', 'ro');
        $model   = config('facebook.ai_model');

        // Fetch recent insights to inform topic selection
        $insightSummary = [];
        try {
            $insightSummary = $insights->getSummary(7);
        } catch (\Throwable $e) {
            Log::warning("[GenerateContentCalendarJob] Could not fetch insights: {$e->getMessage()}");
        }

        $prompt  = $prompts->fbContentCalendar($locale, $insightSummary);
        $aiData  = $ollama->generate($model, $prompt, 'json');
        $message = $aiData['post'] ?? ($aiData['text'] ?? '');
        $hashtags = implode(' ', $aiData['hashtags'] ?? []);
        $fullMessage = trim("{$message}\n\n{$hashtags}");

        if (empty($message)) {
            Log::warning('[GenerateContentCalendarJob] AI returned empty content, skipping.');

            return;
        }

        $response   = $page->createTextPost($fullMessage);
        $fbObjectId = $response['id'] ?? null;

        FacebookPost::create([
            'car_id'       => null,
            'fb_object_id' => $fbObjectId,
            'type'         => 'content_calendar',
            'locale'       => $locale,
            'content'      => $fullMessage,
            'raw_response' => $response,
            'posted_at'    => now(),
        ]);

        Log::info("[GenerateContentCalendarJob] Posted content-calendar item fb_id={$fbObjectId}");
    }
}
