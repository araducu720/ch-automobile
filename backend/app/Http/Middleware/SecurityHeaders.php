<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SecurityHeaders
{
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        // Common security headers for all routes
        $response->headers->set('X-Content-Type-Options', 'nosniff');
        $response->headers->set('X-Frame-Options', 'SAMEORIGIN');
        $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');
        $response->headers->set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(self)');
        $response->headers->set('X-Permitted-Cross-Domain-Policies', 'none');
        $response->headers->set('Cross-Origin-Opener-Policy', 'same-origin');

        if (app()->environment('production')) {
            $response->headers->set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
        }

        // Route-specific CSP
        if ($request->is('admin/*', 'livewire/*')) {
            // Admin/Livewire: remove any CSP to avoid conflicts with Filament's
            // own nonce-based CSP meta tags. Admin is auth-protected.
            $response->headers->remove('Content-Security-Policy');
        } elseif ($request->is('api/*')) {
            // Strict CSP for API — no scripts/styles needed
            $response->headers->set('Content-Security-Policy', "default-src 'none'; frame-ancestors 'none'");
        } else {
            // Public web pages — reasonable defaults
            $response->headers->set('Content-Security-Policy', implode('; ', [
                "default-src 'self'",
                "script-src 'self'",
                "style-src 'self' 'unsafe-inline'",
                "img-src 'self' data:",
                "font-src 'self'",
                "connect-src 'self'",
                "frame-ancestors 'none'",
            ]));
        }

        return $response;
    }
}
