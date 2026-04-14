<?php

namespace App\Enums;

enum ReservationStatus: string
{
    case Pending = 'pending';
    case Confirmed = 'confirmed';
    case Cancelled = 'cancelled';

    public function label(): string
    {
        return match ($this) {
            self::Pending => 'Ausstehend',
            self::Confirmed => 'Bestätigt',
            self::Cancelled => 'Storniert',
        };
    }
}
