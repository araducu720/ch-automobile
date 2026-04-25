<?php

namespace App\Jobs\Facebook;

use App\Models\FacebookMessage;
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
 * ReplyToCommentJob — generates and publishes a reply to a public comment.
 *
 * Enforces a 1-reply-per-comment policy by checking the `facebook_posts`
 * table for existing `comment_reply` records with the same `fb_object_id`.
 */
class ReplyToCommentJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /** @var int */
    public int $tries = 2;

    /** @var int */
    public int $timeout = 180;

    public function __construct(
        public readonly string $commentId,
        public readonly string $commentText,
        public readonly ?int   $carId = null,
        public readonly array  $rawPayload = []
    ) {}

    /**
     * Execute the job.
     */
    public function handle(
        OllamaClient $ollama,
        PromptBuilder $prompts,
        PageService $page
    ): void {
        // Enforce 1-reply-per-comment
        if (FacebookPost::where('type', 'comment_reply')
            ->where('fb_object_id', $this->commentId)
            ->exists()
        ) {
            Log::info("[ReplyToCommentJob] Already replied to comment {$this->commentId}, skipping.");

            return;
        }

        $locale = $ollama->detectLanguage($this->commentText);
        if (strlen($locale) > 5 || $locale === '') {
            $locale = config('facebook.default_locale', 'ro');
        }

        $car    = $this->carId ? \App\Models\Car::find($this->carId) : null;
        $model  = config('facebook.ai_model');
        $prompt = $prompts->fbCommentReply($this->commentText, $locale, $car);
        $aiData = $ollama->generate($model, $prompt, 'json');
        $reply  = $aiData['reply'] ?? ($aiData['text'] ?? '');

        if (empty($reply)) {
            Log::warning("[ReplyToCommentJob] Empty reply for comment {$this->commentId}");

            return;
        }

        $response = $page->replyToComment($this->commentId, $reply);

        FacebookPost::create([
            'car_id'       => $this->carId,
            'fb_object_id' => $this->commentId,
            'type'         => 'comment_reply',
            'locale'       => $locale,
            'content'      => $reply,
            'raw_response' => $response,
            'posted_at'    => now(),
        ]);

        Log::info("[ReplyToCommentJob] Replied to comment {$this->commentId}");
    }
}
