export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <div className="relative h-12 w-12">
        <div className="absolute inset-0 rounded-full border-4 border-[var(--border-primary)]" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[var(--brand-primary)] animate-spin" />
      </div>
      <p className="text-sm text-[var(--text-secondary)] animate-pulse">Wird geladen…</p>
    </div>
  );
}
