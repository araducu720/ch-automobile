<?php

namespace App\Console\Commands;

use App\Models\Reservation;
use Illuminate\Console\Command;

class ExpireReservations extends Command
{
    protected $signature = 'reservations:expire';
    protected $description = 'Expire overdue reservations and free vehicles';

    public function handle(): int
    {
        $expired = Reservation::expired()->get();
        $count = 0;

        foreach ($expired as $reservation) {
            $reservation->update(['bank_transfer_status' => 'expired']);

            if ($reservation->vehicle && $reservation->vehicle->status === 'reserved') {
                $reservation->vehicle->update(['status' => 'available']);
            }

            $count++;
        }

        $this->info("Expired {$count} reservations.");
        return self::SUCCESS;
    }
}
