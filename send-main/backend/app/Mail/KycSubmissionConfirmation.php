<?php

namespace App\Mail;

use App\Models\KycVerification;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class KycSubmissionConfirmation extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public KycVerification $verification
    ) {}

    public function envelope(): Envelope
    {
        $brand = $this->verification->brand;
        return new Envelope(
            subject: "{$brand->name} - Identity Verification Received",
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.kyc.submission-confirmation',
            with: [
                'verification' => $this->verification,
                'brand' => $this->verification->brand,
            ],
        );
    }
}
