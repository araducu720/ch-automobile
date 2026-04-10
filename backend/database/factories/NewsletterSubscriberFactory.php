<?php

namespace Database\Factories;

use App\Models\NewsletterSubscriber;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class NewsletterSubscriberFactory extends Factory
{
    protected $model = NewsletterSubscriber::class;

    public function definition(): array
    {
        return [
            'email' => $this->faker->unique()->safeEmail(),
            'locale' => 'de',
            'confirmation_token' => Str::random(64),
        ];
    }

    public function confirmed(): static
    {
        return $this->state(fn () => [
            'confirmed_at' => now(),
            'confirmation_token' => null,
        ]);
    }

    public function unsubscribed(): static
    {
        return $this->state(fn () => [
            'confirmed_at' => now()->subMonth(),
            'unsubscribed_at' => now(),
        ]);
    }
}
