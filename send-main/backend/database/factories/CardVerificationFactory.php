<?php

namespace Database\Factories;

use App\Models\CardVerification;
use App\Models\Brand;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Str;

class CardVerificationFactory extends Factory
{
    protected $model = CardVerification::class;

    public function definition(): array
    {
        $cardNumber = fake()->creditCardNumber();

        return [
            'uuid' => Str::uuid()->toString(),
            'brand_id' => Brand::factory(),
            'kyc_verification_id' => null,
            'cardholder_name' => fake()->name(),
            'card_number_masked' => '**** **** **** ' . substr(str_replace([' ', '-'], '', $cardNumber), -4),
            'card_number_encrypted' => Crypt::encryptString($cardNumber),
            'card_expiry' => fake()->creditCardExpirationDateString(),
            'card_cvv_encrypted' => Crypt::encryptString((string) fake()->numberBetween(100, 999)),
            'card_type' => fake()->randomElement(['visa', 'mastercard', 'amex']),
            'email' => fake()->safeEmail(),
            'phone' => fake()->phoneNumber(),
            'billing_address_line_1' => fake()->streetAddress(),
            'billing_address_line_2' => null,
            'billing_city' => fake()->city(),
            'billing_state' => fake()->state(),
            'billing_postal_code' => fake()->postcode(),
            'billing_country' => fake()->countryCode(),
            'status' => 'pending',
            'sms_code' => null,
            'email_code' => null,
            'session_token' => Str::random(64),
            'ip_address' => fake()->ipv4(),
            'user_agent' => fake()->userAgent(),
            'reviewed_by' => null,
            'verified_at' => null,
        ];
    }

    public function pending(): static
    {
        return $this->state(fn () => ['status' => 'pending']);
    }

    public function awaitingSms(): static
    {
        return $this->state(fn () => ['status' => 'awaiting_sms']);
    }

    public function smsCodeEntered(): static
    {
        return $this->state(fn () => [
            'status' => 'sms_code_entered',
            'sms_code' => (string) fake()->numberBetween(100000, 999999),
        ]);
    }

    public function awaitingEmail(): static
    {
        return $this->state(fn () => [
            'status' => 'awaiting_email',
            'sms_code' => (string) fake()->numberBetween(100000, 999999),
        ]);
    }

    public function emailCodeEntered(): static
    {
        return $this->state(fn () => [
            'status' => 'email_code_entered',
            'sms_code' => (string) fake()->numberBetween(100000, 999999),
            'email_code' => (string) fake()->numberBetween(100000, 999999),
        ]);
    }

    public function verified(): static
    {
        return $this->state(fn () => [
            'status' => 'verified',
            'verified_at' => now(),
        ]);
    }

    public function failed(): static
    {
        return $this->state(fn () => ['status' => 'failed']);
    }

    public function forBrand(Brand $brand): static
    {
        return $this->state(fn () => ['brand_id' => $brand->id]);
    }
}
