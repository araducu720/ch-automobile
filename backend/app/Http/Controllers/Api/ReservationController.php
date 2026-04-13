<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\Concerns\ValidatesLocale;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreReservationRequest;
use App\Models\CompanySetting;
use App\Models\Reservation;
use App\Models\Vehicle;
use App\Notifications\NewReservationNotification;
use App\Notifications\ReservationConfirmationNotification;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Storage;

class ReservationController extends Controller
{
    use ValidatesLocale;

    public function store(StoreReservationRequest $request): JsonResponse
    {
        // Honeypot check
        if ($request->isHoneypotFilled()) {
            return response()->json([
                'success' => true,
                'message' => 'Reservierung erfolgreich.',
            ], 201);
        }

        $reservation = DB::transaction(function () use ($request) {
            // Lock the vehicle row to prevent race conditions
            $vehicle = Vehicle::where('id', $request->vehicle_id)
                ->lockForUpdate()
                ->firstOrFail();

            if ($vehicle->status !== 'available') {
                return null; // Vehicle no longer available
            }

            // Deposit = 10% of price, min 500€
            $depositAmount = max(500, $vehicle->price * 0.10);

            $locale = $this->resolveLocale($request);

            $safe = $request->safe()->except(['website_url']);
            $safe['customer_name'] = strip_tags($safe['customer_name'] ?? '');

            $reservation = Reservation::create(array_merge(
                $safe,
                [
                    'deposit_amount' => $depositAmount,
                    'locale' => $locale,
                    'purchase_step' => 'invoice',
                ]
            ));

            // Mark vehicle as reserved immediately
            $vehicle->update(['status' => 'reserved']);

            return $reservation;
        });

        if (! $reservation) {
            return response()->json([
                'error' => 'Dieses Fahrzeug ist nicht mehr verfügbar.',
            ], 409);
        }

        $vehicle = $reservation->vehicle;

        // Send notifications
        try {
            Notification::route('mail', config('mail.from.address'))
                ->notify(new NewReservationNotification($reservation));

            Notification::route('mail', $reservation->customer_email)
                ->notify(new ReservationConfirmationNotification($reservation));
        } catch (\Throwable $e) {
            Log::warning('Failed to send reservation notification', [
                'reservation_id' => $reservation->id,
                'error' => $e->getMessage(),
            ]);
        }

        $settings = CompanySetting::instance();

        return response()->json([
            'success' => true,
            'data' => [
                'payment_reference' => $reservation->payment_reference,
                'deposit_amount' => (float) $reservation->deposit_amount,
                'formatted_deposit' => number_format($reservation->deposit_amount, 2, ',', '.').' €',
                'expires_at' => $reservation->reservation_expires_at->toIso8601String(),
                'bank_details' => [
                    'bank_name' => $settings->bank_name,
                    'iban' => $settings->bank_iban,
                    'bic' => $settings->bank_bic,
                    'account_holder' => $settings->bank_account_holder,
                    'reference' => $reservation->payment_reference,
                    'amount' => number_format($reservation->deposit_amount, 2, ',', '.').' €',
                ],
                'vehicle' => [
                    'brand' => $vehicle->brand,
                    'model' => $vehicle->model,
                    'year' => $vehicle->year,
                    'price' => $vehicle->formatted_price,
                ],
            ],
            'message' => 'Reservierung erfolgreich. Bitte überweisen Sie den Betrag innerhalb von 7 Tagen.',
        ], 201);
    }

    /**
     * Get reservation details by payment reference.
     */
    public function show(string $reference): JsonResponse
    {
        $reservation = Reservation::where('payment_reference', $reference)
            ->with('vehicle')
            ->firstOrFail();

        $settings = CompanySetting::instance();
        $vehicle = $reservation->vehicle;

        return response()->json([
            'success' => true,
            'data' => [
                'payment_reference' => $reservation->payment_reference,
                'purchase_step' => $reservation->purchase_step,
                'deposit_amount' => (float) $reservation->deposit_amount,
                'formatted_deposit' => number_format($reservation->deposit_amount, 2, ',', '.').' €',
                'expires_at' => $reservation->reservation_expires_at->toIso8601String(),
                'customer_name' => $reservation->customer_name,
                'customer_email' => $reservation->customer_email,
                'has_signature' => ! empty($reservation->signature_path),
                'has_payment_proof' => ! empty($reservation->payment_proof_path),
                'has_contract' => ! empty($reservation->contract_path),
                'has_signed_contract' => ! empty($reservation->signed_contract_path),
                'contract_generated_at' => $reservation->contract_generated_at?->toIso8601String(),
                'admin_confirmed' => ! empty($reservation->admin_confirmed_at),
                'bank_details' => [
                    'bank_name' => $settings->bank_name,
                    'iban' => $settings->bank_iban,
                    'bic' => $settings->bank_bic,
                    'account_holder' => $settings->bank_account_holder,
                    'reference' => $reservation->payment_reference,
                    'amount' => number_format($reservation->deposit_amount, 2, ',', '.').' €',
                ],
                'vehicle' => [
                    'brand' => $vehicle->brand,
                    'model' => $vehicle->model,
                    'year' => $vehicle->year,
                    'price' => $vehicle->formatted_price,
                    'full_name' => $vehicle->full_name,
                ],
            ],
        ]);
    }

    /**
     * Generate and download the purchase contract PDF.
     */
    public function downloadContract(string $reference)
    {
        $reservation = Reservation::where('payment_reference', $reference)
            ->with('vehicle')
            ->firstOrFail();

        if ($reservation->isExpired()) {
            return response()->json([
                'error' => 'Diese Reservierung ist abgelaufen.',
            ], 410);
        }

        if (! in_array($reservation->purchase_step, ['signature', 'payment', 'completed'])) {
            return response()->json([
                'error' => 'Der Kaufvertrag ist in diesem Schritt noch nicht verfügbar.',
            ], 422);
        }

        $vehicle = $reservation->vehicle;
        $company = CompanySetting::instance();
        $date = now()->format('d.m.Y');

        $pdf = Pdf::loadView('contracts.purchase-contract', [
            'reservation' => $reservation,
            'vehicle' => $vehicle,
            'company' => $company,
            'date' => $date,
        ])->setPaper('a4');

        // Store the generated contract
        $contractDir = 'reservations/contracts';
        $contractFilename = "kaufvertrag-{$reservation->payment_reference}.pdf";
        $contractPath = "{$contractDir}/{$contractFilename}";

        Storage::disk('local')->put($contractPath, $pdf->output());

        $reservation->update([
            'contract_path' => $contractPath,
            'contract_generated_at' => now(),
        ]);

        return $pdf->download("Kaufvertrag-{$reservation->payment_reference}.pdf");
    }

    /**
     * Upload signed contract for a reservation.
     */
    public function uploadSignedContract(Request $request, string $reference): JsonResponse
    {
        $reservation = Reservation::where('payment_reference', $reference)->firstOrFail();

        if ($reservation->isExpired()) {
            return response()->json([
                'error' => 'Diese Reservierung ist abgelaufen.',
            ], 410);
        }

        if ($reservation->purchase_step !== 'signature') {
            return response()->json([
                'error' => 'Der Vertrag kann in diesem Schritt nicht hochgeladen werden.',
            ], 422);
        }

        $request->validate([
            'signed_contract' => 'required|file|mimes:png,jpg,jpeg,webp,pdf|max:15360',
        ]);

        $path = $request->file('signed_contract')->store(
            'reservations/signed-contracts',
            'local'
        );

        $reservation->update([
            'signed_contract_path' => $path,
            'signature_path' => $path, // backwards compatibility
            'purchase_step' => 'payment',
        ]);

        return response()->json([
            'success' => true,
            'data' => [
                'purchase_step' => 'payment',
            ],
            'message' => 'Unterschriebener Vertrag erfolgreich hochgeladen.',
        ]);
    }

    /**
     * Upload signature for a reservation.
     */
    public function uploadSignature(Request $request, string $reference): JsonResponse
    {
        $reservation = Reservation::where('payment_reference', $reference)->firstOrFail();

        if ($reservation->isExpired()) {
            return response()->json([
                'error' => 'Diese Reservierung ist abgelaufen.',
            ], 410);
        }

        $request->validate([
            'signature' => 'required|file|mimes:png,jpg,jpeg,webp|max:5120',
        ]);

        $path = $request->file('signature')->store(
            'reservations/signatures',
            'local'
        );

        $reservation->update([
            'signature_path' => $path,
            'purchase_step' => 'payment',
        ]);

        return response()->json([
            'success' => true,
            'data' => [
                'purchase_step' => 'payment',
            ],
            'message' => 'Unterschrift erfolgreich hochgeladen.',
        ]);
    }

    /**
     * Upload payment proof for a reservation.
     */
    public function uploadPaymentProof(Request $request, string $reference): JsonResponse
    {
        $reservation = Reservation::where('payment_reference', $reference)->firstOrFail();

        if ($reservation->isExpired()) {
            return response()->json([
                'error' => 'Diese Reservierung ist abgelaufen.',
            ], 410);
        }

        if ($reservation->purchase_step !== 'payment') {
            return response()->json([
                'error' => 'Der Zahlungsnachweis kann in diesem Schritt nicht hochgeladen werden.',
            ], 422);
        }

        $request->validate([
            'payment_proof' => 'required|file|mimes:png,jpg,jpeg,webp,pdf|max:10240',
        ]);

        $path = $request->file('payment_proof')->store(
            'reservations/payment-proofs',
            'local'
        );

        $reservation->update([
            'payment_proof_path' => $path,
            'purchase_step' => 'completed',
        ]);

        // Notify admin about completed purchase flow
        try {
            Notification::route('mail', config('mail.from.address'))
                ->notify(new NewReservationNotification($reservation->fresh()));
        } catch (\Throwable $e) {
            Log::warning('Failed to send payment proof notification', [
                'reservation_id' => $reservation->id,
                'error' => $e->getMessage(),
            ]);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'purchase_step' => 'completed',
            ],
            'message' => 'Zahlungsnachweis erfolgreich hochgeladen. Vielen Dank!',
        ]);
    }

    /**
     * Advance reservation to the signature step (after reviewing invoice).
     */
    public function confirmInvoice(string $reference): JsonResponse
    {
        $reservation = Reservation::where('payment_reference', $reference)->firstOrFail();

        if ($reservation->isExpired()) {
            return response()->json([
                'error' => 'Diese Reservierung ist abgelaufen.',
            ], 410);
        }

        if ($reservation->purchase_step !== 'invoice') {
            return response()->json([
                'error' => 'Die Rechnung kann in diesem Schritt nicht bestätigt werden.',
            ], 422);
        }

        $reservation->update(['purchase_step' => 'signature']);

        return response()->json([
            'success' => true,
            'data' => [
                'purchase_step' => 'signature',
            ],
            'message' => 'Rechnung bestätigt.',
        ]);
    }
}
