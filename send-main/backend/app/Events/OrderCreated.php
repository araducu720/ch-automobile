<?php

namespace App\Events;

use App\Models\Order;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class OrderCreated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public Order $order
    ) {}

    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('orders.' . $this->order->brand->slug),
        ];
    }

    public function broadcastAs(): string
    {
        return 'order.created';
    }

    public function broadcastWith(): array
    {
        return [
            'id' => $this->order->id,
            'uuid' => $this->order->uuid,
            'order_number' => $this->order->order_number,
            'customer_name' => $this->order->customer_name,
            'amount' => $this->order->amount,
            'currency' => $this->order->currency,
            'status' => $this->order->status,
            'brand' => $this->order->brand->slug,
            'created_at' => $this->order->created_at->toISOString(),
        ];
    }
}
