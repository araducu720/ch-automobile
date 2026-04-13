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
     * Get the prunable model query — remove page views older than 30 days.
     */
    public function prunable(): Builder
    {
        return static::where('created_at', '<=', now()->subDays(30));
    }

    /**
     * Anonymize IP address (zero last octet for IPv4, last 80 bits for IPv6).
     */
    public static function anonymizeIp(?string $ip): ?string
    {
        if (! $ip) {
            return null;
        }

        if (filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_IPV4)) {
            return preg_replace('/\.\d+$/', '.0', $ip);
        }

        if (filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_IPV6)) {
            // Zero last 5 groups (80 bits)
            $parts = explode(':', $ip);
            $parts = array_pad($parts, 8, '0');
            for ($i = 3; $i < 8; $i++) {
                $parts[$i] = '0';
            }

            return implode(':', $parts);
        }

        return null;
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
