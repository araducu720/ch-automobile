<?php

namespace App\Notifications;

use App\Models\Reservation;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewReservationNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public readonly Reservation $reservation,
    ) {}

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $vehicle = $this->reservation->vehicle;
        $deposit = number_format($this->reservation->deposit_amount, 2, ',', '.') . ' €';

        return (new MailMessage)
            ->subject("Neue Reservierung: {$vehicle->full_name} — {$this->reservation->payment_reference}")
            ->greeting('Neue Fahrzeugreservierung eingegangen')
            ->line("**Fahrzeug:** {$vehicle->full_name}")
            ->line("**Preis:** {$vehicle->formatted_price}")
            ->line("**Kunde:** {$this->reservation->customer_name}")
            ->line("**E-Mail:** {$this->reservation->customer_email}")
            ->line("**Telefon:** {$this->reservation->customer_phone}")
            ->line("**Kaution:** {$deposit}")
            ->line("**Zahlungsreferenz:** {$this->reservation->payment_reference}")
            ->line("**Ablaufdatum:** {$this->reservation->reservation_expires_at->format('d.m.Y H:i')}")
            ->action('Im Admin-Panel ansehen', url('/admin/reservations/' . $this->reservation->id . '/edit'))
            ->salutation('C-H Automobile & Exclusive Cars — System');
    }
}
