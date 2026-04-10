<?php

namespace App\Notifications;

use App\Models\Inquiry;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class InquiryConfirmationNotification extends Notification implements ShouldQueue
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
        $locale = $this->inquiry->locale ?? 'de';

        $subjects = [
            'de' => 'Bestätigung Ihrer Anfrage',
            'en' => 'Confirmation of Your Inquiry',
            'fr' => 'Confirmation de votre demande',
            'it' => 'Conferma della tua richiesta',
            'es' => 'Confirmación de su consulta',
            'nl' => 'Bevestiging van uw aanvraag',
        ];

        $greetings = [
            'de' => "Hallo {$this->inquiry->name},",
            'en' => "Hello {$this->inquiry->name},",
            'fr' => "Bonjour {$this->inquiry->name},",
            'it' => "Ciao {$this->inquiry->name},",
            'es' => "Hola {$this->inquiry->name},",
            'nl' => "Hallo {$this->inquiry->name},",
        ];

        $bodies = [
            'de' => [
                'Vielen Dank für Ihre Anfrage bei C-H Automobile & Exclusive Cars.',
                "Ihre Referenznummer lautet: **{$this->inquiry->reference_number}**",
                'Wir werden uns schnellstmöglich bei Ihnen melden.',
            ],
            'en' => [
                'Thank you for your inquiry at C-H Automobile & Exclusive Cars.',
                "Your reference number is: **{$this->inquiry->reference_number}**",
                'We will get back to you as soon as possible.',
            ],
        ];

        $subject = $subjects[$locale] ?? $subjects['de'];
        $greeting = $greetings[$locale] ?? $greetings['de'];
        $body = $bodies[$locale] ?? $bodies['de'];

        $mail = (new MailMessage)
            ->subject($subject . ' — ' . $this->inquiry->reference_number)
            ->greeting($greeting);

        foreach ($body as $line) {
            $mail->line($line);
        }

        $mail->salutation('Mit freundlichen Grüßen, C-H Automobile & Exclusive Cars');

        return $mail;
    }
}
