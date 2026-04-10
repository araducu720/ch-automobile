<?php

namespace App\Filament\Resources;

use App\Filament\Resources\NewsletterSubscriberResource\Pages;
use App\Models\NewsletterSubscriber;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Tables\Actions\Action;
use Filament\Notifications\Notification;

class NewsletterSubscriberResource extends Resource
{
    protected static ?string $model = NewsletterSubscriber::class;
    protected static ?string $navigationIcon = 'heroicon-o-envelope';
    protected static ?int $navigationSort = 5;

    public static function getNavigationGroup(): ?string
    {
        return __('admin.nav.customer_service');
    }

    public static function getNavigationLabel(): string
    {
        return __('admin.newsletter.nav');
    }

    public static function getModelLabel(): string
    {
        return __('admin.newsletter.label');
    }

    public static function getPluralModelLabel(): string
    {
        return __('admin.newsletter.plural');
    }

    public static function getNavigationBadge(): ?string
    {
        return (string) static::getModel()::confirmed()->count();
    }

    public static function getNavigationBadgeColor(): ?string
    {
        return 'success';
    }

    public static function form(Form $form): Form
    {
        return $form->schema([
            Forms\Components\Section::make(__('admin.newsletter.section_subscriber'))->columns(2)->schema([
                Forms\Components\TextInput::make('email')
                    ->label('E-Mail')
                    ->email()
                    ->required()
                    ->maxLength(255),
                Forms\Components\Select::make('locale')
                    ->label(__('admin.newsletter.language'))
                    ->options([
                        'de' => 'Deutsch',
                        'en' => 'English',
                        'fr' => 'Français',
                        'nl' => 'Nederlands',
                        'it' => 'Italiano',
                        'es' => 'Español',
                        'pl' => 'Polski',
                        'pt' => 'Português',
                        'ro' => 'Română',
                        'cs' => 'Čeština',
                        'hu' => 'Magyar',
                        'sk' => 'Slovenčina',
                        'bg' => 'Български',
                        'hr' => 'Hrvatski',
                        'sl' => 'Slovenščina',
                        'da' => 'Dansk',
                        'fi' => 'Suomi',
                        'sv' => 'Svenska',
                        'el' => 'Ελληνικά',
                        'et' => 'Eesti',
                        'lv' => 'Latviešu',
                        'lt' => 'Lietuvių',
                        'ga' => 'Gaeilge',
                        'mt' => 'Malti',
                    ])
                    ->default('de'),
                Forms\Components\DateTimePicker::make('confirmed_at')
                    ->label(__('admin.newsletter.confirmed_at'))
                    ->disabled(),
                Forms\Components\DateTimePicker::make('unsubscribed_at')
                    ->label(__('admin.newsletter.unsubscribed_at'))
                    ->disabled(),
            ]),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('email')
                    ->label('E-Mail')
                    ->searchable()
                    ->sortable()
                    ->copyable(),
                Tables\Columns\TextColumn::make('locale')
                    ->label(__('admin.newsletter.language'))
                    ->badge()
                    ->sortable(),
                Tables\Columns\IconColumn::make('confirmed_at')
                    ->label(__('admin.newsletter.confirmed'))
                    ->boolean()
                    ->getStateUsing(fn ($record) => $record->confirmed_at !== null)
                    ->trueIcon('heroicon-o-check-circle')
                    ->falseIcon('heroicon-o-x-circle')
                    ->trueColor('success')
                    ->falseColor('danger'),
                Tables\Columns\IconColumn::make('unsubscribed_at')
                    ->label(__('admin.newsletter.unsubscribed'))
                    ->boolean()
                    ->getStateUsing(fn ($record) => $record->unsubscribed_at !== null)
                    ->trueIcon('heroicon-o-x-circle')
                    ->falseIcon('heroicon-o-minus-circle')
                    ->trueColor('danger')
                    ->falseColor('gray'),
                Tables\Columns\TextColumn::make('created_at')
                    ->label(__('admin.newsletter.subscribed_at'))
                    ->dateTime('d.m.Y H:i')
                    ->sortable(),
            ])
            ->defaultSort('created_at', 'desc')
            ->filters([
                Tables\Filters\TernaryFilter::make('confirmed')
                    ->label(__('admin.newsletter.filter_status'))
                    ->placeholder(__('admin.newsletter.filter_all'))
                    ->trueLabel(__('admin.newsletter.filter_confirmed'))
                    ->falseLabel(__('admin.newsletter.filter_unconfirmed'))
                    ->queries(
                        true: fn ($query) => $query->whereNotNull('confirmed_at')->whereNull('unsubscribed_at'),
                        false: fn ($query) => $query->whereNull('confirmed_at'),
                    ),
                Tables\Filters\TernaryFilter::make('unsubscribed')
                    ->label(__('admin.newsletter.filter_unsubscribed'))
                    ->placeholder(__('admin.newsletter.filter_all'))
                    ->trueLabel(__('admin.newsletter.filter_unsubscribed_yes'))
                    ->falseLabel(__('admin.newsletter.filter_active'))
                    ->queries(
                        true: fn ($query) => $query->whereNotNull('unsubscribed_at'),
                        false: fn ($query) => $query->whereNull('unsubscribed_at'),
                    ),
                Tables\Filters\SelectFilter::make('locale')
                    ->label(__('admin.newsletter.language'))
                    ->options([
                        'de' => 'Deutsch',
                        'en' => 'English',
                        'fr' => 'Français',
                        'nl' => 'Nederlands',
                    ]),
            ])
            ->actions([
                Action::make('confirm')
                    ->label(__('admin.newsletter.action_confirm'))
                    ->icon('heroicon-o-check-circle')
                    ->color('success')
                    ->requiresConfirmation()
                    ->modalHeading(__('admin.newsletter.action_confirm_heading'))
                    ->modalDescription(__('admin.newsletter.action_confirm_description'))
                    ->visible(fn ($record) => $record->confirmed_at === null)
                    ->action(function ($record) {
                        $record->update([
                            'confirmed_at' => now(),
                            'confirmation_token' => null,
                        ]);
                        Notification::make()
                            ->title(__('admin.newsletter.action_confirmed'))
                            ->success()
                            ->send();
                    }),
                Action::make('unsubscribe')
                    ->label(__('admin.newsletter.action_unsubscribe'))
                    ->icon('heroicon-o-x-circle')
                    ->color('danger')
                    ->requiresConfirmation()
                    ->modalHeading(__('admin.newsletter.action_unsubscribe_heading'))
                    ->modalDescription(__('admin.newsletter.action_unsubscribe_description'))
                    ->visible(fn ($record) => $record->confirmed_at !== null && $record->unsubscribed_at === null)
                    ->action(function ($record) {
                        $record->update(['unsubscribed_at' => now()]);
                        Notification::make()
                            ->title(__('admin.newsletter.action_unsubscribed'))
                            ->success()
                            ->send();
                    }),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getRelations(): array
    {
        return [];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListNewsletterSubscribers::route('/'),
        ];
    }

    public static function canCreate(): bool
    {
        return false; // Subscribers come via the frontend
    }
}
