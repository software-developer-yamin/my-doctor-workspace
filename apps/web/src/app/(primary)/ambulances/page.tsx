"use client";

import { AmbulanceCard } from "@/components/cards/ambulance-card";
import { AmbulanceRequestForm } from "@/components/app-primary/ambulance-page/ambulance-request-form";
import { BookingContactButtons } from "@/components/common/booking-contact-buttons";
import { Pagination } from "@/components/common/pagination";
import { SearchEmptyState } from "@/components/common/search-empty-state";
import { SearchFilterBar } from "@/components/common/search-filter-bar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAmbulances } from "@/hooks/queries/use-ambulances";
import { useAmbulanceFilters } from "@/hooks/queries/use-ambulance-filters";
import { useBdLocations } from "@/hooks/queries/use-bd-locations";
import {
  AmbulanceIcon,
  ArrowDown01Icon,
  Cancel01Icon,
  CheckmarkBadge01Icon,
  Clock01Icon,
  PinLocation02Icon,
  Search01Icon,
  SecurityCheckIcon,
  Tick02Icon,
  UserGroup02Icon,
  ZapIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { parseAsInteger, parseAsString, useQueryState } from "nuqs";
import { Suspense, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const FEATURES = [
  {
    icon: Clock01Icon,
    title: "24/7 Availability",
    desc: "Always here when you need us",
  },
  {
    icon: ZapIcon,
    title: "Quick Response",
    desc: "Fastest response in emergency",
  },
  {
    icon: UserGroup02Icon,
    title: "Trained Staff",
    desc: "Experienced medical support",
  },
  {
    icon: SecurityCheckIcon,
    title: "Safe & Reliable",
    desc: "Your safety is our priority",
  },
];

const STATUS_OPTIONS = [
  { value: "all", label: "All", icon: CheckmarkBadge01Icon },
  { value: "Active", label: "Available", icon: Clock01Icon },
  { value: "Inactive", label: "Unavailable", icon: Cancel01Icon },
] as const;

function LocationCombobox({
  districtOptions,
  upazilaOptions,
  selectedDistrict,
  selectedUpazila,
  onDistrictChange,
  onUpazilaChange,
  triggerClassName,
}: {
  districtOptions: string[];
  upazilaOptions: string[];
  selectedDistrict: string | null;
  selectedUpazila: string | null;
  onDistrictChange: (v: string | null) => void;
  onUpazilaChange: (v: string | null) => void;
  triggerClassName?: string;
}) {
  const [open, setOpen] = useState(false);
  const [level, setLevel] = useState<"district" | "upazila">("district");
  const [search, setSearch] = useState("");

  const handleOpenChange = (v: boolean) => {
    setOpen(v);
    if (!v) {
      setSearch("");
      setLevel("district");
    }
  };

  const handleDistrictSelect = (d: string | null) => {
    if (d === null) {
      onDistrictChange(null);
      onUpazilaChange(null);
      setOpen(false);
    } else {
      onDistrictChange(d);
      onUpazilaChange(null);
      setLevel("upazila");
      setSearch("");
    }
  };

  const handleUpazilaSelect = (u: string | null) => {
    onUpazilaChange(u);
    setOpen(false);
    setSearch("");
    setLevel("district");
  };

  const triggerLabel = selectedDistrict
    ? selectedUpazila
      ? `${selectedDistrict} · ${selectedUpazila}`
      : selectedDistrict
    : "All Locations";

  const filteredDistricts = districtOptions.filter((d) =>
    d.toLowerCase().includes(search.toLowerCase()),
  );
  const filteredUpazilas = upazilaOptions.filter(
    (u) => u != null && u.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            triggerClassName ??
              "border-border bg-background flex w-full items-center gap-2.5 rounded-md border px-3 py-2.5 text-left text-sm font-medium",
            open && "border-primary/50",
          )}
        >
          <HugeiconsIcon
            icon={PinLocation02Icon}
            size={16}
            className="text-primary shrink-0"
          />
          <span
            className={cn(
              "line-clamp-1 flex-1 text-sm font-medium whitespace-normal",
              selectedDistrict ? "text-foreground" : "text-muted-foreground",
            )}
          >
            {triggerLabel}
          </span>
          <HugeiconsIcon
            icon={ArrowDown01Icon}
            size={14}
            className={cn(
              "text-muted-foreground shrink-0 transition-transform duration-200",
              open && "rotate-180",
            )}
          />
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" sideOffset={6} className="w-72 gap-0 p-0">
        <div className="border-border border-b px-3 py-2.5">
          {level === "upazila" && (
            <button
              type="button"
              onClick={() => {
                setLevel("district");
                setSearch("");
              }}
              className="text-primary mb-2 flex items-center gap-1.5 text-xs font-semibold hover:underline"
            >
              ← {selectedDistrict}
            </button>
          )}
          <div className="flex items-center gap-2">
            <HugeiconsIcon
              icon={Search01Icon}
              size={14}
              className="text-muted-foreground shrink-0"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={
                level === "district"
                  ? "Search districts..."
                  : "Search upazilas..."
              }
              className="text-foreground placeholder:text-muted-foreground w-full bg-transparent text-sm outline-none"
              autoFocus
            />
            {search && (
              <button type="button" onClick={() => setSearch("")}>
                <HugeiconsIcon
                  icon={Cancel01Icon}
                  size={13}
                  className="text-muted-foreground hover:text-foreground"
                />
              </button>
            )}
          </div>
        </div>
        <div className="max-h-64 overflow-y-auto py-1.5">
          {level === "district" ? (
            <>
              <button
                type="button"
                onClick={() => handleDistrictSelect(null)}
                className={cn(
                  "flex w-full items-center justify-between px-3 py-2 text-sm transition-colors",
                  !selectedDistrict
                    ? "text-primary font-semibold"
                    : "text-foreground hover:bg-muted/50",
                )}
              >
                <span className="flex items-center gap-2">
                  <HugeiconsIcon
                    icon={PinLocation02Icon}
                    size={14}
                    className="shrink-0"
                  />
                  All Locations
                </span>
                {!selectedDistrict && (
                  <HugeiconsIcon
                    icon={Tick02Icon}
                    size={14}
                    className="text-primary"
                  />
                )}
              </button>
              {filteredDistricts.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => handleDistrictSelect(d)}
                  className={cn(
                    "flex w-full items-center justify-between px-3 py-2 text-sm transition-colors",
                    selectedDistrict === d
                      ? "text-primary font-semibold"
                      : "text-foreground hover:bg-muted/50",
                  )}
                >
                  <span className="flex items-center gap-2">
                    <HugeiconsIcon
                      icon={PinLocation02Icon}
                      size={14}
                      className="shrink-0"
                    />
                    {d}
                  </span>
                  <span className="text-muted-foreground text-xs">›</span>
                </button>
              ))}
              {filteredDistricts.length === 0 && (
                <p className="text-muted-foreground py-6 text-center text-sm">
                  No districts found
                </p>
              )}
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => handleUpazilaSelect(null)}
                className={cn(
                  "flex w-full items-center justify-between px-3 py-2 text-sm transition-colors",
                  !selectedUpazila
                    ? "text-primary font-semibold"
                    : "text-foreground hover:bg-muted/50",
                )}
              >
                <span className="flex items-center gap-2">
                  <HugeiconsIcon
                    icon={PinLocation02Icon}
                    size={14}
                    className="shrink-0"
                  />
                  All of {selectedDistrict}
                </span>
                {!selectedUpazila && (
                  <HugeiconsIcon
                    icon={Tick02Icon}
                    size={14}
                    className="text-primary"
                  />
                )}
              </button>
              {filteredUpazilas.map((u) => (
                <button
                  key={u}
                  type="button"
                  onClick={() => handleUpazilaSelect(u)}
                  className={cn(
                    "flex w-full items-center justify-between px-3 py-2 text-sm transition-colors",
                    selectedUpazila === u
                      ? "text-primary font-semibold"
                      : "text-foreground hover:bg-muted/50",
                  )}
                >
                  <span className="flex items-center gap-2">
                    <HugeiconsIcon
                      icon={PinLocation02Icon}
                      size={14}
                      className="shrink-0"
                    />
                    {u}
                  </span>
                  {selectedUpazila === u && (
                    <HugeiconsIcon
                      icon={Tick02Icon}
                      size={14}
                      className="text-primary"
                    />
                  )}
                </button>
              ))}
              {filteredUpazilas.length === 0 && (
                <p className="text-muted-foreground py-6 text-center text-sm">
                  {search ? "No results" : "No upazilas found"}
                </p>
              )}
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

function MobileFilterContent({
  ambulanceType,
  setAmbulanceType,
  status,
  setStatus,
  onApply,
  onReset,
  onClose,
  typeOptions,
}: {
  ambulanceType: string | null;
  setAmbulanceType: (v: string | null) => void;
  status: string;
  setStatus: (v: string) => void;
  onApply: () => void;
  onReset: () => void;
  onClose: () => void;
  typeOptions: string[];
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex justify-center pt-3 pb-1">
        <div className="bg-muted-foreground/30 h-1 w-10 rounded-full" />
      </div>
      <div className="flex items-center justify-between px-5 pt-4 pb-4">
        <SheetTitle className="text-foreground text-lg font-bold">
          Filters
        </SheetTitle>
        <button
          type="button"
          onClick={onClose}
          className="border-border bg-muted/40 text-foreground/70 hover:text-foreground flex h-8 w-8 items-center justify-center rounded-full border transition-colors"
        >
          <HugeiconsIcon icon={Cancel01Icon} size={16} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto px-5 pb-4">
        {typeOptions.length > 0 && (
          <div className="mb-6">
            <p className="text-muted-foreground mb-3 text-xs font-bold tracking-wider uppercase">
              Ambulance Type
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setAmbulanceType(null)}
                className={cn(
                  "flex flex-col items-center gap-1.5 rounded-xl border px-2 py-3 text-center transition-colors",
                  !ambulanceType
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-muted/30 text-muted-foreground hover:border-primary/40",
                )}
              >
                <HugeiconsIcon icon={AmbulanceIcon} size={22} />
                <span className="text-micro leading-tight font-medium">
                  All
                </span>
              </button>
              {typeOptions.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setAmbulanceType(t)}
                  className={cn(
                    "flex flex-col items-center gap-1.5 rounded-xl border px-2 py-3 text-center transition-colors",
                    ambulanceType === t
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-muted/30 text-muted-foreground hover:border-primary/40",
                  )}
                >
                  <HugeiconsIcon icon={AmbulanceIcon} size={22} />
                  <span className="text-micro leading-tight font-medium">
                    {t}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
        <div className="mb-6">
          <p className="text-muted-foreground mb-3 text-xs font-bold tracking-wider uppercase">
            Availability
          </p>
          <div className="grid grid-cols-3 gap-2">
            {STATUS_OPTIONS.map((s) => (
              <button
                key={s.value}
                type="button"
                onClick={() => setStatus(s.value)}
                className={cn(
                  "flex flex-col items-center gap-1.5 rounded-xl border px-2 py-3 text-center transition-colors",
                  status === s.value
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-muted/30 text-muted-foreground hover:border-primary/40",
                )}
              >
                <HugeiconsIcon icon={s.icon} size={22} />
                <span className="text-micro leading-tight font-medium">
                  {s.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="border-border border-t px-5 py-4">
        <button
          type="button"
          onClick={onApply}
          className="bg-primary hover:bg-primary/90 mb-3 w-full rounded-2xl py-4 text-base font-semibold text-white transition-opacity"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
}

function AmbulancesContent() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const [search, setSearch] = useQueryState(
    "search",
    parseAsString
      .withDefault("")
      .withOptions({ shallow: false, clearOnDefault: true }),
  );
  const [district, setDistrict] = useQueryState(
    "district",
    parseAsString.withOptions({ shallow: false, clearOnDefault: true }),
  );
  const [upazila, setUpazila] = useQueryState(
    "upazila",
    parseAsString.withOptions({ shallow: false, clearOnDefault: true }),
  );
  const [ambulanceType, setAmbulanceType] = useQueryState(
    "type",
    parseAsString.withOptions({ shallow: false, clearOnDefault: true }),
  );
  const [status, setStatus] = useQueryState(
    "status",
    parseAsString.withOptions({ shallow: false, clearOnDefault: true }),
  );
  const [page, setPage] = useQueryState(
    "page",
    parseAsInteger
      .withDefault(1)
      .withOptions({ shallow: false, clearOnDefault: true }),
  );

  const [searchInput, setSearchInput] = useState(search);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput.trim() || null);
      setPage(null);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const [pendingType, setPendingType] = useState<string | null>(ambulanceType);
  const [pendingStatus, setPendingStatus] = useState<string>(status ?? "all");

  const { data: filtersData } = useAmbulanceFilters();
  const typeOptions = filtersData?.types ?? [];

  const { data: bdLocations = [] } = useBdLocations();
  const districtOptions = [
    ...new Set(bdLocations.map((l) => l.district)),
  ].sort();
  const upazilaOptions = bdLocations
    .filter((l) => l.district === district)
    .map((l) => l.upazila);
  const locationLabel = district ?? "All Locations";

  const filtersUrl: Record<string, unknown> = {
    page,
    limit: 12,
    search: search || "",
    district: district || undefined,
    upazila: upazila || undefined,
    type: ambulanceType || undefined,
    status: status || undefined,
  };

  const {
    data: ambulanceData,
    isLoading,
    isFetching,
  } = useAmbulances(filtersUrl);
  const ambulances = ambulanceData?.data || [];
  const meta = ambulanceData?.meta;
  const totalCount = meta?.total ?? ambulances.length;

  const ambulanceTypesForForm = typeOptions.map((t) => ({ id: t, title: t }));

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const applyFilters = () => {
    setAmbulanceType(pendingType);
    setStatus(pendingStatus === "all" ? null : pendingStatus);
    setPage(null);
    setMobileFilterOpen(false);
  };

  const resetFilters = () => {
    setPendingType(null);
    setPendingStatus("all");
    setAmbulanceType(null);
    setDistrict(null);
    setUpazila(null);
    setStatus(null);
    setPage(null);
  };

  const closeMobileWithoutApply = () => {
    setPendingType(ambulanceType);
    setPendingStatus(status ?? "all");
    setMobileFilterOpen(false);
  };

  return (
    <div className="bg-background min-h-screen pb-24 md:pb-8">
      {/* ── Mobile Hero (< md) ── */}
      <div className="bg-surface relative overflow-hidden md:hidden">
        <div className="relative z-10 max-w-[58%] px-5 pt-6 pb-6">
          <span className="bg-primary-light text-primary text-micro mb-3 inline-flex items-center gap-1.5 rounded-md px-3 py-1 font-bold">
            ✓ FAST. SAFE. ALWAYS READY
          </span>
          <h1 className="text-foreground mb-2 text-2xl leading-tight font-extrabold">
            Ambulance Services Near You
          </h1>
          <p className="text-muted-foreground mb-4 text-xs leading-relaxed">
            Book prompt, high-quality emergency ambulances for your critical
            needs with fast response and trusted support.
          </p>
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button
                size="sm"
                className="bg-primary hover:bg-primary/90 w-fit gap-1.5 rounded-md px-4 text-xs font-semibold text-white shadow-[0_6px_20px_color-mix(in_oklch,var(--primary)_35%,transparent)]"
              >
                Request Ambulance Now →
              </Button>
            </DialogTrigger>
            <DialogContent
              showCloseButton={false}
              className="flex max-h-[92dvh] w-[95vw] flex-col overflow-hidden rounded-md border-0 p-0 sm:max-w-xl md:max-w-2xl lg:max-w-4xl xl:max-w-5xl"
            >
              <DialogTitle className="sr-only">
                Request an Ambulance
              </DialogTitle>
              <AmbulanceRequestForm
                onSuccess={() => setIsFormOpen(false)}
                ambulanceTypes={ambulanceTypesForForm}
              />
            </DialogContent>
          </Dialog>
        </div>
        <div className="absolute top-0 right-0 bottom-0 flex w-[46%] items-end justify-center overflow-hidden">
          <img
            src="/images/default-ambulance.png"
            alt="Ambulance"
            className="h-full w-full object-contain object-bottom"
          />
        </div>
      </div>

      {/* ── Search Bar ── */}
      <SearchFilterBar
        searchValue={searchInput}
        onSearchChange={setSearchInput}
        onSubmit={handleSearch}
        placeholder="Search ambulances by name or type..."
        cityLabel={locationLabel}
        locationNode={<></>}
        actionsNode={<BookingContactButtons />}
      />

      {/* ── Mobile Filter Sheet ── */}
      <Sheet
        open={mobileFilterOpen}
        onOpenChange={(open) => {
          if (!open) closeMobileWithoutApply();
          else setMobileFilterOpen(true);
        }}
      >
        <SheetContent
          side="bottom"
          showCloseButton={false}
          className="h-[85vh] rounded-t-3xl p-0"
        >
          <MobileFilterContent
            ambulanceType={pendingType}
            setAmbulanceType={setPendingType}
            status={pendingStatus}
            setStatus={setPendingStatus}
            onApply={applyFilters}
            onReset={resetFilters}
            onClose={closeMobileWithoutApply}
            typeOptions={typeOptions}
          />
        </SheetContent>
      </Sheet>

      {/* ── Desktop Hero (md+) ── */}
      <div className="container mx-auto hidden px-4 pt-8 pb-10 md:block">
        <div className="bg-surface relative flex min-h-[280px] items-stretch overflow-hidden rounded-md">
          <div className="relative z-10 flex flex-1 flex-col justify-center px-10 py-10">
            <span className="bg-primary-light text-primary mb-5 inline-flex w-fit items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-bold">
              ✓ FAST. SAFE. ALWAYS READY
            </span>
            <h1 className="text-foreground mb-4 text-4xl leading-tight font-extrabold lg:text-[2.6rem]">
              Ambulance Services
              <br />
              Near You
            </h1>
            <p className="text-muted-foreground mb-6 max-w-sm text-sm leading-relaxed">
              Book prompt, high-quality emergency ambulances for your critical
              needs with fast response and trusted support.
            </p>
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
              <DialogTrigger asChild>
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 h-12 w-fit gap-2 rounded-md px-6 font-semibold text-white shadow-[0_6px_20px_color-mix(in_oklch,var(--primary)_35%,transparent)]"
                >
                  Request Ambulance Now →
                </Button>
              </DialogTrigger>
              <DialogContent
                showCloseButton={false}
                className="flex max-h-[92dvh] w-[95vw] flex-col overflow-hidden rounded-md border-0 p-0 sm:max-w-xl md:max-w-2xl lg:max-w-4xl xl:max-w-5xl"
              >
                <DialogTitle className="sr-only">
                  Request an Ambulance
                </DialogTitle>
                <AmbulanceRequestForm
                  onSuccess={() => setIsFormOpen(false)}
                  ambulanceTypes={ambulanceTypesForForm}
                />
              </DialogContent>
            </Dialog>
          </div>
          <div className="relative flex w-[45%] shrink-0 items-end justify-center overflow-hidden">
            <div className="bg-primary-light absolute bottom-0 left-1/2 aspect-square w-[85%] -translate-x-1/2 translate-y-[15%] rounded-md" />
            <div className="absolute top-4 right-4 grid grid-cols-4 gap-1 opacity-30">
              {Array.from({ length: 16 }).map((_, i) => (
                <div key={i} className="bg-primary h-1 w-1 rounded-md" />
              ))}
            </div>
            <div className="text-primary/30 absolute top-8 left-6 text-2xl font-thin select-none">
              +
            </div>
            <img
              src="/images/default-ambulance.png"
              alt="Ambulance service"
              className="relative z-10 h-full w-full object-contain object-bottom"
            />
          </div>
        </div>
      </div>

      {/* ── List Section ── */}
      <div className="container mx-auto mt-4 px-4 md:mt-0">
        <div>
          <div className="min-w-0 flex-1">
            <div className="mb-5">
              <h2 className="text-foreground text-2xl font-extrabold">
                All Ambulance Service
              </h2>
              <p className="text-muted-foreground mt-1 text-sm">
                {isLoading ? (
                  <span className="bg-muted inline-block h-4 w-48 animate-pulse rounded" />
                ) : (
                  <>
                    <span className="text-primary font-bold">
                      {totalCount} ambulances
                    </span>{" "}
                    {district ? `found in ${district}` : "found"}
                  </>
                )}
              </p>
            </div>

            <div
              className={cn(
                "mb-6 transition-opacity",
                isFetching && !isLoading ? "opacity-60" : "opacity-100",
              )}
            >
              {!isLoading && ambulances.length === 0 ? (
                <SearchEmptyState
                  icon={AmbulanceIcon}
                  title="No ambulances found"
                  description="Try a different search term, city, or type. Clear filters to browse all available ambulances."
                  onClear={resetFilters}
                />
              ) : (
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                  {isLoading
                    ? Array.from({ length: 6 }).map((_, i) => (
                        <AmbulanceCard key={`ph-${i}`} loading />
                      ))
                    : ambulances.map((ambulance) => (
                        <AmbulanceCard key={ambulance.id} ambulance={ambulance} />
                      ))}
                </div>
              )}
            </div>

            {meta && (
              <Pagination
                meta={meta}
                isFetching={isFetching}
                currentPage={page}
                onPageChange={handlePageChange}
              />
            )}
          </div>
        </div>
      </div>

      {/* ── Features Strip ── */}
      <div className="container mx-auto mt-10 mb-8 px-4">
        <div className="bg-card border-border rounded-md border px-4 py-5 sm:px-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
            {FEATURES.map((f) => (
              <div key={f.title} className="flex items-center gap-3">
                <div className="bg-primary/10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full">
                  <HugeiconsIcon
                    icon={f.icon}
                    size={22}
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

export default function AmbulancesPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-muted/20 flex min-h-screen w-full animate-pulse items-center justify-center" />
      }
    >
      <AmbulancesContent />
    </Suspense>
  );
}
