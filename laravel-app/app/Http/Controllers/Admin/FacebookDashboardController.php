<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Car;
use App\Models\FacebookGroup;
use App\Models\FacebookPost;
use App\Models\Lead;
use Illuminate\Http\Request;
use Illuminate\View\View;

/**
 * FacebookDashboardController — minimal admin dashboard for Facebook activity.
 *
 * Shows an overview of recent posts, leads, and group activity.
 * Protected by 'auth' middleware defined in routes/web.php.
 */
class FacebookDashboardController extends Controller
{
    /**
     * Display the Facebook marketing dashboard.
     */
    public function index(): View
    {
        $stats = [
            'total_posts'    => FacebookPost::count(),
            'posts_today'    => FacebookPost::whereDate('posted_at', today())->count(),
            'new_leads'      => Lead::where('status', 'new')->count(),
            'published_cars' => Car::where('status', 'published')->count(),
        ];

        $recentPosts = FacebookPost::with('car')
            ->latest('posted_at')
            ->limit(10)
            ->get();

        $recentLeads = Lead::with('car')
            ->latest()
            ->limit(10)
            ->get();

        $groups = FacebookGroup::orderBy('name')->get();

        return view('admin.facebook-dashboard', compact('stats', 'recentPosts', 'recentLeads', 'groups'));
    }

    /**
     * Display a list of all Facebook posts.
     */
    public function posts(Request $request): View
    {
        $posts = FacebookPost::with('car')
            ->when($request->input('type'), fn ($q, $type) => $q->where('type', $type))
            ->latest('posted_at')
            ->paginate(25);

        return view('admin.facebook-posts', compact('posts'));
    }

    /**
     * Display a list of all leads.
     */
    public function leads(Request $request): View
    {
        $leads = Lead::with('car')
            ->when($request->input('status'), fn ($q, $s) => $q->where('status', $s))
            ->latest()
            ->paginate(25);

        return view('admin.facebook-leads', compact('leads'));
    }
}
