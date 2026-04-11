<?php

namespace Database\Seeders;

use App\Models\BlogCategory;
use App\Models\BlogPost;
use App\Models\CompanySetting;
use App\Models\Review;
use App\Models\User;
use App\Models\Vehicle;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Create admin role
        Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);

        // Admin User
        $admin = User::firstOrCreate(
            ['email' => env('ADMIN_EMAIL', 'admin@ch-automobile.de')],
            [
                'name' => env('ADMIN_NAME', 'C-H Admin'),
                'password' => Hash::make(env('ADMIN_PASSWORD', 'password')),
                'email_verified_at' => now(),
            ]
        );

        // Assign admin role
        if (! $admin->hasRole('admin')) {
            $admin->assignRole('admin');
        }

        // Company Settings
        CompanySetting::firstOrCreate(['id' => 1], [
            'company_name' => 'C-H Automobile & Exclusive Cars',
            'street' => 'Straßheimer Str. 67-69',
            'city' => 'Friedberg (Hessen)',
            'postal_code' => '61169',
            'country' => 'Germany',
            'phone' => '+49 1517 5606841',
            'email' => 'info@ch-automobile.de',
            'website' => 'https://www.ch-automobile.de',
            'latitude' => 50.3345,
            'longitude' => 8.7548,
            'facebook_url' => 'https://www.facebook.com/ch.automobile.exclusive',
            'whatsapp_number' => '+4915175606841',
            'opening_hours' => [
                'monday' => ['09:00', '18:00'],
                'tuesday' => ['09:00', '18:00'],
                'wednesday' => ['09:00', '18:00'],
                'thursday' => ['09:00', '18:00'],
                'friday' => ['09:00', '18:00'],
                'saturday' => ['10:00', '14:00'],
                'sunday' => null,
            ],
            'bank_name' => 'Sparkasse Oberhessen',
            'bank_iban' => 'DE89 3704 0044 0532 0130 00',
            'bank_bic' => 'COBADEFFXXX',
            'bank_account_holder' => 'C-H Automobile & Exclusive Cars',
            'imprint' => [
                'de' => '<h2>Impressum</h2><p>C-H Automobile & Exclusive Cars<br>Straßheimer Str. 67-69<br>61169 Friedberg (Hessen)<br>Deutschland</p><p>Telefon: +49 1517 5606841<br>E-Mail: info@ch-automobile.de</p>',
                'en' => '<h2>Legal Notice</h2><p>C-H Automobile & Exclusive Cars<br>Straßheimer Str. 67-69<br>61169 Friedberg (Hessen)<br>Germany</p><p>Phone: +49 1517 5606841<br>Email: info@ch-automobile.de</p>',
            ],
            'meta_title' => [
                'de' => 'C-H Automobile & Exclusive Cars | Gebrauchtwagen in Friedberg',
                'en' => 'C-H Automobile & Exclusive Cars | Used Cars in Friedberg, Germany',
            ],
            'meta_description' => [
                'de' => 'Ihr Autohaus für exklusive Gebrauchtwagen in Friedberg. Ferrari, Porsche, Mercedes und mehr. Finanzierung, Inzahlungnahme und erstklassiger Service.',
                'en' => 'Your dealership for exclusive used cars in Friedberg, Germany. Ferrari, Porsche, Mercedes and more. Financing, trade-in and first-class service.',
            ],
        ]);

        // Demo Vehicles
        $vehicles = [
            [
                'brand' => 'Ferrari', 'model' => 'Purosangue', 'variant' => 'V12',
                'year' => 2025, 'price' => 425000, 'mileage' => 1200,
                'fuel_type' => 'petrol', 'transmission' => 'automatic', 'power_hp' => 725,
                'power_kw' => 533, 'body_type' => 'suv', 'condition' => 'used',
                'color' => 'Rosso Corsa', 'interior_color' => 'Nero', 'doors' => 4, 'seats' => 4,
                'is_featured' => true, 'status' => 'available',
                'description' => ['de' => 'Exklusiver Ferrari Purosangue V12 in Rosso Corsa. Vollausstattung mit Carbon-Paket.', 'en' => 'Exclusive Ferrari Purosangue V12 in Rosso Corsa. Full options with carbon package.'],
                'features' => ['Carbon-Keramikbremsen', 'Panoramadach', 'Burmester Sound', 'Rückfahrkamera', 'LED Matrix'],
            ],
            [
                'brand' => 'Porsche', 'model' => '911', 'variant' => 'Carrera S',
                'year' => 2023, 'price' => 159900, 'mileage' => 12000,
                'fuel_type' => 'petrol', 'transmission' => 'automatic', 'power_hp' => 450,
                'power_kw' => 331, 'body_type' => 'coupe', 'condition' => 'used',
                'color' => 'GT-Silber Metallic', 'interior_color' => 'Schwarz', 'doors' => 2, 'seats' => 4,
                'is_featured' => true, 'status' => 'available',
                'description' => ['de' => 'Porsche 911 Carrera S in GT-Silber mit Sport Chrono Paket und PASM.', 'en' => 'Porsche 911 Carrera S in GT Silver with Sport Chrono package and PASM.'],
                'features' => ['Sport Chrono', 'PASM', 'Sportabgasanlage', 'Bose Sound', 'LED Matrix'],
            ],
            [
                'brand' => 'Mercedes-Benz', 'model' => 'AMG GT', 'variant' => '63 S 4MATIC+',
                'year' => 2024, 'price' => 189500, 'mileage' => 5400,
                'fuel_type' => 'petrol', 'transmission' => 'automatic', 'power_hp' => 639,
                'power_kw' => 470, 'body_type' => 'coupe', 'condition' => 'used',
                'color' => 'Selenitgrau Metallic', 'interior_color' => 'Nappa Schwarz/Rot', 'doors' => 2, 'seats' => 2,
                'is_featured' => true, 'status' => 'available',
                'description' => ['de' => 'Mercedes-AMG GT 63 S in Selenitgrau. V8 Biturbo mit Performance-Abgasanlage.', 'en' => 'Mercedes-AMG GT 63 S in Selenite Grey. V8 Biturbo with performance exhaust system.'],
                'features' => ['AMG Performance-Abgasanlage', 'AMG Ride Control+', 'Burmester 3D', 'Carbon-Paket', 'Head-Up Display'],
            ],
            [
                'brand' => 'BMW', 'model' => 'M4', 'variant' => 'Competition xDrive',
                'year' => 2023, 'price' => 89900, 'mileage' => 18000,
                'fuel_type' => 'petrol', 'transmission' => 'automatic', 'power_hp' => 510,
                'power_kw' => 375, 'body_type' => 'coupe', 'condition' => 'used',
                'color' => 'Frozen Portimao Blau', 'interior_color' => 'Merino Schwarz', 'doors' => 2, 'seats' => 4,
                'is_featured' => true, 'status' => 'available',
                'description' => ['de' => 'BMW M4 Competition xDrive in Frozen Portimao Blau. M Carbon Exterieur-Paket.', 'en' => 'BMW M4 Competition xDrive in Frozen Portimao Blue. M Carbon exterior package.'],
                'features' => ['M Carbon Exterieur', 'M Drivers Package', 'Harman Kardon', 'Laserlicht', 'Head-Up Display'],
            ],
            [
                'brand' => 'Citroën', 'model' => 'C5', 'variant' => 'Tourer Exclusive',
                'year' => 2015, 'price' => 2750, 'mileage' => 185000,
                'fuel_type' => 'diesel', 'transmission' => 'manual', 'power_hp' => 115,
                'power_kw' => 85, 'body_type' => 'kombi', 'condition' => 'used',
                'color' => 'Schwarz', 'interior_color' => 'Grau', 'doors' => 5, 'seats' => 5,
                'is_featured' => false, 'status' => 'available',
                'description' => ['de' => 'Citroën C5 Tourer Exclusive. Komfortables Reisefahrzeug mit Hydropneumatik.', 'en' => 'Citroën C5 Tourer Exclusive. Comfortable touring car with hydropneumatic suspension.'],
                'features' => ['Klimaautomatik', 'Navigationssystem', 'Einparkhilfe', 'Tempomat', 'Sitzheizung'],
            ],
            [
                'brand' => 'Audi', 'model' => 'RS7', 'variant' => 'Sportback Performance',
                'year' => 2024, 'price' => 145000, 'mileage' => 8500,
                'fuel_type' => 'petrol', 'transmission' => 'automatic', 'power_hp' => 630,
                'power_kw' => 463, 'body_type' => 'hatchback', 'condition' => 'used',
                'color' => 'Nardograu', 'interior_color' => 'Valcona Schwarz', 'doors' => 5, 'seats' => 5,
                'is_featured' => true, 'status' => 'available',
                'description' => ['de' => 'Audi RS7 Sportback Performance in Nardograu. V8 TFSI mit 630 PS.', 'en' => 'Audi RS7 Sportback Performance in Nardo Grey. V8 TFSI with 630 HP.'],
                'features' => ['RS Sportabgasanlage', 'Matrix LED', 'Bang & Olufsen', 'Carbon-Optikpaket', 'Allradlenkung'],
            ],
        ];

        foreach ($vehicles as $v) {
            Vehicle::firstOrCreate(
                ['brand' => $v['brand'], 'model' => $v['model'], 'year' => $v['year']],
                $v
            );
        }

        // Demo Blog Categories
        $news = BlogCategory::firstOrCreate(['slug' => 'neuigkeiten'], [
            'name' => ['de' => 'Neuigkeiten', 'en' => 'News'],
        ]);
        $tips = BlogCategory::firstOrCreate(['slug' => 'tipps'], [
            'name' => ['de' => 'Tipps & Ratgeber', 'en' => 'Tips & Guides'],
        ]);

        // Demo Blog Posts
        BlogPost::firstOrCreate(['slug' => 'willkommen-bei-ch-automobile'], [
            'title' => [
                'de' => 'Willkommen bei C-H Automobile & Exclusive Cars',
                'en' => 'Welcome to C-H Automobile & Exclusive Cars',
            ],
            'content' => [
                'de' => '<p>Herzlich willkommen auf unserer neuen Website! Bei C-H Automobile & Exclusive Cars in Friedberg finden Sie erstklassige Gebrauchtwagen zu fairen Preisen.</p><p>Unser Sortiment reicht von eleganten Limousinen über sportliche Coupés bis hin zu exklusiven Supersportwagen. Besuchen Sie uns und lassen Sie sich beraten!</p>',
                'en' => '<p>Welcome to our new website! At C-H Automobile & Exclusive Cars in Friedberg, you\'ll find first-class used cars at fair prices.</p><p>Our range extends from elegant sedans and sporty coupés to exclusive supercars. Visit us and let us advise you!</p>',
            ],
            'excerpt' => [
                'de' => 'Entdecken Sie unsere neue Website und unser exklusives Fahrzeugangebot.',
                'en' => 'Discover our new website and exclusive vehicle offerings.',
            ],
            'category_id' => $news->id,
            'author_id' => $admin->id,
            'is_published' => true,
            'published_at' => now(),
        ]);

        // Demo Reviews
        $demoReviews = [
            ['customer_name' => 'Thomas M.', 'rating' => 5, 'title' => 'Ausgezeichneter Service', 'comment' => 'Sehr professionelle Beratung und faire Preise. Das Team hat sich viel Zeit genommen und meine Fragen ausführlich beantwortet. Absolut empfehlenswert!', 'is_approved' => true, 'is_featured' => true],
            ['customer_name' => 'Sarah K.', 'rating' => 5, 'title' => 'Traumauto gefunden', 'comment' => 'Habe meinen Traumwagen hier gefunden. Der gesamte Kaufprozess war transparent und unkompliziert. Vielen Dank an das gesamte Team!', 'is_approved' => true, 'is_featured' => true],
            ['customer_name' => 'Michael R.', 'rating' => 5, 'title' => 'Top Qualität', 'comment' => 'Die Fahrzeuge sind in einwandfreiem Zustand und die Preise sind fair. Bin sehr zufrieden mit meinem Kauf und dem Service.', 'is_approved' => true],
            ['customer_name' => 'Anna B.', 'rating' => 5, 'title' => 'Sehr empfehlenswert', 'comment' => 'Kompetent, freundlich und ehrlich. So wünscht man sich einen Autohändler. Werde hier definitiv wieder kaufen.', 'is_approved' => true],
        ];

        foreach ($demoReviews as $review) {
            Review::firstOrCreate(
                ['customer_name' => $review['customer_name'], 'title' => $review['title']],
                $review
            );
        }
    }
}
