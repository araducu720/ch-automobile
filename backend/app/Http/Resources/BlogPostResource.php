<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BlogPostResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $locale = $request->get('locale', app()->getLocale());

        return [
            'id' => $this->id,
            'title' => $this->getTranslation('title', $locale, false)
                ?? $this->getTranslation('title', 'de'),
            'slug' => $this->slug,
            'excerpt' => $this->getTranslation('excerpt', $locale, false)
                ?? $this->getTranslation('excerpt', 'de'),
            'category' => $this->whenLoaded('category', fn () => $this->category ? [
                'name' => $this->category->getTranslation('name', $locale, false)
                    ?? $this->category->getTranslation('name', 'de'),
                'slug' => $this->category->slug,
            ] : null),
            'author' => $this->whenLoaded('author', fn () => $this->author->name),
            'featured_image' => $this->getFirstMediaUrl('featured_image', 'hero'),
            'featured_image_thumbnail' => $this->getFirstMediaUrl('featured_image', 'thumbnail'),
            'published_at' => $this->published_at?->toIso8601String(),
            'views_count' => $this->views_count,
        ];
    }
}
