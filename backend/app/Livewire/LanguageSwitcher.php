<?php

namespace App\Livewire;

use Illuminate\Support\Facades\App;
use Livewire\Component;

class LanguageSwitcher extends Component
{
    public string $locale;

    protected array $locales = [
        'de' => ['label' => 'Deutsch', 'flag' => '🇩🇪'],
        'en' => ['label' => 'English', 'flag' => '🇬🇧'],
    ];

    public function mount(): void
    {
        $this->locale = App::getLocale();
    }

    public function switchLocale(string $locale): void
    {
        if (array_key_exists($locale, $this->locales)) {
            session()->put('filament_locale', $locale);
            $this->locale = $locale;
            $this->redirect(request()->header('Referer', '/admin'), navigate: true);
        }
    }

    public function render(): \Illuminate\View\View
    {
        return view('livewire.language-switcher', [
            'locales' => $this->locales,
            'currentLocale' => $this->locale,
        ]);
    }
}
