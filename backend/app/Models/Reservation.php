<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Reservation extends Model
{
    use HasFactory;

    protected $fillable = [
        'vehicle_id', 'customer_name', 'customer_email', 'customer_phone',
        'billing_street', 'billing_city', 'billing_postal_code', 'billing_country',
        'deposit_amount', 'payment_reference', 'bank_transfer_status',
        'purchase_step', 'signature_path', 'payment_proof_path',
        'contract_path', 'signed_contract_path', 'contract_generated_at', 'admin_confirmed_at',
        'reservation_expires_at', 'payment_confirmed_at', 'admin_notes', 'locale',
    ];

    protected $casts = [
        'deposit_amount' => 'decimal:2',
        'reservation_expires_at' => 'datetime',
        'payment_confirmed_at' => 'datetime',
        'contract_generated_at' => 'datetime',
        'admin_confirmed_at' => 'datetime',
    ];

    protected static function booted(): void
    {
        static::creating(function (Reservation $reservation) {
            if (empty($reservation->payment_reference)) {
                $reservation->payment_reference = 'RES-'.strtoupper(\Illuminate\Support\Str::ulid());
            }
            if (empty($reservation->reservation_expires_at)) {
                $reservation->reservation_expires_at = now()->addDays(7);
            }
        });
    }

    public function vehicle(): BelongsTo
    {
        return $this->belongsTo(Vehicle::class);
    }

    public function scopePending($query)
    {
        return $query->where('bank_transfer_status', 'pending');
    }

    public function scopeExpired($query)
    {
        return $query->where('bank_transfer_status', 'pending')
            ->where('reservation_expires_at', '<', now());
    }

    public function isPending(): bool
    {
        return $this->bank_transfer_status === 'pending';
    }

    public function isExpired(): bool
    {
        return $this->isPending() && $this->reservation_expires_at->isPast();
    }

    public function confirm(): void
    {
        $this->update([
            'bank_transfer_status' => 'confirmed',
            'payment_confirmed_at' => now(),
        ]);

        $this->vehicle->update(['status' => 'reserved']);
    }

    public function cancel(): void
    {
        $this->update(['bank_transfer_status' => 'cancelled']);

        if ($this->vehicle->status === 'reserved') {
            $this->vehicle->update(['status' => 'available']);
        }
    }

    public function advanceToStep(string $step): void
    {
        $this->update(['purchase_step' => $step]);
    }

    public function isStep(string $step): bool
    {
        return $this->purchase_step === $step;
    }
}
