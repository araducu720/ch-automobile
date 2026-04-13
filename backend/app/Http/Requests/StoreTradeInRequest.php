<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class StoreTradeInRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'email' => 'required|email:rfc,dns|max:255',
            'phone' => 'required|string|max:50',
            'preferred_contact_method' => 'nullable|in:email,phone,whatsapp',
            'trade_brand' => 'required|string|max:100',
            'trade_model' => 'required|string|max:100',
            'trade_year' => 'required|integer|min:1960|max:'.(2026),
            'trade_mileage' => 'required|integer|min:0|max:999999',
            'trade_condition' => 'required|in:excellent,good,fair,poor',
            'trade_description' => 'nullable|string|max:5000',
            'damage_description' => 'nullable|string|max:5000',
            'photos' => 'nullable|array|max:10',
            'photos.*' => 'image|mimes:jpeg,png,webp|max:5120',
            'locale' => 'nullable|string|max:5',
            'website_url' => 'nullable|string', // honeypot
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Bitte geben Sie Ihren Namen ein.',
            'email.required' => 'Bitte geben Sie Ihre E-Mail-Adresse ein.',
            'phone.required' => 'Bitte geben Sie Ihre Telefonnummer ein.',
            'trade_brand.required' => 'Bitte geben Sie die Marke Ihres Fahrzeugs ein.',
            'trade_model.required' => 'Bitte geben Sie das Modell Ihres Fahrzeugs ein.',
            'trade_year.required' => 'Bitte geben Sie das Baujahr ein.',
            'trade_year.min' => 'Das Baujahr muss nach 1960 liegen.',
            'trade_mileage.required' => 'Bitte geben Sie den Kilometerstand ein.',
            'trade_condition.required' => 'Bitte wählen Sie den Zustand.',
            'photos.*.max' => 'Jedes Foto darf maximal 5 MB groß sein.',
            'photos.max' => 'Maximal 10 Fotos erlaubt.',
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
