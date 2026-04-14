export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4" role="status" aria-live="polite">
      <div className="relative h-12 w-12" aria-hidden="true">
        <div className="absolute inset-0 rounded-full border-4 border-border" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-brand animate-spin" />
      </div>
      <p className="text-sm text-muted animate-pulse sr-only">Loading…</p>
    </div>
  );
}
