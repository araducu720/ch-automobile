<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('car_translations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('car_id')->constrained()->cascadeOnDelete();
            $table->char('locale', 5);      // BCP-47 e.g. "ro", "de", "en"
            $table->string('title', 200);
            $table->text('description');
            $table->string('meta_title', 70)->nullable();
            $table->string('meta_desc', 160)->nullable();
            $table->string('slug', 250)->nullable();
            $table->timestamps();

            $table->unique(['car_id', 'locale']);
            $table->index('locale');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('car_translations');
    }
};
