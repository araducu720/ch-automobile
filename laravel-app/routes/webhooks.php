<?php

use App\Http\Controllers\Webhooks\FacebookWebhookController;
use App\Http\Middleware\VerifyFacebookSignature;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Webhook Routes
|--------------------------------------------------------------------------
| These routes receive events from external services (Meta/Facebook).
| CSRF protection is disabled for these routes because Meta sends requests
| without a CSRF token; we use HMAC signature verification instead.
|
| The VerifyFacebookSignature middleware validates X-Hub-Signature-256
| on all POST requests.
*/

Route::middleware([VerifyFacebookSignature::class])
    ->prefix('webhooks')
    ->name('webhooks.')
    ->group(function () {
        // GET: Meta verification challenge
        Route::get('/facebook', [FacebookWebhookController::class, 'verify'])
            ->name('facebook.verify');

        // POST: Incoming events (messages, comments, postbacks, …)
        Route::post('/facebook', [FacebookWebhookController::class, 'handle'])
            ->name('facebook.handle');
    });
