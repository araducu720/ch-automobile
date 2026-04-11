<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BlogPostDetailResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $locale = $request->get('locale', app()->getLocale());

        return [
            'id' => $this->id,
            'title' => $this->getTranslation('title', $locale, false)
                ?? $this->getTranslation('title', 'de'),
            'slug' => $this->slug,
            'content' => $this->getTranslation('content', $locale, false)
                ?? $this->getTranslation('content', 'de'),
            'excerpt' => $this->getTranslation('excerpt', $locale, false)
                ?? $this->getTranslation('excerpt', 'de'),
            'category' => $this->whenLoaded('category', fn () => $this->category ? [
                'name' => $this->category->getTranslation('name', $locale, false),
                'slug' => $this->category->slug,
            ] : null),
            'author' => $this->whenLoaded('author', fn () => $this->author->name),
            'featured_image' => $this->getFirstMediaUrl('featured_image', 'hero'),
            'published_at' => $this->published_at?->toIso8601String(),
            'meta_title' => $this->getTranslation('meta_title', $locale, false),
            'meta_description' => $this->getTranslation('meta_description', $locale, false),
            'views_count' => $this->views_count,
        ];
    }
}
