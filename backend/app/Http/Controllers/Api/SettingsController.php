<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\SubscribeNewsletterRequest;
use App\Models\CompanySetting;
use App\Models\NewsletterSubscriber;
use App\Notifications\NewsletterConfirmationNotification;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Str;

class SettingsController extends Controller
{
    private const ALLOWED_LOCALES = ['de', 'en', 'fr', 'it', 'es', 'pt', 'nl', 'pl', 'cs', 'sk', 'hu', 'ro', 'bg', 'hr', 'sl', 'et', 'lv', 'lt', 'fi', 'sv', 'da', 'el', 'ga', 'mt'];

    public function index(Request $request): JsonResponse
    {
        $locale = $request->get('locale', 'de');
        if (! in_array($locale, self::ALLOWED_LOCALES, true)) {
            $locale = 'de';
        }
        app()->setLocale($locale);

        $settings = cache()->remember('company_settings', 3600, function () {
            return CompanySetting::instance();
        });

        return response()->json([
            'data' => [
                'company_name' => $settings->company_name,
                'address' => [
                    'street' => $settings->street,
                    'city' => $settings->city,
                    'postal_code' => $settings->postal_code,
                    'country' => $settings->country,
                    'full' => $settings->full_address,
                ],
                'phone' => $settings->phone,
                'email' => $settings->email,
                'website' => $settings->website,
                'coordinates' => [
                    'lat' => (float) $settings->latitude,
                    'lng' => (float) $settings->longitude,
                ],
                'opening_hours' => $settings->opening_hours,
                'social' => [
                    'facebook' => $settings->facebook_url,
                    'instagram' => $settings->instagram_url,
                    'youtube' => $settings->youtube_url,
                    'tiktok' => $settings->tiktok_url,
                    'whatsapp' => $settings->whatsapp_number,
                ],
                'bank_details' => $settings->bank_details,
                'logo' => $settings->logo,
                'logo_dark' => $settings->logo_dark,
                'meta_title' => $settings->getTranslation('meta_title', $locale, false),
                'meta_description' => $settings->getTranslation('meta_description', $locale, false),
            ],
        ]);
    }

    public function legal(string $type, Request $request): JsonResponse
    {
        $locale = $request->get('locale', 'de');
        if (! in_array($locale, self::ALLOWED_LOCALES, true)) {
            $locale = 'de';
        }
        app()->setLocale($locale);
        $settings = CompanySetting::instance();

        $content = match ($type) {
            'imprint' => $settings->getTranslation('imprint', $locale, false),
            'privacy' => $settings->getTranslation('privacy_policy', $locale, false),
            'terms' => $settings->getTranslation('terms_conditions', $locale, false),
            default => null,
        };

        if (! $content) {
            return response()->json(['error' => 'Not found'], 404);
        }

        return response()->json(['data' => ['content' => $content]]);
    }

    public function subscribeNewsletter(SubscribeNewsletterRequest $request): JsonResponse
    {
        // Honeypot check
        if ($request->isHoneypotFilled()) {
            return response()->json([
                'success' => true,
                'message' => 'Bitte bestätigen Sie Ihre E-Mail-Adresse.',
            ], 201);
        }

        $locale = $request->get('locale', 'de');
        if (! in_array($locale, self::ALLOWED_LOCALES, true)) {
            $locale = 'de';
        }

        $subscriber = NewsletterSubscriber::firstOrCreate(
            ['email' => $request->email],
            [
                'locale' => $locale,
                'confirmation_token' => Str::random(64),
            ]
        );

        if ($subscriber->isConfirmed()) {
            return response()->json([
                'success' => true,
                'message' => 'Sie sind bereits angemeldet.',
            ]);
        }

        // Send confirmation email
        try {
            Notification::route('mail', $subscriber->email)
                ->notify(new NewsletterConfirmationNotification($subscriber));
        } catch (\Throwable $e) {
            Log::warning('Failed to send newsletter confirmation', [
                'email' => $subscriber->email,
                'error' => $e->getMessage(),
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Bitte bestätigen Sie Ihre E-Mail-Adresse.',
        ], 201);
    }

    public function confirmNewsletter(string $token)
    {
        $subscriber = NewsletterSubscriber::where('confirmation_token', $token)
            ->whereNull('confirmed_at')
            ->first();

        $frontendUrl = config('app.frontend_url', 'http://localhost:3000');

        if (! $subscriber) {
            return redirect($frontendUrl.'/newsletter/bestaetigt?status=invalid');
        }

        $subscriber->update([
            'confirmed_at' => now(),
            'confirmation_token' => null,
        ]);

        return redirect($frontendUrl.'/newsletter/bestaetigt?status=success');
    }

    public function unsubscribeNewsletter(string $email): JsonResponse
    {
        $subscriber = NewsletterSubscriber::where('email', $email)->first();

        if (! $subscriber) {
            // Return 200 to prevent email enumeration
            return response()->json([
                'success' => true,
                'message' => 'Sie wurden erfolgreich abgemeldet.',
            ]);
        }

        $subscriber->update(['unsubscribed_at' => now()]);

        return response()->json([
            'success' => true,
            'message' => 'Sie wurden erfolgreich abgemeldet.',
        ]);
    }
}
