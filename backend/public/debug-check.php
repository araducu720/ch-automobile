<?php

header('Content-Type: application/json');

$checks = [];

// Check .env
$checks['env_exists'] = file_exists(__DIR__.'/../.env');
$checks['env_size'] = $checks['env_exists'] ? filesize(__DIR__.'/../.env') : 0;

// Check vendor
$checks['vendor_exists'] = is_dir(__DIR__.'/../vendor');
$checks['autoload_exists'] = file_exists(__DIR__.'/../vendor/autoload.php');

// Check artisan
$checks['artisan_exists'] = file_exists(__DIR__.'/../artisan');

// Try to boot Laravel
try {
    require __DIR__.'/../vendor/autoload.php';
    $app = require_once __DIR__.'/../bootstrap/app.php';
    $kernel = $app->make(\Illuminate\Contracts\Console\Kernel::class);
    $kernel->bootstrap();

    $checks['laravel_booted'] = true;
    $checks['app_env'] = config('app.env');
    $checks['db_connection'] = config('database.default');
    $checks['db_database'] = config('database.connections.mysql.database');

    // Test DB connection
    try {
        \Illuminate\Support\Facades\DB::connection()->getPdo();
        $checks['db_connected'] = true;

        // Check if tables exist
        $tables = \Illuminate\Support\Facades\DB::select('SHOW TABLES');
        $checks['table_count'] = count($tables);
        $checks['tables'] = array_map(fn ($t) => array_values((array) $t)[0], $tables);
    } catch (\Exception $e) {
        $checks['db_connected'] = false;
        $checks['db_error'] = $e->getMessage();
    }
} catch (\Throwable $e) {
    $checks['laravel_booted'] = false;
    $checks['boot_error'] = $e->getMessage();
    $checks['boot_trace'] = substr($e->getTraceAsString(), 0, 500);
}

echo json_encode($checks, JSON_PRETTY_PRINT);
