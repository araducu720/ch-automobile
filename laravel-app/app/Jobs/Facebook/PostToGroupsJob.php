<?php

namespace App\Jobs\Facebook;

use App\Models\Car;
use App\Models\FacebookGroup;
use App\Models\FacebookPost;
use App\Services\Facebook\GroupsService;
use App\Services\Ollama\OllamaClient;
use App\Services\Ollama\PromptBuilder;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

/**
 * PostToGroupsJob — publishes a car listing to a single Facebook Group.
 *
 * Each job handles one group at a time.  A unique copy is generated via
 * Ollama with a tone appropriate for group audiences.
 *
 * Rate limiting: max posts per day per group is enforced by checking
 * `facebook_posts` records for today.
 */
class PostToGroupsJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /** @var int */
    public int $tries = 2;

    /** @var int */
    public int $timeout = 180;

    public function __construct(
        public readonly Car $car,
        public readonly FacebookGroup $group
    ) {}

    /**
     * Execute the job.
     */
    public function handle(
        OllamaClient $ollama,
        PromptBuilder $prompts,
        GroupsService $groups
    ): void {
        if ($this->group->manual_only) {
            Log::info("[PostToGroupsJob] Group {$this->group->fb_group_id} is manual_only, skipping.");

            return;
        }

        if ($this->exceededDailyLimit()) {
            Log::info("[PostToGroupsJob] Group {$this->group->fb_group_id} hit daily limit.");

            return;
        }

        $locale = $this->group->language ?? config('facebook.default_locale', 'ro');
        $model  = config('facebook.ai_model');

        $prompt  = $prompts->fbGroupPost($this->car, $locale, 'casual-friendly');
        $aiData  = $ollama->generate($model, $prompt, 'json');
        $text    = $aiData['text'] ?? ($aiData['post'] ?? '');
        $hashtags = implode(' ', $aiData['hashtags'] ?? []);
        $message = trim("{$text}\n\n{$hashtags}");

        $response = $groups->postToGroup($this->group, $message, url('/cars/' . $this->car->id));

        if ($response) {
            FacebookPost::create([
                'car_id'       => $this->car->id,
                'fb_object_id' => $response['id'] ?? null,
                'type'         => 'group',
                'locale'       => $locale,
                'content'      => $message,
                'raw_response' => $response,
                'posted_at'    => now(),
            ]);

            Log::info("[PostToGroupsJob] Posted to group {$this->group->fb_group_id} for car #{$this->car->id}");
        }
    }

    // -------------------------------------------------------------------------
    // Helpers
    // -------------------------------------------------------------------------

    /** Check if the daily post limit for this group has been reached. */
    private function exceededDailyLimit(): bool
    {
        $max = $this->group->max_per_day ?? config('facebook.groups_max_per_day', 3);

        $todayCount = FacebookPost::where('type', 'group')
            ->whereDate('posted_at', today())
            ->whereHas('car', fn ($q) => $q->whereNotNull('id'))
            ->count();

        return $todayCount >= $max;
    }
}
