<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class StoreReviewRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'customer_name' => 'required|string|max:255',
            'customer_email' => 'nullable|email:rfc|max:255',
            'rating' => 'required|integer|min:1|max:5',
            'title' => 'nullable|string|max:255',
            'comment' => 'required|string|min:20|max:500',
            'vehicle_id' => 'nullable|exists:vehicles,id',
            'locale' => 'nullable|string|max:5',
            'website_url' => 'nullable|string', // honeypot
        ];
    }

    public function messages(): array
    {
        return [
            'customer_name.required' => 'Bitte geben Sie Ihren Namen ein.',
            'rating.required' => 'Bitte wählen Sie eine Bewertung.',
            'rating.min' => 'Die Bewertung muss mindestens 1 Stern sein.',
            'rating.max' => 'Die Bewertung darf maximal 5 Sterne sein.',
            'comment.required' => 'Bitte schreiben Sie einen Kommentar.',
            'comment.min' => 'Der Kommentar muss mindestens 20 Zeichen lang sein.',
            'comment.max' => 'Der Kommentar darf maximal 500 Zeichen lang sein.',
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
