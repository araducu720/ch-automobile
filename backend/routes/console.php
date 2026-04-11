<?php

use Illuminate\Support\Facades\Schedule;

// Expire overdue reservations every hour
Schedule::command('reservations:expire')->hourly();

// Sync mobile.de inventory every 6 hours
Schedule::command('mobile-de:sync')->everySixHours();

// Clear old page views monthly
Schedule::command('model:prune', ['--model' => 'App\\Models\\PageView'])->monthly();
