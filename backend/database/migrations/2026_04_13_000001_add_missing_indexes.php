<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    private function indexExists(string $table, string $indexName): bool
    {
        $driver = Schema::getConnection()->getDriverName();

        if ($driver === 'sqlite') {
            $indexes = DB::select("PRAGMA index_list(`{$table}`)");
            foreach ($indexes as $index) {
                if ($index->name === $indexName) {
                    return true;
                }
            }
            return false;
        }

        $indexes = DB::select("SHOW INDEX FROM `{$table}` WHERE Key_name = ?", [$indexName]);
        return count($indexes) > 0;
    }

    private function addIndexIfNotExists(Blueprint $table, string $tableName, array|string $columns, ?string $indexName = null): void
    {
        $cols = is_array($columns) ? $columns : [$columns];
        $name = $indexName ?? ($tableName . '_' . implode('_', $cols) . '_index');
        if (!$this->indexExists($tableName, $name)) {
            $table->index($cols, $name);
        }
    }

    public function up(): void
    {
        Schema::table('vehicles', function (Blueprint $table) {
            $this->addIndexIfNotExists($table, 'vehicles', 'brand');
            $this->addIndexIfNotExists($table, 'vehicles', 'fuel_type');
            $this->addIndexIfNotExists($table, 'vehicles', 'transmission');
            $this->addIndexIfNotExists($table, 'vehicles', 'body_type');
            $this->addIndexIfNotExists($table, 'vehicles', ['status', 'is_featured']);
            $this->addIndexIfNotExists($table, 'vehicles', ['brand', 'status']);
            $this->addIndexIfNotExists($table, 'vehicles', 'price');
            $this->addIndexIfNotExists($table, 'vehicles', 'year');
        });

        Schema::table('inquiries', function (Blueprint $table) {
            $this->addIndexIfNotExists($table, 'inquiries', 'vehicle_id');
            $this->addIndexIfNotExists($table, 'inquiries', 'status');
            $this->addIndexIfNotExists($table, 'inquiries', 'type');
            $this->addIndexIfNotExists($table, 'inquiries', 'created_at');
        });

        Schema::table('reservations', function (Blueprint $table) {
            $this->addIndexIfNotExists($table, 'reservations', 'vehicle_id');
            $this->addIndexIfNotExists($table, 'reservations', 'payment_reference');
            $this->addIndexIfNotExists($table, 'reservations', 'bank_transfer_status');
        });

        Schema::table('reviews', function (Blueprint $table) {
            $this->addIndexIfNotExists($table, 'reviews', 'vehicle_id');
            $this->addIndexIfNotExists($table, 'reviews', 'is_approved');
        });

        Schema::table('blog_posts', function (Blueprint $table) {
            $this->addIndexIfNotExists($table, 'blog_posts', 'author_id');
            $this->addIndexIfNotExists($table, 'blog_posts', 'is_published');
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
