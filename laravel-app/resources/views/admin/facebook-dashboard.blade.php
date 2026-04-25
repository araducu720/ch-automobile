<!DOCTYPE html>
<html lang="ro">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>C-H Automobile — Facebook Dashboard</title>
    <style>
        body { font-family: system-ui, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; }
        h1 { color: #1877f2; }
        .stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px; }
        .stat { background: white; border-radius: 8px; padding: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
        .stat .value { font-size: 2rem; font-weight: bold; color: #1877f2; }
        .stat .label { color: #666; font-size: 0.9rem; margin-top: 4px; }
        table { width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1); margin-bottom: 24px; }
        th { background: #1877f2; color: white; padding: 12px; text-align: left; font-size: 0.85rem; }
        td { padding: 10px 12px; border-bottom: 1px solid #eee; font-size: 0.85rem; }
        tr:last-child td { border-bottom: none; }
        .badge { display: inline-block; padding: 2px 8px; border-radius: 12px; font-size: 0.75rem; font-weight: bold; }
        .badge-blue { background: #e7f3ff; color: #1877f2; }
        .badge-green { background: #e6f4ea; color: #137333; }
        .badge-orange { background: #fff3e0; color: #e65100; }
        nav { margin-bottom: 24px; }
        nav a { margin-right: 16px; color: #1877f2; text-decoration: none; font-weight: 500; }
        nav a:hover { text-decoration: underline; }
    </style>
</head>
<body>
<div class="container">
    <h1>🤖 Facebook AI Agent Dashboard</h1>

    <nav>
        <a href="{{ route('admin.facebook.index') }}">Dashboard</a>
        <a href="{{ route('admin.facebook.posts') }}">Posts</a>
        <a href="{{ route('admin.facebook.leads') }}">Leads</a>
    </nav>

    <div class="stats">
        <div class="stat">
            <div class="value">{{ $stats['total_posts'] }}</div>
            <div class="label">Total Posts</div>
        </div>
        <div class="stat">
            <div class="value">{{ $stats['posts_today'] }}</div>
            <div class="label">Posts Today</div>
        </div>
        <div class="stat">
            <div class="value">{{ $stats['new_leads'] }}</div>
            <div class="label">New Leads</div>
        </div>
        <div class="stat">
            <div class="value">{{ $stats['published_cars'] }}</div>
            <div class="label">Published Cars</div>
        </div>
    </div>

    <h2>Recent Posts</h2>
    <table>
        <thead>
            <tr>
                <th>Car</th>
                <th>Type</th>
                <th>Locale</th>
                <th>FB Object ID</th>
                <th>Posted At</th>
            </tr>
        </thead>
        <tbody>
            @forelse($recentPosts as $post)
            <tr>
                <td>{{ $post->car ? $post->car->brand . ' ' . $post->car->model : '—' }}</td>
                <td><span class="badge badge-blue">{{ $post->type }}</span></td>
                <td>{{ strtoupper($post->locale) }}</td>
                <td><code>{{ $post->fb_object_id ?? '—' }}</code></td>
                <td>{{ $post->posted_at?->format('d.m.Y H:i') ?? '—' }}</td>
            </tr>
            @empty
            <tr><td colspan="5" style="text-align:center;color:#999;">No posts yet.</td></tr>
            @endforelse
        </tbody>
    </table>

    <h2>Recent Leads</h2>
    <table>
        <thead>
            <tr>
                <th>Source</th>
                <th>Intent</th>
                <th>Car</th>
                <th>Locale</th>
                <th>Status</th>
                <th>Created</th>
            </tr>
        </thead>
        <tbody>
            @forelse($recentLeads as $lead)
            <tr>
                <td>{{ $lead->source }}</td>
                <td>{{ $lead->intent ?? '—' }}</td>
                <td>{{ $lead->car ? $lead->car->brand . ' ' . $lead->car->model : '—' }}</td>
                <td>{{ strtoupper($lead->locale ?? '') }}</td>
                <td>
                    <span class="badge {{ $lead->status === 'new' ? 'badge-orange' : 'badge-green' }}">
                        {{ $lead->status }}
                    </span>
                </td>
                <td>{{ $lead->created_at->format('d.m.Y H:i') }}</td>
            </tr>
            @empty
            <tr><td colspan="6" style="text-align:center;color:#999;">No leads yet.</td></tr>
            @endforelse
        </tbody>
    </table>

    <h2>Facebook Groups</h2>
    <table>
        <thead>
            <tr>
                <th>Name</th>
                <th>Language</th>
                <th>Max/Day</th>
                <th>API Allowed</th>
                <th>Last Posted</th>
            </tr>
        </thead>
        <tbody>
            @forelse($groups as $group)
            <tr>
                <td>{{ $group->name }}</td>
                <td>{{ strtoupper($group->language ?? '—') }}</td>
                <td>{{ $group->max_per_day }}</td>
                <td>
                    @if($group->manual_only)
                        <span class="badge badge-orange">Manual Only</span>
                    @else
                        <span class="badge badge-green">API</span>
                    @endif
                </td>
                <td>{{ $group->last_posted_at?->format('d.m.Y H:i') ?? 'Never' }}</td>
            </tr>
            @empty
            <tr><td colspan="5" style="text-align:center;color:#999;">No groups configured.</td></tr>
            @endforelse
        </tbody>
    </table>
</div>
</body>
</html>
