<?php

namespace App\Filament\Resources;

use App\Filament\Resources\InquiryResource\Pages;
use App\Models\Inquiry;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class InquiryResource extends Resource
{
    protected static ?string $model = Inquiry::class;

    protected static ?string $navigationIcon = 'heroicon-o-inbox';

    protected static ?int $navigationSort = 1;

    public static function getNavigationGroup(): ?string
    {
        return __('admin.nav.customer_service');
    }

    public static function getNavigationLabel(): string
    {
        return __('admin.inquiry.nav');
    }

    public static function getModelLabel(): string
    {
        return __('admin.inquiry.label');
    }

    public static function getPluralModelLabel(): string
    {
        return __('admin.inquiry.plural');
    }

    public static function getNavigationBadge(): ?string
    {
        return static::getModel()::new()->count() ?: null;
    }

    public static function getNavigationBadgeColor(): ?string
    {
        return static::getModel()::new()->count() > 0 ? 'danger' : 'primary';
    }

    public static function form(Form $form): Form
    {
        return $form->schema([
            Forms\Components\Section::make(__('admin.inquiry.section_details'))->columns(2)->schema([
                Forms\Components\Select::make('type')->label(__('admin.inquiry.type'))->required()
                    ->options([
                        'general' => __('admin.inquiry.type_general'),
                        'test_drive' => __('admin.inquiry.type_test_drive'),
                        'price_inquiry' => __('admin.inquiry.type_price'),
                        'financing' => __('admin.inquiry.type_financing'),
                        'trade_in' => __('admin.inquiry.type_trade_in'),
                    ])->disabled(),
                Forms\Components\Select::make('status')->label(__('admin.inquiry.status'))->required()
                    ->options([
                        'new' => __('admin.inquiry.status_new'),
                        'in_progress' => __('admin.inquiry.status_in_progress'),
                        'completed' => __('admin.inquiry.status_completed'),
                        'archived' => __('admin.inquiry.status_archived'),
                    ]),
                Forms\Components\TextInput::make('name')->label('Name')->disabled(),
                Forms\Components\TextInput::make('email')->label('E-Mail')->disabled(),
                Forms\Components\TextInput::make('phone')->label(__('admin.inquiry.phone'))->disabled(),
                Forms\Components\TextInput::make('reference_number')->label(__('admin.inquiry.reference'))->disabled(),
                Forms\Components\Select::make('vehicle_id')->label(__('admin.inquiry.vehicle'))
                    ->relationship('vehicle', 'brand')
                    ->getOptionLabelFromRecordUsing(fn ($record) => "{$record->brand} {$record->model} ({$record->year})")
                    ->disabled(),
                Forms\Components\DateTimePicker::make('preferred_date')->label(__('admin.inquiry.preferred_date'))->disabled(),
            ]),
            Forms\Components\Section::make(__('admin.inquiry.section_message'))->schema([
                Forms\Components\Textarea::make('message')->label(__('admin.inquiry.message'))->disabled()->rows(4),
            ]),
            Forms\Components\Section::make(__('admin.inquiry.section_notes'))->schema([
                Forms\Components\Textarea::make('admin_notes')->label(__('admin.inquiry.internal_notes'))->rows(4),
            ]),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('reference_number')->label(__('admin.inquiry.reference'))->searchable(),
                Tables\Columns\TextColumn::make('type')->label(__('admin.inquiry.type'))
                    ->badge()->formatStateUsing(fn (string $state) => match ($state) {
                        'general' => __('admin.inquiry.type_general'),
                        'test_drive' => __('admin.inquiry.type_test_drive'),
                        'price_inquiry' => __('admin.inquiry.type_price'),
                        'financing' => __('admin.inquiry.type_financing'),
                        'trade_in' => __('admin.inquiry.type_trade_in'),
                        default => $state,
                    }),
                Tables\Columns\TextColumn::make('name')->label('Name')->searchable(),
                Tables\Columns\TextColumn::make('email')->label('E-Mail')->searchable(),
                Tables\Columns\TextColumn::make('vehicle.brand')->label(__('admin.inquiry.vehicle'))
                    ->formatStateUsing(fn ($record) => $record->vehicle ? "{$record->vehicle->brand} {$record->vehicle->model}" : '—'),
                Tables\Columns\TextColumn::make('status')->label(__('admin.inquiry.status'))
                    ->badge()->color(fn (string $state) => match ($state) {
                        'new' => 'danger', 'in_progress' => 'warning',
                        'completed' => 'success', 'archived' => 'gray', default => 'gray',
                    }),
                Tables\Columns\TextColumn::make('created_at')->label(__('admin.inquiry.received'))
                    ->dateTime('d.m.Y H:i')->sortable(),
            ])
            ->defaultSort('created_at', 'desc')
            ->filters([
                SelectFilter::make('status')->options([
                    'new' => __('admin.inquiry.status_new'),
                    'in_progress' => __('admin.inquiry.status_in_progress'),
                    'completed' => __('admin.inquiry.status_completed'),
                    'archived' => __('admin.inquiry.status_archived'),
                ]),
                SelectFilter::make('type')->options([
                    'general' => __('admin.inquiry.type_general'),
                    'test_drive' => __('admin.inquiry.type_test_drive'),
                    'price_inquiry' => __('admin.inquiry.type_price'),
                    'financing' => __('admin.inquiry.type_financing'),
                    'trade_in' => __('admin.inquiry.type_trade_in'),
                ]),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\Action::make('mark_in_progress')
                    ->label(__('admin.inquiry.action_in_progress'))
                    ->icon('heroicon-o-play')
                    ->action(fn (Inquiry $record) => $record->update(['status' => 'in_progress']))
                    ->visible(fn (Inquiry $record) => $record->status === 'new'),
                Tables\Actions\Action::make('mark_completed')
                    ->label(__('admin.inquiry.action_complete'))
                    ->icon('heroicon-o-check')
                    ->action(fn (Inquiry $record) => $record->update(['status' => 'completed']))
                    ->visible(fn (Inquiry $record) => in_array($record->status, ['new', 'in_progress'])),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                    Tables\Actions\BulkAction::make('archive')
                        ->label(__('admin.inquiry.action_archive'))
                        ->action(fn ($records) => $records->each->update(['status' => 'archived']))
                        ->requiresConfirmation()
                        ->deselectRecordsAfterCompletion(),
                ]),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListInquiries::route('/'),
            'edit' => Pages\EditInquiry::route('/{record}/edit'),
        ];
    }
}
