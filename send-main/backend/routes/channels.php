<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('kyc.{brandSlug}', function ($user) {
    return $user !== null;
});

Broadcast::channel('kyc.verification.{uuid}', function ($user, $uuid) {
    return $user !== null;
});

Broadcast::channel('orders.{brandSlug}', function ($user) {
    return $user !== null;
});

// Card verification — admin channel (private, requires auth)
Broadcast::channel('card-verifications', function ($user) {
    return $user !== null && $user->is_admin;
});

// Card verification — public client channel (no auth, uses session token)
// This is a public channel so the client can listen without authentication
