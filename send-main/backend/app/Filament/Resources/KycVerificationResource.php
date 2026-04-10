<?php

namespace App\Filament\Resources;

use App\Filament\Resources\KycVerificationResource\Pages;
use App\Models\KycVerification;
use App\Events\KycStatusUpdated;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Tables\Filters\SelectFilter;
use Filament\Infolists;
use Filament\Infolists\Infolist;
use Filament\Notifications\Notification;

class KycVerificationResource extends Resource
{
    protected static ?string $model = KycVerification::class;
    protected static ?string $navigationIcon = 'heroicon-o-identification';
    protected static ?string $navigationGroup = 'KYC Management';
    protected static ?int $navigationSort = 1;
    protected static ?string $recordTitleAttribute = 'email';

    public static function form(Form $form): Form
    {
        return $form->schema([
            Forms\Components\Section::make('Personal Information')->schema([
                Forms\Components\Select::make('brand_id')
                    ->relationship('brand', 'name')
                    ->required()
                    ->searchable(),
                Forms\Components\TextInput::make('first_name')->required()->maxLength(255),
                Forms\Components\TextInput::make('last_name')->required()->maxLength(255),
                Forms\Components\TextInput::make('email')->email()->required()->maxLength(255),
                Forms\Components\TextInput::make('phone')->tel()->maxLength(20),
                Forms\Components\DatePicker::make('date_of_birth')->maxDate(now()),
                Forms\Components\TextInput::make('nationality')->maxLength(100),
            ])->columns(2),

            Forms\Components\Section::make('Address')->schema([
                Forms\Components\TextInput::make('address_line_1')->maxLength(500),
                Forms\Components\TextInput::make('address_line_2')->maxLength(500),
                Forms\Components\TextInput::make('city')->maxLength(255),
                Forms\Components\TextInput::make('state')->maxLength(255),
                Forms\Components\TextInput::make('postal_code')->maxLength(20),
                Forms\Components\TextInput::make('country')->maxLength(100),
            ])->columns(2),

            Forms\Components\Section::make('Documents')->schema([
                Forms\Components\Select::make('document_type')
                    ->options([
                        'passport' => 'Passport',
                        'id_card' => 'ID Card',
                        'driving_license' => 'Driving License',
                    ]),
                Forms\Components\TextInput::make('document_number')->maxLength(100),
                Forms\Components\FileUpload::make('document_front_path')
                    ->label('Document Front')
                    ->disk('private')
                    ->directory('kyc/documents'),
                Forms\Components\FileUpload::make('document_back_path')
                    ->label('Document Back')
                    ->disk('private')
                    ->directory('kyc/documents'),
                Forms\Components\FileUpload::make('selfie_path')
                    ->label('Selfie')
                    ->disk('private')
                    ->directory('kyc/selfies'),
            ])->columns(2),

            Forms\Components\Section::make('Verification Status')->schema([
                Forms\Components\Select::make('status')
                    ->options([
                        'pending' => 'Pending',
                        'documents_uploaded' => 'Documents Uploaded',
                        'in_review' => 'In Review',
                        'approved' => 'Approved',
                        'rejected' => 'Rejected',
                        'additional_info_required' => 'Additional Info Required',
                    ])
                    ->required(),
                Forms\Components\Textarea::make('rejection_reason')
                    ->visible(fn (Forms\Get $get) => $get('status') === 'rejected'),
                Forms\Components\TextInput::make('confidence_score')
                    ->numeric()
                    ->disabled(),
            ])->columns(1),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('uuid')
                    ->label('ID')
                    ->limit(8)
                    ->copyable()
                    ->searchable(),
                Tables\Columns\TextColumn::make('brand.name')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'Walmart' => 'info',
                        'Amazon' => 'warning',
                        'DPD' => 'danger',
                        'DHL' => 'success',
                        default => 'gray',
                    })
                    ->sortable(),
                Tables\Columns\TextColumn::make('full_name')
                    ->label('Name')
                    ->searchable(['first_name', 'last_name']),
                Tables\Columns\TextColumn::make('email')->searchable(),
                Tables\Columns\TextColumn::make('document_type')
                    ->badge()
                    ->formatStateUsing(fn (string $state): string => str_replace('_', ' ', ucfirst($state))),
                Tables\Columns\TextColumn::make('status')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'pending' => 'gray',
                        'documents_uploaded' => 'info',
                        'in_review' => 'warning',
                        'approved' => 'success',
                        'rejected' => 'danger',
                        'additional_info_required' => 'warning',
                        default => 'gray',
                    }),
                Tables\Columns\TextColumn::make('confidence_score')
                    ->label('Score')
                    ->suffix('%')
                    ->color(fn (?string $state): string => match (true) {
                        $state === null => 'gray',
                        (float) $state >= 80 => 'success',
                        (float) $state >= 50 => 'warning',
                        default => 'danger',
                    }),
                Tables\Columns\TextColumn::make('submitted_at')
                    ->dateTime('M d, Y H:i')
                    ->sortable(),
            ])
            ->defaultSort('created_at', 'desc')
            ->filters([
                SelectFilter::make('brand')
                    ->relationship('brand', 'name'),
                SelectFilter::make('status')
                    ->options([
                        'pending' => 'Pending',
                        'documents_uploaded' => 'Documents Uploaded',
                        'in_review' => 'In Review',
                        'approved' => 'Approved',
                        'rejected' => 'Rejected',
                        'additional_info_required' => 'Additional Info Required',
                    ]),
            ])
            ->actions([
                Tables\Actions\Action::make('approve')
                    ->icon('heroicon-o-check-circle')
                    ->color('success')
                    ->requiresConfirmation()
                    ->visible(fn (KycVerification $record) => !$record->isApproved())
                    ->action(function (KycVerification $record) {
                        $record->update([
                            'status' => 'approved',
                            'reviewed_at' => now(),
                            'reviewed_by' => auth()->id(),
                        ]);
                        broadcast(new KycStatusUpdated($record));
                        Notification::make()->title('KYC Approved')->success()->send();
                    }),
                Tables\Actions\Action::make('reject')
                    ->icon('heroicon-o-x-circle')
                    ->color('danger')
                    ->form([
                        Forms\Components\Textarea::make('rejection_reason')
                            ->required()
                            ->label('Reason for Rejection'),
                    ])
                    ->visible(fn (KycVerification $record) => !$record->isRejected())
                    ->action(function (KycVerification $record, array $data) {
                        $record->update([
                            'status' => 'rejected',
                            'rejection_reason' => $data['rejection_reason'],
                            'reviewed_at' => now(),
                            'reviewed_by' => auth()->id(),
                        ]);
                        broadcast(new KycStatusUpdated($record));
                        Notification::make()->title('KYC Rejected')->danger()->send();
                    }),
                Tables\Actions\ViewAction::make(),
                Tables\Actions\EditAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ])
            ->poll('10s');
    }

    public static function getRelations(): array
    {
        return [];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListKycVerifications::route('/'),
            'create' => Pages\CreateKycVerification::route('/create'),
            'view' => Pages\ViewKycVerification::route('/{record}'),
            'edit' => Pages\EditKycVerification::route('/{record}/edit'),
        ];
    }

    public static function getNavigationBadge(): ?string
    {
        return static::getModel()::whereIn('status', ['pending', 'documents_uploaded', 'in_review'])->count() ?: null;
    }

    public static function getNavigationBadgeColor(): ?string
    {
        return 'warning';
    }
}
