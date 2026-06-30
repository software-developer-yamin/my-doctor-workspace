export default function HospitalDetailsLoading() {
  return (
    <main className="container mx-auto px-4 py-6 lg:py-12">
      {/* Back Button Skeleton */}
      <div className="mb-6 h-10 w-40 animate-pulse rounded-xl bg-muted/40" />

      <div className="flex w-full flex-col gap-6 lg:gap-12">
        {/* Hospital Info Card Skeleton */}
        <div className="relative flex w-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          {/* Cover Skeleton */}
          <div className="relative h-[180px] w-full animate-pulse bg-muted/40 md:h-[260px]" />

          {/* Info Skeleton */}
          <div className="relative -mt-12 flex flex-col gap-4 px-4 pb-6 md:-mt-16 md:flex-row md:items-end md:gap-6 md:px-8">
            {/* Logo Skeleton */}
            <div className="relative z-20 h-24 w-24 shrink-0 animate-pulse rounded-2xl border-4 border-card bg-muted/40 md:h-36 md:w-36" />

            {/* Text Skeleton */}
            <div className="flex flex-1 flex-col gap-3 pt-1 pb-1 md:pt-0">
              <div className="flex items-center gap-3">
                <div className="h-8 w-1/2 animate-pulse rounded-lg bg-muted/40 md:h-10" />
                <div className="h-6 w-12 animate-pulse rounded-lg bg-muted/30" />
              </div>
              <div className="mt-2 flex flex-wrap gap-4">
                <div className="h-5 w-48 animate-pulse rounded-md bg-muted/30" />
                <div className="h-5 w-36 animate-pulse rounded-md bg-muted/30" />
              </div>
            </div>
          </div>

          {/* Specialities Skeleton */}
          <div className="border-t border-border bg-muted/20 px-4 py-4 md:px-8">
            <div className="flex flex-col gap-3">
              <div className="h-3 w-20 animate-pulse rounded bg-muted/40" />
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-7 w-24 animate-pulse rounded-lg bg-muted/30"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Active Doctors Skeleton */}
        <div className="flex flex-col gap-6 py-8 md:py-12">
          <div className="space-y-3">
            <div className="h-4 w-32 animate-pulse rounded bg-muted/40" />
            <div className="h-8 w-64 animate-pulse rounded bg-muted/40" />
            <div className="h-4 w-full max-w-md animate-pulse rounded bg-muted/30" />
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-48 animate-pulse rounded-2xl border border-border/50 bg-muted/20"
              />
            ))}
          </div>
        </div>

        {/* Tabs Skeleton */}
        <div className="flex flex-col gap-6">
          <div className="flex gap-2 overflow-hidden border-b border-border pb-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-10 w-28 shrink-0 animate-pulse rounded-xl bg-muted/30"
              />
            ))}
          </div>
          <div className="h-96 animate-pulse rounded-2xl bg-muted/20" />
        </div>
      </div>
    </main>
  );
}
