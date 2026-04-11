<?php

namespace App\Notifications;

use App\Models\Inquiry;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewInquiryNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public readonly Inquiry $inquiry,
    ) {}

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $typeLabels = [
            'general' => 'Allgemeine Anfrage',
            'test_drive' => 'Probefahrt',
            'price_inquiry' => 'Preisanfrage',
            'financing' => 'Finanzierung',
            'trade_in' => 'Inzahlungnahme',
        ];

        $type = $typeLabels[$this->inquiry->type] ?? $this->inquiry->type;

        $mail = (new MailMessage)
            ->subject("Neue Anfrage: {$type} — {$this->inquiry->reference_number}")
            ->greeting('Neue Kundenanfrage eingegangen')
            ->line("**Typ:** {$type}")
            ->line("**Referenznummer:** {$this->inquiry->reference_number}")
            ->line("**Name:** {$this->inquiry->name}")
            ->line("**E-Mail:** {$this->inquiry->email}");

        if ($this->inquiry->phone) {
            $mail->line("**Telefon:** {$this->inquiry->phone}");
        }

        $mail->line('**Nachricht:**')
            ->line($this->inquiry->message);

        if ($this->inquiry->vehicle) {
            $mail->line("**Fahrzeug:** {$this->inquiry->vehicle->full_name}");
        }

        if ($this->inquiry->preferred_date) {
            $mail->line("**Wunschtermin:** {$this->inquiry->preferred_date->format('d.m.Y')} {$this->inquiry->preferred_time}");
        }

        $mail->action('Im Admin-Panel ansehen', url('/admin/inquiries/'.$this->inquiry->id.'/edit'))
            ->salutation('C-H Automobile & Exclusive Cars — System');

        return $mail;
    }
}
