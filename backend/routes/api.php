<?php

use App\Http\Controllers\Api\BlogController;
use App\Http\Controllers\Api\InquiryController;
use App\Http\Controllers\Api\ReservationController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\SettingsController;
use App\Http\Controllers\Api\VehicleController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes — v1
|--------------------------------------------------------------------------
*/

Route::prefix('v1')->group(function () {

    // Vehicles
    Route::get('/vehicles', [VehicleController::class, 'index']);
    Route::get('/vehicles/featured', [VehicleController::class, 'featured']);
    Route::get('/vehicles/brands', [VehicleController::class, 'brands']);
    Route::get('/vehicles/{slug}', [VehicleController::class, 'show']);

    // Inquiries
    Route::post('/inquiries', [InquiryController::class, 'store'])
        ->middleware('throttle:10,1');
    Route::post('/trade-in', [InquiryController::class, 'storeTradeIn'])
        ->middleware('throttle:5,1');

    // Reservations
    Route::post('/reservations', [ReservationController::class, 'store'])
        ->middleware('throttle:5,1');
    Route::get('/reservations/{reference}', [ReservationController::class, 'show'])
        ->middleware('throttle:10,1');
    Route::post('/reservations/{reference}/confirm-invoice', [ReservationController::class, 'confirmInvoice'])
        ->middleware('throttle:10,1');
    Route::get('/reservations/{reference}/contract', [ReservationController::class, 'downloadContract'])
        ->middleware('throttle:10,1');
    Route::post('/reservations/{reference}/signed-contract', [ReservationController::class, 'uploadSignedContract'])
        ->middleware('throttle:10,1');
    Route::post('/reservations/{reference}/signature', [ReservationController::class, 'uploadSignature'])
        ->middleware('throttle:10,1');
    Route::post('/reservations/{reference}/payment-proof', [ReservationController::class, 'uploadPaymentProof'])
        ->middleware('throttle:10,1');

    // Blog
    Route::get('/blog/posts', [BlogController::class, 'index']);
    Route::get('/blog/posts/{slug}', [BlogController::class, 'show']);
    Route::get('/blog/categories', [BlogController::class, 'categories']);

    // Reviews
    Route::get('/reviews', [ReviewController::class, 'index']);
    Route::post('/reviews', [ReviewController::class, 'store'])
        ->middleware('throttle:5,1');

    // Settings
    Route::get('/settings', [SettingsController::class, 'index']);
    Route::get('/legal/{type}', [SettingsController::class, 'legal']);
    Route::post('/newsletter/subscribe', [SettingsController::class, 'subscribeNewsletter'])
        ->middleware('throttle:5,1');
    Route::get('/newsletter/confirm/{token}', [SettingsController::class, 'confirmNewsletter']);
    Route::post('/newsletter/unsubscribe/{email}', [SettingsController::class, 'unsubscribeNewsletter'])
        ->middleware('throttle:5,1');
});
