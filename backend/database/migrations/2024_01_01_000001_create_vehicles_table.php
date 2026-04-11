<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('vehicles', function (Blueprint $table) {
            $table->id();
            $table->string('brand');
            $table->string('model');
            $table->string('variant')->nullable();
            $table->unsignedSmallInteger('year');
            $table->decimal('price', 12, 2);
            $table->boolean('price_on_request')->default(false);
            $table->unsignedInteger('mileage')->default(0);
            $table->enum('fuel_type', ['petrol', 'diesel', 'electric', 'hybrid', 'plug_in_hybrid', 'lpg', 'cng', 'hydrogen'])->default('petrol');
            $table->enum('transmission', ['manual', 'automatic', 'semi_automatic'])->default('manual');
            $table->unsignedSmallInteger('power_hp')->nullable();
            $table->unsignedSmallInteger('power_kw')->nullable();
            $table->unsignedInteger('engine_displacement')->nullable()->comment('in cc');
            $table->string('color')->nullable();
            $table->string('interior_color')->nullable();
            $table->enum('body_type', ['sedan', 'suv', 'coupe', 'cabrio', 'kombi', 'van', 'hatchback', 'pickup', 'roadster', 'limousine', 'other'])->default('sedan');
            $table->unsignedTinyInteger('doors')->nullable();
            $table->unsignedTinyInteger('seats')->nullable();
            $table->string('vin')->nullable()->unique();
            $table->date('registration_date')->nullable();
            $table->enum('condition', ['new', 'used', 'classic', 'demonstration'])->default('used');
            $table->json('description')->nullable()->comment('Translatable JSON');
            $table->json('features')->nullable()->comment('Array of feature strings');
            $table->json('equipment')->nullable()->comment('Categorized equipment JSON');
            $table->enum('status', ['available', 'reserved', 'sold', 'draft'])->default('available');
            $table->boolean('is_featured')->default(false);
            $table->string('mobile_de_id')->nullable()->index();
            $table->string('autoscout_id')->nullable()->index();
            $table->string('slug')->unique();
            $table->string('emission_class')->nullable();
            $table->string('emission_sticker')->nullable();
            $table->decimal('co2_emissions', 6, 2)->nullable();
            $table->decimal('fuel_consumption_combined', 4, 1)->nullable();
            $table->decimal('fuel_consumption_urban', 4, 1)->nullable();
            $table->decimal('fuel_consumption_extra_urban', 4, 1)->nullable();
            $table->unsignedTinyInteger('previous_owners')->nullable();
            $table->boolean('accident_free')->nullable();
            $table->boolean('non_smoker')->nullable();
            $table->boolean('garage_kept')->nullable();
            $table->date('tuv_until')->nullable()->comment('TÜV/HU valid until');
            $table->string('warranty')->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->unsignedBigInteger('views_count')->default(0);
            $table->timestamps();
            $table->softDeletes();

            $table->index(['brand', 'model']);
            $table->index(['status', 'is_featured']);
            $table->index(['price']);
            $table->index(['year']);
            $table->index(['created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('vehicles');
    }
};
