<?php

namespace App\Filament\Widgets;

use App\Models\Brand;
use App\Models\KycVerification;
use Filament\Widgets\ChartWidget;

class BrandActivityWidget extends ChartWidget
{
    protected static ?string $heading = 'KYC Activity by Brand';
    protected static ?int $sort = 3;
    protected int | string | array $columnSpan = 'full';

    protected function getData(): array
    {
        $brands = Brand::withCount(['kycVerifications'])->get();

        return [
            'datasets' => [
                [
                    'label' => 'KYC Verifications',
                    'data' => $brands->pluck('kyc_verifications_count')->toArray(),
                    'backgroundColor' => $brands->pluck('primary_color')->toArray(),
                ],
            ],
            'labels' => $brands->pluck('name')->toArray(),
        ];
    }

    protected function getType(): string
    {
        return 'bar';
    }
}
