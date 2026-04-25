<?php

use App\Http\Controllers\Admin\FacebookDashboardController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

/*
|--------------------------------------------------------------------------
| Admin — Facebook Marketing Dashboard
|--------------------------------------------------------------------------
| Minimal admin panel for monitoring the AI agent's activity.
| Protected by the built-in 'auth' middleware.
*/
Route::middleware(['auth'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/facebook',        [FacebookDashboardController::class, 'index'])->name('facebook.index');
    Route::get('/facebook/posts',  [FacebookDashboardController::class, 'posts'])->name('facebook.posts');
    Route::get('/facebook/leads',  [FacebookDashboardController::class, 'leads'])->name('facebook.leads');
});
