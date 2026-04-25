<?php

namespace App\Services\Facebook;

use GuzzleHttp\Exception\GuzzleException;

/**
 * Service for pulling Facebook Page Insights.
 *
 * Uses the Graph API /insights endpoint to fetch engagement metrics,
 * reach, impressions, etc., which are later fed to the AI agent for
 * content strategy recommendations.
 */
class InsightsService
{
    public function __construct(protected GraphClient $graph) {}

    /**
     * Fetch page-level insight metrics for the last N days.
     *
     * @param  int  $days   Look-back window (default 7 days).
     * @return array  Raw insights data keyed by metric name.
     *
     * @throws GuzzleException
     */
    public function getPageInsights(int $days = 7): array
    {
        $pageId = config('facebook.page_id');

        $metrics = implode(',', [
            'page_post_engagements',
            'page_impressions',
            'page_reach',
            'page_fan_adds',
            'page_views_total',
        ]);

        $response = $this->graph->get("{$pageId}/insights", [
            'metric' => $metrics,
            'period' => 'day',
            'since'  => now()->subDays($days)->timestamp,
            'until'  => now()->timestamp,
        ]);

        return $response['data'] ?? [];
    }

    /**
     * Return a flat summary (metric → total_value) suitable for passing to the AI.
     *
     * @param  int  $days
     * @return array  e.g. ['page_reach' => 4200, 'page_post_engagements' => 320, …]
     *
     * @throws GuzzleException
     */
    public function getSummary(int $days = 7): array
    {
        $raw     = $this->getPageInsights($days);
        $summary = [];

        foreach ($raw as $metric) {
            $name  = $metric['name'] ?? null;
            $total = 0;

            foreach ($metric['values'] ?? [] as $point) {
                $total += (int) ($point['value'] ?? 0);
            }

            if ($name) {
                $summary[$name] = $total;
            }
        }

        return $summary;
    }
}
