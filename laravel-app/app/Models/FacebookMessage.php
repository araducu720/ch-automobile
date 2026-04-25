<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * FacebookMessage — stores all Messenger conversations.
 *
 * @property int         $id
 * @property string      $sender_psid  Page-Scoped User ID.
 * @property string      $direction    in|out
 * @property string      $text         Message body.
 * @property string|null $locale       Detected language.
 * @property string|null $intent       Detected user intent (test_drive, price_offer, …).
 * @property array|null  $raw          Full webhook payload.
 */
class FacebookMessage extends Model
{
    use HasFactory;

    /** @var list<string> */
    protected $fillable = ['sender_psid', 'direction', 'text', 'locale', 'intent', 'raw'];

    /** @var array<string, string> */
    protected $casts = [
        'raw' => 'array',
    ];
}
