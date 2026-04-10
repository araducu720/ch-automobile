<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('vehicle_id')->nullable()->constrained()->nullOnDelete();
            $table->string('customer_name');
            $table->string('customer_email')->nullable();
            $table->unsignedTinyInteger('rating')->comment('1-5');
            $table->string('title')->nullable();
            $table->text('comment');
            $table->boolean('is_approved')->default(false);
            $table->boolean('is_featured')->default(false);
            $table->string('locale', 5)->default('de');
            $table->string('ip_address', 45)->nullable();
            $table->timestamps();

            $table->index(['is_approved', 'is_featured']);
            $table->index(['rating']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};
