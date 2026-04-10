<?php

namespace Database\Factories;

use App\Models\Review;
use Illuminate\Database\Eloquent\Factories\Factory;

class ReviewFactory extends Factory
{
    protected $model = Review::class;

    public function definition(): array
    {
        return [
            'vehicle_id' => null,
            'customer_name' => $this->faker->name(),
            'customer_email' => $this->faker->safeEmail(),
            'rating' => $this->faker->numberBetween(1, 5),
            'title' => $this->faker->sentence(4),
            'comment' => $this->faker->paragraph(2),
            'is_approved' => false,
            'is_featured' => false,
            'locale' => 'de',
            'ip_address' => $this->faker->ipv4(),
        ];
    }

    public function approved(): static
    {
        return $this->state(fn () => ['is_approved' => true]);
    }

    public function featured(): static
    {
        return $this->state(fn () => ['is_approved' => true, 'is_featured' => true]);
    }
}
