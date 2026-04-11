<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('trade_in_valuations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('inquiry_id')->constrained()->cascadeOnDelete();
            $table->string('trade_brand');
            $table->string('trade_model');
            $table->unsignedSmallInteger('trade_year');
            $table->unsignedInteger('trade_mileage');
            $table->enum('trade_condition', ['excellent', 'good', 'fair', 'poor'])->default('good');
            $table->text('trade_description')->nullable();
            $table->text('damage_description')->nullable();
            $table->decimal('estimated_value', 12, 2)->nullable();
            $table->text('valuation_notes')->nullable();
            $table->enum('status', ['pending', 'valuated', 'accepted', 'rejected'])->default('pending');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('trade_in_valuations');
    }
};
