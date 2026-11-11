/** Grey placeholder blocks shown while a page loads (pure CSS, no data). */
export const Bone = ({ className = "" }: { className?: string }) => (
  <div aria-hidden className={`animate-pulse rounded-md bg-neutral-100 ${className}`} />
);

export function CardSkeleton() {
  return (
    <div>
      <Bone className="aspect-[4/5] w-full" />
      <Bone className="mt-3 h-4 w-4/5" />
      <Bone className="mt-2 h-3 w-1/2" />
      <Bone className="mt-3 h-4 w-1/3" />
    </div>
  );
}

export function GridSkeleton({ count = 6, cols = "grid-cols-2 md:grid-cols-3 lg:grid-cols-4" }: { count?: number; cols?: string }) {
  return (
    <div className={`grid gap-x-4 gap-y-10 sm:gap-x-6 ${cols}`}>
      {Array.from({ length: count }, (_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

export function PageLoading({ children }: { children: React.ReactNode }) {
  return (
    <div role="status" aria-live="polite" aria-label="Loading">
      <span className="sr-only">Loading…</span>
      {children}
    </div>
  );
}
