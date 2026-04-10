<?php

namespace Database\Factories;

use App\Models\KycVerification;
use App\Models\Brand;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class KycVerificationFactory extends Factory
{
    protected $model = KycVerification::class;

    public function definition(): array
    {
        return [
            'uuid' => Str::uuid()->toString(),
            'user_id' => null,
            'brand_id' => Brand::factory(),
            'first_name' => fake()->firstName(),
            'last_name' => fake()->lastName(),
            'email' => fake()->safeEmail(),
            'phone' => fake()->phoneNumber(),
            'date_of_birth' => fake()->date('Y-m-d', '-18 years'),
            'nationality' => fake()->countryCode(),
            'address_line_1' => fake()->streetAddress(),
            'address_line_2' => null,
            'city' => fake()->city(),
            'state' => fake()->state(),
            'postal_code' => fake()->postcode(),
            'country' => fake()->countryCode(),
            'document_type' => fake()->randomElement(['passport', 'drivers_license', 'national_id']),
            'document_front_path' => null,
            'document_back_path' => null,
            'selfie_path' => null,
            'status' => 'pending',
            'rejection_reason' => null,
            'reviewed_by' => null,
            'reviewed_at' => null,
            'verification_checks' => [],
            'confidence_score' => null,
            'ip_address' => fake()->ipv4(),
            'user_agent' => fake()->userAgent(),
        ];
    }

    public function pending(): static
    {
        return $this->state(fn () => ['status' => 'pending']);
    }

    public function inReview(): static
    {
        return $this->state(fn () => ['status' => 'in_review']);
    }

    public function approved(): static
    {
        return $this->state(fn () => [
            'status' => 'approved',
            'reviewed_by' => User::factory()->admin(),
            'reviewed_at' => now(),
            'confidence_score' => fake()->numberBetween(80, 100),
        ]);
    }

    public function rejected(): static
    {
        return $this->state(fn () => [
            'status' => 'rejected',
            'rejection_reason' => fake()->sentence(),
            'reviewed_by' => User::factory()->admin(),
            'reviewed_at' => now(),
        ]);
    }

    public function withDocuments(): static
    {
        return $this->state(fn () => [
            'document_front_path' => 'private/kyc/test/documents/front_' . Str::random(10) . '.jpg',
            'document_back_path' => 'private/kyc/test/documents/back_' . Str::random(10) . '.jpg',
            'selfie_path' => 'private/kyc/test/selfies/selfie_' . Str::random(10) . '.jpg',
        ]);
    }

    public function forBrand(Brand $brand): static
    {
        return $this->state(fn () => ['brand_id' => $brand->id]);
    }
}
