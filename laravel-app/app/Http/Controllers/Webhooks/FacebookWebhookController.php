<?php

namespace App\Http\Controllers\Webhooks;

use App\Http\Controllers\Controller;
use App\Jobs\Facebook\ReplyToCommentJob;
use App\Jobs\Facebook\ReplyToMessengerJob;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Log;

/**
 * FacebookWebhookController
 *
 * Handles Meta webhook events for the C-H Automobile Facebook Page.
 *
 * Routes:
 *  GET  /webhooks/facebook  — Verification challenge (Meta calls this once when you subscribe).
 *  POST /webhooks/facebook  — Incoming events (messages, comments, postbacks, …).
 *
 * Security: the VerifyFacebookSignature middleware validates the
 * X-Hub-Signature-256 header on all POST requests before this
 * controller is reached.
 */
class FacebookWebhookController extends Controller
{
    /**
     * Handle the Meta webhook verification challenge.
     *
     * Meta sends:
     *  ?hub.mode=subscribe
     *  &hub.verify_token=<your_token>
     *  &hub.challenge=<random_string>
     *
     * We must echo back hub.challenge with HTTP 200 if hub.verify_token matches.
     */
    public function verify(Request $request): Response|JsonResponse
    {
        $mode       = $request->query('hub_mode');
        $token      = $request->query('hub_verify_token');
        $challenge  = $request->query('hub_challenge');

        if ($mode === 'subscribe' && $token === config('facebook.verify_token')) {
            Log::info('[FacebookWebhook] Verification challenge accepted.');

            return response((string) $challenge, 200);
        }

        Log::warning('[FacebookWebhook] Verification challenge failed.', [
            'mode'  => $mode,
            'token' => $token,
        ]);

        return response()->json(['error' => 'Forbidden'], 403);
    }

    /**
     * Handle incoming webhook events from Meta.
     *
     * Dispatches appropriate jobs based on event type.
     */
    public function handle(Request $request): JsonResponse
    {
        $payload = $request->json()->all();

        Log::debug('[FacebookWebhook] Received payload', ['object' => $payload['object'] ?? null]);

        if (($payload['object'] ?? '') !== 'page') {
            return response()->json(['status' => 'ignored']);
        }

        foreach ($payload['entry'] ?? [] as $entry) {
            // Messenger messages
            foreach ($entry['messaging'] ?? [] as $event) {
                $this->handleMessagingEvent($event);
            }

            // Page feed events (comments, posts, etc.)
            foreach ($entry['changes'] ?? [] as $change) {
                $this->handleFeedChange($change);
            }
        }

        return response()->json(['status' => 'ok']);
    }

    // -------------------------------------------------------------------------
    // Private event handlers
    // -------------------------------------------------------------------------

    /** Dispatch Messenger reply job for incoming messages. */
    private function handleMessagingEvent(array $event): void
    {
        $psid    = $event['sender']['id'] ?? null;
        $message = $event['message']['text'] ?? null;

        if (!$psid || !$message) {
            return;
        }

        ReplyToMessengerJob::dispatch($psid, $message, $event)
            ->onQueue('facebook');

        Log::info("[FacebookWebhook] Queued ReplyToMessengerJob for PSID {$psid}");
    }

    /** Dispatch comment reply job for new comments on Page posts. */
    private function handleFeedChange(array $change): void
    {
        $field = $change['field'] ?? '';
        $value = $change['value'] ?? [];

        if ($field !== 'feed') {
            return;
        }

        $itemType   = $value['item'] ?? '';
        $verb       = $value['verb'] ?? '';
        $commentId  = $value['comment_id'] ?? null;
        $message    = $value['message'] ?? null;

        if ($itemType === 'comment' && $verb === 'add' && $commentId && $message) {
            ReplyToCommentJob::dispatch($commentId, $message, null, $value)
                ->onQueue('facebook');

            Log::info("[FacebookWebhook] Queued ReplyToCommentJob for comment {$commentId}");
        }
    }
}
