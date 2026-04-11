<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reservations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('vehicle_id')->constrained()->cascadeOnDelete();
            $table->string('customer_name');
            $table->string('customer_email');
            $table->string('customer_phone');
            $table->string('billing_street')->nullable();
            $table->string('billing_city')->nullable();
            $table->string('billing_postal_code')->nullable();
            $table->string('billing_country')->default('DE');
            $table->decimal('deposit_amount', 12, 2);
            $table->string('payment_reference')->unique();
            $table->enum('bank_transfer_status', ['pending', 'confirmed', 'cancelled', 'expired', 'refunded'])->default('pending');
            $table->dateTime('reservation_expires_at');
            $table->dateTime('payment_confirmed_at')->nullable();
            $table->text('admin_notes')->nullable();
            $table->string('locale', 5)->default('de');
            $table->timestamps();

            $table->index(['bank_transfer_status']);
            $table->index(['reservation_expires_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reservations');
    }
};
