<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'name' => 'C-H Automobile & Exclusive Cars API',
        'version' => '1.0.0',
    ]);
});
