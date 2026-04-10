<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Brand;
use App\Events\OrderCreated;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class OrderController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Order::with('brand');

        if ($request->has('brand')) {
            $query->whereHas('brand', fn ($q) => $q->where('slug', $request->brand));
        }
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $orders = $query->latest()->paginate(20);

        return response()->json($orders);
    }

    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'brand_slug' => 'required|exists:brands,slug',
            'customer_name' => 'required|string|max:255',
            'customer_email' => 'required|email|max:255',
            'amount' => 'required|numeric|min:0',
            'currency' => 'nullable|string|size:3',
            'items' => 'nullable|array',
            'shipping_address' => 'nullable|array',
            'notes' => 'nullable|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $brand = Brand::where('slug', $request->brand_slug)->firstOrFail();

        $data = $validator->validated();
        $data['brand_id'] = $brand->id;
        unset($data['brand_slug']);

        $order = Order::create($data);
        $order->load('brand');

        broadcast(new OrderCreated($order))->toOthers();

        return response()->json([
            'message' => 'Order created successfully.',
            'data' => $order,
        ], 201);
    }

    public function show(string $uuid): JsonResponse
    {
        $order = Order::where('uuid', $uuid)
            ->with(['brand', 'kycVerification'])
            ->firstOrFail();

        return response()->json(['data' => $order]);
    }

    public function updateStatus(Request $request, string $uuid): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'status' => 'required|in:processing,verified,shipped,delivered,cancelled,on_hold',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $order = Order::where('uuid', $uuid)->firstOrFail();

        $updateData = ['status' => $request->status];

        if ($request->status === 'shipped') {
            $updateData['shipped_at'] = now();
        }
        if ($request->status === 'delivered') {
            $updateData['delivered_at'] = now();
        }

        $order->update($updateData);

        return response()->json([
            'message' => 'Order status updated.',
            'data' => $order,
        ]);
    }
}
