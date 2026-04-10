<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return ['status' => 'ok', 'app' => 'KYC Platform API'];
});
