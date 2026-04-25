<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('facebook_posts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('car_id')->nullable()->constrained()->nullOnDelete();
            $table->string('fb_object_id', 100)->nullable();
            $table->enum('type', ['new_listing', 'repost', 'group', 'content_calendar', 'comment_reply']);
            $table->char('locale', 5)->default('ro');
            $table->text('content');
            $table->json('raw_response')->nullable();
            $table->timestamp('posted_at')->nullable();
            $table->timestamps();

            $table->index(['car_id', 'type']);
            $table->index('posted_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('facebook_posts');
    }
};
