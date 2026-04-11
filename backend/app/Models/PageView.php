<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\MassPrunable;
use Illuminate\Database\Eloquent\Model;

class PageView extends Model
{
    use HasFactory, MassPrunable;

    protected $fillable = [
        'page_type',
        'page_id',
        'url',
        'ip_address',
        'user_agent',
        'referer',
        'locale',
    ];

    protected $casts = [
        'page_id' => 'integer',
    ];

    /**
     * Get the prunable model query — remove page views older than 90 days.
     */
    public function prunable(): Builder
    {
        return static::where('created_at', '<=', now()->subDays(90));
    }

    /**
     * Scope: filter by page type.
     */
    public function scopeForType(Builder $query, string $type): Builder
    {
        return $query->where('page_type', $type);
    }

    /**
     * Scope: filter by specific page.
     */
    public function scopeForPage(Builder $query, string $type, int $id): Builder
    {
        return $query->where('page_type', $type)->where('page_id', $id);
    }

    /**
     * Scope: views from today.
     */
    public function scopeToday(Builder $query): Builder
    {
        return $query->whereDate('created_at', today());
    }

    /**
     * Scope: views from this month.
     */
    public function scopeThisMonth(Builder $query): Builder
    {
        return $query->whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year);
    }
}
