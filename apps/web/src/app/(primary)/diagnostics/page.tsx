"use client";

import { DiagnosticCard } from "@/components/cards/diagnostic-card";
import { BookingContactButtons } from "@/components/common/booking-contact-buttons";
import { Pagination } from "@/components/common/pagination";
import { SearchEmptyState } from "@/components/common/search-empty-state";
import { SearchFilterBar } from "@/components/common/search-filter-bar";
import { useDiagnosticTests } from "@/hooks/queries/use-diagnostics";
import {
  Activity01Icon,
  CheckmarkCircle01Icon,
  Clock01Icon,
  Doctor02Icon,
  MicroscopeIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { parseAsInteger, parseAsString, useQueryState } from "nuqs";
import { Suspense, useEffect, useRef, useState } from "react";

const OPTS = { shallow: false, clearOnDefault: true } as const;

const FEATURES = [
  {
    icon: Clock01Icon,
    title: "24/7 Booking",
    desc: "Book lab tests anytime, any day",
  },
  {
    icon: Activity01Icon,
    title: "Fast Turnaround",
    desc: "Results delivered quickly",
  },
  {
    icon: Doctor02Icon,
    title: "Accredited Labs",
    desc: "Certified diagnostic centers only",
  },
  {
    icon: CheckmarkCircle01Icon,
    title: "Safe & Reliable",
    desc: "Accurate results guaranteed",
  },
];

function DiagnosticsContent() {
  const [search, setSearch] = useQueryState("search", parseAsString.withDefault("").withOptions(OPTS));
  const [district, setDistrict] = useQueryState("district", parseAsString.withOptions(OPTS));
  const [upazila, setUpazila] = useQueryState("upazila", parseAsString.withOptions(OPTS));
  const [category, setCategory] = useQueryState("category", parseAsString.withOptions(OPTS));
  const [sort, setSort] = useQueryState("sort", parseAsString.withOptions(OPTS));
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1).withOptions(OPTS));
  const [limit] = useQueryState("limit", parseAsInteger.withDefault(20).withOptions(OPTS));

  const [searchInput, setSearchInput] = useState(() => search);

  // Sync searchInput when URL search changes externally (back/forward navigation)
  const prevSearchRef = useRef(search);
  useEffect(() => {
    if (search !== prevSearchRef.current) {
      prevSearchRef.current = search;
      const t = setTimeout(() => setSearchInput(search ?? ""), 0);
      return () => clearTimeout(t);
    }
  }, [search]);

  // Debounced search → URL
  useEffect(() => {
    const timer = setTimeout(() => {
      const normalized = searchInput.trim();
      setSearch(normalized || null);
      setPage(null);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput, setSearch, setPage]);

  const filtersUrl: Record<string, unknown> = {
    page: page ?? 1,
    limit: limit ?? 20,
    search: search.trim(),
    ...(district ? { district } : {}),
    ...(upazila ? { upazila } : {}),
    ...(category ? { category } : {}),
    ...(sort ? { sort } : {}),
  };

  const { data, isLoading, isFetching } = useDiagnosticTests(filtersUrl);
  const tests = data?.data || [];
  const meta = data?.meta;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleClearAll = () => {
    setSearch(null);
    setPage(null);
    setCategory(null);
    setSort(null);
    setDistrict(null);
    setUpazila(null);
    setSearchInput("");
  };

  return (
    <div className="bg-background min-h-screen pb-24 md:pb-8">

      {/* ── Search Bar ── */}
      <SearchFilterBar
        searchValue={searchInput}
        onSearchChange={setSearchInput}
        onSubmit={handleSearch}
        placeholder="Search diagnostics by name, test or service..."
        locationNode={<></>}
        actionsNode={<BookingContactButtons />}
      />

      {/* ── Diagnostic Tests Grid ── */}
      <div className="container mx-auto px-4 pt-3 sm:pt-6">
        <div
          className={`transition-opacity ${isFetching && !isLoading ? "opacity-60" : "opacity-100"}`}
        >
          {!isLoading && tests.length === 0 ? (
            <SearchEmptyState
              icon={MicroscopeIcon}
              title="No tests found"
              description="Try a different test name or browse all available medical tests."
              onClear={handleClearAll}
            />
          ) : (
            <>
              <div className="grid grid-cols-1 gap-3 sm:gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
                {isLoading
                  ? Array.from({ length: 10 }).map((_, i) => (
                      <DiagnosticCard key={`ph-${i}`} loading />
                    ))
                  : tests.map((test) => (
                      <DiagnosticCard key={test.id} test={test} />
                    ))}
              </div>

              {!isLoading && meta && (
                <Pagination
                  meta={meta}
                  isFetching={isFetching}
                  currentPage={page ?? 1}
                  onPageChange={handlePageChange}
                />
              )}
            </>
          )}
        </div>
      </div>

      {/* ── Features Strip ── */}
      <div className="container mx-auto mt-10 mb-4 px-4">
        <div className="bg-card border-border rounded-md border px-4 py-5 shadow-sm sm:px-8">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-4">
            {FEATURES.map((f) => (
              <div key={f.title} className="flex items-center gap-3">
                <div className="bg-primary/10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full">
                  <HugeiconsIcon
                    icon={f.icon}
                    size={20}
                    className="text-primary"
                  />
                </div>
                <div>
                  <p className="text-foreground text-sm font-bold">{f.title}</p>
                  <p className="text-muted-foreground text-xs">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}

export default function DiagnosticsPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-muted/20 flex min-h-screen w-full animate-pulse items-center justify-center" />
      }
    >
      <DiagnosticsContent />
    </Suspense>
  );
}
