<?php

namespace Database\Factories;

use App\Models\Inquiry;
use Illuminate\Database\Eloquent\Factories\Factory;

class InquiryFactory extends Factory
{
    protected $model = Inquiry::class;

    public function definition(): array
    {
        return [
            'type' => $this->faker->randomElement(['general', 'test_drive', 'price_inquiry', 'financing']),
            'vehicle_id' => null,
            'name' => $this->faker->name(),
            'email' => $this->faker->safeEmail(),
            'phone' => $this->faker->phoneNumber(),
            'message' => $this->faker->paragraph(2),
            'preferred_contact_method' => $this->faker->randomElement(['email', 'phone', 'whatsapp']),
            'status' => 'new',
            'locale' => 'de',
            'ip_address' => $this->faker->ipv4(),
            'user_agent' => 'PHPUnit Test',
        ];
    }

    public function tradeIn(): static
    {
        return $this->state(fn () => ['type' => 'trade_in']);
    }

    public function testDrive(): static
    {
        return $this->state(fn () => ['type' => 'test_drive']);
    }
}
