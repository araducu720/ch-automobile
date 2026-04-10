<?php

namespace App\Events;

use App\Models\KycVerification;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class KycStatusUpdated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public KycVerification $kycVerification
    ) {}

    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('kyc.' . $this->kycVerification->brand->slug),
            new PrivateChannel('kyc.verification.' . $this->kycVerification->uuid),
        ];
    }

    public function broadcastAs(): string
    {
        return 'kyc.status.updated';
    }

    public function broadcastWith(): array
    {
        return [
            'id' => $this->kycVerification->id,
            'uuid' => $this->kycVerification->uuid,
            'status' => $this->kycVerification->status,
            'brand' => $this->kycVerification->brand->slug,
            'full_name' => $this->kycVerification->full_name,
            'email' => $this->kycVerification->email,
            'updated_at' => $this->kycVerification->updated_at->toISOString(),
        ];
    }
}
