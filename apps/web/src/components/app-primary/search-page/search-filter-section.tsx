"use client";

import { BookingContactButtons } from "@/components/common/booking-contact-buttons";
import { SearchFilterBar } from "@/components/common/search-filter-bar";
import { LocationCombobox } from "@/components/common/location-combobox";
import { MobileFilterSheet } from "@/components/common/mobile-filter-sheet";
import { FilterSidebar } from "@/components/common/filter-sidebar";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useBdLocations } from "@/hooks/queries/use-bd-locations";
import { useDoctorFilters } from "@/hooks/queries/use-doctor-filters";
import {
  useSpecialities,
  useSpecialitySearch,
} from "@/hooks/queries/use-specialities";
import { cn } from "@/lib/utils";
import {
  Cancel01Icon,
  Search01Icon,
  SortByDown01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

const DOCTOR_SORT_OPTIONS = [
  { label: "Relevance", value: "" },
  { label: "Rating: High to Low", value: "rating_desc" },
  { label: "Most Experienced", value: "experience_desc" },
] as const;

interface SearchFilterSectionProps {
  placeholderText?: string;
  filterType?: "doctor" | "hospital" | "ambulance" | "diagnostics" | "all";
  hideType?: boolean;
  onSearch?: (filters: any) => void;
}

// ─────────────────────────────────────────────
// Location combobox (district → upazila cascade)
// ─────────────────────────────────────────────
// Specialty inline filter (search + checkbox list)
// ─────────────────────────────────────────────
function SpecialtyInlineFilter({
  defaultSpecialties,
  selectedSpecialtyId,
  onSelect,
}: {
  defaultSpecialties: { id: string; name: string }[];
  selectedSpecialtyId: string;
  onSelect: (id: string) => void;
}) {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => clearTimeout(t);
  }, [search]);

  const { data: searchData, isFetching } = useSpecialitySearch(debouncedSearch);

  const list: { id: string; name: string }[] = debouncedSearch
    ? (searchData?.data ?? [])
    : defaultSpecialties;

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
            checked={!selectedSpecialtyId}
            onCheckedChange={() => onSelect("")}
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
            <label
              key={sp.id}
              className="flex cursor-pointer items-start gap-2.5"
            >
              <Checkbox
                className="border-muted-foreground/30 data-[state=checked]:bg-primary data-[state=checked]:border-primary mt-0.5 h-4 w-4 shrink-0 rounded"
                checked={selectedSpecialtyId === sp.id}
                onCheckedChange={() =>
                  onSelect(selectedSpecialtyId === sp.id ? "" : sp.id)
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

// ─────────────────────────────────────────────
// Sidebar filter panel (shared between desktop persistent + mobile sheet)
// ─────────────────────────────────────────────
const SCHEDULE_BANDS = [
  { code: "morning", label: "Morning", range: "6:00 AM – 12:00 PM" },
  { code: "afternoon", label: "Afternoon", range: "12:00 PM – 4:00 PM" },
  { code: "evening", label: "Evening", range: "4:00 PM – 8:00 PM" },
  { code: "night", label: "Night", range: "8:00 PM – 12:00 AM" },
] as const;

function FilterPanel({
  filterType,
  selectedSpecialty,
  setSelectedSpecialty,
  selectedSchedule,
  setSelectedSchedule,
  isAvailableHome,
  setIsAvailableHome,
  defaultSpecialties,
  timeSlots,
}: {
  filterType: string;
  selectedSpecialty: string;
  setSelectedSpecialty: (v: string) => void;
  selectedSchedule: string[];
  setSelectedSchedule: (v: string[]) => void;
  isAvailableHome: boolean;
  setIsAvailableHome: (v: boolean) => void;
  defaultSpecialties: { id: string; name: string }[];
  timeSlots: { startTime: string; endTime: string }[];
}) {
  const toggleSchedule = (val: string) =>
    setSelectedSchedule(
      selectedSchedule.includes(val)
        ? selectedSchedule.filter((s) => s !== val)
        : [...selectedSchedule, val],
    );

  return (
    <div className="flex flex-col gap-5">
      {/* Specialties */}
      {(filterType === "doctor" || filterType === "all") && (
        <div>
          <p className="text-muted-foreground text-micro mb-2 font-bold tracking-wider uppercase">
            Department
          </p>
          <SpecialtyInlineFilter
            defaultSpecialties={defaultSpecialties}
            selectedSpecialtyId={selectedSpecialty}
            onSelect={setSelectedSpecialty}
          />
        </div>
      )}

      {/* Consultation time */}
      {filterType === "doctor" && (
        <div>
          <p className="text-muted-foreground text-micro mb-2 font-bold tracking-wider uppercase">
            Consultation Time
          </p>
          <div className="flex flex-col gap-2">
            <label className="flex cursor-pointer items-center gap-2.5">
              <Checkbox
                className="border-muted-foreground/30 data-[state=checked]:bg-primary data-[state=checked]:border-primary h-4 w-4 rounded"
                checked={selectedSchedule.length === 0}
                onCheckedChange={() => setSelectedSchedule([])}
              />
              <span className="text-foreground text-body-sm font-medium">
                All
              </span>
            </label>
            {SCHEDULE_BANDS.map((band) => (
              <label
                key={band.code}
                className="flex cursor-pointer items-center gap-2.5"
              >
                <Checkbox
                  className="border-muted-foreground/30 data-[state=checked]:bg-primary data-[state=checked]:border-primary h-4 w-4 rounded"
                  checked={selectedSchedule.includes(band.code)}
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
      )}

      {/* Home Service */}
      {filterType === "doctor" && (
        <div>
          <p className="text-muted-foreground text-micro mb-2 font-bold tracking-wider uppercase">
            Home Service
          </p>
          <label className="flex cursor-pointer items-center gap-2.5">
            <Checkbox
              className="border-muted-foreground/30 data-[state=checked]:bg-primary data-[state=checked]:border-primary h-4 w-4 rounded"
              checked={isAvailableHome}
              onCheckedChange={(v) => setIsAvailableHome(!!v)}
            />
            <span className="text-foreground text-body-sm font-medium">
              Available for Home Visit
            </span>
          </label>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// Main exported component
// ─────────────────────────────────────────────
export const SearchFilterSection = ({
  placeholderText = "Search by name or code...",
  filterType = "all",
  onSearch,
}: SearchFilterSectionProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [searchValue, setSearchValue] = useState(
    searchParams.get("search") || searchParams.get("q") || "",
  );
  const [selectedDistrict, setSelectedDistrict] = useState(
    searchParams.get("district") || "",
  );
  const [selectedUpazila, setSelectedUpazila] = useState(
    searchParams.get("upazila") || "",
  );
  const [sheetOpen, setSheetOpen] = useState(false);

  const [selectedSpecialty, setSelectedSpecialty] = useState(
    searchParams.get("specialization") || "",
  );
  const [selectedSchedule, setSelectedSchedule] = useState<string[]>(
    searchParams.get("schedule")?.split(",").filter(Boolean) || [],
  );
  const [isAvailableHome, setIsAvailableHome] = useState(
    searchParams.get("isAvailableHome") === "true",
  );
  const [selectedSort, setSelectedSort] = useState(
    searchParams.get("sort") || "",
  );

  const { data: specData } = useSpecialities();
  const { data: bdLocations = [] } = useBdLocations();
  const { data: filterData } = useDoctorFilters();

  const updateUrl = useCallback(
    (updates: Record<string, string | number | undefined>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (
          value === undefined ||
          value === "" ||
          value === "all" ||
          value === 0
        ) {
          params.delete(key);
          if (key === "search") params.delete("q");
        } else {
          params.set(key, String(value));
          if (key === "search") params.delete("q");
        }
      });
      params.delete("page");
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
      if (onSearch) onSearch(updates);
    },
    [searchParams, pathname, router, onSearch],
  );

  // Sync search from URL
  const currentUrlQuery =
    searchParams.get("search") || searchParams.get("q") || "";
  const [prevUrlQuery, setPrevUrlQuery] = useState(currentUrlQuery);
  if (currentUrlQuery !== prevUrlQuery) {
    setPrevUrlQuery(currentUrlQuery);
    if (
      !searchValue ||
      currentUrlQuery !== (searchParams.get("search") || "")
    ) {
      setSearchValue(currentUrlQuery);
    }
  }

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      const normalized = searchValue.trim();
      const currentSearch =
        searchParams.get("search") || searchParams.get("q") || "";
      if (normalized !== currentSearch) updateUrl({ search: normalized });
    }, 500);
    return () => clearTimeout(timer);
  }, [searchValue, updateUrl, searchParams]);

  const districtOptions = [
    ...new Set(bdLocations.map((l) => l.district)),
  ].sort();
  const upazilaOptions = bdLocations
    .filter((l) => l.district === selectedDistrict)
    .map((l) => l.upazila);
  const locationLabel = selectedDistrict || "All Locations";

  const handleReset = () => {
    setSearchValue("");
    setSelectedDistrict("");
    setSelectedUpazila("");
    setSelectedSpecialty("");
    setSelectedSchedule([]);
    setIsAvailableHome(false);
    setSelectedSort("");
    router.push(pathname);
  };

  const handleDistrictSelect = (districtName: string | null) => {
    setSelectedDistrict(districtName || "");
    setSelectedUpazila("");
    updateUrl({ district: districtName || undefined, upazila: undefined });
  };

  const handleUpazilaSelect = (upazila: string | null) => {
    setSelectedUpazila(upazila || "");
    updateUrl({ upazila: upazila || undefined });
  };

  const panelProps = {
    filterType,
    selectedSpecialty,
    setSelectedSpecialty: (v: string) => {
      setSelectedSpecialty(v);
      updateUrl({ specialization: v || undefined });
    },
    selectedSchedule,
    setSelectedSchedule: (v: string[]) => {
      setSelectedSchedule(v);
      updateUrl({ schedule: v.join(",") || undefined });
    },
    isAvailableHome,
    setIsAvailableHome: (v: boolean) => {
      setIsAvailableHome(v);
      updateUrl({ isAvailableHome: v ? "true" : undefined });
    },
    defaultSpecialties: specData?.data || [],
    timeSlots: filterData?.timeSlots ?? [],
  };

  return (
    <section className="bg-background sticky top-14 z-40 w-full lg:top-16">
      <SearchFilterBar
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        onSubmit={(e) => e.preventDefault()}
        placeholder={placeholderText}
        cityLabel={locationLabel}
        mobileCityLabel={locationLabel}
        onFilterClick={() => setSheetOpen(true)}
        locationNode={
          filterType === "doctor" ? (
            <LocationCombobox
              districtOptions={districtOptions}
              upazilaOptions={upazilaOptions}
              selectedDistrict={selectedDistrict || null}
              selectedUpazila={selectedUpazila || null}
              onDistrictChange={handleDistrictSelect}
              onUpazilaChange={handleUpazilaSelect}
              triggerClassName="bg-card border-border flex items-center gap-2.5 rounded-md border px-4 py-3 text-left text-sm font-medium whitespace-nowrap"
            />
          ) : (
            <></>
          )
        }
        sortNode={
          filterType === "doctor" ? (
            <Select
              value={searchParams.get("sort") || "__none__"}
              onValueChange={(val) => {
                const actual = val === "__none__" ? "" : val;
                setSelectedSort(actual);
                updateUrl({ sort: actual || undefined });
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
                {DOCTOR_SORT_OPTIONS.map((opt) => (
                  <SelectItem
                    key={opt.value || "__none__"}
                    value={opt.value || "__none__"}
                  >
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : undefined
        }
        actionsNode={<BookingContactButtons hideCallOnDesktop />}
        noBorder
      />

      <MobileFilterSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        title="Filters"
      >
        {filterType === "doctor" && (
          <div className="mb-6">
            <p className="text-muted-foreground mb-3 text-xs font-bold tracking-wider uppercase">
              Sort By
            </p>
            <div className="grid grid-cols-2 gap-2">
              {DOCTOR_SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    setSelectedSort(opt.value);
                    updateUrl({ sort: opt.value || undefined });
                  }}
                  className={cn(
                    "rounded-lg border px-2 py-2 text-center text-xs font-medium transition-colors",
                    selectedSort === opt.value
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-muted/30 text-muted-foreground hover:border-primary/40",
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}
        <FilterPanel {...panelProps} />
      </MobileFilterSheet>
    </section>
  );
};

// ─────────────────────────────────────────────
// Sidebar exported for use in the page layout
// ─────────────────────────────────────────────
export function DoctorFilterSidebar({
  filterType = "doctor",
  onSearch,
}: {
  filterType?: "doctor" | "hospital" | "ambulance" | "diagnostics" | "all";
  onSearch?: (filters: any) => void;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [selectedSpecialty, setSelectedSpecialty] = useState(
    searchParams.get("specialization") || "",
  );
  const [selectedSchedule, setSelectedSchedule] = useState<string[]>(
    searchParams.get("schedule")?.split(",").filter(Boolean) || [],
  );
  const [isAvailableHome, setIsAvailableHome] = useState(
    searchParams.get("isAvailableHome") === "true",
  );

  const { data: specData } = useSpecialities();
  const { data: filterData } = useDoctorFilters();

  const updateUrl = useCallback(
    (updates: Record<string, string | undefined>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value === undefined || value === "" || value === "all") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });
      params.delete("page");
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
      if (onSearch) onSearch(updates);
    },
    [searchParams, pathname, router, onSearch],
  );

  return (
    <FilterSidebar title="Filter Doctors">
      <FilterPanel
        filterType={filterType}
        selectedSpecialty={selectedSpecialty}
        setSelectedSpecialty={(v) => {
          setSelectedSpecialty(v);
          updateUrl({ specialization: v || undefined });
        }}
        selectedSchedule={selectedSchedule}
        setSelectedSchedule={(v) => {
          setSelectedSchedule(v);
          updateUrl({ schedule: v.join(",") || undefined });
        }}
        isAvailableHome={isAvailableHome}
        setIsAvailableHome={(v) => {
          setIsAvailableHome(v);
          updateUrl({ isAvailableHome: v ? "true" : undefined });
        }}
        defaultSpecialties={specData?.data || []}
        timeSlots={filterData?.timeSlots ?? []}
      />
    </FilterSidebar>
  );
}
