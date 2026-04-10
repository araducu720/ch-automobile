<?php

namespace App\Jobs;

use App\Models\KycVerification;
use App\Events\KycStatusUpdated;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class ProcessKycVerification implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;
    public int $backoff = 60;

    public function __construct(
        public KycVerification $kycVerification
    ) {}

    public function handle(): void
    {
        Log::info("Processing KYC verification: {$this->kycVerification->uuid}");

        // Move to in_review status
        $this->kycVerification->update(['status' => 'in_review']);
        broadcast(new KycStatusUpdated($this->kycVerification));

        // Simulate document verification checks
        $checks = [
            'document_readable' => true,
            'document_not_expired' => true,
            'face_match' => $this->kycVerification->selfie_path ? true : null,
            'data_consistency' => true,
        ];

        $score = collect($checks)->filter()->count() / collect($checks)->count() * 100;

        $this->kycVerification->update([
            'verification_checks' => $checks,
            'confidence_score' => round($score, 2),
        ]);

        // Auto-approve if confidence score is high enough
        if ($score >= 80) {
            $this->kycVerification->update([
                'status' => 'approved',
                'reviewed_at' => now(),
            ]);
        }

        broadcast(new KycStatusUpdated($this->kycVerification));

        Log::info("KYC verification processed: {$this->kycVerification->uuid}, score: {$score}");
    }

    public function failed(\Throwable $exception): void
    {
        Log::error("KYC processing failed for {$this->kycVerification->uuid}: {$exception->getMessage()}");
    }
}
