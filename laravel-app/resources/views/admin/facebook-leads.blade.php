<!DOCTYPE html>
<html lang="ro">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Leads — C-H Automobile</title>
    <style>
        body { font-family: system-ui, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; }
        h1 { color: #1877f2; }
        table { width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
        th { background: #1877f2; color: white; padding: 12px; text-align: left; font-size: 0.85rem; }
        td { padding: 10px 12px; border-bottom: 1px solid #eee; font-size: 0.85rem; }
        tr:last-child td { border-bottom: none; }
        .badge { display: inline-block; padding: 2px 8px; border-radius: 12px; font-size: 0.75rem; font-weight: bold; }
        .badge-new { background: #fff3e0; color: #e65100; }
        .badge-contacted { background: #e7f3ff; color: #1877f2; }
        .badge-converted { background: #e6f4ea; color: #137333; }
        .badge-lost { background: #fce8e6; color: #c62828; }
        nav { margin-bottom: 24px; }
        nav a { margin-right: 16px; color: #1877f2; text-decoration: none; font-weight: 500; }
    </style>
</head>
<body>
<div class="container">
    <h1>🎯 Leads</h1>
    <nav>
        <a href="{{ route('admin.facebook.index') }}">← Dashboard</a>
        <a href="{{ route('admin.facebook.posts') }}">Posts</a>
    </nav>

    <table>
        <thead>
            <tr>
                <th>ID</th>
                <th>Source</th>
                <th>Intent</th>
                <th>Car</th>
                <th>Locale</th>
                <th>Name</th>
                <th>Status</th>
                <th>Created</th>
            </tr>
        </thead>
        <tbody>
            @forelse($leads as $lead)
            <tr>
                <td>{{ $lead->id }}</td>
                <td>{{ $lead->source }}</td>
                <td>{{ $lead->intent ?? '—' }}</td>
                <td>{{ $lead->car ? $lead->car->brand . ' ' . $lead->car->model : '—' }}</td>
                <td>{{ strtoupper($lead->locale ?? '') }}</td>
                <td>{{ $lead->name ?? '—' }}</td>
                <td>
                    <span class="badge badge-{{ $lead->status }}">{{ $lead->status }}</span>
                </td>
                <td>{{ $lead->created_at->format('d.m.Y H:i') }}</td>
            </tr>
            @empty
            <tr><td colspan="8" style="text-align:center;color:#999;">No leads found.</td></tr>
            @endforelse
        </tbody>
    </table>

    <div style="margin-top:16px;">
        {{ $leads->links() }}
    </div>
</div>
</body>
</html>
