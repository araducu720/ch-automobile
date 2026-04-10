<?php

namespace App\Filament\Pages;

use Filament\Pages\Page;
use App\Models\KycVerification;
use Filament\Tables;
use Filament\Tables\Concerns\InteractsWithTable;
use Filament\Tables\Contracts\HasTable;
use Filament\Tables\Table;
use Filament\Tables\Filters\SelectFilter;
use Illuminate\Database\Eloquent\Builder;

class LiveKycPanel extends Page implements HasTable
{
    use InteractsWithTable;

    protected static ?string $navigationIcon = 'heroicon-o-signal';
    protected static ?string $navigationLabel = 'Live KYC Panel';
    protected static ?string $navigationGroup = 'KYC Management';
    protected static ?int $navigationSort = 0;
    protected static string $view = 'filament.pages.live-kyc-panel';

    public function table(Table $table): Table
    {
        return $table
            ->query(KycVerification::query()->with('brand')->latest())
            ->columns([
                Tables\Columns\TextColumn::make('uuid')
                    ->label('ID')
                    ->limit(8)
                    ->copyable(),
                Tables\Columns\TextColumn::make('brand.name')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'Walmart' => 'info',
                        'Amazon' => 'warning',
                        'DPD' => 'danger',
                        'DHL' => 'success',
                        default => 'gray',
                    }),
                Tables\Columns\TextColumn::make('full_name')
                    ->label('Name')
                    ->searchable(['first_name', 'last_name']),
                Tables\Columns\TextColumn::make('email'),
                Tables\Columns\TextColumn::make('status')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'pending' => 'gray',
                        'documents_uploaded' => 'info',
                        'in_review' => 'warning',
                        'approved' => 'success',
                        'rejected' => 'danger',
                        default => 'gray',
                    }),
                Tables\Columns\TextColumn::make('confidence_score')
                    ->suffix('%'),
                Tables\Columns\TextColumn::make('created_at')
                    ->since()
                    ->sortable(),
            ])
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
                    ]),
            ])
            ->poll('5s');
    }
}
