<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\BlogPostDetailResource;
use App\Http\Resources\BlogPostResource;
use App\Models\BlogCategory;
use App\Models\BlogPost;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BlogController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $locale = $request->get('locale', 'de');
        app()->setLocale($locale);

        $query = BlogPost::published()->recent()->with(['category', 'author', 'media']);

        if ($request->filled('category')) {
            $query->whereHas('category', fn ($q) => $q->where('slug', $request->category));
        }

        $posts = $query->paginate(min($request->integer('per_page', 9), 50));

        return response()->json([
            'data' => BlogPostResource::collection($posts),
            'meta' => [
                'current_page' => $posts->currentPage(),
                'last_page' => $posts->lastPage(),
                'total' => $posts->total(),
            ],
        ]);
    }

    public function show(string $slug, Request $request): JsonResponse
    {
        $locale = $request->get('locale', 'de');
        app()->setLocale($locale);

        $post = BlogPost::published()
            ->with(['category', 'author', 'media'])
            ->where('slug', $slug)
            ->firstOrFail();

        $post->increment('views_count');

        $related = BlogPost::published()
            ->where('id', '!=', $post->id)
            ->when($post->category_id, fn ($q) => $q->where('category_id', $post->category_id))
            ->recent()
            ->limit(3)
            ->get();

        return response()->json([
            'data' => new BlogPostDetailResource($post),
            'related' => $related->map(fn (BlogPost $p) => [
                'title' => $p->getTranslation('title', $locale, false) ?? $p->getTranslation('title', 'de'),
                'slug' => $p->slug,
                'featured_image_thumbnail' => $p->getFirstMediaUrl('featured_image', 'thumbnail'),
                'published_at' => $p->published_at?->toIso8601String(),
            ]),
        ]);
    }

    public function categories(Request $request): JsonResponse
    {
        $locale = $request->get('locale', 'de');
        app()->setLocale($locale);

        $categories = BlogCategory::withCount(['posts' => fn ($q) => $q->published()])
            ->orderBy('sort_order')
            ->get()
            ->map(fn (BlogCategory $cat) => [
                'name' => $cat->getTranslation('name', $locale, false) ?? $cat->getTranslation('name', 'de'),
                'slug' => $cat->slug,
                'posts_count' => $cat->posts_count,
            ]);

        return response()->json(['data' => $categories]);
    }
}
