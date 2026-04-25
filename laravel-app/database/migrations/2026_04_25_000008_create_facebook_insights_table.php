<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('facebook_insights', function (Blueprint $table) {
            $table->id();
            $table->date('snapshot_date');
            $table->json('metrics');          // raw metrics from InsightsService
            $table->text('ai_summary')->nullable(); // Ollama-generated summary
            $table->json('recommendations')->nullable();
            $table->timestamps();

            $table->unique('snapshot_date');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('facebook_insights');
    }
};
