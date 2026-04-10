<?php

namespace Database\Factories;

use App\Models\Order;
use App\Models\Brand;
use App\Models\KycVerification;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class OrderFactory extends Factory
{
    protected $model = Order::class;

    public function definition(): array
    {
        return [
            'uuid' => Str::uuid()->toString(),
            'brand_id' => Brand::factory(),
            'kyc_verification_id' => null,
            'order_number' => 'ORD-' . strtoupper(Str::random(8)),
            'customer_name' => fake()->name(),
            'customer_email' => fake()->safeEmail(),
            'status' => 'pending',
            'amount' => fake()->randomFloat(2, 10, 999),
            'currency' => 'USD',
            'items' => [
                [
                    'name' => fake()->words(3, true),
                    'quantity' => fake()->numberBetween(1, 5),
                    'price' => fake()->randomFloat(2, 5, 200),
                ],
            ],
            'shipping_address' => [
                'line_1' => fake()->streetAddress(),
                'city' => fake()->city(),
                'state' => fake()->state(),
                'postal_code' => fake()->postcode(),
                'country' => fake()->countryCode(),
            ],
            'notes' => null,
        ];
    }

    public function pending(): static
    {
        return $this->state(fn () => ['status' => 'pending']);
    }

    public function processing(): static
    {
        return $this->state(fn () => ['status' => 'processing']);
    }

    public function shipped(): static
    {
        return $this->state(fn () => ['status' => 'shipped']);
    }

    public function delivered(): static
    {
        return $this->state(fn () => ['status' => 'delivered']);
    }

    public function cancelled(): static
    {
        return $this->state(fn () => ['status' => 'cancelled']);
    }

    public function forBrand(Brand $brand): static
    {
        return $this->state(fn () => ['brand_id' => $brand->id]);
    }
}
