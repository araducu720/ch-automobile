<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class TradeInValuation extends Model implements HasMedia
{
    use HasFactory, InteractsWithMedia;

    protected $fillable = [
        'inquiry_id', 'trade_brand', 'trade_model', 'trade_year',
        'trade_mileage', 'trade_condition', 'trade_description',
        'damage_description', 'estimated_value', 'valuation_notes', 'status',
    ];

    protected $casts = [
        'trade_year' => 'integer',
        'trade_mileage' => 'integer',
        'estimated_value' => 'decimal:2',
    ];

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('trade_in_photos')
            ->useFallbackUrl('/images/no-photo.jpg');
    }

    public function inquiry(): BelongsTo
    {
        return $this->belongsTo(Inquiry::class);
    }
}
