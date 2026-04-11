<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Inquiry extends Model
{
    use HasFactory;

    protected $fillable = [
        'type', 'vehicle_id', 'name', 'email', 'phone', 'message',
        'preferred_date', 'preferred_time', 'preferred_contact_method',
        'status', 'admin_notes', 'reference_number', 'locale',
        'ip_address', 'user_agent',
    ];

    protected $casts = [
        'preferred_date' => 'datetime',
    ];

    protected static function booted(): void
    {
        static::creating(function (Inquiry $inquiry) {
            if (empty($inquiry->reference_number)) {
                $inquiry->reference_number = 'INQ-'.strtoupper(uniqid());
            }
        });
    }

    public function vehicle(): BelongsTo
    {
        return $this->belongsTo(Vehicle::class);
    }

    public function tradeInValuation(): HasOne
    {
        return $this->hasOne(TradeInValuation::class);
    }

    public function scopeNew($query)
    {
        return $query->where('status', 'new');
    }

    public function scopeInProgress($query)
    {
        return $query->where('status', 'in_progress');
    }

    public function scopeByType($query, string $type)
    {
        return $query->where('type', $type);
    }
}
