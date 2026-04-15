<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\Concerns\ValidatesLocale;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreInquiryRequest;
use App\Http\Requests\StoreTradeInRequest;
use App\Models\Inquiry;
use App\Models\PageView;
use App\Models\TradeInValuation;
use App\Notifications\InquiryConfirmationNotification;
use App\Notifications\NewInquiryNotification;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Notification;

class InquiryController extends Controller
{
    use ValidatesLocale;

    public function store(StoreInquiryRequest $request): JsonResponse
    {
        // Honeypot check — return identical-looking response to avoid detection
        if ($request->isHoneypotFilled()) {
            return response()->json([
                'success' => true,
                'reference_number' => 'INQ-'.\Illuminate\Support\Str::ulid(),
                'message' => 'Ihre Anfrage wurde erfolgreich gesendet.',
            ], 201);
        }

        $inquiry = DB::transaction(function () use ($request) {
            $safe = $request->safe()->except(['website_url']);
            $safe['name'] = strip_tags($safe['name'] ?? '');
            $safe['message'] = strip_tags($safe['message'] ?? '');

            return Inquiry::create(array_merge(
                $safe,
                [
                    'ip_address' => PageView::anonymizeIp($request->ip()),
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
        // Honeypot check — return identical-looking response to avoid detection
        if ($request->isHoneypotFilled()) {
            return response()->json([
                'success' => true,
                'reference_number' => 'INQ-'.\Illuminate\Support\Str::ulid(),
                'message' => 'Ihre Inzahlungnahme-Anfrage wurde erfolgreich gesendet.',
            ], 201);
        }

        $inquiry = DB::transaction(function () use ($request) {
            $inquiry = Inquiry::create([
                'type' => 'trade_in',
                'name' => strip_tags($request->name),
                'email' => $request->email,
                'phone' => $request->phone,
                'message' => strip_tags("Inzahlungnahme: {$request->trade_brand} {$request->trade_model} ({$request->trade_year})"),
                'preferred_contact_method' => $request->get('preferred_contact_method', 'email'),
                'ip_address' => PageView::anonymizeIp($request->ip()),
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
