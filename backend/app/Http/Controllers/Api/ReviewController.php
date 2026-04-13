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
    private const ALLOWED_LOCALES = ['de', 'en', 'fr', 'it', 'es', 'pt', 'nl', 'pl', 'cs', 'sk', 'hu', 'ro', 'bg', 'hr', 'sl', 'et', 'lv', 'lt', 'fi', 'sv', 'da', 'el', 'ga', 'mt'];

    public function index(Request $request): JsonResponse
    {
        $reviews = Review::approved()
            ->with('vehicle:id,brand,model')
            ->orderByDesc('created_at')
            ->paginate($request->integer('per_page', 10));

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
        // Honeypot check
        if ($request->isHoneypotFilled()) {
            return response()->json(['success' => true], 200);
        }

        $review = DB::transaction(function () use ($request) {
            return Review::create(array_merge(
                $request->safe()->except(['website_url']),
                [
                    'ip_address' => $request->ip(),
                    'locale' => in_array($request->get('locale', 'de'), self::ALLOWED_LOCALES, true) ? $request->get('locale', 'de') : 'de',
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
