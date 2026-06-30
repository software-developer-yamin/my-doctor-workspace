"use client";

import { SpecializationCard } from "@/components/cards/specialization-card";
import { Pagination } from "@/components/common/pagination";
import { useSpecialitiesPaginated } from "@/hooks/queries/use-specialities";
import { Search01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useIsMobile } from "@/hooks/ui/use-mobile";
import React, { useState, useEffect } from "react";

const LIMIT = 24;

export default function SpecializationsPage() {
  const isMobile = useIsMobile();
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);

  // Debounce search — 400ms delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
      setPage(1); // Reset to page 1 on new search
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const { data, isLoading, isFetching } = useSpecialitiesPaginated({
    page,
    limit: LIMIT,
    search: debouncedSearch || undefined,
  });

  const specializations = data?.data || [];
  const meta = data?.meta;

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto py-6 lg:py-12">
        {/* Header */}
        <h1 className="text-foreground text-3xl font-bold">
          Doctor Specializations
        </h1>

        {/* Search Bar */}
        <div className="relative mt-4 w-full">
          <span className="absolute inset-y-0 left-0 flex items-center pl-4">
            <HugeiconsIcon
              icon={Search01Icon}
              size={20}
              className="text-muted-foreground"
            />
          </span>
          <input
            type="text"
            placeholder={isMobile ? "Search..." : "Search specializations..."}
            className="border-border bg-background dark:bg-card text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary h-12 w-full rounded-md border pl-11 pr-4 text-sm shadow-sm focus:outline-none focus:ring-1"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>

        {/* Grid */}
        <div
          className={`mt-10 grid grid-cols-2 gap-x-6 gap-y-12 transition-opacity sm:grid-cols-3 md:gap-x-8 lg:grid-cols-6 lg:gap-x-4 ${isFetching && !isLoading ? "opacity-60" : "opacity-100"}`}
        >
          {!isLoading && specializations.length === 0 ? (
            <div className="col-span-full py-12 text-center">
              <p className="text-muted-foreground">
                {debouncedSearch
                  ? `No specializations found for "${debouncedSearch}".`
                  : "No specializations available."}
              </p>
            </div>
          ) : isLoading ? (
            Array.from({ length: LIMIT }).map((_, i) => (
              <SpecializationCard key={`ph-${i}`} loading />
            ))
          ) : (
            specializations.map((spec) => (
              <SpecializationCard key={spec.id} specialization={spec} />
            ))
          )}
        </div>

        {/* Pagination */}
        {!isLoading && meta && (
          <Pagination
            meta={meta}
            isFetching={isFetching}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
}

