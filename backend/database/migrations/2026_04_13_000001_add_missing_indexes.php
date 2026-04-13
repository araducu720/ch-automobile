<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('vehicles', function (Blueprint $table) {
            $table->index('brand');
            $table->index('fuel_type');
            $table->index('transmission');
            $table->index('body_type');
            $table->index(['status', 'is_featured']);
            $table->index(['brand', 'status']);
            $table->index('price');
            $table->index('year');
        });

        Schema::table('inquiries', function (Blueprint $table) {
            $table->index('vehicle_id');
            $table->index('status');
            $table->index('type');
            $table->index('created_at');
        });

        Schema::table('reservations', function (Blueprint $table) {
            $table->index('vehicle_id');
            $table->index('payment_reference');
            $table->index('bank_transfer_status');
        });

        Schema::table('reviews', function (Blueprint $table) {
            $table->index('vehicle_id');
            $table->index('is_approved');
        });

        Schema::table('blog_posts', function (Blueprint $table) {
            $table->index('author_id');
            $table->index('is_published');
        });
    }

    public function down(): void
    {
        Schema::table('vehicles', function (Blueprint $table) {
            $table->dropIndex(['brand']);
            $table->dropIndex(['fuel_type']);
            $table->dropIndex(['transmission']);
            $table->dropIndex(['body_type']);
            $table->dropIndex(['status', 'is_featured']);
            $table->dropIndex(['brand', 'status']);
            $table->dropIndex(['price']);
            $table->dropIndex(['year']);
        });

        Schema::table('inquiries', function (Blueprint $table) {
            $table->dropIndex(['vehicle_id']);
            $table->dropIndex(['status']);
            $table->dropIndex(['type']);
            $table->dropIndex(['created_at']);
        });

        Schema::table('reservations', function (Blueprint $table) {
            $table->dropIndex(['vehicle_id']);
            $table->dropIndex(['payment_reference']);
            $table->dropIndex(['bank_transfer_status']);
        });

        Schema::table('reviews', function (Blueprint $table) {
            $table->dropIndex(['vehicle_id']);
            $table->dropIndex(['is_approved']);
        });

        Schema::table('blog_posts', function (Blueprint $table) {
            $table->dropIndex(['author_id']);
            $table->dropIndex(['is_published']);
        });
    }
};
