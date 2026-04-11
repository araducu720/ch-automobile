<?php

namespace App\Filament\Resources;

use App\Filament\Resources\BlogPostResource\Pages;
use App\Models\BlogPost;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Concerns\Translatable;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class BlogPostResource extends Resource
{
    use Translatable;

    protected static ?string $model = BlogPost::class;

    protected static ?string $navigationIcon = 'heroicon-o-document-text';

    protected static ?int $navigationSort = 1;

    public static function getNavigationGroup(): ?string
    {
        return __('admin.nav.content');
    }

    public static function getNavigationLabel(): string
    {
        return __('admin.blog_post.nav');
    }

    public static function getModelLabel(): string
    {
        return __('admin.blog_post.label');
    }

    public static function getPluralModelLabel(): string
    {
        return __('admin.blog_post.plural');
    }

    public static function form(Form $form): Form
    {
        return $form->schema([
            Forms\Components\Section::make(__('admin.blog_post.section_post'))->columns(2)->schema([
                Forms\Components\TextInput::make('title')->label(__('admin.blog_post.title'))->required()->maxLength(255),
                Forms\Components\Select::make('category_id')->label(__('admin.blog_post.category'))
                    ->relationship('category', 'name')
                    ->createOptionForm([
                        Forms\Components\TextInput::make('name')->label('Name')->required(),
                    ]),
                Forms\Components\Textarea::make('excerpt')->label(__('admin.blog_post.excerpt'))->rows(3)->columnSpanFull(),
                Forms\Components\RichEditor::make('content')->label(__('admin.blog_post.content'))
                    ->required()->columnSpanFull()
                    ->toolbarButtons([
                        'bold', 'italic', 'underline', 'strike', 'link',
                        'h2', 'h3', 'bulletList', 'orderedList',
                        'blockquote', 'codeBlock', 'attachFiles',
                    ]),
            ]),
            Forms\Components\Section::make(__('admin.blog_post.section_image_publish'))->columns(2)->schema([
                Forms\Components\SpatieMediaLibraryFileUpload::make('featured_image')
                    ->label(__('admin.blog_post.featured_image'))->collection('featured_image')
                    ->image()->imageEditor(),
                Forms\Components\Group::make()->schema([
                    Forms\Components\Toggle::make('is_published')->label(__('admin.blog_post.published')),
                    Forms\Components\DateTimePicker::make('published_at')->label(__('admin.blog_post.publish_date'))
                        ->default(now()),
                    Forms\Components\Select::make('author_id')->label(__('admin.blog_post.author'))
                        ->relationship('author', 'name')->required()->default(auth()->id()),
                ]),
            ]),
            Forms\Components\Section::make('SEO')->collapsed()->columns(2)->schema([
                Forms\Components\TextInput::make('meta_title')->label(__('admin.blog_post.meta_title')),
                Forms\Components\Textarea::make('meta_description')->label(__('admin.blog_post.meta_description'))->rows(2),
            ]),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\SpatieMediaLibraryImageColumn::make('featured_image')
                    ->label(__('admin.blog_post.image'))->collection('featured_image')->conversion('thumbnail')
                    ->width(80)->height(50),
                Tables\Columns\TextColumn::make('title')->label(__('admin.blog_post.title'))->searchable()->sortable()->limit(50),
                Tables\Columns\TextColumn::make('category.name')->label(__('admin.blog_post.category'))->sortable(),
                Tables\Columns\TextColumn::make('author.name')->label(__('admin.blog_post.author')),
                Tables\Columns\IconColumn::make('is_published')->label(__('admin.blog_post.published'))->boolean(),
                Tables\Columns\TextColumn::make('published_at')->label(__('admin.blog_post.date'))
                    ->dateTime('d.m.Y')->sortable(),
                Tables\Columns\TextColumn::make('views_count')->label(__('admin.blog_post.views'))->sortable(),
            ])
            ->defaultSort('created_at', 'desc')
            ->actions([Tables\Actions\EditAction::make()])
            ->bulkActions([Tables\Actions\BulkActionGroup::make([Tables\Actions\DeleteBulkAction::make()])]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListBlogPosts::route('/'),
            'create' => Pages\CreateBlogPost::route('/create'),
            'edit' => Pages\EditBlogPost::route('/{record}/edit'),
        ];
    }
}
