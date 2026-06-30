"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface FilterOption {
  id: string;
  label: string;
}

interface DomiciliaryFiltersProps {
  categories: FilterOption[];
  selectedCategories: string[];
  onCategoryToggle: (id: string) => void;
}

export function DomiciliaryFilters({
  categories,
  selectedCategories,
  onCategoryToggle,
}: DomiciliaryFiltersProps) {
  return (
    <aside className="w-full shrink-0 space-y-4 sm:w-1/4">
      {/* Category Filter */}
      <div className="bg-card border-border rounded-xl border shadow-sm">
        <h4 className="border-border text-primary border-b px-5 py-3.5 text-sm font-black uppercase tracking-tight">
          Service Type
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

      {/* Trust Badge */}
      <div className="bg-primary/5 border-primary/10 rounded-xl border p-5">
        <h5 className="text-primary mb-2 text-sm font-black">Trusted Home Care</h5>
        <p className="text-muted-foreground text-micro leading-relaxed font-bold">
          All our caregivers and nurses are verified and professionally trained to provide the best care at your home.
        </p>
      </div>
    </aside>
  );
}
