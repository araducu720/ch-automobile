<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('car_photos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('car_id')->constrained()->cascadeOnDelete();
            $table->string('url', 2048);
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->json('ai_tags')->nullable(); // tags from llama3.2-vision
            $table->timestamps();

            $table->index(['car_id', 'sort_order']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('car_photos');
    }
};
