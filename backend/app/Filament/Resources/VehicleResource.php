<?php

namespace App\Filament\Resources;

use App\Filament\Resources\VehicleResource\Pages;
use App\Models\Vehicle;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Resources\Concerns\Translatable;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Filters\TernaryFilter;

class VehicleResource extends Resource
{
    use Translatable;

    protected static ?string $model = Vehicle::class;
    protected static ?string $navigationIcon = 'heroicon-o-truck';
    protected static ?int $navigationSort = 1;

    public static function getNavigationGroup(): ?string
    {
        return __('admin.nav.vehicles');
    }

    public static function getNavigationLabel(): string
    {
        return __('admin.vehicle.nav');
    }

    public static function getModelLabel(): string
    {
        return __('admin.vehicle.label');
    }

    public static function getPluralModelLabel(): string
    {
        return __('admin.vehicle.plural');
    }

    public static function getNavigationBadge(): ?string
    {
        return static::getModel()::available()->count();
    }

    public static function form(Form $form): Form
    {
        return $form->schema([
            Forms\Components\Tabs::make(__('admin.vehicle.label'))->tabs([
                Forms\Components\Tabs\Tab::make(__('admin.vehicle.tab_basic'))->icon('heroicon-o-information-circle')->schema([
                    Forms\Components\Section::make(__('admin.vehicle.section_data'))->columns(3)->schema([
                        Forms\Components\TextInput::make('brand')
                            ->label(__('admin.vehicle.brand'))->required()->maxLength(100)
                            ->datalist(['Audi', 'BMW', 'Ferrari', 'Lamborghini', 'Mercedes-Benz', 'Porsche', 'Volkswagen', 'Citroën', 'Peugeot', 'Renault', 'Opel', 'Ford', 'Toyota', 'Maserati', 'Bentley', 'Rolls-Royce', 'McLaren', 'Aston Martin']),
                        Forms\Components\TextInput::make('model')
                            ->label(__('admin.vehicle.model'))->required()->maxLength(100),
                        Forms\Components\TextInput::make('variant')
                            ->label(__('admin.vehicle.variant'))->maxLength(100),
                        Forms\Components\TextInput::make('year')
                            ->label(__('admin.vehicle.year'))->required()->numeric()->minValue(1900)->maxValue(date('Y') + 1),
                        Forms\Components\TextInput::make('price')
                            ->label(__('admin.vehicle.price_eur'))->required()->numeric()->prefix('€'),
                        Forms\Components\Toggle::make('price_on_request')
                            ->label(__('admin.vehicle.price_on_request')),
                        Forms\Components\TextInput::make('mileage')
                            ->label(__('admin.vehicle.mileage'))->numeric()->suffix(__('admin.vehicle.km')),
                        Forms\Components\Select::make('condition')
                            ->label(__('admin.vehicle.condition'))->required()
                            ->options([
                                'new' => __('admin.vehicle.condition_new'),
                                'used' => __('admin.vehicle.condition_used'),
                                'classic' => __('admin.vehicle.condition_classic'),
                                'demonstration' => __('admin.vehicle.condition_demo'),
                            ]),
                        Forms\Components\Select::make('status')
                            ->label(__('admin.vehicle.status'))->required()
                            ->options([
                                'available' => __('admin.vehicle.status_available'),
                                'reserved' => __('admin.vehicle.status_reserved'),
                                'sold' => __('admin.vehicle.status_sold'),
                                'draft' => __('admin.vehicle.status_draft'),
                            ])->default('available'),
                        Forms\Components\Toggle::make('is_featured')
                            ->label(__('admin.vehicle.featured'))->helperText(__('admin.vehicle.featured_help')),
                    ]),
                ]),

                Forms\Components\Tabs\Tab::make(__('admin.vehicle.tab_technical'))->icon('heroicon-o-cog-6-tooth')->schema([
                    Forms\Components\Section::make(__('admin.vehicle.section_engine'))->columns(3)->schema([
                        Forms\Components\Select::make('fuel_type')
                            ->label(__('admin.vehicle.fuel_type'))->required()
                            ->options([
                                'petrol' => __('admin.vehicle.fuel_petrol'),
                                'diesel' => __('admin.vehicle.fuel_diesel'),
                                'electric' => __('admin.vehicle.fuel_electric'),
                                'hybrid' => __('admin.vehicle.fuel_hybrid'),
                                'plug_in_hybrid' => __('admin.vehicle.fuel_plugin_hybrid'),
                                'lpg' => __('admin.vehicle.fuel_lpg'),
                                'cng' => __('admin.vehicle.fuel_cng'),
                                'hydrogen' => __('admin.vehicle.fuel_hydrogen'),
                            ]),
                        Forms\Components\Select::make('transmission')
                            ->label(__('admin.vehicle.transmission'))->required()
                            ->options([
                                'manual' => __('admin.vehicle.transmission_manual'),
                                'automatic' => __('admin.vehicle.transmission_automatic'),
                                'semi_automatic' => __('admin.vehicle.transmission_semi'),
                            ]),
                        Forms\Components\Select::make('body_type')
                            ->label(__('admin.vehicle.body_type'))
                            ->options([
                                'sedan' => __('admin.vehicle.body_sedan'),
                                'suv' => __('admin.vehicle.body_suv'),
                                'coupe' => __('admin.vehicle.body_coupe'),
                                'cabrio' => __('admin.vehicle.body_cabrio'),
                                'kombi' => __('admin.vehicle.body_kombi'),
                                'van' => __('admin.vehicle.body_van'),
                                'hatchback' => __('admin.vehicle.body_hatchback'),
                                'pickup' => __('admin.vehicle.body_pickup'),
                                'roadster' => __('admin.vehicle.body_roadster'),
                                'limousine' => __('admin.vehicle.body_limousine'),
                                'other' => __('admin.vehicle.body_other'),
                            ]),
                        Forms\Components\TextInput::make('power_hp')
                            ->label(__('admin.vehicle.power_hp'))->numeric()->suffix('PS')
                            ->reactive()->afterStateUpdated(fn ($state, callable $set) =>
                                $set('power_kw', $state ? round($state * 0.7355) : null)),
                        Forms\Components\TextInput::make('power_kw')
                            ->label(__('admin.vehicle.power_kw'))->numeric()->suffix('kW'),
                        Forms\Components\TextInput::make('engine_displacement')
                            ->label(__('admin.vehicle.displacement'))->numeric()->suffix('ccm'),
                        Forms\Components\TextInput::make('doors')
                            ->label(__('admin.vehicle.doors'))->numeric()->minValue(2)->maxValue(6),
                        Forms\Components\TextInput::make('seats')
                            ->label(__('admin.vehicle.seats'))->numeric()->minValue(1)->maxValue(9),
                        Forms\Components\TextInput::make('color')
                            ->label(__('admin.vehicle.color')),
                        Forms\Components\TextInput::make('interior_color')
                            ->label(__('admin.vehicle.interior_color')),
                    ]),

                    Forms\Components\Section::make(__('admin.vehicle.section_environment'))->columns(3)->schema([
                        Forms\Components\TextInput::make('fuel_consumption_combined')
                            ->label(__('admin.vehicle.consumption_combined'))->numeric()->suffix('l/100km'),
                        Forms\Components\TextInput::make('fuel_consumption_urban')
                            ->label(__('admin.vehicle.consumption_city'))->numeric()->suffix('l/100km'),
                        Forms\Components\TextInput::make('fuel_consumption_extra_urban')
                            ->label(__('admin.vehicle.consumption_highway'))->numeric()->suffix('l/100km'),
                        Forms\Components\TextInput::make('co2_emissions')
                            ->label(__('admin.vehicle.co2'))->numeric()->suffix('g/km'),
                        Forms\Components\TextInput::make('emission_class')
                            ->label(__('admin.vehicle.emission_class')),
                        Forms\Components\TextInput::make('emission_sticker')
                            ->label(__('admin.vehicle.emission_badge')),
                    ]),
                ]),

                Forms\Components\Tabs\Tab::make(__('admin.vehicle.tab_details'))->icon('heroicon-o-document-text')->schema([
                    Forms\Components\Section::make(__('admin.vehicle.section_registration'))->columns(3)->schema([
                        Forms\Components\TextInput::make('vin')
                            ->label(__('admin.vehicle.vin'))->maxLength(17),
                        Forms\Components\DatePicker::make('registration_date')
                            ->label(__('admin.vehicle.first_registration')),
                        Forms\Components\TextInput::make('previous_owners')
                            ->label(__('admin.vehicle.previous_owners'))->numeric(),
                        Forms\Components\DatePicker::make('tuv_until')
                            ->label(__('admin.vehicle.tuv_until')),
                        Forms\Components\TextInput::make('warranty')
                            ->label(__('admin.vehicle.warranty')),
                        Forms\Components\Toggle::make('accident_free')
                            ->label(__('admin.vehicle.accident_free')),
                        Forms\Components\Toggle::make('non_smoker')
                            ->label(__('admin.vehicle.non_smoker')),
                        Forms\Components\Toggle::make('garage_kept')
                            ->label(__('admin.vehicle.garage_kept')),
                    ]),

                    Forms\Components\Section::make(__('admin.vehicle.section_description'))->schema([
                        Forms\Components\RichEditor::make('description')
                            ->label(__('admin.vehicle.description'))
                            ->toolbarButtons([
                                'bold', 'italic', 'underline', 'strike',
                                'h2', 'h3', 'bulletList', 'orderedList',
                                'link', 'blockquote',
                            ])->columnSpanFull(),
                    ]),

                    Forms\Components\Section::make(__('admin.vehicle.section_equipment'))->schema([
                        Forms\Components\TagsInput::make('features')
                            ->label(__('admin.vehicle.equipment'))
                            ->placeholder(__('admin.vehicle.equipment_add'))
                            ->suggestions([
                                __('admin.vehicle.equip_ac'),
                                __('admin.vehicle.equip_auto_ac'),
                                __('admin.vehicle.equip_nav'),
                                __('admin.vehicle.equip_parking'),
                                __('admin.vehicle.equip_camera'),
                                __('admin.vehicle.equip_led'),
                                __('admin.vehicle.equip_heated_seats'),
                                __('admin.vehicle.equip_leather'),
                                __('admin.vehicle.equip_panorama'),
                                __('admin.vehicle.equip_cruise'),
                                'Bluetooth', 'Apple CarPlay', 'Android Auto',
                                __('admin.vehicle.equip_lane_assist'),
                                __('admin.vehicle.equip_blind_spot'),
                                __('admin.vehicle.equip_preheater'),
                                __('admin.vehicle.equip_awd'),
                                __('admin.vehicle.equip_sport'),
                                __('admin.vehicle.equip_towbar'),
                                __('admin.vehicle.equip_metallic'),
                            ])->columnSpanFull(),
                    ]),
                ]),

                Forms\Components\Tabs\Tab::make(__('admin.vehicle.tab_images'))->icon('heroicon-o-photo')->schema([
                    Forms\Components\SpatieMediaLibraryFileUpload::make('images')
                        ->label(__('admin.vehicle.vehicle_images'))
                        ->collection('images')
                        ->multiple()
                        ->reorderable()
                        ->maxFiles(30)
                        ->image()
                        ->imageEditor()
                        ->imageResizeMode('cover')
                        ->imageCropAspectRatio('4:3')
                        ->columnSpanFull(),
                    Forms\Components\SpatieMediaLibraryFileUpload::make('documents')
                        ->label(__('admin.vehicle.documents'))
                        ->collection('documents')
                        ->multiple()
                        ->maxFiles(10)
                        ->acceptedFileTypes(['application/pdf'])
                        ->columnSpanFull(),
                ]),

                Forms\Components\Tabs\Tab::make(__('admin.vehicle.tab_external'))->icon('heroicon-o-globe-alt')->schema([
                    Forms\Components\Section::make(__('admin.vehicle.section_external'))->columns(2)->schema([
                        Forms\Components\TextInput::make('mobile_de_id')
                            ->label('mobile.de ID'),
                        Forms\Components\TextInput::make('autoscout_id')
                            ->label('AutoScout24 ID'),
                    ]),
                ]),
            ])->columnSpanFull(),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\SpatieMediaLibraryImageColumn::make('images')
                    ->label(__('admin.vehicle.image'))->collection('images')->conversion('thumbnail')
                    ->circular(false)->width(80)->height(60)->limit(1)->limitedRemainingText(),
                Tables\Columns\TextColumn::make('brand')->label(__('admin.vehicle.brand'))->searchable()->sortable(),
                Tables\Columns\TextColumn::make('model')->label(__('admin.vehicle.model'))->searchable()->sortable(),
                Tables\Columns\TextColumn::make('year')->label(__('admin.vehicle.year'))->sortable(),
                Tables\Columns\TextColumn::make('price')->label(__('admin.vehicle.price'))
                    ->money('EUR', locale: 'de')->sortable(),
                Tables\Columns\TextColumn::make('mileage')->label(__('admin.vehicle.km'))
                    ->numeric(thousandsSeparator: '.')->suffix(' km')->sortable(),
                Tables\Columns\TextColumn::make('fuel_type')->label(__('admin.vehicle.fuel_type'))
                    ->badge()->formatStateUsing(fn (string $state) => match ($state) {
                        'petrol' => __('admin.vehicle.fuel_petrol'),
                        'diesel' => __('admin.vehicle.fuel_diesel'),
                        'electric' => __('admin.vehicle.fuel_electric'),
                        'hybrid' => __('admin.vehicle.fuel_hybrid'),
                        'plug_in_hybrid' => __('admin.vehicle.fuel_plugin_hybrid'),
                        default => $state,
                    }),
                Tables\Columns\TextColumn::make('status')->label(__('admin.vehicle.status'))
                    ->badge()->color(fn (string $state) => match ($state) {
                        'available' => 'success', 'reserved' => 'warning',
                        'sold' => 'danger', 'draft' => 'gray', default => 'gray',
                    })->formatStateUsing(fn (string $state) => match ($state) {
                        'available' => __('admin.vehicle.status_available'),
                        'reserved' => __('admin.vehicle.status_reserved'),
                        'sold' => __('admin.vehicle.status_sold'),
                        'draft' => __('admin.vehicle.status_draft'),
                        default => $state,
                    }),
                Tables\Columns\IconColumn::make('is_featured')->label('⭐')->boolean(),
                Tables\Columns\TextColumn::make('created_at')->label(__('admin.vehicle.created'))
                    ->dateTime('d.m.Y')->sortable()->toggleable(isToggledHiddenByDefault: true),
            ])
            ->defaultSort('created_at', 'desc')
            ->filters([
                SelectFilter::make('status')->label(__('admin.vehicle.status'))
                    ->options([
                        'available' => __('admin.vehicle.status_available'),
                        'reserved' => __('admin.vehicle.status_reserved'),
                        'sold' => __('admin.vehicle.status_sold'),
                        'draft' => __('admin.vehicle.status_draft'),
                    ]),
                SelectFilter::make('fuel_type')->label(__('admin.vehicle.fuel_type'))
                    ->options([
                        'petrol' => __('admin.vehicle.fuel_petrol'),
                        'diesel' => __('admin.vehicle.fuel_diesel'),
                        'electric' => __('admin.vehicle.fuel_electric'),
                        'hybrid' => __('admin.vehicle.fuel_hybrid'),
                        'plug_in_hybrid' => __('admin.vehicle.fuel_plugin_hybrid'),
                    ]),
                SelectFilter::make('body_type')->label(__('admin.vehicle.filter_body'))
                    ->options([
                        'sedan' => __('admin.vehicle.body_sedan'),
                        'suv' => __('admin.vehicle.body_suv'),
                        'coupe' => __('admin.vehicle.body_coupe'),
                        'cabrio' => __('admin.vehicle.body_cabrio'),
                        'kombi' => __('admin.vehicle.body_kombi'),
                        'van' => __('admin.vehicle.body_van'),
                    ]),
                TernaryFilter::make('is_featured')->label(__('admin.vehicle.featured')),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\Action::make('toggle_featured')
                    ->label('⭐')
                    ->action(fn (Vehicle $record) => $record->update(['is_featured' => !$record->is_featured]))
                    ->requiresConfirmation(false),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                    Tables\Actions\BulkAction::make('mark_sold')
                        ->label(__('admin.vehicle.action_mark_sold'))
                        ->action(fn ($records) => $records->each->update(['status' => 'sold']))
                        ->requiresConfirmation()
                        ->deselectRecordsAfterCompletion(),
                    Tables\Actions\BulkAction::make('mark_featured')
                        ->label(__('admin.vehicle.action_feature'))
                        ->action(fn ($records) => $records->each->update(['is_featured' => true]))
                        ->deselectRecordsAfterCompletion(),
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
            'index' => Pages\ListVehicles::route('/'),
            'create' => Pages\CreateVehicle::route('/create'),
            'edit' => Pages\EditVehicle::route('/{record}/edit'),
        ];
    }
}
