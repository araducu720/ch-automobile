<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class StoreInquiryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'type' => 'required|in:general,test_drive,price_inquiry,financing,trade_in',
            'vehicle_id' => 'nullable|exists:vehicles,id',
            'name' => 'required|string|max:255',
            'email' => 'required|email:rfc,dns|max:255',
            'phone' => 'nullable|string|max:50',
            'message' => 'required|string|min:10|max:5000',
            'preferred_date' => 'nullable|date|after:today',
            'preferred_time' => 'nullable|string|max:10',
            'preferred_contact_method' => 'nullable|in:email,phone,whatsapp',
            'locale' => 'nullable|string|max:5',
            'website_url' => 'nullable|string', // honeypot
        ];
    }

    public function messages(): array
    {
        return [
            'type.required' => 'Bitte wählen Sie den Anfrage-Typ.',
            'type.in' => 'Ungültiger Anfrage-Typ.',
            'name.required' => 'Bitte geben Sie Ihren Namen ein.',
            'email.required' => 'Bitte geben Sie Ihre E-Mail-Adresse ein.',
            'email.email' => 'Bitte geben Sie eine gültige E-Mail-Adresse ein.',
            'message.required' => 'Bitte geben Sie eine Nachricht ein.',
            'message.min' => 'Die Nachricht muss mindestens 10 Zeichen lang sein.',
            'preferred_date.after' => 'Das gewünschte Datum muss in der Zukunft liegen.',
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
