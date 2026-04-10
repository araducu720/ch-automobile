<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Translatable\HasTranslations;

class CompanySetting extends Model
{
    use HasFactory, HasTranslations;

    protected $fillable = [
        'company_name', 'street', 'city', 'postal_code', 'country',
        'phone', 'email', 'website', 'latitude', 'longitude',
        'opening_hours', 'facebook_url', 'instagram_url', 'youtube_url',
        'tiktok_url', 'whatsapp_number', 'bank_name', 'bank_iban',
        'bank_bic', 'bank_account_holder', 'tax_id', 'trade_register',
        'imprint', 'privacy_policy', 'terms_conditions',
        'logo', 'logo_dark', 'favicon', 'meta_title', 'meta_description',
    ];

    public array $translatable = [
        'imprint', 'privacy_policy', 'terms_conditions',
        'meta_title', 'meta_description',
    ];

    protected $casts = [
        'opening_hours' => 'array',
        'latitude' => 'decimal:7',
        'longitude' => 'decimal:7',
    ];

    public static function instance(): static
    {
        return static::firstOrCreate(['id' => 1]);
    }

    /**
     * Ensure opening_hours values are always flat strings for Filament KeyValue.
     */
    protected function openingHours(): Attribute
    {
        return Attribute::make(
            get: function ($value) {
                $hours = json_decode($value, true);
                if (! is_array($hours)) {
                    return $hours;
                }
                return array_map(function ($v) {
                    if (is_array($v)) {
                        return implode(' - ', $v);
                    }
                    return $v ?? 'Geschlossen';
                }, $hours);
            },
        );
    }

    public function getFullAddressAttribute(): string
    {
        return "{$this->street}, {$this->postal_code} {$this->city}, {$this->country}";
    }

    public function getBankDetailsAttribute(): array
    {
        return [
            'bank_name' => $this->bank_name,
            'iban' => $this->bank_iban,
            'bic' => $this->bank_bic,
            'account_holder' => $this->bank_account_holder,
        ];
    }
}
