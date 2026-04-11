export default function Loading() {
  return (
    <div className="page-transition">
      <div className="border-b border-border bg-secondary">
        <div className="container-main py-4">
          <div className="flex items-center gap-2">
            <div className="h-4 w-12 rounded animate-shimmer" />
            <span className="text-muted-foreground">/</span>
            <div className="h-4 w-10 rounded animate-shimmer" />
            <span className="text-muted-foreground">/</span>
            <div className="h-4 w-40 rounded animate-shimmer" />
          </div>
        </div>
      </div>

      <div className="py-8 lg:py-12">
        <div className="container-main">
          <div className="h-5 w-32 rounded animate-shimmer mb-6" />

          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_300px]">
            <div>
              {/* Badge */}
              <div className="h-6 w-24 rounded-full animate-shimmer mb-4" />
              {/* Title */}
              <div className="h-10 w-3/4 rounded-lg animate-shimmer mb-3" />
              <div className="h-10 w-1/2 rounded-lg animate-shimmer mb-4" />
              {/* Excerpt */}
              <div className="h-5 w-full rounded animate-shimmer mb-2" />
              <div className="h-5 w-4/5 rounded animate-shimmer mb-6" />
              {/* Meta */}
              <div className="flex gap-4 mb-8 pb-6 border-b border-border">
                <div className="h-4 w-28 rounded animate-shimmer" />
                <div className="h-4 w-24 rounded animate-shimmer" />
                <div className="h-4 w-32 rounded animate-shimmer" />
              </div>
              {/* Hero image */}
              <div className="aspect-[16/9] rounded-xl animate-shimmer mb-8" />
              {/* Content lines */}
              <div className="space-y-3">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-5 rounded animate-shimmer"
                    style={{ width: `${70 + Math.random() * 30}%` }}
                  />
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <aside className="space-y-6">
              <div className="rounded-xl border border-border p-5">
                <div className="h-4 w-16 rounded animate-shimmer mb-3" />
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full animate-shimmer" />
                  <div>
                    <div className="h-4 w-24 rounded animate-shimmer mb-1" />
                    <div className="h-3 w-20 rounded animate-shimmer" />
                  </div>
                </div>
              </div>
              <div className="rounded-xl border border-border p-5">
                <div className="h-4 w-32 rounded animate-shimmer mb-4" />
                <div className="space-y-4">
                  {Array.from({ length: 2 }).map((_, i) => (
                    <div key={i}>
                      <div className="aspect-[16/9] rounded-lg animate-shimmer mb-2" />
                      <div className="h-4 w-3/4 rounded animate-shimmer" />
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
