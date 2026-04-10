<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('reservations', function (Blueprint $table) {
            $table->string('contract_path')->nullable()->after('payment_proof_path');
            $table->string('signed_contract_path')->nullable()->after('contract_path');
            $table->dateTime('contract_generated_at')->nullable()->after('signed_contract_path');
            $table->dateTime('admin_confirmed_at')->nullable()->after('contract_generated_at');
        });
    }

    public function down(): void
    {
        Schema::table('reservations', function (Blueprint $table) {
            $table->dropColumn([
                'contract_path',
                'signed_contract_path',
                'contract_generated_at',
                'admin_confirmed_at',
            ]);
        });
    }
};
