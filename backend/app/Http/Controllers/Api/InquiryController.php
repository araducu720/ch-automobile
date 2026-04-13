<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreInquiryRequest;
use App\Http\Requests\StoreTradeInRequest;
use App\Models\Inquiry;
use App\Models\TradeInValuation;
use App\Notifications\InquiryConfirmationNotification;
use App\Notifications\NewInquiryNotification;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Notification;

class InquiryController extends Controller
{
    private const ALLOWED_LOCALES = ['de', 'en', 'fr', 'it', 'es', 'pt', 'nl', 'pl', 'cs', 'sk', 'hu', 'ro', 'bg', 'hr', 'sl', 'et', 'lv', 'lt', 'fi', 'sv', 'da', 'el', 'ga', 'mt'];

    private function resolveLocale($request): string
    {
        $locale = $request->get('locale', 'de');
        return in_array($locale, self::ALLOWED_LOCALES, true) ? $locale : 'de';
    }

    public function store(StoreInquiryRequest $request): JsonResponse
    {
        // Honeypot check
        if ($request->isHoneypotFilled()) {
            return response()->json(['success' => true, 'reference_number' => 'SPAM'], 200);
        }

        $inquiry = DB::transaction(function () use ($request) {
            return Inquiry::create(array_merge(
                $request->safe()->except(['website_url']),
                [
                    'ip_address' => $request->ip(),
                    'user_agent' => $request->userAgent(),
                    'locale' => $this->resolveLocale($request),
                ]
            ));
        });

        // Send notifications
        try {
            Notification::route('mail', config('mail.from.address'))
                ->notify(new NewInquiryNotification($inquiry));

            Notification::route('mail', $inquiry->email)
                ->notify(new InquiryConfirmationNotification($inquiry));
        } catch (\Throwable $e) {
            Log::warning('Failed to send inquiry notification', [
                'inquiry_id' => $inquiry->id,
                'error' => $e->getMessage(),
            ]);
        }

        return response()->json([
            'success' => true,
            'reference_number' => $inquiry->reference_number,
            'message' => 'Ihre Anfrage wurde erfolgreich gesendet.',
        ], 201);
    }

    public function storeTradeIn(StoreTradeInRequest $request): JsonResponse
    {
        // Honeypot check
        if ($request->isHoneypotFilled()) {
            return response()->json(['success' => true, 'reference_number' => 'SPAM'], 200);
        }

        $inquiry = DB::transaction(function () use ($request) {
            $inquiry = Inquiry::create([
                'type' => 'trade_in',
                'name' => $request->name,
                'email' => $request->email,
                'phone' => $request->phone,
                'message' => "Inzahlungnahme: {$request->trade_brand} {$request->trade_model} ({$request->trade_year})",
                'preferred_contact_method' => $request->get('preferred_contact_method', 'email'),
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'locale' => $this->resolveLocale($request),
            ]);

            $tradeIn = TradeInValuation::create([
                'inquiry_id' => $inquiry->id,
                'trade_brand' => $request->trade_brand,
                'trade_model' => $request->trade_model,
                'trade_year' => $request->trade_year,
                'trade_mileage' => $request->trade_mileage,
                'trade_condition' => $request->trade_condition,
                'trade_description' => $request->trade_description,
                'damage_description' => $request->damage_description,
            ]);

            if ($request->hasFile('photos')) {
                foreach ($request->file('photos') as $photo) {
                    $tradeIn->addMedia($photo)->toMediaCollection('trade_in_photos');
                }
            }

            return $inquiry;
        });

        // Send admin notification
        try {
            Notification::route('mail', config('mail.from.address'))
                ->notify(new NewInquiryNotification($inquiry));

            Notification::route('mail', $inquiry->email)
                ->notify(new InquiryConfirmationNotification($inquiry));
        } catch (\Throwable $e) {
            Log::warning('Failed to send trade-in notification', [
                'inquiry_id' => $inquiry->id,
                'error' => $e->getMessage(),
            ]);
        }

        return response()->json([
            'success' => true,
            'reference_number' => $inquiry->reference_number,
            'message' => 'Ihre Inzahlungnahme-Anfrage wurde erfolgreich gesendet.',
        ], 201);
    }
}
