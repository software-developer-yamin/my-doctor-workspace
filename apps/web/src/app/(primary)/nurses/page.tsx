"use client";

import { SearchFilterSection } from "@/components/app-primary/search-page/search-filter-section";
import { NurseCard } from "@/components/cards/nurse-card";
import { SearchEmptyState } from "@/components/common/search-empty-state";
import { NURSES_DATA } from "@/data/nurses.data";
import { StethoscopeIcon } from "@hugeicons/core-free-icons";
import dynamic from "next/dynamic";

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

import { Suspense } from "react";

function NursesContent() {
  return (
    <>
      <SearchFilterSection
        hideType={true}
        placeholderText="Search nurses by name, specialty, or services..."
      />

      <div className="container mx-auto mt-2">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-foreground text-2xl font-bold">
            Certified Nurses for Home & Hospital Care
          </h1>
          <p className="text-muted-foreground mt-2">
            Book qualified nurses for ICU care, home visits, elderly assistance,
            and more.
          </p>
        </div>

        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Left Side: Nurses List */}
          <div className="flex flex-1 flex-col gap-4">
            {NURSES_DATA.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 text-xs sm:grid-cols-2 md:text-base lg:grid-cols-3">
                {NURSES_DATA.map((nurse) => (
                  <NurseCard key={nurse.id} nurse={nurse} />
                ))}
              </div>
            ) : (
              <SearchEmptyState
                icon={StethoscopeIcon}
                title="No nurses found"
                description="We couldn't find any nurses matching your criteria. Please check back later."
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default function NursesPage() {
  return (
    <div className="bg-background min-h-screen pb-20">
      <Suspense
        fallback={
          <div className="bg-muted/20 flex h-screen w-full animate-pulse items-center justify-center" />
        }
      >
        <NursesContent />
      </Suspense>
    </div>
  );
}
