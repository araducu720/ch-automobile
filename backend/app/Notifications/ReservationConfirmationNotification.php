<?php

namespace App\Notifications;

use App\Models\CompanySetting;
use App\Models\Reservation;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ReservationConfirmationNotification extends Notification implements ShouldQueue
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
        $deposit = number_format($this->reservation->deposit_amount, 2, ',', '.').' €';
        $settings = CompanySetting::instance();
        $locale = $this->reservation->locale ?? 'de';

        // Mask IBAN for email security (show first 4 and last 4 chars)
        $iban = $settings->bank_iban;
        $maskedIban = strlen($iban) > 8
            ? substr($iban, 0, 4).str_repeat('*', strlen($iban) - 8).substr($iban, -4)
            : $iban;

        $mail = (new MailMessage)
            ->subject("Reservierungsbestätigung — {$this->reservation->payment_reference}")
            ->greeting("Hallo {$this->reservation->customer_name},")
            ->line('Vielen Dank für Ihre Reservierung bei C-H Automobile & Exclusive Cars.')
            ->line("**Fahrzeug:** {$vehicle->full_name}")
            ->line("**Fahrzeugpreis:** {$vehicle->formatted_price}")
            ->line('')
            ->line('---')
            ->line('**Zahlungsinformationen für die Kaution:**')
            ->line("**Betrag:** {$deposit}")
            ->line("**Zahlungsreferenz:** {$this->reservation->payment_reference}")
            ->line("**Kontoinhaber:** {$settings->bank_account_holder}")
            ->line("**Bank:** {$settings->bank_name}")
            ->line("**IBAN:** {$maskedIban}")
            ->line("**BIC:** {$settings->bank_bic}")
            ->line('')
            ->line("Bitte überweisen Sie den Betrag innerhalb von 7 Tagen und geben Sie die Zahlungsreferenz **{$this->reservation->payment_reference}** als Verwendungszweck an.")
            ->line('')
            ->line("**Ablaufdatum:** {$this->reservation->reservation_expires_at->format('d.m.Y H:i')}")
            ->line('')
            ->line('Bei Fragen erreichen Sie uns unter:')
            ->line("Telefon: {$settings->phone}")
            ->line("E-Mail: {$settings->email}")
            ->salutation('Mit freundlichen Grüßen, C-H Automobile & Exclusive Cars');

        return $mail;
    }
}
