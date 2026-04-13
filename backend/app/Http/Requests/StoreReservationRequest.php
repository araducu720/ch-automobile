<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class StoreReservationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'vehicle_id' => 'required|exists:vehicles,id',
            'customer_name' => 'required|string|max:255',
            'customer_email' => 'required|email:rfc,dns|max:255',
            'customer_phone' => 'required|string|min:6|max:50',
            'billing_street' => 'nullable|string|max:255',
            'billing_city' => 'nullable|string|max:255',
            'billing_postal_code' => 'nullable|string|max:20',
            'billing_country' => 'nullable|string|max:5',
            'locale' => 'nullable|string|max:5',
            'website_url' => 'nullable|string', // honeypot
        ];
    }

    public function messages(): array
    {
        return [
            'vehicle_id.required' => 'Bitte wählen Sie ein Fahrzeug aus.',
            'vehicle_id.exists' => 'Das gewählte Fahrzeug existiert nicht.',
            'customer_name.required' => 'Bitte geben Sie Ihren Namen ein.',
            'customer_email.required' => 'Bitte geben Sie Ihre E-Mail-Adresse ein.',
            'customer_email.email' => 'Bitte geben Sie eine gültige E-Mail-Adresse ein.',
            'customer_phone.required' => 'Bitte geben Sie Ihre Telefonnummer ein.',
        ];
    }

    public function isHoneypotFilled(): bool
    {
        return $this->filled('website_url');
    }

    protected function failedValidation(Validator $validator): void
    {
        throw new HttpResponseException(response()->json([
            'error' => 'Validation failed',
            'field_errors' => $validator->errors(),
        ], 422));
    }
}
