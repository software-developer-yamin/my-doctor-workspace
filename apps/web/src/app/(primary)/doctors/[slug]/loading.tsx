export default function DoctorDetailsLoading() {
  return (
    <main className="container mx-auto py-6 lg:py-10">
      {/* Back button */}
      <div className="mb-5 h-10 w-40 animate-pulse rounded-xl bg-muted/40" />

      <div className="flex w-full flex-col gap-6">
        {/* Hero skeleton — matches DoctorHero: rounded-2xl card, gradient bg, avatar + info + stats */}
        <div className="w-full overflow-hidden rounded-2xl border border-border bg-white shadow-sm dark:bg-card">
          <div className="relative px-5 py-6 md:px-8 md:py-10 lg:px-10 lg:py-12">
            {/* Avatar + info row */}
            <div className="flex items-start gap-4 md:items-center md:gap-6 lg:gap-8">
              {/* Mobile: square avatar */}
              <div className="h-[100px] w-[100px] shrink-0 animate-pulse rounded-2xl bg-muted/40 md:hidden" />

              {/* Tablet/desktop: circle avatar with ring */}
              <div className="relative hidden shrink-0 md:block">
                <div className="rounded-full bg-white p-2.5 shadow-md lg:p-3">
                  <div className="h-[120px] w-[120px] animate-pulse rounded-full bg-muted/40 lg:h-[158px] lg:w-[158px]" />
                </div>
              </div>

              {/* Doctor info */}
              <div className="flex flex-1 flex-col gap-2 min-w-0">
                <div className="h-7 w-3/4 animate-pulse rounded-xl bg-muted/40 md:h-9 lg:h-12" />
                <div className="h-4 w-1/2 animate-pulse rounded-lg bg-muted/30" />
                <div className="mt-1 h-9 w-36 animate-pulse rounded-xl bg-muted/20" />
              </div>
            </div>

            {/* Stats grid: 2-col mobile, 4-col sm+ */}
            <div className="mt-6 grid grid-cols-2 gap-2.5 sm:grid-cols-4 md:mt-8 lg:mt-10 lg:gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="flex items-center gap-2.5 rounded-2xl border border-gray-200 bg-white px-3 py-3 shadow-sm dark:border-border dark:bg-card"
                >
                  <div className="h-9 w-9 shrink-0 animate-pulse rounded-xl bg-muted/40 lg:h-10 lg:w-10" />
                  <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                    <div className="h-4 w-14 animate-pulse rounded-md bg-muted/40" />
                    <div className="h-3 w-20 animate-pulse rounded-md bg-muted/20" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs skeleton */}
        <div className="flex flex-col gap-6">
          {/* Tab buttons */}
          <div className="flex gap-2 border-b border-border/60 pb-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-9 w-24 animate-pulse rounded-lg bg-muted/30" />
            ))}
          </div>

          {/* Tab content — locations tab layout */}
          <div className="flex flex-col gap-6">
            {/* Summary stat cards: 1-col → 2-col sm → 4-col lg */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 lg:flex-col lg:items-start lg:p-5"
                >
                  <div className="h-14 w-14 shrink-0 animate-pulse rounded-xl bg-muted/40" />
                  <div className="flex flex-1 flex-col gap-2">
                    <div className="h-3 w-24 animate-pulse rounded-md bg-muted/30" />
                    <div className="h-6 w-16 animate-pulse rounded-lg bg-muted/40" />
                    <div className="h-3 w-20 animate-pulse rounded-md bg-muted/20" />
                  </div>
                </div>
              ))}
            </div>

            {/* Chamber card: stacked on mobile/tablet, outer+inner on lg */}
            <div className="flex flex-col gap-4 lg:flex-row lg:gap-4 lg:rounded-2xl lg:border lg:border-border lg:bg-muted/30 lg:p-4 lg:shadow-sm">
              {/* Left: hospital info */}
              <div className="rounded-2xl border border-border bg-card p-5 lg:w-[42%] lg:flex-none">
                <div className="h-14 w-14 animate-pulse rounded-xl bg-muted/40" />
                <div className="mt-3 h-5 w-3/4 animate-pulse rounded-lg bg-muted/40" />
                <div className="mt-4 flex flex-col gap-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="h-4 w-4 shrink-0 animate-pulse rounded-full bg-muted/30" />
                      <div className="h-3 w-full animate-pulse rounded-md bg-muted/20" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: schedule */}
              <div className="rounded-2xl border border-border bg-card p-5 lg:flex-1">
                <div className="h-4 w-28 animate-pulse rounded-md bg-muted/30" />
                <div className="mt-2 h-3 w-24 animate-pulse rounded-md bg-muted/20" />
                <div className="mt-1 h-8 w-48 animate-pulse rounded-lg bg-muted/40" />
                <div className="mt-4 h-4 w-32 animate-pulse rounded-md bg-muted/30" />
                {/* Day pills */}
                <div className="mt-3 flex gap-2 overflow-hidden lg:grid lg:grid-cols-7">
                  {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                    <div
                      key={i}
                      className="h-16 w-[80px] shrink-0 animate-pulse rounded-xl bg-muted/30 lg:w-auto lg:shrink"
                    />
                  ))}
                </div>
                {/* Buttons */}
                <div className="mt-5 flex gap-3">
                  <div className="h-12 flex-1 animate-pulse rounded-xl bg-muted/40" />
                  <div className="h-12 w-32 animate-pulse rounded-xl bg-muted/20" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
