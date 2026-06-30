"use client";

import { HospitalCard } from "@/components/cards/hospital-card";
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
import { useInfiniteHospitals } from "@/hooks/queries/use-hospitals";
import { useHospitalFilters } from "@/hooks/queries/use-hospital-filters";
import { useBdLocations } from "@/hooks/queries/use-bd-locations";
import {
  Activity01Icon,
  Cancel01Icon,
  CheckmarkBadge01Icon,
  Clock01Icon,
  Hospital01Icon,
  Hospital02Icon,
  HospitalBed01Icon,
  MicroscopeIcon,
  Search01Icon,
  StethoscopeIcon,
  TwentyFourHoursClockIcon,
  Building02Icon,
  SortByDown01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { parseAsString, useQueryState } from "nuqs";
import { useDebounce } from "@/hooks/use-debounce";
import { Suspense, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

// ─── Helpers ─────────────────────────────────────────────────────────────────

const SERVICE_ICON_MAP: Record<string, typeof Activity01Icon> = {
  icu: HospitalBed01Icon,
  emergency: Activity01Icon,
  surgery: Hospital01Icon,
  pathology: MicroscopeIcon,
  "digital x-ray": StethoscopeIcon,
  "x-ray": StethoscopeIcon,
};

function getServiceIcon(name: string) {
  const k = name.toLowerCase();
  for (const [key, icon] of Object.entries(SERVICE_ICON_MAP)) {
    if (k.includes(key)) return icon;
  }
  return Hospital01Icon;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const SORT_OPTIONS = [
  { label: "Relevance", value: "" },
  { label: "Rating: High to Low", value: "rating_desc" },
  { label: "Most Doctors", value: "doctors_desc" },
  { label: "Most Beds", value: "beds_desc" },
] as const;

const AVAILABILITY_TYPES = [
  { value: "all", label: "All", icon: CheckmarkBadge01Icon },
  { value: "open_now", label: "Open Now", icon: Clock01Icon },
  { value: "24_7", label: "24/7 Open", icon: TwentyFourHoursClockIcon },
] as const;

// ─── Hospital speciality single-select (sidebar) ──────────────────────────────

function HospitalSpecialityDropdown({
  specialityOptions,
  selected,
  onSelect,
  specialitySearch,
  onSearchChange,
}: {
  specialityOptions: Array<{ _id: string; name: string }>;
  selected: string | null;
  onSelect: (v: string | null) => void;
  specialitySearch: string;
  onSearchChange: (v: string) => void;
}) {
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
          value={specialitySearch}
          onChange={(e) => onSearchChange(e.target.value)}
          className="border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-primary/50 w-full rounded-md border py-1.5 pr-7 pl-7 text-xs outline-none"
        />
        {specialitySearch && (
          <button
            type="button"
            onClick={() => onSearchChange("")}
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
        className="flex max-h-72 flex-col gap-1.5 overflow-y-auto overscroll-y-contain pr-0.5"
        onWheel={(e) => e.stopPropagation()}
      >
        <label className="flex cursor-pointer items-start gap-2.5">
          <Checkbox
            className="border-muted-foreground/30 data-[state=checked]:bg-primary data-[state=checked]:border-primary mt-0.5 h-4 w-4 shrink-0 rounded"
            checked={!selected}
            onCheckedChange={() => onSelect(null)}
          />
          <span className="text-foreground text-xs leading-snug font-medium">
            All Departments
          </span>
        </label>
        {specialityOptions.length > 0 ? (
          specialityOptions.map((s) => (
            <label
              key={s._id}
              title={s.name}
              className="flex cursor-pointer items-start gap-2.5"
            >
              <Checkbox
                className="border-muted-foreground/30 data-[state=checked]:bg-primary data-[state=checked]:border-primary mt-0.5 h-4 w-4 shrink-0 rounded"
                checked={selected === s._id}
                onCheckedChange={() =>
                  onSelect(selected === s._id ? null : s._id)
                }
              />
              <span className="text-foreground line-clamp-2 text-xs leading-snug font-medium">
                {s.name}
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

function HospitalDesktopSidebar({
  hospitalType,
  setHospitalType,
  speciality,
  setSpeciality,
  availability,
  setAvailability,
  specialityOptions,
  typeOptions,
  specialitySearch,
  setSpecialitySearch,
}: {
  hospitalType: string | null;
  setHospitalType: (v: string | null) => void;
  speciality: string | null;
  setSpeciality: (v: string | null) => void;
  availability: string;
  setAvailability: (v: string | null) => void;
  specialityOptions: Array<{ _id: string; name: string }>;
  typeOptions: string[];
  specialitySearch: string;
  setSpecialitySearch: (v: string) => void;
}) {
  return (
    <FilterSidebar title="Filter Hospitals">
      <div className="flex flex-col gap-5">
        {/* Hospital Type */}
        {typeOptions.length > 0 && (
          <div>
            <p className="text-muted-foreground text-micro mb-2 font-bold tracking-wider uppercase">
              Hospital Type
            </p>
            <div className="flex flex-col gap-2">
              <label className="flex cursor-pointer items-center gap-2.5">
                <Checkbox
                  className="border-muted-foreground/30 data-[state=checked]:bg-primary data-[state=checked]:border-primary h-4 w-4 rounded"
                  checked={!hospitalType}
                  onCheckedChange={() => setHospitalType(null)}
                />
                <span className="text-foreground text-body-sm font-medium">
                  All Types
                </span>
              </label>
              {typeOptions.map((t) => (
                <label
                  key={t}
                  className="flex cursor-pointer items-center gap-2.5"
                >
                  <Checkbox
                    className="border-muted-foreground/30 data-[state=checked]:bg-primary data-[state=checked]:border-primary h-4 w-4 rounded"
                    checked={hospitalType === t}
                    onCheckedChange={() => setHospitalType(t)}
                  />
                  <span className="text-foreground text-body-sm font-medium">
                    {t}
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Department */}
        <div>
          <p className="text-muted-foreground text-micro mb-2 font-bold tracking-wider uppercase">
            Department
          </p>
          <HospitalSpecialityDropdown
            specialityOptions={specialityOptions}
            selected={speciality}
            onSelect={setSpeciality}
            specialitySearch={specialitySearch}
            onSearchChange={setSpecialitySearch}
          />
        </div>

        {/* Availability */}
        <div>
          <p className="text-muted-foreground text-micro mb-2 font-bold tracking-wider uppercase">
            Availability
          </p>
          <div className="flex flex-col gap-2">
            {AVAILABILITY_TYPES.map((a) => (
              <label
                key={a.value}
                className="flex cursor-pointer items-center gap-2.5"
              >
                <Checkbox
                  className="border-muted-foreground/30 data-[state=checked]:bg-primary data-[state=checked]:border-primary h-4 w-4 rounded"
                  checked={availability === a.value}
                  onCheckedChange={() => setAvailability(a.value)}
                />
                <span className="text-foreground text-body-sm font-medium">
                  {a.label}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </FilterSidebar>
  );
}


// ─── Main content ─────────────────────────────────────────────────────────────

function HospitalsContent() {
  const [search, setSearch] = useQueryState(
    "search",
    parseAsString
      .withDefault("")
      .withOptions({ shallow: false, clearOnDefault: true }),
  );
  const [speciality, setSpeciality] = useQueryState(
    "speciality",
    parseAsString.withOptions({ shallow: false, clearOnDefault: true }),
  );
  const [district, setDistrict] = useQueryState(
    "district",
    parseAsString.withOptions({ shallow: false, clearOnDefault: true }),
  );
  const [upazila, setUpazila] = useQueryState(
    "upazila",
    parseAsString.withOptions({ shallow: false, clearOnDefault: true }),
  );
  const [availability, setAvailability] = useQueryState(
    "availability",
    parseAsString
      .withDefault("all")
      .withOptions({ shallow: false, clearOnDefault: true }),
  );

  const [hospitalType, setHospitalType] = useQueryState(
    "type",
    parseAsString.withOptions({ shallow: false, clearOnDefault: true }),
  );

  const [sort, setSort] = useQueryState(
    "sort",
    parseAsString.withOptions({ shallow: false, clearOnDefault: true }),
  );

  const [searchInput, setSearchInput] = useState(search);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [specialitySearch, setSpecialitySearch] = useState("");
  const debouncedSpecialitySearch = useDebounce(specialitySearch, 300);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput.trim() || null);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const { data: filtersData } = useHospitalFilters(
    debouncedSpecialitySearch || undefined,
  );
  const specialityOptions = filtersData?.specialities ?? [];
  const typeOptions = filtersData?.types ?? [];

  const { data: bdLocations = [] } = useBdLocations();

  const districtOptions = [
    ...new Set(bdLocations.map((l) => l.district)),
  ].sort();
  const upazilaOptions = bdLocations
    .filter((l) => l.district === district)
    .map((l) => l.upazila)
    .filter(Boolean) as string[];
  const locationLabel = district ?? "All Locations";

  const filtersUrl: Record<string, unknown> = {
    limit: 10,
    search: search || "",
    district: district || undefined,
    type: hospitalType || undefined,
    speciality: speciality || undefined,
    upazila: upazila || undefined,
    availability: availability !== "all" ? availability : undefined,
    sort: sort || undefined,
  };

  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useInfiniteHospitals(filtersUrl);

  const hospitals = data?.pages.flatMap((p) => p.data) ?? [];
  const totalCount = data?.pages[0]?.meta?.total ?? 0;

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
    setHospitalType(null);
    setSpeciality(null);
    setDistrict(null);
    setUpazila(null);
    setAvailability(null);
    setSort(null);
  };

  return (
    <div className="bg-background min-h-screen">
      {/* ── Sticky search area ────────────────────────────────────────────── */}
      <section className="bg-background sticky top-14 z-40 w-full md:top-16">
        <SearchFilterBar
          searchValue={searchInput}
          onSearchChange={setSearchInput}
          onSubmit={handleSearch}
          placeholder="Search hospitals, clinics, services..."
          mobilePlaceholder="Search hospitals, clinics..."
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
              onUpazilaChange={(v) => {
                setUpazila(v);
              }}
              triggerClassName="bg-card border-border flex items-center gap-2.5 rounded-md border px-4 py-3 text-left text-sm font-medium whitespace-nowrap"
            />
          }
          sortNode={
            <Select
              value={sort ?? "__none__"}
              onValueChange={(val) => {
                setSort(val === "__none__" ? null : val);
              }}
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
                  <SelectItem
                    key={opt.value || "__none__"}
                    value={opt.value || "__none__"}
                  >
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
        {/* Hospital Type */}
        {typeOptions.length > 0 && (
          <div className="mb-6">
            <p className="text-muted-foreground mb-3 text-xs font-bold tracking-wider uppercase">
              Hospital Type
            </p>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
              <button
                type="button"
                onClick={() => setHospitalType(null)}
                className={cn(
                  "flex flex-col items-center gap-1.5 rounded-xl border px-2 py-3 text-center transition-colors",
                  !hospitalType
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-muted/30 text-muted-foreground hover:border-primary/40",
                )}
              >
                <HugeiconsIcon icon={Building02Icon} size={22} />
                <span className="text-micro leading-tight font-medium">All</span>
              </button>
              {typeOptions.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setHospitalType(t)}
                  className={cn(
                    "flex flex-col items-center gap-1.5 rounded-xl border px-2 py-3 text-center transition-colors",
                    hospitalType === t
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-muted/30 text-muted-foreground hover:border-primary/40",
                  )}
                >
                  <HugeiconsIcon icon={getServiceIcon(t)} size={22} />
                  <span className="text-micro leading-tight font-medium">{t}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Department */}
        <div className="mb-6">
          <p className="text-muted-foreground mb-3 text-xs font-bold tracking-wider uppercase">
            Department
          </p>
          <HospitalSpecialityDropdown
            specialityOptions={specialityOptions}
            selected={speciality}
            onSelect={setSpeciality}
            specialitySearch={specialitySearch}
            onSearchChange={setSpecialitySearch}
          />
        </div>

        {/* Availability */}
        <div className="mb-6">
          <p className="text-muted-foreground mb-3 text-xs font-bold tracking-wider uppercase">
            Availability
          </p>
          <div className="grid grid-cols-3 gap-2">
            {AVAILABILITY_TYPES.map((a) => (
              <button
                key={a.value}
                type="button"
                onClick={() => setAvailability(a.value === "all" ? null : a.value)}
                className={cn(
                  "rounded-lg border px-2 py-2 text-center text-xs font-medium transition-colors",
                  (availability ?? "all") === a.value
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-muted/30 text-muted-foreground hover:border-primary/40",
                )}
              >
                {a.label}
              </button>
            ))}
          </div>
        </div>

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
      </MobileFilterSheet>

      <div className="container mx-auto mt-6 px-4 pb-20">
        {/* ── Layout: sidebar + grid ─────────────────────────────────────── */}
        <div className="flex gap-6">
          <HospitalDesktopSidebar
            hospitalType={hospitalType}
            setHospitalType={setHospitalType}
            speciality={speciality}
            setSpeciality={setSpeciality}
            availability={availability ?? "all"}
            setAvailability={(v) => {
              setAvailability(v === "all" ? null : v);
            }}
            specialityOptions={specialityOptions}
            typeOptions={typeOptions}
            specialitySearch={specialitySearch}
            setSpecialitySearch={setSpecialitySearch}
          />

          <div className="min-w-0 flex-1">
            {/* ── Results bar ─────────────────────────────────────────────── */}
            <div className="mb-5 flex items-center justify-between gap-3">
              <p className="text-muted-foreground text-sm">
                {isLoading ? (
                  <span className="bg-muted inline-block h-4 w-48 animate-pulse rounded" />
                ) : (
                  <>
                    <span className="text-primary font-bold">
                      {totalCount} hospitals
                    </span>{" "}
                    {district ? `found in ${district}` : "found"}
                  </>
                )}
              </p>
              <BookingContactButtons className="hidden w-auto md:flex" />
            </div>

            {!isLoading && hospitals.length === 0 ? (
              <SearchEmptyState
                icon={Hospital02Icon}
                title="No hospitals found"
                description="Try a different name, location, or specialty. You can also clear the filters to browse all hospitals."
                onClear={() => {
                  setSearch(null);
                  setDistrict(null);
                  setSpeciality(null);
                  setUpazila(null);
                  setAvailability(null);
                }}
              />
            ) : (
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {isLoading
                  ? Array.from({ length: 6 }).map((_, i) => (
                      <HospitalCard key={`ph-${i}`} loading />
                    ))
                  : hospitals.map((hospital) => (
                      <HospitalCard key={hospital.id} hospital={hospital} />
                    ))}
              </div>
            )}

            {/* Infinite scroll sentinel */}
            <div ref={sentinelRef} className="h-4" />
            {isFetchingNextPage && (
              <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
                {Array.from({ length: 2 }).map((_, i) => (
                  <HospitalCard key={`more-${i}`} loading />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HospitalsPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-muted/20 flex min-h-screen w-full animate-pulse items-center justify-center" />
      }
    >
      <HospitalsContent />
    </Suspense>
  );
}
