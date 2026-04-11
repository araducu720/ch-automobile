export default function Loading() {
  return (
    <div className="py-8 lg:py-12">
      <div className="container-main max-w-4xl">
        {/* Back button */}
        <div className="h-5 w-32 rounded-lg animate-shimmer mb-6" />

        {/* Image gallery */}
        <div className="aspect-[16/9] rounded-xl animate-shimmer mb-8" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="h-8 w-3/4 rounded-lg animate-shimmer" />
            <div className="h-5 w-1/2 rounded-lg animate-shimmer" />

            {/* Specs grid */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="p-3 rounded-lg border border-border">
                  <div className="h-4 w-20 rounded animate-shimmer mb-2" />
                  <div className="h-5 w-28 rounded animate-shimmer" />
                </div>
              ))}
            </div>

            {/* Description */}
            <div className="space-y-2 mt-8">
              <div className="h-6 w-40 rounded-lg animate-shimmer" />
              <div className="h-4 w-full rounded animate-shimmer" />
              <div className="h-4 w-full rounded animate-shimmer" />
              <div className="h-4 w-3/4 rounded animate-shimmer" />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="rounded-xl border border-border p-6 space-y-4">
              <div className="h-8 w-32 rounded-lg animate-shimmer" />
              <div className="h-10 w-full rounded-lg animate-shimmer" />
              <div className="h-10 w-full rounded-lg animate-shimmer" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
