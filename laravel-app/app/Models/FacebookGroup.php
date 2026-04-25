<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * FacebookGroup — configuration record for each group the agent posts to.
 *
 * @property int         $id
 * @property string      $fb_group_id    Numeric Facebook Group ID.
 * @property string      $name           Human-readable name.
 * @property string|null $language       BCP-47 locale this group uses.
 * @property int         $max_per_day    Max posts per day (overrides global config).
 * @property bool        $manual_only    If true, the API cannot post here; require manual posting.
 * @property bool        $allows_api_posts  Whether the group allows Graph API posts.
 * @property string|null $notes
 * @property \Carbon\Carbon|null $last_posted_at
 */
class FacebookGroup extends Model
{
    use HasFactory;

    /** @var list<string> */
    protected $fillable = [
        'fb_group_id', 'name', 'language', 'max_per_day',
        'manual_only', 'allows_api_posts', 'notes', 'last_posted_at',
    ];

    /** @var array<string, string> */
    protected $casts = [
        'max_per_day'      => 'integer',
        'manual_only'      => 'boolean',
        'allows_api_posts' => 'boolean',
        'last_posted_at'   => 'datetime',
    ];
}
