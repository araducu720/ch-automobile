<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\Brand;
use App\Models\User;
use App\Models\KycVerification;
use App\Events\KycStatusUpdated;
use App\Mail\KycSubmissionConfirmation;
use App\Mail\KycStatusUpdate;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Mail;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class KycFlowTest extends TestCase
{
    use RefreshDatabase;

    private Brand $brand;
    private User $admin;

    protected function setUp(): void
    {
        parent::setUp();
        $this->brand = Brand::factory()->walmart()->create();
        $this->admin = User::factory()->admin()->create();
    }

    // ========== SUBMISSION FLOW ==========

    public function test_kyc_submission_creates_verification(): void
    {
        Mail::fake();

        $response = $this->postJson('/api/kyc', [
            'brand_slug' => 'walmart',
            'first_name' => 'John',
            'last_name' => 'Doe',
            'email' => 'john@example.com',
            'phone' => '+1234567890',
            'date_of_birth' => '1990-01-15',
            'nationality' => 'US',
            'address_line_1' => '123 Main St',
            'city' => 'New York',
            'state' => 'NY',
            'postal_code' => '10001',
            'country' => 'US',
            'document_type' => 'passport',
        ]);

        $response->assertStatus(201);
        $response->assertJsonStructure([
            'data' => ['uuid', 'status', 'first_name', 'last_name', 'email'],
        ]);

        $this->assertDatabaseHas('kyc_verifications', [
            'email' => 'john@example.com',
            'first_name' => 'John',
            'last_name' => 'Doe',
            'status' => 'pending',
            'brand_id' => $this->brand->id,
        ]);
    }

    public function test_kyc_submission_with_documents(): void
    {
        Storage::fake('local');

        $response = $this->postJson('/api/kyc', [
            'brand_slug' => 'walmart',
            'first_name' => 'Jane',
            'last_name' => 'Smith',
            'email' => 'jane@example.com',
            'document_type' => 'drivers_license',
            'document_front' => UploadedFile::fake()->image('front.jpg', 800, 600),
            'document_back' => UploadedFile::fake()->image('back.jpg', 800, 600),
            'selfie' => UploadedFile::fake()->image('selfie.jpg', 600, 600),
        ]);

        $response->assertStatus(201);

        $verification = KycVerification::where('email', 'jane@example.com')->first();
        $this->assertNotNull($verification->document_front_path);
        $this->assertNotNull($verification->document_back_path);
        $this->assertNotNull($verification->selfie_path);
    }

    public function test_kyc_submission_validates_required_fields(): void
    {
        $response = $this->postJson('/api/kyc', []);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['brand_slug', 'first_name', 'last_name', 'email']);
    }

    public function test_kyc_submission_validates_email_format(): void
    {
        $response = $this->postJson('/api/kyc', [
            'brand_slug' => 'walmart',
            'first_name' => 'John',
            'last_name' => 'Doe',
            'email' => 'not-an-email',
        ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['email']);
    }

    // ========== STATUS RETRIEVAL ==========

    public function test_get_kyc_status_by_uuid(): void
    {
        $verification = KycVerification::factory()->forBrand($this->brand)->create();

        $response = $this->getJson("/api/kyc/{$verification->uuid}");

        $response->assertStatus(200);
        $response->assertJsonPath('data.uuid', $verification->uuid);
        $response->assertJsonPath('data.status', 'pending');
    }

    public function test_get_kyc_returns_404_for_invalid_uuid(): void
    {
        $response = $this->getJson('/api/kyc/nonexistent-uuid');

        $response->assertStatus(404);
    }

    // ========== ADMIN STATUS UPDATES ==========

    public function test_admin_can_approve_kyc(): void
    {
        Event::fake([KycStatusUpdated::class]);

        $verification = KycVerification::factory()
            ->forBrand($this->brand)
            ->inReview()
            ->create();

        $response = $this->actingAs($this->admin, 'sanctum')
            ->putJson("/api/kyc/{$verification->uuid}/status", [
                'status' => 'approved',
            ]);

        $response->assertStatus(200);
        $response->assertJsonPath('data.status', 'approved');

        $this->assertDatabaseHas('kyc_verifications', [
            'uuid' => $verification->uuid,
            'status' => 'approved',
        ]);

        Event::assertDispatched(KycStatusUpdated::class);
    }

    public function test_admin_can_reject_kyc_with_reason(): void
    {
        Event::fake([KycStatusUpdated::class]);

        $verification = KycVerification::factory()
            ->forBrand($this->brand)
            ->inReview()
            ->create();

        $response = $this->actingAs($this->admin, 'sanctum')
            ->putJson("/api/kyc/{$verification->uuid}/status", [
                'status' => 'rejected',
                'rejection_reason' => 'Document not legible',
            ]);

        $response->assertStatus(200);
        $response->assertJsonPath('data.status', 'rejected');

        $this->assertDatabaseHas('kyc_verifications', [
            'uuid' => $verification->uuid,
            'status' => 'rejected',
            'rejection_reason' => 'Document not legible',
        ]);
    }

    public function test_non_admin_cannot_update_kyc_status(): void
    {
        $user = User::factory()->create();
        $verification = KycVerification::factory()->forBrand($this->brand)->create();

        $response = $this->actingAs($user, 'sanctum')
            ->putJson("/api/kyc/{$verification->uuid}/status", [
                'status' => 'approved',
            ]);

        $response->assertStatus(403);
    }

    public function test_unauthenticated_cannot_update_kyc_status(): void
    {
        $verification = KycVerification::factory()->forBrand($this->brand)->create();

        $response = $this->putJson("/api/kyc/{$verification->uuid}/status", [
            'status' => 'approved',
        ]);

        $response->assertStatus(401);
    }

    // ========== KYC STATS ==========

    public function test_admin_can_get_kyc_stats(): void
    {
        KycVerification::factory()->forBrand($this->brand)->pending()->count(5)->create();
        KycVerification::factory()->forBrand($this->brand)->approved()->count(3)->create();
        KycVerification::factory()->forBrand($this->brand)->rejected()->count(2)->create();

        $response = $this->actingAs($this->admin, 'sanctum')
            ->getJson('/api/kyc/stats');

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'data' => ['total', 'pending', 'approved', 'rejected'],
        ]);
        $response->assertJsonPath('data.total', 10);
        $response->assertJsonPath('data.pending', 5);
        $response->assertJsonPath('data.approved', 3);
        $response->assertJsonPath('data.rejected', 2);
    }

    // ========== BRAND FILTER ==========

    public function test_kyc_list_filters_by_brand(): void
    {
        $amazon = Brand::factory()->amazon()->create();
        KycVerification::factory()->forBrand($this->brand)->count(3)->create();
        KycVerification::factory()->forBrand($amazon)->count(2)->create();

        $response = $this->actingAs($this->admin, 'sanctum')
            ->getJson('/api/kyc?brand_slug=walmart');

        $response->assertStatus(200);
        $this->assertCount(3, $response->json('data'));
    }

    // ========== FULL E2E FLOW ==========

    public function test_complete_kyc_flow_submit_to_approval(): void
    {
        Event::fake([KycStatusUpdated::class]);

        // Step 1: Submit KYC
        $submitResponse = $this->postJson('/api/kyc', [
            'brand_slug' => 'walmart',
            'first_name' => 'Alice',
            'last_name' => 'Wonder',
            'email' => 'alice@example.com',
            'phone' => '+1555123456',
            'document_type' => 'passport',
        ]);

        $submitResponse->assertStatus(201);
        $uuid = $submitResponse->json('data.uuid');

        // Step 2: Check status is pending
        $statusResponse = $this->getJson("/api/kyc/{$uuid}");
        $statusResponse->assertJsonPath('data.status', 'pending');

        // Step 3: Admin moves to in_review
        $reviewResponse = $this->actingAs($this->admin, 'sanctum')
            ->putJson("/api/kyc/{$uuid}/status", ['status' => 'in_review']);
        $reviewResponse->assertJsonPath('data.status', 'in_review');

        // Step 4: Admin approves
        $approveResponse = $this->actingAs($this->admin, 'sanctum')
            ->putJson("/api/kyc/{$uuid}/status", ['status' => 'approved']);
        $approveResponse->assertJsonPath('data.status', 'approved');

        // Step 5: Verify final state
        $finalResponse = $this->getJson("/api/kyc/{$uuid}");
        $finalResponse->assertJsonPath('data.status', 'approved');

        Event::assertDispatchedTimes(KycStatusUpdated::class, 2);
    }

    public function test_complete_kyc_flow_submit_to_rejection(): void
    {
        Event::fake([KycStatusUpdated::class]);

        // Submit + check
        $submitResponse = $this->postJson('/api/kyc', [
            'brand_slug' => 'walmart',
            'first_name' => 'Bob',
            'last_name' => 'Builder',
            'email' => 'bob@example.com',
            'document_type' => 'national_id',
        ]);

        $uuid = $submitResponse->json('data.uuid');

        // Admin rejects
        $rejectResponse = $this->actingAs($this->admin, 'sanctum')
            ->putJson("/api/kyc/{$uuid}/status", [
                'status' => 'rejected',
                'rejection_reason' => 'Blurry document photo',
            ]);

        $rejectResponse->assertJsonPath('data.status', 'rejected');
        $rejectResponse->assertJsonPath('data.rejection_reason', 'Blurry document photo');
    }

    // ========== MULTI-BRAND FLOW ==========

    public function test_multi_brand_kyc_submissions(): void
    {
        $amazon = Brand::factory()->amazon()->create();
        $dpd = Brand::factory()->dpd()->create();
        $dhl = Brand::factory()->dhl()->create();

        foreach (['walmart', 'amazon', 'dpd', 'dhl'] as $brand) {
            $response = $this->postJson('/api/kyc', [
                'brand_slug' => $brand,
                'first_name' => 'User',
                'last_name' => ucfirst($brand),
                'email' => "{$brand}@test.com",
                'document_type' => 'passport',
            ]);

            $response->assertStatus(201);
            $response->assertJsonPath('data.email', "{$brand}@test.com");
        }

        $this->assertDatabaseCount('kyc_verifications', 4);
    }
}
