<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * FacebookPost — tracks every post published to Facebook by the AI agent.
 *
 * @property int         $id
 * @property int|null    $car_id         The vehicle this post is about (nullable for content-calendar posts).
 * @property string      $fb_object_id   Graph API object ID returned by Meta.
 * @property string      $type           new_listing|repost|group|content_calendar|comment_reply
 * @property string      $locale         BCP-47 code.
 * @property string      $content        The text that was posted.
 * @property array|null  $raw_response   Full JSON response from Graph API.
 * @property \Carbon\Carbon $posted_at   When the post went live.
 */
class FacebookPost extends Model
{
    use HasFactory;

    /** @var list<string> */
    protected $fillable = [
        'car_id', 'fb_object_id', 'type', 'locale', 'content', 'raw_response', 'posted_at',
    ];

    /** @var array<string, string> */
    protected $casts = [
        'raw_response' => 'array',
        'posted_at'    => 'datetime',
    ];

    /**
     * The car linked to this post (if any).
     *
     * @return BelongsTo<Car, FacebookPost>
     */
    public function car(): BelongsTo
    {
        return $this->belongsTo(Car::class);
    }
}
