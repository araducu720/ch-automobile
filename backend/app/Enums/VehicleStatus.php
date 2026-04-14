<?php

namespace App\Enums;

enum VehicleStatus: string
{
    case Available = 'available';
    case Reserved = 'reserved';
    case Sold = 'sold';
    case Draft = 'draft';

    public function label(): string
    {
        return match ($this) {
            self::Available => 'Verfügbar',
            self::Reserved => 'Reserviert',
            self::Sold => 'Verkauft',
            self::Draft => 'Entwurf',
        };
    }

    /**
     * Statuses visible on the public website.
     */
    public static function published(): array
    {
        return [self::Available, self::Reserved];
    }
}
