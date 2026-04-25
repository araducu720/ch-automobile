<?php

namespace Database\Factories;

use App\Models\Car;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Car>
 */
class CarFactory extends Factory
{
    /** @var string */
    protected $model = Car::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $brands = ['BMW', 'Mercedes-Benz', 'Volkswagen', 'Audi', 'Toyota', 'Ford', 'Renault'];
        $models = ['320d', 'C 200', 'Golf', 'A4', 'RAV4', 'Focus', 'Clio'];
        $fuels  = ['gasoline', 'diesel', 'electric', 'hybrid'];
        $trans  = ['manual', 'automatic'];
        $bodies = ['sedan', 'hatchback', 'suv', 'wagon', 'coupe'];

        return [
            'vin'              => strtoupper($this->faker->bothify('???##########????')),
            'brand'            => $this->faker->randomElement($brands),
            'model'            => $this->faker->randomElement($models),
            'year'             => $this->faker->numberBetween(2015, 2024),
            'km'               => $this->faker->numberBetween(5000, 200000),
            'fuel'             => $this->faker->randomElement($fuels),
            'transmission'     => $this->faker->randomElement($trans),
            'hp'               => $this->faker->numberBetween(90, 300),
            'body_style'       => $this->faker->randomElement($bodies),
            'price'            => $this->faker->numberBetween(500000, 8000000), // cents
            'currency'         => 'EUR',
            'location_city'    => $this->faker->city(),
            'location_country' => $this->faker->country(),
            'highlights'       => $this->faker->sentence(8),
            'status'           => 'draft',
            'target_locales'   => ['ro', 'de'],
            'embedding'        => null,
        ];
    }

    /** Mark the car as published. */
    public function published(): static
    {
        return $this->state(['status' => 'published']);
    }

    /** Mark the car as sold. */
    public function sold(): static
    {
        return $this->state(['status' => 'sold']);
    }
}
