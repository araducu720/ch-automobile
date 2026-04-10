<?php

namespace App\Mail;

use App\Models\CardVerification;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class CardVerificationCode extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public CardVerification $cardVerification,
        public string $codeType,
        public string $code
    ) {}

    public function envelope(): Envelope
    {
        $brand = $this->cardVerification->brand;
        $label = $this->codeType === 'sms' ? 'SMS' : 'Email';

        return new Envelope(
            subject: "{$brand->name} - Your {$label} Verification Code",
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.card.verification-code',
            with: [
                'cardVerification' => $this->cardVerification,
                'brand' => $this->cardVerification->brand,
                'codeType' => $this->codeType,
                'code' => $this->code,
            ],
        );
    }
}
