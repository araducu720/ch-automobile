<?php

namespace Database\Factories;

use App\Models\Brand;
use Illuminate\Database\Eloquent\Factories\Factory;

class BrandFactory extends Factory
{
    protected $model = Brand::class;

    public function definition(): array
    {
        $name = fake()->randomElement(['Walmart', 'Amazon', 'DPD', 'DHL']);
        $slug = strtolower($name);

        return [
            'name' => $name,
            'slug' => $slug . '_' . fake()->unique()->randomNumber(4),
            'logo_url' => "/brands/{$slug}-logo.svg",
            'primary_color' => fake()->hexColor(),
            'secondary_color' => fake()->hexColor(),
            'font_family' => 'Arial, sans-serif',
            'theme_config' => [
                'header_bg' => fake()->hexColor(),
                'button_radius' => '4px',
                'card_shadow' => '0 2px 8px rgba(0,0,0,0.08)',
                'accent' => fake()->hexColor(),
                'text_primary' => '#333333',
                'text_secondary' => '#666666',
                'bg_light' => '#F5F5F5',
                'success' => '#4CAF50',
                'error' => '#F44336',
            ],
            'kyc_fields' => ['first_name', 'last_name', 'email', 'phone', 'date_of_birth', 'address'],
            'is_active' => true,
        ];
    }

    public function walmart(): static
    {
        return $this->state(fn () => [
            'name' => 'Walmart',
            'slug' => 'walmart',
            'primary_color' => '#0071CE',
            'secondary_color' => '#FFC220',
        ]);
    }

    public function amazon(): static
    {
        return $this->state(fn () => [
            'name' => 'Amazon',
            'slug' => 'amazon',
            'primary_color' => '#232F3E',
            'secondary_color' => '#FF9900',
        ]);
    }

    public function dpd(): static
    {
        return $this->state(fn () => [
            'name' => 'DPD',
            'slug' => 'dpd',
            'primary_color' => '#DC0032',
            'secondary_color' => '#414042',
        ]);
    }

    public function dhl(): static
    {
        return $this->state(fn () => [
            'name' => 'DHL',
            'slug' => 'dhl',
            'primary_color' => '#FFCC00',
            'secondary_color' => '#D40511',
        ]);
    }
}
