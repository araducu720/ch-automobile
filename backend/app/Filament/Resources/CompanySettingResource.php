<?php

namespace App\Filament\Resources;

use App\Filament\Resources\CompanySettingResource\Pages;
use App\Models\CompanySetting;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Resources\Concerns\Translatable;

class CompanySettingResource extends Resource
{
    use Translatable;

    protected static ?string $model = CompanySetting::class;
    protected static ?string $navigationIcon = 'heroicon-o-cog-6-tooth';
    protected static ?int $navigationSort = 10;
    protected static ?string $slug = 'settings';

    public static function getNavigationGroup(): ?string
    {
        return __('admin.nav.settings');
    }

    public static function getNavigationLabel(): string
    {
        return __('admin.company.nav');
    }

    public static function getModelLabel(): string
    {
        return __('admin.company.label');
    }

    public static function getPluralModelLabel(): string
    {
        return __('admin.company.plural');
    }

    public static function form(Form $form): Form
    {
        return $form->schema([
            Forms\Components\Tabs::make(__('admin.nav.settings'))->tabs([
                // ─── Company info ───
                Forms\Components\Tabs\Tab::make(__('admin.company.tab_company'))
                    ->icon('heroicon-o-building-office')
                    ->schema([
                        Forms\Components\Section::make(__('admin.company.section_contact'))->columns(2)->schema([
                            Forms\Components\TextInput::make('company_name')
                                ->label(__('admin.company.company_name'))->required()->maxLength(255),
                            Forms\Components\TextInput::make('email')
                                ->label('E-Mail')->email()->required()->maxLength(255),
                            Forms\Components\TextInput::make('phone')
                                ->label(__('admin.company.phone'))->tel()->required()->maxLength(50),
                            Forms\Components\TextInput::make('website')
                                ->label('Website')->url()->maxLength(255),
                        ]),
                        Forms\Components\Section::make(__('admin.company.section_address'))->columns(2)->schema([
                            Forms\Components\TextInput::make('street')
                                ->label(__('admin.company.street'))->required()->maxLength(255),
                            Forms\Components\TextInput::make('city')
                                ->label(__('admin.company.city'))->required()->maxLength(255),
                            Forms\Components\TextInput::make('postal_code')
                                ->label(__('admin.company.zip'))->required()->maxLength(20),
                            Forms\Components\TextInput::make('country')
                                ->label(__('admin.company.country'))->required()->maxLength(100),
                            Forms\Components\TextInput::make('latitude')
                                ->label(__('admin.company.latitude'))->numeric()->step(0.0000001),
                            Forms\Components\TextInput::make('longitude')
                                ->label(__('admin.company.longitude'))->numeric()->step(0.0000001),
                        ]),
                    ]),

                // ─── Opening hours ───
                Forms\Components\Tabs\Tab::make(__('admin.company.tab_hours'))
                    ->icon('heroicon-o-clock')
                    ->schema([
                        Forms\Components\Section::make(__('admin.company.section_hours'))->schema([
                            Forms\Components\KeyValue::make('opening_hours')
                                ->label(__('admin.company.hours'))
                                ->keyLabel(__('admin.company.hours_day'))->valueLabel(__('admin.company.hours_time'))
                                ->addActionLabel(__('admin.company.hours_add'))
                                ->default([
                                    __('admin.company.monday') => '09:00 - 18:00',
                                    __('admin.company.tuesday') => '09:00 - 18:00',
                                    __('admin.company.wednesday') => '09:00 - 18:00',
                                    __('admin.company.thursday') => '09:00 - 18:00',
                                    __('admin.company.friday') => '09:00 - 18:00',
                                    __('admin.company.saturday') => '10:00 - 14:00',
                                    __('admin.company.sunday') => __('admin.company.closed'),
                                ]),
                        ]),
                    ]),

                // ─── Social media ───
                Forms\Components\Tabs\Tab::make('Social Media')
                    ->icon('heroicon-o-globe-alt')
                    ->schema([
                        Forms\Components\Section::make(__('admin.company.section_social'))->columns(2)->schema([
                            Forms\Components\TextInput::make('facebook_url')
                                ->label('Facebook URL')->url()->maxLength(500),
                            Forms\Components\TextInput::make('instagram_url')
                                ->label('Instagram URL')->url()->maxLength(500),
                            Forms\Components\TextInput::make('youtube_url')
                                ->label('YouTube URL')->url()->maxLength(500),
                            Forms\Components\TextInput::make('tiktok_url')
                                ->label('TikTok URL')->url()->maxLength(500),
                            Forms\Components\TextInput::make('whatsapp_number')
                                ->label(__('admin.company.whatsapp'))->tel()->maxLength(50),
                        ]),
                    ]),

                // ─── Bank details ───
                Forms\Components\Tabs\Tab::make(__('admin.company.tab_bank'))
                    ->icon('heroicon-o-banknotes')
                    ->schema([
                        Forms\Components\Section::make(__('admin.company.section_bank'))->columns(2)->schema([
                            Forms\Components\TextInput::make('bank_name')
                                ->label('Bank')->maxLength(255),
                            Forms\Components\TextInput::make('bank_account_holder')
                                ->label(__('admin.company.account_holder'))->maxLength(255),
                            Forms\Components\TextInput::make('bank_iban')
                                ->label('IBAN')->maxLength(34),
                            Forms\Components\TextInput::make('bank_bic')
                                ->label('BIC')->maxLength(11),
                        ]),
                        Forms\Components\Section::make(__('admin.company.section_tax'))->columns(2)->schema([
                            Forms\Components\TextInput::make('tax_id')
                                ->label(__('admin.company.tax_number'))->maxLength(50),
                            Forms\Components\TextInput::make('trade_register')
                                ->label(__('admin.company.trade_register'))->maxLength(100),
                        ]),
                    ]),

                // ─── Branding ───
                Forms\Components\Tabs\Tab::make('Branding')
                    ->icon('heroicon-o-photo')
                    ->schema([
                        Forms\Components\Section::make(__('admin.company.section_logo'))->columns(3)->schema([
                            Forms\Components\FileUpload::make('logo')
                                ->label(__('admin.company.logo_light'))
                                ->image()
                                ->directory('branding')
                                ->maxSize(2048),
                            Forms\Components\FileUpload::make('logo_dark')
                                ->label(__('admin.company.logo_dark'))
                                ->image()
                                ->directory('branding')
                                ->maxSize(2048),
                            Forms\Components\FileUpload::make('favicon')
                                ->label('Favicon')
                                ->image()
                                ->directory('branding')
                                ->maxSize(512),
                        ]),
                    ]),

                // ─── SEO ───
                Forms\Components\Tabs\Tab::make('SEO')
                    ->icon('heroicon-o-magnifying-glass')
                    ->schema([
                        Forms\Components\Section::make(__('admin.company.section_meta'))->schema([
                            Forms\Components\TextInput::make('meta_title')
                                ->label(__('admin.company.meta_title'))->maxLength(70),
                            Forms\Components\Textarea::make('meta_description')
                                ->label(__('admin.company.meta_description'))->rows(3)->maxLength(160),
                        ]),
                    ]),

                // ─── Legal ───
                Forms\Components\Tabs\Tab::make(__('admin.company.tab_legal'))
                    ->icon('heroicon-o-scale')
                    ->schema([
                        Forms\Components\Section::make(__('admin.company.section_imprint'))->schema([
                            Forms\Components\RichEditor::make('imprint')
                                ->label(__('admin.company.imprint'))
                                ->toolbarButtons([
                                    'bold', 'italic', 'underline', 'link',
                                    'h2', 'h3', 'bulletList', 'orderedList',
                                ]),
                        ]),
                        Forms\Components\Section::make(__('admin.company.section_privacy'))->schema([
                            Forms\Components\RichEditor::make('privacy_policy')
                                ->label(__('admin.company.privacy_policy'))
                                ->toolbarButtons([
                                    'bold', 'italic', 'underline', 'link',
                                    'h2', 'h3', 'bulletList', 'orderedList',
                                ]),
                        ]),
                        Forms\Components\Section::make(__('admin.company.section_terms'))->schema([
                            Forms\Components\RichEditor::make('terms_conditions')
                                ->label(__('admin.company.terms'))
                                ->toolbarButtons([
                                    'bold', 'italic', 'underline', 'link',
                                    'h2', 'h3', 'bulletList', 'orderedList',
                                ]),
                        ]),
                    ]),
            ])->columnSpanFull()->persistTabInQueryString(),
        ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ManageCompanySetting::route('/'),
        ];
    }
}
