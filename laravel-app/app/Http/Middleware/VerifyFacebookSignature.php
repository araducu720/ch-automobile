<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * VerifyFacebookSignature — validates the X-Hub-Signature-256 header on
 * all incoming POST requests to the Facebook webhook endpoint.
 *
 * Meta computes the signature as:
 *   HMAC-SHA256(app_secret, raw_request_body)
 * prefixed with "sha256=".
 *
 * Reference:
 *  https://developers.facebook.com/docs/messenger-platform/webhooks#validate-payloads
 */
class VerifyFacebookSignature
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): Response  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // GET requests (webhook verification challenge) don't carry a signature
        if ($request->isMethod('GET')) {
            return $next($request);
        }

        $signature = $request->header('X-Hub-Signature-256', '');
        $secret    = config('facebook.app_secret', '');

        if (empty($secret)) {
            abort(500, 'FB_APP_SECRET is not configured.');
        }

        if (empty($signature)) {
            abort(403, 'Missing X-Hub-Signature-256 header.');
        }

        $rawBody  = $request->getContent();
        $expected = 'sha256=' . hash_hmac('sha256', $rawBody, $secret);

        if (!hash_equals($expected, $signature)) {
            abort(403, 'Invalid Facebook webhook signature.');
        }

        return $next($request);
    }
}
