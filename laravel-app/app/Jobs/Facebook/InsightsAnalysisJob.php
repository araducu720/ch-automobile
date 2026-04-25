<?php

namespace App\Jobs\Facebook;

use App\Services\Facebook\InsightsService;
use App\Services\Ollama\OllamaClient;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

/**
 * InsightsAnalysisJob — daily at 23:00, pulls Page insights and asks the AI
 * to summarise what worked and store recommendations.
 */
class InsightsAnalysisJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /** @var int */
    public int $tries = 1;

    /** @var int */
    public int $timeout = 300;

    /**
     * Execute the job.
     */
    public function handle(InsightsService $insights, OllamaClient $ollama): void
    {
        $metrics = [];
        try {
            $metrics = $insights->getSummary(7);
        } catch (\Throwable $e) {
            Log::warning("[InsightsAnalysisJob] Could not fetch insights: {$e->getMessage()}");

            return;
        }

        $model  = config('facebook.ai_model');
        $prompt = $this->buildInsightsPrompt($metrics);

        $aiData = $ollama->generate($model, $prompt, 'json');

        $summary         = $aiData['summary'] ?? '';
        $recommendations = $aiData['recommendations'] ?? [];

        DB::table('facebook_insights')->updateOrInsert(
            ['snapshot_date' => today()->toDateString()],
            [
                'metrics'         => json_encode($metrics),
                'ai_summary'      => $summary,
                'recommendations' => json_encode($recommendations),
                'updated_at'      => now(),
                'created_at'      => now(),
            ]
        );

        Log::info('[InsightsAnalysisJob] Insights analysis stored for ' . today()->toDateString());
    }

    // -------------------------------------------------------------------------
    // Helpers
    // -------------------------------------------------------------------------

    /** Build a prompt that asks the AI to interpret the insights. */
    private function buildInsightsPrompt(array $metrics): string
    {
        $metricsJson = json_encode($metrics, JSON_PRETTY_PRINT);

        return <<<PROMPT
You are a social media analyst for an automobile dealership in Europe.

Below are Facebook Page insights for the last 7 days (all values are totals):

{$metricsJson}

Analyse the data and respond ONLY in valid JSON with this structure:
{
  "summary": "2-3 sentence plain-language summary of performance",
  "recommendations": [
    "Specific actionable recommendation 1",
    "Specific actionable recommendation 2",
    "Specific actionable recommendation 3"
  ]
}

Do not include any text outside the JSON object.
PROMPT;
    }
}
