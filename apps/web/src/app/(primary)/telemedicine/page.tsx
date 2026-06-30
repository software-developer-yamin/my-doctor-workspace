"use client";

import { TelemedicineSpecializationCard } from "@/components/cards/telemedicine-specialization-card";
import { TELEMEDICINE_SPECIALIZATIONS } from "@/data/telemedicine.data";
import { Search01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useIsMobile } from "@/hooks/ui/use-mobile";
import React, { useState } from "react";

export default function TelemedicinePage() {
  const isMobile = useIsMobile();
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = TELEMEDICINE_SPECIALIZATIONS.filter((spec) =>
    spec.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto py-6 lg:py-12">

        {/* Header */}
        <div className="flex flex-col gap-4 pb-4 md:flex-row md:items-center md:justify-between">
          <h1 className="text-3xl font-bold text-foreground">
            Select a Specialization
          </h1>

          {/* Search */}
          <div className="relative w-full md:w-[300px]">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <HugeiconsIcon
                icon={Search01Icon}
                size={20}
                className="text-muted-foreground"
              />
            </span>
            <input
              type="search"
              placeholder={isMobile ? "Search..." : "Search doctors, hospitals, clinics..."}
              className="h-full w-full rounded-md border border-border bg-card py-3 pl-11 pr-3 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Grid */}
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
          {filtered.length > 0 ? (
            filtered.map((spec) => (
              <TelemedicineSpecializationCard
                key={spec.id}
                specialization={spec}
              />
            ))
          ) : (
            <div className="col-span-full py-16 text-center">
              <p className="text-muted-foreground text-lg">
                No specializations found for &quot;{searchTerm}&quot;.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
