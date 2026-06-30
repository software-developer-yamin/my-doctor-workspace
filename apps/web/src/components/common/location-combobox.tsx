"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  ArrowDown01Icon,
  Cancel01Icon,
  PinLocation02Icon,
  Search01Icon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function LocationCombobox({
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
        {/* Header */}
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

        {/* List */}
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
