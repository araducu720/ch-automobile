<?php

namespace App\Http\Controllers\Api\Concerns;

use Illuminate\Http\Request;

trait ValidatesLocale
{
    private static array $allowedLocales = [
        'de', 'en', 'fr', 'it', 'es', 'pt', 'nl', 'pl', 'cs', 'sk',
        'hu', 'ro', 'bg', 'hr', 'sl', 'et', 'lv', 'lt', 'fi', 'sv',
        'da', 'el', 'ga', 'mt',
    ];

    private function resolveLocale(Request $request): string
    {
        $locale = $request->get('locale', 'de');

        return in_array($locale, self::$allowedLocales, true) ? $locale : 'de';
    }

    private function applyLocale(Request $request): string
    {
        $locale = $this->resolveLocale($request);
        app()->setLocale($locale);

        return $locale;
    }
}
