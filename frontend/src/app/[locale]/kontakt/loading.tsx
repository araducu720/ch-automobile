export default function Loading() {
  return (
    <div className="py-8 lg:py-12">
      <div className="container-main max-w-3xl">
        <div className="h-9 w-40 rounded-lg animate-shimmer mb-3" />
        <div className="h-5 w-72 rounded-lg animate-shimmer mb-10" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact form */}
          <div className="space-y-4">
            <div className="h-10 w-full rounded-lg animate-shimmer" />
            <div className="h-10 w-full rounded-lg animate-shimmer" />
            <div className="h-10 w-full rounded-lg animate-shimmer" />
            <div className="h-32 w-full rounded-lg animate-shimmer" />
            <div className="h-10 w-32 rounded-lg animate-shimmer" />
          </div>

          {/* Contact info */}
          <div className="space-y-6">
            <div className="rounded-xl border border-border p-6 space-y-4">
              <div className="h-5 w-40 rounded animate-shimmer" />
              <div className="h-4 w-56 rounded animate-shimmer" />
              <div className="h-4 w-48 rounded animate-shimmer" />
              <div className="h-4 w-52 rounded animate-shimmer" />
            </div>
            <div className="aspect-[4/3] rounded-xl animate-shimmer" />
          </div>
        </div>
      </div>
    </div>
  );
}
