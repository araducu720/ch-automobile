<?php

namespace App\Filament\Resources;

use App\Filament\Resources\BlogCategoryResource\Pages;
use App\Models\BlogCategory;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Resources\Concerns\Translatable;
use Filament\Tables;
use Filament\Tables\Table;

class BlogCategoryResource extends Resource
{
    use Translatable;

    protected static ?string $model = BlogCategory::class;
    protected static ?string $navigationIcon = 'heroicon-o-tag';
    protected static ?int $navigationSort = 2;

    public static function getNavigationGroup(): ?string
    {
        return __('admin.nav.content');
    }

    public static function getNavigationLabel(): string
    {
        return __('admin.blog_category.nav');
    }

    public static function getModelLabel(): string
    {
        return __('admin.blog_category.label');
    }

    public static function getPluralModelLabel(): string
    {
        return __('admin.blog_category.plural');
    }

    public static function form(Form $form): Form
    {
        return $form->schema([
            Forms\Components\Section::make(__('admin.blog_category.section_category'))->columns(2)->schema([
                Forms\Components\TextInput::make('name')
                    ->label('Name')
                    ->required()
                    ->maxLength(255),
                Forms\Components\TextInput::make('slug')
                    ->label('Slug')
                    ->disabled()
                    ->dehydrated(false)
                    ->helperText(__('admin.blog_category.slug_auto')),
                Forms\Components\TextInput::make('sort_order')
                    ->label(__('admin.blog_category.sort_order'))
                    ->numeric()
                    ->default(0)
                    ->minValue(0),
            ]),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->label('Name')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('slug')
                    ->label('Slug')
                    ->color('gray'),
                Tables\Columns\TextColumn::make('posts_count')
                    ->label(__('admin.blog_category.posts_count'))
                    ->counts('posts')
                    ->sortable(),
                Tables\Columns\TextColumn::make('sort_order')
                    ->label(__('admin.blog_category.sort_order'))
                    ->sortable(),
                Tables\Columns\TextColumn::make('created_at')
                    ->label(__('admin.blog_category.created'))
                    ->dateTime('d.m.Y')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->defaultSort('sort_order')
            ->filters([])
            ->actions([
                Tables\Actions\EditAction::make(),
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
            'index' => Pages\ListBlogCategories::route('/'),
            'create' => Pages\CreateBlogCategory::route('/create'),
            'edit' => Pages\EditBlogCategory::route('/{record}/edit'),
        ];
    }
}
