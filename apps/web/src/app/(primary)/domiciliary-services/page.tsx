"use client";

import { DomiciliaryServiceCard } from "@/components/cards/domiciliary-service-card";
import { DomiciliaryFilters } from "@/components/app-primary/domiciliary-services-page/domiciliary-filters";
import {
  DOMICILIARY_CATEGORIES,
  DOMICILIARY_SERVICES,
} from "@/data/domiciliary-services.data";
import { Search01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import { FloatingCartButton } from "@/components/common/floating-cart-button";

export default function DomiciliaryServicesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const toggleCategory = (id: string) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    );
  };

  const filtered = DOMICILIARY_SERVICES.filter((service) => {
    const matchesSearch =
      searchQuery === "" ||
      service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategories.length === 0 ||
      selectedCategories.includes(service.category);

    return matchesSearch && matchesCategory;
  });

  return (
    <main className="bg-background min-h-screen">
      <div className="container mx-auto px-4 xl:px-0">
        {/* Page Title & Intro */}
        <div className="pt-10 pb-8">
          <h1 className="text-foreground text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
            Healthcare at Your Doorstep
          </h1>
          <p className="text-muted-foreground mt-3 max-w-2xl text-base font-bold sm:text-lg">
            Professional nursing, physiotherapy, and elderly care services provided by certified health experts in the comfort of your home.
          </p>
        </div>

        <div className="flex flex-col items-start gap-8 pb-20 sm:flex-row">
          {/* Sidebar Filters */}
          <DomiciliaryFilters
            categories={DOMICILIARY_CATEGORIES}
            selectedCategories={selectedCategories}
            onCategoryToggle={toggleCategory}
          />

          {/* Main Results Column */}
          <div className="w-full sm:w-3/4">
            {/* Search Bar */}
            <div className="mb-8">
              <div className="group relative">
                <span className="text-muted-foreground absolute inset-y-0 left-0 flex items-center pl-4 group-focus-within:text-primary transition-colors">
                  <HugeiconsIcon icon={Search01Icon} className="h-5 w-5" />
                </span>
                <input
                  type="search"
                  placeholder="Search home care services (e.g. Nursing, Physio)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border-border bg-card text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20 block h-[54px] w-full rounded-md border pr-4 pl-12 text-sm font-bold shadow-sm transition-all outline-none focus:ring-2"
                />
              </div>
            </div>

            {/* Results Grid */}
            {filtered.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((service) => (
                  <DomiciliaryServiceCard key={service.id} service={service} />
                ))}
              </div>
            ) : (
              <div className="bg-card border-border flex h-60 flex-col items-center justify-center rounded-md border text-center shadow-sm">
                <div className="bg-muted/50 mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                  <HugeiconsIcon icon={Search01Icon} className="text-muted-foreground h-8 w-8" />
                </div>
                <p className="text-foreground text-lg font-black">
                  No services found
                </p>
                <p className="text-muted-foreground mt-1 max-w-xs text-sm font-bold italic">
                  We couldn&apos;t find anything matching your search or filters.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating UI */}
      <FloatingCartButton count={0} onClick={() => {}} />
    </main>
  );
}
