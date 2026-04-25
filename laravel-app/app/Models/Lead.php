<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Lead — a potential customer who expressed interest via social media.
 *
 * @property int         $id
 * @property string      $source       facebook_messenger|facebook_comment|…
 * @property string|null $fb_object_id Graph API object ID that triggered this lead.
 * @property string|null $name
 * @property string|null $phone
 * @property string|null $locale       BCP-47 code.
 * @property string|null $intent       test_drive|price_offer|financing|reservation
 * @property int|null    $car_id       Car the customer is interested in.
 * @property string      $status       new|contacted|converted|lost
 */
class Lead extends Model
{
    use HasFactory;

    /** @var list<string> */
    protected $fillable = [
        'source', 'fb_object_id', 'name', 'phone', 'locale',
        'intent', 'car_id', 'status',
    ];

    /**
     * The car this lead is interested in.
     *
     * @return BelongsTo<Car, Lead>
     */
    public function car(): BelongsTo
    {
        return $this->belongsTo(Car::class);
    }
}
