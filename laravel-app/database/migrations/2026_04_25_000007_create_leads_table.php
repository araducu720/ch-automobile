<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('leads', function (Blueprint $table) {
            $table->id();
            $table->string('source', 60)->default('facebook_messenger'); // facebook_messenger|facebook_comment|…
            $table->string('fb_object_id', 100)->nullable();
            $table->string('name', 200)->nullable();
            $table->string('phone', 30)->nullable();
            $table->char('locale', 5)->nullable();
            $table->string('intent', 50)->nullable();        // test_drive|price_offer|financing|reservation
            $table->foreignId('car_id')->nullable()->constrained()->nullOnDelete();
            $table->enum('status', ['new', 'contacted', 'converted', 'lost'])->default('new');
            $table->timestamps();

            $table->index('status');
            $table->index('intent');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('leads');
    }
};
