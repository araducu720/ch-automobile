<?php

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],
    'allowed_methods' => ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    'allowed_origins' => [
        env('FRONTEND_URL', 'http://localhost:3000'),
    ],
    'allowed_origins_patterns' => [
        'https://*.vercel.app',
    ],
    'allowed_headers' => [
        'Content-Type',
        'X-Requested-With',
        'Accept',
        'Authorization',
        'X-CSRF-TOKEN',
        'X-XSRF-TOKEN',
    ],
    'exposed_headers' => [],
    'max_age' => 86400,
    'supports_credentials' => true,
];
