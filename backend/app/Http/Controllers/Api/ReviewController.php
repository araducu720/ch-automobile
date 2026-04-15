<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\Concerns\ValidatesLocale;
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
    use ValidatesLocale;

    public function index(Request $request): JsonResponse
    {
        $reviews = Review::approved()
            ->with('vehicle:id,brand,model')
            ->orderByDesc('created_at')
            ->paginate(min(max($request->integer('per_page', 10), 1), 50));

        $avgRating = Review::approved()->avg('rating');
        $totalCount = Review::approved()->count();
        $ratingBreakdown = Review::approved()
            ->selectRaw('rating, COUNT(*) as count')
            ->groupBy('rating')
            ->pluck('count', 'rating')
            ->toArray();
        // Ensure all ratings 1-5 are present
        $breakdown = [];
        for ($i = 5; $i >= 1; $i--) {
            $breakdown[$i] = $ratingBreakdown[$i] ?? 0;
        }

        return response()->json([
            'data' => ReviewResource::collection($reviews),
            'aggregate' => [
                'average_rating' => round($avgRating ?? 0, 1),
                'total_count' => $totalCount,
                'breakdown' => $breakdown,
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
        // Honeypot check — return identical-looking response to avoid detection
        if ($request->isHoneypotFilled()) {
            return response()->json([
                'success' => true,
                'message' => 'Vielen Dank für Ihre Bewertung! Sie wird nach Prüfung veröffentlicht.',
            ], 201);
        }

        $review = DB::transaction(function () use ($request) {
            $safe = $request->safe()->except(['website_url']);
            $safe['customer_name'] = strip_tags($safe['customer_name'] ?? '');
            $safe['comment'] = strip_tags($safe['comment'] ?? '');
            if (isset($safe['title'])) {
                $safe['title'] = strip_tags($safe['title']);
            }

            return Review::create(array_merge(
                $safe,
                [
                    'ip_address' => \App\Models\PageView::anonymizeIp($request->ip()),
                    'locale' => $this->resolveLocale($request),
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
