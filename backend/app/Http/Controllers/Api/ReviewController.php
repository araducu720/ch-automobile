<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreReviewRequest;
use App\Http\Resources\ReviewResource;
use App\Models\Review;
use App\Notifications\NewReviewNotification;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Notification;

class ReviewController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $reviews = Review::approved()
            ->with('vehicle:id,brand,model')
            ->orderByDesc('created_at')
            ->paginate($request->integer('per_page', 10));

        $avgRating = Review::approved()->avg('rating');
        $totalCount = Review::approved()->count();
        $ratingBreakdown = [];
        for ($i = 5; $i >= 1; $i--) {
            $ratingBreakdown[$i] = Review::approved()->where('rating', $i)->count();
        }

        return response()->json([
            'data' => ReviewResource::collection($reviews),
            'aggregate' => [
                'average_rating' => round($avgRating ?? 0, 1),
                'total_count' => $totalCount,
                'breakdown' => $ratingBreakdown,
            ],
            'meta' => [
                'current_page' => $reviews->currentPage(),
                'last_page' => $reviews->lastPage(),
                'total' => $reviews->total(),
            ],
        ]);
    }

    public function store(StoreReviewRequest $request): JsonResponse
    {
        // Honeypot check
        if ($request->isHoneypotFilled()) {
            return response()->json(['success' => true], 200);
        }

        $review = DB::transaction(function () use ($request) {
            return Review::create(array_merge(
                $request->safe()->except(['website_url']),
                [
                    'ip_address' => $request->ip(),
                    'locale' => $request->get('locale', 'de'),
                ]
            ));
        });

        // Notify admin
        try {
            Notification::route('mail', config('mail.from.address'))
                ->notify(new NewReviewNotification($review));
        } catch (\Throwable $e) {
            Log::warning('Failed to send review notification', [
                'review_id' => $review->id,
                'error' => $e->getMessage(),
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Vielen Dank für Ihre Bewertung! Sie wird nach Prüfung veröffentlicht.',
        ], 201);
    }
}
