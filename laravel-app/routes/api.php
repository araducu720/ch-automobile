<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
| These routes are loaded by the application's bootstrap/app.php
| with the "api" middleware group.
|
| TODO (future PRs): add vehicle listing API, authentication endpoints, etc.
*/

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
