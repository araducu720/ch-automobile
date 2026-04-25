<?php

namespace App\Services\Facebook;

use App\Models\FacebookGroup;
use GuzzleHttp\Exception\ClientException;
use GuzzleHttp\Exception\GuzzleException;
use Illuminate\Support\Facades\Log;

/**
 * Service for posting content to Facebook Groups via the Graph API.
 *
 * NOTE: Facebook's Graph API restricts group posting to groups where the
 * app has been explicitly granted access by group admins.  If posting
 * fails with a permission error, the group is automatically flagged as
 * `manual_only = true` in the database and skipped on future runs.
 */
class GroupsService
{
    public function __construct(protected GraphClient $graph) {}

    /**
     * Post a text message to a Facebook Group.
     *
     * @param  FacebookGroup  $group    The target group record.
     * @param  string         $message  Post body text.
     * @param  string|null    $link     Optional link to attach.
     * @return array|null  Graph API response, or null if group is manual-only / posting failed gracefully.
     *
     * @throws GuzzleException  On unexpected API errors.
     */
    public function postToGroup(FacebookGroup $group, string $message, ?string $link = null): ?array
    {
        if ($group->manual_only) {
            Log::info("[GroupsService] Skipping group {$group->fb_group_id} (manual_only).");

            return null;
        }

        $data = ['message' => $message];

        if ($link !== null) {
            $data['link'] = $link;
        }

        try {
            $response = $this->graph->post("{$group->fb_group_id}/feed", $data);

            $group->touch('last_posted_at');

            return $response;
        } catch (ClientException $e) {
            $body = json_decode((string) $e->getResponse()->getBody(), true);
            $code = $body['error']['code'] ?? 0;

            // 200 = Permissions error (app not allowed to post in this group)
            // 100 = Invalid param (group may have disabled API posting)
            if (in_array($code, [200, 100], true)) {
                Log::warning("[GroupsService] Group {$group->fb_group_id} does not allow API posts. Marking as manual_only.", [
                    'error' => $body['error']['message'] ?? '',
                ]);

                $group->update(['manual_only' => true]);

                return null;
            }

            throw $e;
        }
    }
}
