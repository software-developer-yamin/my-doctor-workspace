"use client";

import { Input } from "@/components/ui/input";
import { Search01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

export const HospitalSearchBar = () => {
  return (
    <div className="relative my-5 w-full md:my-6">
      <div className="relative">
        <div className="text-muted-foreground pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
          <HugeiconsIcon icon={Search01Icon} className="h-5 w-5" />
        </div>
        <Input
          type="search"
          placeholder="I'm looking for..."
          className="bg-card border-border h-12 w-full rounded-md pr-4 pl-11 text-base shadow-sm"
        />
      </div>
    </div>
  );
};
