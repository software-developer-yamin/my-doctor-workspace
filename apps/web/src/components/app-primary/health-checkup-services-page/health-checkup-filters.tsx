"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface FilterOption {
  id: string;
  label: string;
}

interface HealthCheckupFiltersProps {
  categories: FilterOption[];
  providers: FilterOption[];
  selectedCategories: string[];
  selectedProviders: string[];
  onCategoryToggle: (id: string) => void;
  onProviderToggle: (id: string) => void;
}

export function HealthCheckupFilters({
  categories,
  providers,
  selectedCategories,
  selectedProviders,
  onCategoryToggle,
  onProviderToggle,
}: HealthCheckupFiltersProps) {
  return (
    <aside className="w-full shrink-0 space-y-4 sm:w-1/4">
      {/* Category Filter */}
      <div className="bg-card border-border rounded-xl border shadow-sm">
        <h4 className="border-border text-primary border-b px-5 py-3.5 text-sm font-black uppercase tracking-tight">
          Category
        </h4>
        <div className="space-y-4 p-5">
          {categories.map((cat) => (
            <div key={cat.id} className="flex items-center gap-2.5">
              <Checkbox
                id={`cat-${cat.id}`}
                checked={selectedCategories.includes(cat.id)}
                onCheckedChange={() => onCategoryToggle(cat.id)}
                className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <Label
                htmlFor={`cat-${cat.id}`}
                className="text-muted-foreground cursor-pointer text-sm font-bold"
              >
                {cat.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Service Providers Filter */}
      <div className="bg-card border-border rounded-xl border shadow-sm">
        <h4 className="border-border text-primary border-b px-5 py-3.5 text-sm font-black uppercase tracking-tight">
          Service Providers
        </h4>
        <div className="space-y-4 p-5">
          {providers.map((provider) => (
            <div key={provider.id} className="flex items-center gap-2.5">
              <Checkbox
                id={`prov-${provider.id}`}
                checked={selectedProviders.includes(provider.id)}
                onCheckedChange={() => onProviderToggle(provider.id)}
                className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <Label
                htmlFor={`prov-${provider.id}`}
                className="text-muted-foreground cursor-pointer text-sm leading-snug font-bold"
              >
                {provider.label}
              </Label>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
