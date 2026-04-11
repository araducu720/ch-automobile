<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class VehicleResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'brand' => $this->brand,
            'model' => $this->model,
            'variant' => $this->variant,
            'full_name' => $this->full_name,
            'year' => $this->year,
            'price' => (float) $this->price,
            'formatted_price' => $this->formatted_price,
            'price_on_request' => $this->price_on_request,
            'mileage' => $this->mileage,
            'formatted_mileage' => $this->formatted_mileage,
            'fuel_type' => $this->fuel_type,
            'transmission' => $this->transmission,
            'body_type' => $this->body_type,
            'power_hp' => $this->power_hp,
            'power_kw' => $this->power_kw,
            'color' => $this->color,
            'condition' => $this->condition,
            'status' => $this->status,
            'slug' => $this->slug,
            'thumbnail' => $this->thumbnail_url,
            'main_image' => $this->main_image_url,
            'images_count' => count($this->image_gallery),
        ];
    }
}
