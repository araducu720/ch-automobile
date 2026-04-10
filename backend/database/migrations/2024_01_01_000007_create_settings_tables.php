<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('company_settings', function (Blueprint $table) {
            $table->id();
            $table->string('company_name')->default('C-H Automobile & Exclusive Cars');
            $table->string('street')->default('Straßheimer Str. 67-69');
            $table->string('city')->default('Friedberg (Hessen)');
            $table->string('postal_code')->default('61169');
            $table->string('country')->default('Germany');
            $table->string('phone')->default('+49 1517 5606841');
            $table->string('email')->default('info@ch-automobile.de');
            $table->string('website')->default('https://www.ch-automobile.de');
            $table->decimal('latitude', 10, 7)->default(50.3345);
            $table->decimal('longitude', 10, 7)->default(8.7548);
            $table->json('opening_hours')->nullable();
            $table->string('facebook_url')->nullable();
            $table->string('instagram_url')->nullable();
            $table->string('youtube_url')->nullable();
            $table->string('tiktok_url')->nullable();
            $table->string('whatsapp_number')->nullable();
            $table->string('bank_name')->nullable();
            $table->string('bank_iban')->nullable();
            $table->string('bank_bic')->nullable();
            $table->string('bank_account_holder')->nullable();
            $table->string('tax_id')->nullable();
            $table->string('trade_register')->nullable();
            $table->json('imprint')->nullable()->comment('Translatable legal text');
            $table->json('privacy_policy')->nullable()->comment('Translatable');
            $table->json('terms_conditions')->nullable()->comment('Translatable');
            $table->string('logo')->nullable();
            $table->string('logo_dark')->nullable();
            $table->string('favicon')->nullable();
            $table->json('meta_title')->nullable()->comment('Translatable');
            $table->json('meta_description')->nullable()->comment('Translatable');
            $table->timestamps();
        });

        Schema::create('newsletter_subscribers', function (Blueprint $table) {
            $table->id();
            $table->string('email')->unique();
            $table->string('locale', 5)->default('de');
            $table->string('confirmation_token')->nullable();
            $table->dateTime('confirmed_at')->nullable();
            $table->dateTime('unsubscribed_at')->nullable();
            $table->timestamps();
        });

        Schema::create('page_views', function (Blueprint $table) {
            $table->id();
            $table->string('page_type')->comment('vehicle, blog, page');
            $table->unsignedBigInteger('page_id')->nullable();
            $table->string('url');
            $table->string('ip_address', 45)->nullable();
            $table->string('user_agent')->nullable();
            $table->string('referer')->nullable();
            $table->string('locale', 5)->nullable();
            $table->timestamps();

            $table->index(['page_type', 'page_id']);
            $table->index(['created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('page_views');
        Schema::dropIfExists('newsletter_subscribers');
        Schema::dropIfExists('company_settings');
    }
};
