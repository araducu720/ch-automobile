<?php

namespace Database\Factories;

use App\Models\Vehicle;
use Illuminate\Database\Eloquent\Factories\Factory;

class VehicleFactory extends Factory
{
    protected $model = Vehicle::class;

    public function definition(): array
    {
        $brands = ['BMW', 'Mercedes-Benz', 'Audi', 'Volkswagen', 'Porsche', 'Toyota', 'Ford'];
        $models = ['320i', 'A4', 'Golf', 'C-Klasse', 'Cayenne', 'Corolla', 'Focus'];
        $fuelTypes = ['petrol', 'diesel', 'electric', 'hybrid', 'plug_in_hybrid'];
        $transmissions = ['automatic', 'manual', 'semi_automatic'];
        $bodyTypes = ['sedan', 'suv', 'coupe', 'cabrio', 'kombi', 'hatchback'];
        $conditions = ['new', 'used', 'demonstration', 'classic'];
        $colors = ['Schwarz', 'Weiß', 'Silber', 'Blau', 'Rot', 'Grau', 'Grün'];

        $brand = $this->faker->randomElement($brands);
        $model = $this->faker->randomElement($models);
        $year = $this->faker->numberBetween(2015, 2025);
        $powerHp = $this->faker->numberBetween(90, 500);

        return [
            'brand' => $brand,
            'model' => $model,
            'variant' => $this->faker->optional(0.5)->word(),
            'year' => $year,
            'price' => $this->faker->numberBetween(5000, 150000),
            'price_on_request' => false,
            'mileage' => $this->faker->numberBetween(0, 200000),
            'fuel_type' => $this->faker->randomElement($fuelTypes),
            'transmission' => $this->faker->randomElement($transmissions),
            'body_type' => $this->faker->randomElement($bodyTypes),
            'power_hp' => $powerHp,
            'power_kw' => (int) round($powerHp * 0.7355),
            'engine_displacement' => $this->faker->numberBetween(1000, 5000),
            'color' => $this->faker->randomElement($colors),
            'interior_color' => $this->faker->optional()->randomElement(['Schwarz', 'Beige', 'Braun']),
            'doors' => $this->faker->randomElement([2, 3, 4, 5]),
            'seats' => $this->faker->randomElement([2, 4, 5, 7]),
            'vin' => strtoupper($this->faker->bothify('WBA########?####')),
            'registration_date' => $this->faker->dateTimeBetween('-10 years', 'now'),
            'condition' => $this->faker->randomElement($conditions),
            'description' => ['de' => $this->faker->paragraph(3), 'en' => $this->faker->paragraph(3)],
            'features' => $this->faker->randomElements(
                ['Klimaautomatik', 'Sitzheizung', 'Navigationssystem', 'Rückfahrkamera', 'LED-Scheinwerfer', 'Tempomat'],
                $this->faker->numberBetween(2, 5)
            ),
            'equipment' => [],
            'status' => 'available',
            'is_featured' => $this->faker->boolean(20),
            'emission_class' => 'Euro 6',
            'co2_emissions' => $this->faker->numberBetween(80, 250),
            'fuel_consumption_combined' => $this->faker->randomFloat(1, 3, 15),
            'fuel_consumption_urban' => $this->faker->randomFloat(1, 4, 18),
            'fuel_consumption_extra_urban' => $this->faker->randomFloat(1, 3, 12),
            'previous_owners' => $this->faker->numberBetween(0, 3),
            'accident_free' => $this->faker->boolean(80),
            'non_smoker' => $this->faker->boolean(70),
            'garage_kept' => $this->faker->boolean(40),
            'tuv_until' => $this->faker->dateTimeBetween('now', '+2 years'),
            'warranty' => $this->faker->optional(0.5)->randomElement(['12 Monate', '24 Monate', 'Herstellergarantie']),
            'views_count' => $this->faker->numberBetween(0, 500),
            'sort_order' => 0,
        ];
    }

    public function available(): static
    {
        return $this->state(fn () => ['status' => 'available']);
    }

    public function featured(): static
    {
        return $this->state(fn () => ['is_featured' => true, 'status' => 'available']);
    }

    public function reserved(): static
    {
        return $this->state(fn () => ['status' => 'reserved']);
    }

    public function sold(): static
    {
        return $this->state(fn () => ['status' => 'sold']);
    }

    public function draft(): static
    {
        return $this->state(fn () => ['status' => 'draft']);
    }

    public function priceOnRequest(): static
    {
        return $this->state(fn () => ['price_on_request' => true]);
    }
}
