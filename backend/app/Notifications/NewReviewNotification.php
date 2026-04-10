<?php

namespace App\Notifications;

use App\Models\Review;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewReviewNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public readonly Review $review,
    ) {}

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $stars = str_repeat('⭐', $this->review->rating);

        $mail = (new MailMessage)
            ->subject("Neue Bewertung: {$stars} von {$this->review->customer_name}")
            ->greeting('Neue Kundenbewertung eingegangen')
            ->line("**Kunde:** {$this->review->customer_name}")
            ->line("**Bewertung:** {$stars} ({$this->review->rating}/5)")
            ->line("**Kommentar:** {$this->review->comment}");

        if ($this->review->title) {
            $mail->line("**Titel:** {$this->review->title}");
        }

        if ($this->review->vehicle) {
            $mail->line("**Fahrzeug:** {$this->review->vehicle->brand} {$this->review->vehicle->model}");
        }

        $mail->line('')
            ->line('Die Bewertung muss noch freigeschaltet werden.')
            ->action('Im Admin-Panel ansehen', url('/admin/reviews/' . $this->review->id . '/edit'))
            ->salutation('C-H Automobile & Exclusive Cars — System');

        return $mail;
    }
}
