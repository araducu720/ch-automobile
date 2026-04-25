<!DOCTYPE html>
<html lang="ro">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Facebook Posts — C-H Automobile</title>
    <style>
        body { font-family: system-ui, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; }
        h1 { color: #1877f2; }
        table { width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
        th { background: #1877f2; color: white; padding: 12px; text-align: left; font-size: 0.85rem; }
        td { padding: 10px 12px; border-bottom: 1px solid #eee; font-size: 0.85rem; }
        tr:last-child td { border-bottom: none; }
        .badge { display: inline-block; padding: 2px 8px; border-radius: 12px; font-size: 0.75rem; font-weight: bold; background: #e7f3ff; color: #1877f2; }
        nav { margin-bottom: 24px; }
        nav a { margin-right: 16px; color: #1877f2; text-decoration: none; font-weight: 500; }
    </style>
</head>
<body>
<div class="container">
    <h1>📢 Facebook Posts</h1>
    <nav>
        <a href="{{ route('admin.facebook.index') }}">← Dashboard</a>
        <a href="{{ route('admin.facebook.leads') }}">Leads</a>
    </nav>

    <table>
        <thead>
            <tr>
                <th>ID</th>
                <th>Car</th>
                <th>Type</th>
                <th>Locale</th>
                <th>FB Object ID</th>
                <th>Posted At</th>
            </tr>
        </thead>
        <tbody>
            @forelse($posts as $post)
            <tr>
                <td>{{ $post->id }}</td>
                <td>{{ $post->car ? $post->car->brand . ' ' . $post->car->model . ' ' . $post->car->year : '—' }}</td>
                <td><span class="badge">{{ $post->type }}</span></td>
                <td>{{ strtoupper($post->locale) }}</td>
                <td><code>{{ $post->fb_object_id ?? '—' }}</code></td>
                <td>{{ $post->posted_at?->format('d.m.Y H:i') ?? '—' }}</td>
            </tr>
            @empty
            <tr><td colspan="6" style="text-align:center;color:#999;">No posts found.</td></tr>
            @endforelse
        </tbody>
    </table>

    <div style="margin-top:16px;">
        {{ $posts->links() }}
    </div>
</div>
</body>
</html>
