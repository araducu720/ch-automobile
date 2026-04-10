<?php

namespace Database\Factories;

use App\Models\Template;
use App\Models\Brand;
use Illuminate\Database\Eloquent\Factories\Factory;

class TemplateFactory extends Factory
{
    protected $model = Template::class;

    public function definition(): array
    {
        return [
            'brand_id' => Brand::factory(),
            'name' => fake()->words(3, true),
            'type' => fake()->randomElement(['email', 'form', 'notification']),
            'subject' => fake()->sentence(),
            'html_content' => '<div>' . fake()->paragraph() . '</div>',
            'css_variables' => ['--primary' => fake()->hexColor()],
            'config' => [],
            'is_active' => true,
        ];
    }

    public function email(): static
    {
        return $this->state(fn () => ['type' => 'email']);
    }

    public function form(): static
    {
        return $this->state(fn () => ['type' => 'form']);
    }

    public function notification(): static
    {
        return $this->state(fn () => ['type' => 'notification']);
    }

    public function forBrand(Brand $brand): static
    {
        return $this->state(fn () => ['brand_id' => $brand->id]);
    }
}
