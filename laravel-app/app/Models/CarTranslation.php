<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * CarTranslation — AI-generated translations for a vehicle listing.
 *
 * One row per (car_id, locale) pair.
 *
 * @property int    $id
 * @property int    $car_id
 * @property string $locale      BCP-47 code, e.g. "ro".
 * @property string $title       Short listing title.
 * @property string $description Long marketing description.
 * @property string $meta_title  SEO meta title.
 * @property string $meta_desc   SEO meta description.
 * @property string $slug        URL-friendly slug (unique per locale).
 */
class CarTranslation extends Model
{
    use HasFactory;

    /** @var list<string> */
    protected $fillable = ['car_id', 'locale', 'title', 'description', 'meta_title', 'meta_desc', 'slug'];

    /**
     * The car this translation belongs to.
     *
     * @return BelongsTo<Car, CarTranslation>
     */
    public function car(): BelongsTo
    {
        return $this->belongsTo(Car::class);
    }
}
