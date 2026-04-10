<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BrandController extends Controller
{
    public function index(): JsonResponse
    {
        $brands = Brand::where('is_active', true)
            ->withCount(['kycVerifications', 'orders'])
            ->get();

        return response()->json(['data' => $brands]);
    }

    public function show(string $slug): JsonResponse
    {
        $brand = Brand::where('slug', $slug)
            ->where('is_active', true)
            ->with(['templates' => fn ($q) => $q->where('is_active', true)])
            ->withCount(['kycVerifications', 'orders'])
            ->firstOrFail();

        return response()->json(['data' => $brand]);
    }

    public function theme(string $slug): JsonResponse
    {
        $brand = Brand::where('slug', $slug)
            ->where('is_active', true)
            ->firstOrFail();

        return response()->json([
            'data' => [
                'name' => $brand->name,
                'slug' => $brand->slug,
                'logo_url' => $brand->logo_url,
                'primary_color' => $brand->primary_color,
                'secondary_color' => $brand->secondary_color,
                'font_family' => $brand->font_family,
                'theme_config' => $brand->theme_config,
            ],
        ]);
    }
}
