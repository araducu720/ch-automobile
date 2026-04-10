<?php

namespace Database\Factories;

use App\Models\Reservation;
use App\Models\Vehicle;
use Illuminate\Database\Eloquent\Factories\Factory;

class ReservationFactory extends Factory
{
    protected $model = Reservation::class;

    public function definition(): array
    {
        return [
            'vehicle_id' => Vehicle::factory(),
            'customer_name' => $this->faker->name(),
            'customer_email' => $this->faker->safeEmail(),
            'customer_phone' => $this->faker->phoneNumber(),
            'billing_street' => $this->faker->streetAddress(),
            'billing_city' => $this->faker->city(),
            'billing_postal_code' => $this->faker->postcode(),
            'billing_country' => 'DE',
            'deposit_amount' => $this->faker->numberBetween(500, 5000),
            'bank_transfer_status' => 'pending',
            'locale' => 'de',
        ];
    }

    public function confirmed(): static
    {
        return $this->state(fn () => [
            'bank_transfer_status' => 'confirmed',
            'payment_confirmed_at' => now(),
        ]);
    }

    public function expired(): static
    {
        return $this->state(fn () => [
            'reservation_expires_at' => now()->subDay(),
        ]);
    }
}
