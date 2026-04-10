<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\KycVerification;
use App\Models\Brand;
use App\Events\KycStatusUpdated;
use App\Jobs\ProcessKycVerification;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class KycController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = KycVerification::with('brand');

        if ($request->has('brand')) {
            $query->whereHas('brand', fn ($q) => $q->where('slug', $request->brand));
        }
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $verifications = $query->latest()->paginate(20);

        return response()->json($verifications);
    }

    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'brand_slug' => 'required|exists:brands,slug',
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:20',
            'date_of_birth' => 'nullable|date|before:today',
            'nationality' => 'nullable|string|max:100',
            'address_line_1' => 'nullable|string|max:500',
            'city' => 'nullable|string|max:255',
            'postal_code' => 'nullable|string|max:20',
            'country' => 'nullable|string|max:100',
            'document_type' => 'required|in:passport,id_card,driving_license',
            'document_number' => 'nullable|string|max:100',
            'document_front' => 'required|file|mimes:jpg,jpeg,png,pdf|max:10240',
            'document_back' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:10240',
            'selfie' => 'nullable|file|mimes:jpg,jpeg,png|max:10240',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $brand = Brand::where('slug', $request->brand_slug)->firstOrFail();

        $data = $validator->validated();
        $data['brand_id'] = $brand->id;
        $data['ip_address'] = $request->ip();
        $data['user_agent'] = $request->userAgent();
        $data['status'] = 'documents_uploaded';
        $data['submitted_at'] = now();

        if ($request->hasFile('document_front')) {
            $data['document_front_path'] = $request->file('document_front')
                ->store("kyc/{$brand->slug}/documents", 'private');
        }
        if ($request->hasFile('document_back')) {
            $data['document_back_path'] = $request->file('document_back')
                ->store("kyc/{$brand->slug}/documents", 'private');
        }
        if ($request->hasFile('selfie')) {
            $data['selfie_path'] = $request->file('selfie')
                ->store("kyc/{$brand->slug}/selfies", 'private');
        }

        unset($data['brand_slug'], $data['document_front'], $data['document_back'], $data['selfie']);

        $kyc = KycVerification::create($data);
        $kyc->load('brand');

        ProcessKycVerification::dispatch($kyc);
        broadcast(new KycStatusUpdated($kyc))->toOthers();

        return response()->json([
            'message' => 'KYC verification submitted successfully.',
            'data' => $kyc,
        ], 201);
    }

    public function show(string $uuid): JsonResponse
    {
        $kyc = KycVerification::where('uuid', $uuid)
            ->with(['brand', 'reviewer'])
            ->firstOrFail();

        return response()->json(['data' => $kyc]);
    }

    public function updateStatus(Request $request, string $uuid): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'status' => 'required|in:in_review,approved,rejected,additional_info_required',
            'rejection_reason' => 'required_if:status,rejected|nullable|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $kyc = KycVerification::where('uuid', $uuid)->firstOrFail();
        $kyc->update([
            'status' => $request->status,
            'rejection_reason' => $request->rejection_reason,
            'reviewed_at' => now(),
            'reviewed_by' => $request->user()?->id,
        ]);

        $kyc->load('brand');
        broadcast(new KycStatusUpdated($kyc))->toOthers();

        return response()->json([
            'message' => 'KYC status updated.',
            'data' => $kyc,
        ]);
    }

    public function stats(Request $request): JsonResponse
    {
        $query = KycVerification::query();

        if ($request->has('brand')) {
            $query->whereHas('brand', fn ($q) => $q->where('slug', $request->brand));
        }

        $stats = [
            'total' => (clone $query)->count(),
            'pending' => (clone $query)->where('status', 'pending')->count(),
            'documents_uploaded' => (clone $query)->where('status', 'documents_uploaded')->count(),
            'in_review' => (clone $query)->where('status', 'in_review')->count(),
            'approved' => (clone $query)->where('status', 'approved')->count(),
            'rejected' => (clone $query)->where('status', 'rejected')->count(),
            'today' => (clone $query)->whereDate('created_at', today())->count(),
        ];

        return response()->json(['data' => $stats]);
    }
}
