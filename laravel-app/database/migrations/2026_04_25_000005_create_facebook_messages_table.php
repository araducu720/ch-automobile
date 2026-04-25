<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('facebook_messages', function (Blueprint $table) {
            $table->id();
            $table->string('sender_psid', 50);
            $table->enum('direction', ['in', 'out']);
            $table->text('text');
            $table->char('locale', 5)->nullable();
            $table->string('intent', 50)->nullable(); // test_drive|price_offer|financing|reservation
            $table->json('raw')->nullable();
            $table->timestamps();

            $table->index('sender_psid');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('facebook_messages');
    }
};
