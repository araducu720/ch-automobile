export default function Loading() {
  return (
    <div className="py-8 lg:py-12">
      <div className="container-main">
        <div className="max-w-2xl mb-10">
          <div className="h-9 w-32 rounded-lg animate-shimmer" />
          <div className="h-5 w-64 rounded-lg animate-shimmer mt-3" />
        </div>
        <div className="flex flex-wrap gap-2 mb-8">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-7 w-20 rounded-full animate-shimmer" />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-[var(--border-primary)] overflow-hidden">
              <div className="aspect-[16/9] animate-shimmer" />
              <div className="p-5 space-y-3">
                <div className="h-5 w-16 rounded-full animate-shimmer" />
                <div className="h-6 w-3/4 rounded-lg animate-shimmer" />
                <div className="h-4 w-full rounded-lg animate-shimmer" />
                <div className="h-4 w-2/3 rounded-lg animate-shimmer" />
                <div className="flex items-center gap-3 pt-2">
                  <div className="h-4 w-24 rounded-lg animate-shimmer" />
                  <div className="h-4 w-20 rounded-lg animate-shimmer" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
