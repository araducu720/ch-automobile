<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class VehicleDetailResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $locale = $request->get('locale', app()->getLocale());

        $base = (new VehicleResource($this->resource))->toArray($request);

        return array_merge($base, [
            'interior_color' => $this->interior_color,
            'doors' => $this->doors,
            'seats' => $this->seats,
            'engine_displacement' => $this->engine_displacement,
            'vin' => $this->vin,
            'registration_date' => $this->registration_date?->format('Y-m-d'),
            'description' => $this->getTranslation('description', $locale, false)
                ?? $this->getTranslation('description', 'de', false),
            'features' => $this->features ?? [],
            'equipment' => $this->equipment ?? [],
            'emission_class' => $this->emission_class,
            'co2_emissions' => $this->co2_emissions,
            'fuel_consumption_combined' => $this->fuel_consumption_combined,
            'fuel_consumption_urban' => $this->fuel_consumption_urban,
            'fuel_consumption_extra_urban' => $this->fuel_consumption_extra_urban,
            'previous_owners' => $this->previous_owners,
            'accident_free' => $this->accident_free,
            'non_smoker' => $this->non_smoker,
            'garage_kept' => $this->garage_kept,
            'tuv_until' => $this->tuv_until?->format('Y-m-d'),
            'warranty' => $this->warranty,
            'images' => $this->image_gallery,
        ]);
    }
}
