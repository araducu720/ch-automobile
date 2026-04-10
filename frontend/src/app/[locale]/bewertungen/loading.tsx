export default function Loading() {
  return (
    <div className="py-8 lg:py-12">
      <div className="container-main">
        <div className="max-w-2xl mb-10">
          <div className="h-9 w-56 rounded-lg animate-shimmer" />
          <div className="h-5 w-80 rounded-lg animate-shimmer mt-3" />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-[var(--border-primary)] p-6 text-center">
              <div className="h-8 w-16 rounded-lg animate-shimmer mx-auto mb-2" />
              <div className="h-4 w-24 rounded animate-shimmer mx-auto" />
            </div>
          ))}
        </div>

        {/* Review cards */}
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-[var(--border-primary)] p-6 space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full animate-shimmer" />
                <div>
                  <div className="h-5 w-32 rounded animate-shimmer" />
                  <div className="h-4 w-24 rounded animate-shimmer mt-1" />
                </div>
              </div>
              <div className="h-4 w-full rounded animate-shimmer" />
              <div className="h-4 w-3/4 rounded animate-shimmer" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
