<?php

namespace App\Filament\Resources\CompanySettingResource\Pages;

use App\Filament\Resources\CompanySettingResource;
use App\Models\CompanySetting;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class ManageCompanySetting extends EditRecord
{
    use EditRecord\Concerns\Translatable;
    protected static string $resource = CompanySettingResource::class;

    /**
     * Always edit the singleton instance (id = 1).
     */
    public function mount(int|string $record = null): void
    {
        $this->record = CompanySetting::instance();

        $this->fillForm();
    }

    protected function getHeaderActions(): array
    {
        return [
            Actions\LocaleSwitcher::make(),
        ];
    }

    protected function getRedirectUrl(): string
    {
        return static::getResource()::getUrl('index');
    }

    public function getTitle(): string
    {
        return __('admin.company.title');
    }
}
