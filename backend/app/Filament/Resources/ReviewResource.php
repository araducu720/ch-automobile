<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ReviewResource\Pages;
use App\Models\Review;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class ReviewResource extends Resource
{
    protected static ?string $model = Review::class;

    protected static ?string $navigationIcon = 'heroicon-o-star';

    protected static ?int $navigationSort = 2;

    public static function getNavigationGroup(): ?string
    {
        return __('admin.nav.content');
    }

    public static function getNavigationLabel(): string
    {
        return __('admin.review.nav');
    }

    public static function getModelLabel(): string
    {
        return __('admin.review.label');
    }

    public static function getPluralModelLabel(): string
    {
        return __('admin.review.plural');
    }

    public static function getNavigationBadge(): ?string
    {
        return static::getModel()::where('is_approved', false)->count() ?: null;
    }

    public static function form(Form $form): Form
    {
        return $form->schema([
            Forms\Components\Section::make(__('admin.review.section_review'))->columns(2)->schema([
                Forms\Components\TextInput::make('customer_name')->label('Name')->required(),
                Forms\Components\TextInput::make('customer_email')->label('E-Mail'),
                Forms\Components\Select::make('rating')->label(__('admin.review.rating'))->required()
                    ->options([1 => '⭐', 2 => '⭐⭐', 3 => '⭐⭐⭐', 4 => '⭐⭐⭐⭐', 5 => '⭐⭐⭐⭐⭐']),
                Forms\Components\Select::make('vehicle_id')->label(__('admin.review.vehicle'))
                    ->relationship('vehicle', 'brand')
                    ->getOptionLabelFromRecordUsing(fn ($record) => "{$record->brand} {$record->model}")
                    ->nullable(),
                Forms\Components\TextInput::make('title')->label(__('admin.review.title'))->columnSpanFull(),
                Forms\Components\Textarea::make('comment')->label(__('admin.review.comment'))->required()->rows(4)->columnSpanFull(),
                Forms\Components\Toggle::make('is_approved')->label(__('admin.review.approved')),
                Forms\Components\Toggle::make('is_featured')->label(__('admin.review.featured')),
            ]),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('customer_name')->label('Name')->searchable(),
                Tables\Columns\TextColumn::make('rating')->label(__('admin.review.rating'))
                    ->formatStateUsing(fn (int $state) => str_repeat('⭐', $state)),
                Tables\Columns\TextColumn::make('title')->label(__('admin.review.title'))->limit(40),
                Tables\Columns\TextColumn::make('vehicle.brand')->label(__('admin.review.vehicle'))
                    ->formatStateUsing(fn ($record) => $record->vehicle ? "{$record->vehicle->brand} {$record->vehicle->model}" : '—'),
                Tables\Columns\IconColumn::make('is_approved')->label(__('admin.review.approved'))->boolean(),
                Tables\Columns\IconColumn::make('is_featured')->label('⭐')->boolean(),
                Tables\Columns\TextColumn::make('created_at')->label(__('admin.review.date'))
                    ->dateTime('d.m.Y')->sortable(),
            ])
            ->defaultSort('created_at', 'desc')
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\Action::make('approve')
                    ->label(__('admin.review.action_approve'))
                    ->icon('heroicon-o-check')
                    ->color('success')
                    ->action(fn (Review $record) => $record->update(['is_approved' => true]))
                    ->visible(fn (Review $record) => ! $record->is_approved),
                Tables\Actions\Action::make('reject')
                    ->label(__('admin.review.action_reject'))
                    ->icon('heroicon-o-x-mark')
                    ->color('danger')
                    ->action(fn (Review $record) => $record->delete())
                    ->requiresConfirmation(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                    Tables\Actions\BulkAction::make('approve_all')
                        ->label(__('admin.review.action_approve_all'))
                        ->action(fn ($records) => $records->each->update(['is_approved' => true]))
                        ->deselectRecordsAfterCompletion(),
                ]),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListReviews::route('/'),
            'edit' => Pages\EditReview::route('/{record}/edit'),
        ];
    }
}
