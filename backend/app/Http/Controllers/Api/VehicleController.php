<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\VehicleDetailResource;
use App\Http\Resources\VehicleResource;
use App\Models\Vehicle;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class VehicleController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $locale = $request->get('locale', 'de');
        app()->setLocale($locale);

        $query = Vehicle::published()
            ->with('media')
            ->filterByBrand($request->get('brand'))
            ->filterByPriceRange($request->float('price_min'), $request->float('price_max'))
            ->filterByYearRange($request->integer('year_min'), $request->integer('year_max'))
            ->filterByFuelType($request->get('fuel_type'))
            ->filterByTransmission($request->get('transmission'))
            ->filterByBodyType($request->get('body_type'))
            ->filterByCondition($request->get('condition'));

        if ($request->filled('mileage_max')) {
            $query->where('mileage', '<=', $request->integer('mileage_max'));
        }

        if ($request->filled('search')) {
            $search = str_replace(['%', '_'], ['\\%', '\\_'], $request->get('search'));
            $query->where(function ($q) use ($search) {
                $q->where('brand', 'like', "%{$search}%")
                    ->orWhere('model', 'like', "%{$search}%")
                    ->orWhere('variant', 'like', "%{$search}%");
            });
        }

        $sortField = $request->get('sort', 'created_at');
        $sortDir = $request->get('direction', 'desc');
        $allowedSorts = ['price', 'year', 'mileage', 'created_at'];
        if (in_array($sortField, $allowedSorts)) {
            $query->orderBy($sortField, $sortDir === 'asc' ? 'asc' : 'desc');
        }

        $perPage = min($request->integer('per_page', 12), 48);
        $vehicles = $query->paginate($perPage);

        return response()->json([
            'data' => VehicleResource::collection($vehicles),
            'meta' => [
                'current_page' => $vehicles->currentPage(),
                'last_page' => $vehicles->lastPage(),
                'per_page' => $vehicles->perPage(),
                'total' => $vehicles->total(),
            ],
        ]);
    }

    public function show(string $slug, Request $request): JsonResponse
    {
        $locale = $request->get('locale', 'de');
        app()->setLocale($locale);

        $vehicle = Vehicle::published()
            ->with('media')
            ->where('slug', $slug)
            ->firstOrFail();

        $vehicle->increment('views_count');

        $related = Vehicle::available()
            ->with('media')
            ->where('id', '!=', $vehicle->id)
            ->where('brand', $vehicle->brand)
            ->limit(4)
            ->get();

        return response()->json([
            'data' => new VehicleDetailResource($vehicle),
            'related' => VehicleResource::collection($related),
        ]);
    }

    public function featured(Request $request): JsonResponse
    {
        $locale = $request->get('locale', 'de');
        app()->setLocale($locale);

        $limit = min((int) $request->get('limit', 8), 20);

        $vehicles = Vehicle::available()
            ->featured()
            ->with('media')
            ->orderBy('sort_order')
            ->limit($limit)
            ->get();

        return response()->json(['data' => VehicleResource::collection($vehicles)]);
    }

    public function brands(): JsonResponse
    {
        $brands = cache()->remember('vehicle_brands', 300, function () {
            return Vehicle::published()
                ->select('brand')
                ->selectRaw('COUNT(*) as count')
                ->groupBy('brand')
                ->orderBy('brand')
                ->get();
        });

        return response()->json([
            'data' => $brands,
        ], 200, [
            'Cache-Control' => 'public, max-age=60, stale-while-revalidate=300',
        ]);
    }
}
