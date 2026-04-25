<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Car model — represents a vehicle listing in the marketplace.
 *
 * @property int         $id
 * @property string|null $vin
 * @property string      $brand
 * @property string      $model
 * @property int         $year
 * @property int         $km             Odometer reading (kilometres).
 * @property string|null $fuel           gasoline|diesel|electric|hybrid|lpg|cng
 * @property string|null $transmission   manual|automatic
 * @property int|null    $hp             Horsepower.
 * @property string|null $body_style     sedan|suv|coupe|convertible|hatchback|wagon|van|pickup|truck
 * @property int         $price          Price in cents (e.g. 1500000 = 15 000 EUR).
 * @property string      $currency       ISO 4217 currency code, default EUR.
 * @property string|null $location_city
 * @property string|null $location_country
 * @property string|null $highlights     Short free-text about special features.
 * @property string      $status         draft|published|sold
 * @property array|null  $target_locales JSON array of BCP-47 codes, e.g. ["ro","de","en"].
 * @property array|null  $embedding      Semantic embedding vector (JSON).
 */
class Car extends Model
{
    use HasFactory;

    /** @var list<string> */
    protected $fillable = [
        'vin', 'brand', 'model', 'year', 'km', 'fuel', 'transmission',
        'hp', 'body_style', 'price', 'currency', 'location_city',
        'location_country', 'highlights', 'status', 'target_locales', 'embedding',
    ];

    /** @var array<string, string> */
    protected $casts = [
        'year'           => 'integer',
        'km'             => 'integer',
        'hp'             => 'integer',
        'price'          => 'integer',
        'target_locales' => 'array',
        'embedding'      => 'array',
    ];

    // -------------------------------------------------------------------------
    // Relationships
    // -------------------------------------------------------------------------

    /**
     * The photos attached to this car.
     *
     * @return HasMany<CarPhoto>
     */
    public function photos(): HasMany
    {
        return $this->hasMany(CarPhoto::class)->orderBy('sort_order');
    }

    /**
     * AI-generated translations for this car.
     *
     * @return HasMany<CarTranslation>
     */
    public function translations(): HasMany
    {
        return $this->hasMany(CarTranslation::class);
    }

    /**
     * Facebook posts linked to this car.
     *
     * @return HasMany<FacebookPost>
     */
    public function facebookPosts(): HasMany
    {
        return $this->hasMany(FacebookPost::class);
    }

    // -------------------------------------------------------------------------
    // Helpers
    // -------------------------------------------------------------------------

    /**
     * Return the price formatted as a human-readable string, e.g. "15.000 EUR".
     *
     * @return string
     */
    public function formattedPrice(): string
    {
        return number_format($this->price / 100, 0, '.', '.') . ' ' . ($this->currency ?? 'EUR');
    }

    /**
     * Return the locales this car should be promoted in.
     * Falls back to the global default locale if none are set.
     *
     * @return array<string>
     */
    public function getEffectiveLocales(): array
    {
        return $this->target_locales ?? [config('facebook.default_locale', 'ro')];
    }
}
