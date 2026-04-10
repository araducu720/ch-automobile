<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Brand extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'logo_url',
        'primary_color',
        'secondary_color',
        'font_family',
        'theme_config',
        'kyc_fields',
        'is_active',
    ];

    protected $casts = [
        'theme_config' => 'array',
        'kyc_fields' => 'array',
        'is_active' => 'boolean',
    ];

    public function templates(): HasMany
    {
        return $this->hasMany(Template::class);
    }

    public function kycVerifications(): HasMany
    {
        return $this->hasMany(KycVerification::class);
    }

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }

    public function getActiveTemplate(string $type): ?Template
    {
        return $this->templates()
            ->where('type', $type)
            ->where('is_active', true)
            ->first();
    }
}
