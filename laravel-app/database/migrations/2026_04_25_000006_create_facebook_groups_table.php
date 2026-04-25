<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('facebook_groups', function (Blueprint $table) {
            $table->id();
            $table->string('fb_group_id', 50)->unique();
            $table->string('name', 200);
            $table->char('language', 5)->nullable(); // primary language of the group
            $table->unsignedTinyInteger('max_per_day')->default(3);
            $table->boolean('allows_api_posts')->default(true);
            $table->boolean('manual_only')->default(false);
            $table->text('notes')->nullable();
            $table->timestamp('last_posted_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('facebook_groups');
    }
};
