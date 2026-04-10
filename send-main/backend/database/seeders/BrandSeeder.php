<?php

namespace Database\Seeders;

use App\Models\Brand;
use Illuminate\Database\Seeder;

class BrandSeeder extends Seeder
{
    public function run(): void
    {
        $brands = [
            [
                'name' => 'Walmart',
                'slug' => 'walmart',
                'primary_color' => '#0071CE',
                'secondary_color' => '#FFC220',
                'font_family' => 'Bogle, Helvetica Neue, Helvetica, Arial, sans-serif',
                'theme_config' => [
                    'header_bg' => '#0071CE',
                    'button_radius' => '4px',
                    'card_shadow' => '0 2px 8px rgba(0,0,0,0.08)',
                    'accent' => '#FFC220',
                    'text_primary' => '#2E2F32',
                    'text_secondary' => '#6D6E71',
                    'bg_light' => '#F2F8FD',
                    'success' => '#2A8703',
                    'error' => '#DE1C24',
                ],
                'kyc_fields' => ['first_name', 'last_name', 'email', 'phone', 'date_of_birth', 'address', 'document_type', 'document_front', 'selfie'],
                'is_active' => true,
            ],
            [
                'name' => 'Amazon',
                'slug' => 'amazon',
                'primary_color' => '#232F3E',
                'secondary_color' => '#FF9900',
                'font_family' => 'Amazon Ember, Arial, sans-serif',
                'theme_config' => [
                    'header_bg' => '#232F3E',
                    'button_radius' => '8px',
                    'card_shadow' => '0 2px 5px 0 rgba(213,217,217,.5)',
                    'accent' => '#FF9900',
                    'text_primary' => '#0F1111',
                    'text_secondary' => '#565959',
                    'bg_light' => '#EAEDED',
                    'success' => '#067D62',
                    'error' => '#CC0C39',
                    'link' => '#007185',
                    'border' => '#D5D9D9',
                ],
                'kyc_fields' => ['first_name', 'last_name', 'email', 'phone', 'date_of_birth', 'nationality', 'address', 'document_type', 'document_front', 'document_back', 'selfie'],
                'is_active' => true,
            ],
            [
                'name' => 'DPD',
                'slug' => 'dpd',
                'primary_color' => '#DC0032',
                'secondary_color' => '#414042',
                'font_family' => 'PlutoSans, Helvetica Neue, Helvetica, Arial, sans-serif',
                'theme_config' => [
                    'header_bg' => '#DC0032',
                    'button_radius' => '6px',
                    'card_shadow' => '0 1px 3px rgba(0,0,0,0.12)',
                    'accent' => '#DC0032',
                    'text_primary' => '#414042',
                    'text_secondary' => '#6D6E71',
                    'bg_light' => '#F5F5F5',
                    'success' => '#4CAF50',
                    'error' => '#DC0032',
                    'border' => '#E0E0E0',
                ],
                'kyc_fields' => ['first_name', 'last_name', 'email', 'phone', 'address', 'document_type', 'document_front'],
                'is_active' => true,
            ],
            [
                'name' => 'DHL',
                'slug' => 'dhl',
                'primary_color' => '#FFCC00',
                'secondary_color' => '#D40511',
                'font_family' => 'Delivery, Verdana, Arial, sans-serif',
                'theme_config' => [
                    'header_bg' => '#FFCC00',
                    'header_text' => '#D40511',
                    'button_radius' => '0px',
                    'card_shadow' => '0 2px 4px rgba(0,0,0,0.1)',
                    'accent' => '#D40511',
                    'text_primary' => '#333333',
                    'text_secondary' => '#666666',
                    'bg_light' => '#FFFBEB',
                    'success' => '#69B826',
                    'error' => '#D40511',
                    'border' => '#CCCCCC',
                ],
                'kyc_fields' => ['first_name', 'last_name', 'email', 'phone', 'address', 'document_type', 'document_front', 'document_back'],
                'is_active' => true,
            ],
        ];

        foreach ($brands as $brand) {
            Brand::updateOrCreate(['slug' => $brand['slug']], $brand);
        }
    }
}
