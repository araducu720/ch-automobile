export default function Loading() {
  return (
    <div className="py-8 lg:py-12">
      <div className="container-main">
        {/* Hero */}
        <div className="max-w-3xl mb-12">
          <div className="h-10 w-64 rounded-lg animate-shimmer mb-4" />
          <div className="h-5 w-full rounded-lg animate-shimmer" />
          <div className="h-5 w-3/4 rounded-lg animate-shimmer mt-2" />
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-[var(--border-primary)] p-6 text-center">
              <div className="h-10 w-16 rounded-lg animate-shimmer mx-auto mb-2" />
              <div className="h-4 w-24 rounded animate-shimmer mx-auto" />
            </div>
          ))}
        </div>

        {/* Content sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="aspect-[4/3] rounded-xl animate-shimmer" />
          <div className="space-y-4 flex flex-col justify-center">
            <div className="h-7 w-48 rounded-lg animate-shimmer" />
            <div className="h-4 w-full rounded animate-shimmer" />
            <div className="h-4 w-full rounded animate-shimmer" />
            <div className="h-4 w-3/4 rounded animate-shimmer" />
          </div>
        </div>

        {/* Team */}
        <div className="h-7 w-40 rounded-lg animate-shimmer mb-6" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-[var(--border-primary)] overflow-hidden">
              <div className="aspect-square animate-shimmer" />
              <div className="p-4 space-y-2">
                <div className="h-5 w-32 rounded animate-shimmer" />
                <div className="h-4 w-24 rounded animate-shimmer" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
