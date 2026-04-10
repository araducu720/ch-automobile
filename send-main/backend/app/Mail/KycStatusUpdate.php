<?php

namespace App\Mail;

use App\Models\KycVerification;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class KycStatusUpdate extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public KycVerification $verification
    ) {}

    public function envelope(): Envelope
    {
        $brand = $this->verification->brand;
        $statusLabel = match ($this->verification->status) {
            'approved' => 'Approved',
            'rejected' => 'Action Required',
            'in_review' => 'Under Review',
            default => 'Status Update',
        };

        return new Envelope(
            subject: "{$brand->name} - Verification {$statusLabel}",
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.kyc.status-update',
            with: [
                'verification' => $this->verification,
                'brand' => $this->verification->brand,
            ],
        );
    }
}
