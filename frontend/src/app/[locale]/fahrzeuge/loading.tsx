export default function Loading() {
  return (
    <div className="py-8 lg:py-12">
      <div className="container-main">
        <div className="max-w-2xl mb-10">
          <div className="h-9 w-48 rounded-lg animate-shimmer" />
          <div className="h-5 w-72 rounded-lg animate-shimmer mt-3" />
        </div>
        <div className="h-14 w-full rounded-xl animate-shimmer mb-8" />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-border overflow-hidden">
              <div className="aspect-[16/10] animate-shimmer" />
              <div className="p-4 space-y-3">
                <div className="h-5 w-3/4 rounded-lg animate-shimmer" />
                <div className="h-4 w-1/2 rounded-lg animate-shimmer" />
                <div className="flex gap-2">
                  <div className="h-6 w-16 rounded-full animate-shimmer" />
                  <div className="h-6 w-20 rounded-full animate-shimmer" />
                  <div className="h-6 w-14 rounded-full animate-shimmer" />
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-border">
                  <div className="h-6 w-24 rounded-lg animate-shimmer" />
                  <div className="h-9 w-20 rounded-lg animate-shimmer" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
