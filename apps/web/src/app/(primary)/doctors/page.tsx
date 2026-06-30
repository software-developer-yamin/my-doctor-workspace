"use client";

import { DoctorCard } from "@/components/cards/doctor-card";
import { BookingContactButtons } from "@/components/common/booking-contact-buttons";
import { SearchEmptyState } from "@/components/common/search-empty-state";
import { LocationCombobox } from "@/components/common/location-combobox";
import { FilterSidebar } from "@/components/common/filter-sidebar";
import { MobileFilterSheet } from "@/components/common/mobile-filter-sheet";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SearchFilterBar } from "@/components/common/search-filter-bar";
import { useInfiniteDoctors } from "@/hooks/queries/use-doctors";
import { useBdLocations } from "@/hooks/queries/use-bd-locations";
import {
  useSpecialities,
  useSpecialitySearch,
} from "@/hooks/queries/use-specialities";
import {
  Cancel01Icon,
  Doctor02Icon,
  Search01Icon,
  SortByDown01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { parseAsString, useQueryState } from "nuqs";
import { Suspense, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

// ─── Constants ────────────────────────────────────────────────────────────────

const SORT_OPTIONS = [
  { label: "Relevance", value: "" },
  { label: "Rating: High to Low", value: "rating_desc" },
  { label: "Most Experienced", value: "experience_desc" },
] as const;

const SCHEDULE_BANDS = [
  { code: "morning", label: "Morning", range: "6:00 AM – 12:00 PM" },
  { code: "afternoon", label: "Afternoon", range: "12:00 PM – 4:00 PM" },
  { code: "evening", label: "Evening", range: "4:00 PM – 8:00 PM" },
  { code: "night", label: "Night", range: "8:00 PM – 12:00 AM" },
] as const;

// ─── Sub-components ────────────────────────────────────────────────────────────

function SpecialtyFilter({
  selectedId,
  onSelect,
}: {
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}) {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => clearTimeout(t);
  }, [search]);

  const { data: specData } = useSpecialities();
  const { data: searchData, isFetching } = useSpecialitySearch(debouncedSearch);

  const list = debouncedSearch ? (searchData?.data ?? []) : (specData?.data ?? []);

  return (
    <div>
      <div className="relative mb-2">
        <HugeiconsIcon
          icon={Search01Icon}
          size={12}
          className="text-muted-foreground absolute top-1/2 left-2.5 -translate-y-1/2"
        />
        <input
          type="text"
          placeholder="Search departments..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-primary/50 w-full rounded-md border py-1.5 pr-7 pl-7 text-xs outline-none"
        />
        {search && (
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setDebouncedSearch("");
            }}
            className="absolute top-1/2 right-2 -translate-y-1/2"
          >
            <HugeiconsIcon
              icon={Cancel01Icon}
              size={12}
              className="text-muted-foreground hover:text-foreground"
            />
          </button>
        )}
      </div>
      <div
        className="flex max-h-60 flex-col gap-1.5 overflow-y-auto overscroll-y-contain pr-0.5"
        onWheel={(e) => e.stopPropagation()}
      >
        <label className="flex cursor-pointer items-start gap-2.5">
          <Checkbox
            className="border-muted-foreground/30 data-[state=checked]:bg-primary data-[state=checked]:border-primary mt-0.5 h-4 w-4 shrink-0 rounded"
            checked={!selectedId}
            onCheckedChange={() => onSelect(null)}
          />
          <span className="text-foreground text-xs leading-snug font-medium">
            All Departments
          </span>
        </label>
        {isFetching && debouncedSearch ? (
          <p className="text-muted-foreground py-3 text-center text-xs">
            Searching...
          </p>
        ) : list.length > 0 ? (
          list.map((sp) => (
            <label key={sp.id} className="flex cursor-pointer items-start gap-2.5">
              <Checkbox
                className="border-muted-foreground/30 data-[state=checked]:bg-primary data-[state=checked]:border-primary mt-0.5 h-4 w-4 shrink-0 rounded"
                checked={selectedId === sp.id}
                onCheckedChange={() =>
                  onSelect(selectedId === sp.id ? null : sp.id)
                }
              />
              <span className="text-foreground line-clamp-2 text-xs leading-snug font-medium">
                {sp.name}
              </span>
            </label>
          ))
        ) : (
          <p className="text-muted-foreground py-3 text-center text-xs">
            No departments found
          </p>
        )}
      </div>
    </div>
  );
}

function DoctorFilterPanel({
  specialization,
  setSpecialization,
  schedule,
  setSchedule,
  isAvailableHome,
  setIsAvailableHome,
}: {
  specialization: string | null;
  setSpecialization: (v: string | null) => void;
  schedule: string | null;
  setSchedule: (v: string | null) => void;
  isAvailableHome: string | null;
  setIsAvailableHome: (v: string | null) => void;
}) {
  const selectedSchedules = schedule?.split(",").filter(Boolean) ?? [];

  const toggleSchedule = (code: string) => {
    const next = selectedSchedules.includes(code)
      ? selectedSchedules.filter((s) => s !== code)
      : [...selectedSchedules, code];
    setSchedule(next.join(",") || null);
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Department */}
      <div>
        <p className="text-muted-foreground text-micro mb-2 font-bold tracking-wider uppercase">
          Department
        </p>
        <SpecialtyFilter selectedId={specialization} onSelect={setSpecialization} />
      </div>

      {/* Consultation Time */}
      <div>
        <p className="text-muted-foreground text-micro mb-2 font-bold tracking-wider uppercase">
          Consultation Time
        </p>
        <div className="flex flex-col gap-2">
          <label className="flex cursor-pointer items-center gap-2.5">
            <Checkbox
              className="border-muted-foreground/30 data-[state=checked]:bg-primary data-[state=checked]:border-primary h-4 w-4 rounded"
              checked={selectedSchedules.length === 0}
              onCheckedChange={() => setSchedule(null)}
            />
            <span className="text-foreground text-body-sm font-medium">All</span>
          </label>
          {SCHEDULE_BANDS.map((band) => (
            <label key={band.code} className="flex cursor-pointer items-center gap-2.5">
              <Checkbox
                className="border-muted-foreground/30 data-[state=checked]:bg-primary data-[state=checked]:border-primary h-4 w-4 rounded"
                checked={selectedSchedules.includes(band.code)}
                onCheckedChange={() => toggleSchedule(band.code)}
              />
              <span className="flex flex-col">
                <span className="text-foreground text-body-sm leading-tight font-medium">
                  {band.label}
                </span>
                <span className="text-muted-foreground text-2xs leading-tight">
                  {band.range}
                </span>
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Home Service */}
      <div>
        <p className="text-muted-foreground text-micro mb-2 font-bold tracking-wider uppercase">
          Home Service
        </p>
        <label className="flex cursor-pointer items-center gap-2.5">
          <Checkbox
            className="border-muted-foreground/30 data-[state=checked]:bg-primary data-[state=checked]:border-primary h-4 w-4 rounded"
            checked={isAvailableHome === "true"}
            onCheckedChange={(v) => setIsAvailableHome(v ? "true" : null)}
          />
          <span className="text-foreground text-body-sm font-medium">
            Available for Home Visit
          </span>
        </label>
      </div>
    </div>
  );
}

// ─── Main content ─────────────────────────────────────────────────────────────

const OPTS = { shallow: false, clearOnDefault: true } as const;

function DoctorsContent() {
  const [search, setSearch] = useQueryState(
    "search",
    parseAsString.withDefault("").withOptions(OPTS),
  );
  const [specialization, setSpecialization] = useQueryState(
    "specialization",
    parseAsString.withOptions(OPTS),
  );
  const [isAvailableHome, setIsAvailableHome] = useQueryState(
    "isAvailableHome",
    parseAsString.withOptions(OPTS),
  );
  const [schedule, setSchedule] = useQueryState(
    "schedule",
    parseAsString.withOptions(OPTS),
  );
  const [district, setDistrict] = useQueryState(
    "district",
    parseAsString.withOptions(OPTS),
  );
  const [upazila, setUpazila] = useQueryState(
    "upazila",
    parseAsString.withOptions(OPTS),
  );
  const [sort, setSort] = useQueryState(
    "sort",
    parseAsString.withOptions(OPTS),
  );

  const [searchInput, setSearchInput] = useState(search);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput.trim() || null);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const { data: bdLocations = [] } = useBdLocations();
  const districtOptions = [...new Set(bdLocations.map((l) => l.district))].sort();
  const upazilaOptions = bdLocations
    .filter((l) => l.district === district)
    .map((l) => l.upazila)
    .filter(Boolean) as string[];
  const locationLabel = district ?? "All Locations";

  const filtersUrl = {
    limit: 10,
    search: search?.trim() || "",
    specialization: specialization || undefined,
    isAvailableHome: isAvailableHome || undefined,
    schedule: schedule || undefined,
    district: district || undefined,
    upazila: upazila || undefined,
    sort: sort || undefined,
  };

  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useInfiniteDoctors(filtersUrl);

  const doctors = data?.pages.flatMap((p) => p.data) ?? [];
  const total = data?.pages[0]?.meta?.total ?? 0;

  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: "300px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const resetFilters = () => {
    setSpecialization(null);
    setIsAvailableHome(null);
    setSchedule(null);
    setDistrict(null);
    setUpazila(null);
    setSort(null);
  };

  const filterProps = {
    specialization,
    setSpecialization,
    schedule,
    setSchedule,
    isAvailableHome,
    setIsAvailableHome,
  };

  return (
    <div className="bg-background min-h-screen">
      {/* ── Sticky search area ── */}
      <section className="bg-background sticky top-14 z-40 w-full md:top-16">
        <SearchFilterBar
          searchValue={searchInput}
          onSearchChange={setSearchInput}
          onSubmit={handleSearch}
          placeholder="Search doctors by name, specialty, or condition..."
          mobilePlaceholder="Search doctors, specialties..."
          cityLabel={locationLabel}
          onFilterClick={() => setMobileFilterOpen(true)}
          locationNode={
            <LocationCombobox
              districtOptions={districtOptions}
              upazilaOptions={upazilaOptions}
              selectedDistrict={district ?? null}
              selectedUpazila={upazila}
              onDistrictChange={(v) => {
                setDistrict(v);
                setUpazila(null);
              }}
              onUpazilaChange={setUpazila}
              triggerClassName="bg-card border-border flex items-center gap-2.5 rounded-md border px-4 py-3 text-left text-sm font-medium whitespace-nowrap"
            />
          }
          sortNode={
            <Select
              value={sort ?? "__none__"}
              onValueChange={(val) => setSort(val === "__none__" ? null : val)}
            >
              <SelectTrigger className="bg-card border-border !h-auto w-auto shrink-0 items-center gap-2.5 rounded-md border px-4 py-3.5 text-left text-sm font-medium shadow-none md:py-3">
                <HugeiconsIcon
                  icon={SortByDown01Icon}
                  size={14}
                  className="text-primary shrink-0"
                />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value || "__none__"} value={opt.value || "__none__"}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          }
          actionsNode={<BookingContactButtons hideCallOnDesktop />}
          noBorder
        />
      </section>

      <MobileFilterSheet
        open={mobileFilterOpen}
        onOpenChange={setMobileFilterOpen}
        title="Filters"
      >
        {/* Sort */}
        <div className="mb-6">
          <p className="text-muted-foreground mb-3 text-xs font-bold tracking-wider uppercase">
            Sort By
          </p>
          <div className="grid grid-cols-2 gap-2">
            {SORT_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setSort(opt.value || null)}
                className={cn(
                  "rounded-lg border px-2 py-2 text-center text-xs font-medium transition-colors",
                  (sort ?? "") === opt.value
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-muted/30 text-muted-foreground hover:border-primary/40",
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
        <DoctorFilterPanel {...filterProps} />
      </MobileFilterSheet>

      <div className="container mx-auto mt-6 px-4 pb-20">
        <div className="flex gap-6">
          <FilterSidebar title="Filter Doctors">
            <DoctorFilterPanel {...filterProps} />
          </FilterSidebar>

          <div className="min-w-0 flex-1">
            {/* Results bar */}
            <div className="mb-5 flex items-center justify-between gap-3">
              <p className="text-muted-foreground text-sm">
                {isLoading ? (
                  <span className="bg-muted inline-block h-4 w-48 animate-pulse rounded" />
                ) : (
                  <>
                    <span className="text-primary font-bold">{total} doctors</span>{" "}
                    {district ? `found in ${district}` : "found"}
                  </>
                )}
              </p>
              <BookingContactButtons className="hidden w-auto md:flex" />
            </div>

            {!isLoading && doctors.length === 0 ? (
              <SearchEmptyState
                icon={Doctor02Icon}
                title="No doctors found"
                description="Try a different name, specialty, or location. You can also clear the filters to browse all doctors."
                onClear={resetFilters}
              />
            ) : (
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {isLoading
                  ? Array.from({ length: 6 }).map((_, i) => (
                      <DoctorCard key={`ph-${i}`} loading />
                    ))
                  : doctors.map((doctor) => (
                      <DoctorCard key={doctor.id} doctor={doctor} />
                    ))}
              </div>
            )}

            <div ref={sentinelRef} className="h-4" />
            {isFetchingNextPage && (
              <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
                {Array.from({ length: 2 }).map((_, i) => (
                  <DoctorCard key={`more-${i}`} loading />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DoctorsPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-muted/20 flex min-h-screen w-full animate-pulse items-center justify-center" />
      }
    >
      <DoctorsContent />
    </Suspense>
  );
}
