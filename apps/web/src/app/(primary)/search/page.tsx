"use client";

import { SearchFilterSection } from "@/components/app-primary/search-page/search-filter-section";
import { DoctorCard } from "@/components/cards/doctor-card";
import { HospitalCard } from "@/components/cards/hospital-card";
import { NurseCard } from "@/components/cards/nurse-card";
import { Pagination } from "@/components/common/pagination";
import { NURSES_DATA, TNurse } from "@/data/nurses.data";
import { useDoctors } from "@/hooks/queries/use-doctors";
import { useHospitals } from "@/hooks/queries/use-hospitals";
import { Doctor } from "@/types/doctor.type";
import { Hospital } from "@/types/hospital.type";
import dynamic from "next/dynamic";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

const SearchMapComponent = dynamic(
  () =>
    import("@/components/app-primary/search-page/search-map").then(
      (m) => m.SearchMap,
    ),
  {
    ssr: false,
    loading: () => <div className="bg-muted/80 flex-1 animate-pulse" />,
  },
);

type TSearchItem =
  | { type: "hospital"; data: Hospital }
  | { type: "doctor"; data: Doctor }
  | { type: "nurse"; data: TNurse };

function SearchResults() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const typeFilter = searchParams.get("type")?.toLowerCase() || "";
  const query = (searchParams.get("search") || searchParams.get("q") || "")
    .trim()
    .toLowerCase();

  // Extract other advanced filters if present
  const filters: Record<string, any> = {
    page: searchParams.get("page") ? Number(searchParams.get("page")) : 1,
    limit: searchParams.get("limit") ? Number(searchParams.get("limit")) : 10,
    search: query,
    district: searchParams.get("district") || undefined,
    upazila: searchParams.get("upazila") || undefined,
    speciality: searchParams.get("speciality") || undefined,
    concentration: searchParams.get("concentration") || undefined,
    gender: searchParams.get("gender") || undefined,
    consultationType: searchParams.get("consultationType") || undefined,
    minFee: searchParams.get("minFee") || undefined,
    maxFee: searchParams.get("maxFee") || undefined,
    rating: searchParams.get("rating") || undefined,
  };

  // Fetch dynamic results
  const doctorQuery = useDoctors(filters);

  const hospitalFilters = {
    ...filters,
    page: filters.page,
    limit: filters.limit,
    search: query,
    district: filters.district,
    upazila: filters.upazila,
  };
  const hospitalQuery = useHospitals(hospitalFilters);

  const allItems: TSearchItem[] = [];

  const isLoading =
    (typeFilter === "doctor" && doctorQuery.isLoading) ||
    (typeFilter === "hospital" && hospitalQuery.isLoading) ||
    (typeFilter === "" && (doctorQuery.isLoading || hospitalQuery.isLoading));

  const isFetching = doctorQuery.isFetching || hospitalQuery.isFetching;

  if (
    !doctorQuery.isLoading &&
    (typeFilter === "doctor" || typeFilter === "")
  ) {
    doctorQuery.data?.data.forEach((d) =>
      allItems.push({ type: "doctor", data: d }),
    );
  }

  if (
    !hospitalQuery.isLoading &&
    (typeFilter === "hospital" || typeFilter === "")
  ) {
    hospitalQuery.data?.data.forEach((h) =>
      allItems.push({ type: "hospital", data: h }),
    );
  }

  if (typeFilter === "nurse" || typeFilter === "") {
    const filteredNurses = NURSES_DATA.filter(
      (n) =>
        n.name.toLowerCase().includes(query.toLowerCase()) ||
        n.specialty.toLowerCase().includes(query.toLowerCase()) ||
        n.certifications.some((c) =>
          c.toLowerCase().includes(query.toLowerCase()),
        ) ||
        n.services.some((s) => s.toLowerCase().includes(query.toLowerCase())),
    );
    allItems.push(
      ...filteredNurses.map((n) => ({ type: "nurse" as const, data: n })),
    );
  }

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`${pathname}?${params.toString()}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Determine which metadata to use for pagination
  // If a specific type is selected, use that. If "all", we don't have a combined meta.
  const meta =
    typeFilter === "doctor"
      ? doctorQuery.data?.meta
      : typeFilter === "hospital"
        ? hospitalQuery.data?.meta
        : null;

  const skeletonCards = Array.from({ length: 4 }, (_, i) => {
    const tf = typeFilter;
    if (tf === "hospital") return <HospitalCard key={`ph-${i}`} loading />;
    if (tf === "nurse") return <NurseCard key={`ph-${i}`} loading />;
    return <DoctorCard key={`ph-${i}`} loading />;
  });

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-foreground text-xl font-black tracking-tight sm:text-2xl">
          {typeFilter === "nurse"
            ? "Certified Nurses for Home & Hospital Care"
            : typeFilter === "doctor"
              ? "Consult Our Top Specialized Doctors"
              : typeFilter === "hospital"
                ? "Top Hospitals & Clinics"
                : "Doctors, Hospitals & Nurses"}
          {typeFilter && (
            <span className="text-primary ml-2 text-sm font-black uppercase">
              ({typeFilter}s)
            </span>
          )}
        </h2>
      </div>

      <div
        className={`flex flex-col gap-2 transition-opacity ${isFetching && !isLoading ? "opacity-60" : "opacity-100"}`}
      >
        {isLoading ? skeletonCards : (
          allItems.map((item, index) => {
            if (item.type === "hospital") {
              return (
                <HospitalCard
                  key={`h-${item.data.id}-${index}`}
                  hospital={item.data}
                />
              );
            }
            if (item.type === "doctor") {
              return (
                <DoctorCard
                  key={`d-${item.data.id}-${index}`}
                  doctor={item.data}
                />
              );
            }
            if (item.type === "nurse") {
              return (
                <NurseCard key={`n-${item.data.id}-${index}`} nurse={item.data} />
              );
            }
            return null;
          })
        )}
        {!isLoading && allItems.length === 0 && (
          <div className="text-muted-foreground py-20 text-center font-black">
            No results found.
          </div>
        )}

        {/* Pagination - Only if a specific type is selected because we have meta for it */}
        {!isLoading && meta && (
          <Pagination
            meta={meta}
            isFetching={isFetching}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </>
  );
}

export default function SearchPage() {
  return (
    <div className="bg-background min-h-screen pb-20">
      {/* Heavy Filter Section at the Top */}
      <Suspense fallback={<div className="bg-card h-32 animate-pulse" />}>
        <SearchFilterSection placeholderText="Search doctors, hospitals..." />
      </Suspense>

      {/* Main Content Area: Split Layout (Cards + Map) */}
      <div className="container mx-auto mt-6">
        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Left Side: Results List */}
          <div className="flex flex-1 flex-col">
            <Suspense
              fallback={
                <div className="bg-card h-64 animate-pulse rounded-md" />
              }
            >
              <SearchResults />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
