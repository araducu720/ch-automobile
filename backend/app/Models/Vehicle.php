<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;
use Spatie\Translatable\HasTranslations;
use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;
use Laravel\Scout\Searchable;

class Vehicle extends Model implements HasMedia
{
    use HasFactory, SoftDeletes, InteractsWithMedia, HasTranslations, HasSlug, Searchable;

    protected $fillable = [
        'brand', 'model', 'variant', 'year', 'price', 'price_on_request',
        'mileage', 'fuel_type', 'transmission', 'power_hp', 'power_kw',
        'engine_displacement', 'color', 'interior_color', 'body_type',
        'doors', 'seats', 'vin', 'registration_date', 'condition',
        'description', 'features', 'equipment', 'status', 'is_featured',
        'mobile_de_id', 'autoscout_id', 'image_urls', 'slug', 'emission_class',
        'emission_sticker', 'co2_emissions', 'fuel_consumption_combined',
        'fuel_consumption_urban', 'fuel_consumption_extra_urban',
        'previous_owners', 'accident_free', 'non_smoker', 'garage_kept',
        'tuv_until', 'warranty', 'sort_order', 'views_count',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'price_on_request' => 'boolean',
        'mileage' => 'integer',
        'power_hp' => 'integer',
        'power_kw' => 'integer',
        'engine_displacement' => 'integer',
        'doors' => 'integer',
        'seats' => 'integer',
        'year' => 'integer',
        'features' => 'array',
        'equipment' => 'array',
        'image_urls' => 'array',
        'is_featured' => 'boolean',
        'co2_emissions' => 'decimal:2',
        'fuel_consumption_combined' => 'decimal:1',
        'fuel_consumption_urban' => 'decimal:1',
        'fuel_consumption_extra_urban' => 'decimal:1',
        'previous_owners' => 'integer',
        'accident_free' => 'boolean',
        'non_smoker' => 'boolean',
        'garage_kept' => 'boolean',
        'registration_date' => 'date',
        'tuv_until' => 'date',
        'views_count' => 'integer',
        'sort_order' => 'integer',
    ];

    public array $translatable = ['description'];

    public function getSlugOptions(): SlugOptions
    {
        return SlugOptions::create()
            ->generateSlugsFrom(fn ($model) => "{$model->brand} {$model->model} {$model->year}")
            ->saveSlugsTo('slug')
            ->slugsShouldBeNoLongerThan(80);
    }

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('images')
            ->useFallbackUrl('/images/vehicle-placeholder.jpg');

        $this->addMediaCollection('documents');
    }

    public function registerMediaConversions(?Media $media = null): void
    {
        $this->addMediaConversion('thumbnail')
            ->width(400)
            ->height(300)
            ->sharpen(10)
            ->format('webp')
            ->quality(80)
            ->performOnCollections('images');

        $this->addMediaConversion('medium')
            ->width(800)
            ->height(600)
            ->format('webp')
            ->quality(85)
            ->performOnCollections('images');

        $this->addMediaConversion('large')
            ->width(1600)
            ->height(1200)
            ->format('webp')
            ->quality(90)
            ->performOnCollections('images');
    }

    public function toSearchableArray(): array
    {
        return [
            'id' => $this->id,
            'brand' => $this->brand,
            'model' => $this->model,
            'variant' => $this->variant,
            'year' => $this->year,
            'price' => (float) $this->price,
            'fuel_type' => $this->fuel_type,
            'transmission' => $this->transmission,
            'body_type' => $this->body_type,
            'condition' => $this->condition,
            'color' => $this->color,
            'status' => $this->status,
        ];
    }

    // Relationships

    public function inquiries(): HasMany
    {
        return $this->hasMany(Inquiry::class);
    }

    public function reservations(): HasMany
    {
        return $this->hasMany(Reservation::class);
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    // Scopes

    public function scopeAvailable($query)
    {
        return $query->where('status', 'available');
    }

    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    public function scopePublished($query)
    {
        return $query->whereIn('status', ['available', 'reserved']);
    }

    public function scopeFilterByBrand($query, ?string $brand)
    {
        return $brand ? $query->where('brand', $brand) : $query;
    }

    public function scopeFilterByPriceRange($query, ?float $min, ?float $max)
    {
        if ($min) $query->where('price', '>=', $min);
        if ($max) $query->where('price', '<=', $max);
        return $query;
    }

    public function scopeFilterByYearRange($query, ?int $min, ?int $max)
    {
        if ($min) $query->where('year', '>=', $min);
        if ($max) $query->where('year', '<=', $max);
        return $query;
    }

    public function scopeFilterByFuelType($query, ?string $fuelType)
    {
        return $fuelType ? $query->where('fuel_type', $fuelType) : $query;
    }

    public function scopeFilterByTransmission($query, ?string $transmission)
    {
        return $transmission ? $query->where('transmission', $transmission) : $query;
    }

    public function scopeFilterByBodyType($query, ?string $bodyType)
    {
        return $bodyType ? $query->where('body_type', $bodyType) : $query;
    }

    public function scopeFilterByCondition($query, ?string $condition)
    {
        return $condition ? $query->where('condition', $condition) : $query;
    }

    // Accessors

    public function getFullNameAttribute(): string
    {
        return trim("{$this->brand} {$this->model} {$this->variant}");
    }

    public function getFormattedPriceAttribute(): string
    {
        if ($this->price_on_request) {
            return 'Preis auf Anfrage';
        }
        return number_format($this->price, 0, ',', '.') . ' €';
    }

    public function getFormattedMileageAttribute(): string
    {
        return number_format($this->mileage, 0, ',', '.') . ' km';
    }

    public function getMainImageUrlAttribute(): ?string
    {
        $media = $this->getFirstMedia('images');
        if ($media) {
            return $media->getUrl('medium');
        }
        $urls = $this->image_urls;
        return $urls[0] ?? null;
    }

    public function getThumbnailUrlAttribute(): ?string
    {
        $media = $this->getFirstMedia('images');
        if ($media) {
            return $media->getUrl('thumbnail');
        }
        $urls = $this->image_urls;
        if (!empty($urls[0])) {
            return str_replace('/1280x960.webp', '/400x300.webp', $urls[0]);
        }
        return null;
    }

    public function getImageGalleryAttribute(): array
    {
        $spatieMedia = $this->getMedia('images');
        if ($spatieMedia->isNotEmpty()) {
            return $spatieMedia->map(fn ($media) => [
                'id' => $media->id,
                'thumbnail' => $media->getUrl('thumbnail'),
                'medium' => $media->getUrl('medium'),
                'large' => $media->getUrl('large'),
                'original' => $media->getUrl(),
                'alt' => "{$this->brand} {$this->model} {$this->year} - Foto",
            ])->toArray();
        }

        $urls = $this->image_urls ?? [];
        return collect($urls)->values()->map(fn ($url, $i) => [
            'id' => $i + 1,
            'thumbnail' => str_replace('/1280x960.webp', '/400x300.webp', $url),
            'medium' => str_replace('/1280x960.webp', '/800x600.webp', $url),
            'large' => $url,
            'original' => $url,
            'alt' => "{$this->brand} {$this->model} {$this->year} - Foto " . ($i + 1),
        ])->toArray();
    }
}
