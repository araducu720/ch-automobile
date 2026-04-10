<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('reservations', function (Blueprint $table) {
            $table->enum('purchase_step', [
                'details',
                'invoice',
                'signature',
                'payment',
                'completed',
            ])->default('details')->after('bank_transfer_status');
            $table->string('signature_path')->nullable()->after('purchase_step');
            $table->string('payment_proof_path')->nullable()->after('signature_path');
        });
    }

    public function down(): void
    {
        Schema::table('reservations', function (Blueprint $table) {
            $table->dropColumn(['purchase_step', 'signature_path', 'payment_proof_path']);
        });
    }
};
