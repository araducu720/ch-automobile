<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReviewResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'customer_name' => $this->customer_name,
            'rating' => $this->rating,
            'title' => $this->title,
            'comment' => $this->comment,
            'vehicle' => $this->whenLoaded('vehicle', fn () => $this->vehicle
                ? "{$this->vehicle->brand} {$this->vehicle->model}"
                : null
            ),
            'is_featured' => $this->is_featured,
            'created_at' => $this->created_at->toIso8601String(),
        ];
    }
}
