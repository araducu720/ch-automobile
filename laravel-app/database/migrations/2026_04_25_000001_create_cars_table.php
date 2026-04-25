<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cars', function (Blueprint $table) {
            $table->id();
            $table->string('vin', 17)->nullable()->unique();
            $table->string('brand', 100);
            $table->string('model', 100);
            $table->unsignedSmallInteger('year');
            $table->unsignedInteger('km')->default(0);
            $table->string('fuel', 30)->nullable();          // gasoline|diesel|electric|hybrid|lpg|cng
            $table->string('transmission', 20)->nullable();  // manual|automatic
            $table->unsignedSmallInteger('hp')->nullable();
            $table->string('body_style', 30)->nullable();    // sedan|suv|coupe|…
            $table->unsignedBigInteger('price')->default(0); // cents
            $table->char('currency', 3)->default('EUR');
            $table->string('location_city', 100)->nullable();
            $table->string('location_country', 100)->nullable();
            $table->text('highlights')->nullable();
            $table->enum('status', ['draft', 'published', 'sold'])->default('draft');
            $table->json('target_locales')->nullable();      // ["ro","de","en",…]
            $table->longText('embedding')->nullable();       // JSON float array
            $table->timestamps();

            $table->index('status');
            $table->index(['brand', 'model']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cars');
    }
};
