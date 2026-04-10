export default function Loading() {
  return (
    <div className="py-8 lg:py-12">
      <div className="container-main max-w-3xl">
        <div className="h-9 w-56 rounded-lg animate-shimmer mb-3" />
        <div className="h-5 w-80 rounded-lg animate-shimmer mb-10" />

        {/* Vehicle info section */}
        <div className="space-y-4 mb-8">
          <div className="h-6 w-48 rounded-lg animate-shimmer" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="h-10 w-full rounded-lg animate-shimmer" />
            <div className="h-10 w-full rounded-lg animate-shimmer" />
            <div className="h-10 w-full rounded-lg animate-shimmer" />
            <div className="h-10 w-full rounded-lg animate-shimmer" />
          </div>
        </div>

        {/* Personal info */}
        <div className="space-y-4 mb-8">
          <div className="h-6 w-40 rounded-lg animate-shimmer" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="h-10 w-full rounded-lg animate-shimmer" />
            <div className="h-10 w-full rounded-lg animate-shimmer" />
            <div className="h-10 w-full rounded-lg animate-shimmer" />
          </div>
        </div>

        {/* Photo upload */}
        <div className="h-32 w-full rounded-xl border-2 border-dashed border-[var(--border-primary)] animate-shimmer mb-8" />

        <div className="h-10 w-40 rounded-lg animate-shimmer" />
      </div>
    </div>
  );
}
