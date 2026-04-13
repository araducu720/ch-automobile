<?php

namespace App\Notifications;

use App\Models\NewsletterSubscriber;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewsletterConfirmationNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public NewsletterSubscriber $subscriber,
    ) {}

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $confirmUrl = config('app.frontend_url', 'http://localhost:3000')
            .'/newsletter/bestaetigt?token='.$this->subscriber->confirmation_token;

        return (new MailMessage)
            ->subject('Bitte bestätigen Sie Ihre Newsletter-Anmeldung')
            ->greeting('Willkommen!')
            ->line('Vielen Dank für Ihre Anmeldung zum Newsletter von C-H Automobile & Exclusive Cars.')
            ->line('Bitte bestätigen Sie Ihre E-Mail-Adresse, indem Sie auf den folgenden Button klicken:')
            ->action('E-Mail bestätigen', $confirmUrl)
            ->line('Falls Sie sich nicht für unseren Newsletter angemeldet haben, können Sie diese E-Mail ignorieren.')
            ->salutation('Mit freundlichen Grüßen, C-H Automobile & Exclusive Cars');
    }
}
