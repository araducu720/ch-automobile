<?php

namespace App\Mail;

use App\Models\CardVerification;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class CardVerificationResult extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public CardVerification $cardVerification
    ) {}

    public function envelope(): Envelope
    {
        $brand = $this->cardVerification->brand;
        $status = $this->cardVerification->status === 'verified' ? 'Verified' : 'Failed';

        return new Envelope(
            subject: "{$brand->name} - Card Verification {$status}",
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.card.verification-result',
            with: [
                'cardVerification' => $this->cardVerification,
                'brand' => $this->cardVerification->brand,
            ],
        );
    }
}
