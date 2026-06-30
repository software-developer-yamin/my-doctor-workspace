"use client";

import { HealthCheckupServiceCard } from "@/components/cards/health-checkup-service-card";
import { HealthCheckupFilters } from "@/components/app-primary/health-checkup-services-page/health-checkup-filters";
import {
  HEALTH_CHECKUP_CATEGORIES,
  HEALTH_CHECKUP_PACKAGES,
  SERVICE_PROVIDERS,
} from "@/data/health-checkup.data";
import { Search01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import { FloatingCartButton } from "@/components/common/floating-cart-button";

export default function HealthCheckupServicesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedProviders, setSelectedProviders] = useState<string[]>([]);

  const toggleCategory = (id: string) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    );
  };

  const toggleProvider = (id: string) => {
    setSelectedProviders((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id],
    );
  };

  const filtered = HEALTH_CHECKUP_PACKAGES.filter((pkg) => {
    const matchesSearch =
      searchQuery === "" ||
      pkg.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategories.length === 0 ||
      selectedCategories.includes(pkg.category);

    const matchesProvider =
      selectedProviders.length === 0 ||
      selectedProviders.includes(pkg.providerId);

    return matchesSearch && matchesCategory && matchesProvider;
  });

  return (
    <main className="bg-background min-h-screen">
      <div className="container mx-auto px-4 xl:px-0">
        {/* Page Title */}
        <div className="pt-10 pb-6">
          <h1 className="text-foreground text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
            Health Checkup &amp; Insurance
          </h1>
        </div>

        <div className="flex flex-col items-start gap-6 pb-14 sm:flex-row">
          <HealthCheckupFilters
            categories={HEALTH_CHECKUP_CATEGORIES}
            providers={SERVICE_PROVIDERS}
            selectedCategories={selectedCategories}
            selectedProviders={selectedProviders}
            onCategoryToggle={toggleCategory}
            onProviderToggle={toggleProvider}
          />

          {/* ── Right Side: Search + Grid ── */}
          <div className="w-full sm:w-3/4">
            {/* Search Input */}
            <div className="mb-6">
              <div className="relative">
                <span className="text-muted-foreground pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <HugeiconsIcon icon={Search01Icon} className="h-5 w-5" />
                </span>
                <input
                  type="search"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border-border bg-card text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20 block h-[50px] w-full rounded-md border pr-4 pl-11 text-sm font-bold shadow-sm transition-all outline-none focus:ring-2"
                />
              </div>
            </div>

            {/* Results Grid */}
            {filtered.length > 0 ? (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((pkg) => (
                  <HealthCheckupServiceCard key={pkg.id} package={pkg} />
                ))}
              </div>
            ) : (
              <div className="bg-card border-border flex h-48 flex-col items-center justify-center rounded-md border text-center shadow-sm">
                <p className="text-foreground text-base font-black">
                  No packages found
                </p>
                <p className="text-muted-foreground mt-1 text-sm font-bold italic">
                  Try adjusting your filters or search term.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <FloatingCartButton count={0} onClick={() => {}} />
    </main>
  );
}
