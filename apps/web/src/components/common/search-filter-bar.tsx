"use client";

import {
  FilterHorizontalIcon,
  PinLocation02Icon,
  Search01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

interface SearchFilterBarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  placeholder?: string;
  mobilePlaceholder?: string;
  cityLabel?: string;
  mobileCityLabel?: string;
  onLocationClick?: () => void;
  onFilterClick?: () => void;
  locationNode?: React.ReactNode;
  sortNode?: React.ReactNode;
  actionsNode?: React.ReactNode;
  className?: string;
  noBorder?: boolean;
}

export function SearchFilterBar({
  searchValue,
  onSearchChange,
  onSubmit,
  placeholder = "Search...",
  mobilePlaceholder,
  cityLabel,
  mobileCityLabel,
  onLocationClick,
  onFilterClick,
  locationNode,
  sortNode,
  actionsNode,
  className,
  noBorder = false,
}: SearchFilterBarProps) {
  return (
    <div
      className={`bg-background sticky top-14 lg:top-16 z-40 w-full ${noBorder ? "" : "md:border-border md:border-b"} ${className ?? ""}`}
    >
      <div className="container mx-auto px-4 py-3">
        <form onSubmit={onSubmit}>
          {/* Mobile: two-row layout */}
          <div className="flex flex-col gap-2 md:hidden">
            {/* Row 1: Search input */}
            <div className="bg-card border-border flex items-center gap-3 rounded-md border px-4 py-4">
              <HugeiconsIcon
                icon={Search01Icon}
                size={20}
                className="text-muted-foreground shrink-0"
              />
              <input
                type="text"
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={mobilePlaceholder ?? placeholder}
                className="text-foreground placeholder:text-muted-foreground placeholder:[text-overflow:ellipsis] min-w-0 flex-1 bg-transparent text-base outline-none"
              />
            </div>

            {/* Row 2: Location + Filters */}
            <div className="flex items-stretch justify-between gap-3">
              {locationNode ?? (
                <button
                  type="button"
                  onClick={onLocationClick}
                  className="bg-card border-border flex flex-1 items-center gap-2.5 rounded-md border px-4 py-3.5 text-left"
                >
                  <HugeiconsIcon
                    icon={PinLocation02Icon}
                    size={18}
                    className="text-primary shrink-0"
                  />
                  <span className="text-foreground line-clamp-1 text-sm font-medium">
                    {mobileCityLabel ?? cityLabel}
                  </span>
                </button>
              )}

              {onFilterClick && (
                <button
                  type="button"
                  onClick={onFilterClick}
                  className="bg-card border-border text-primary flex items-center gap-2.5 rounded-md border px-4 py-3.5 text-sm font-semibold"
                >
                  <HugeiconsIcon
                    icon={FilterHorizontalIcon}
                    size={18}
                    className="text-primary shrink-0"
                  />
                  <span>Filters</span>
                </button>
              )}
            </div>

            {/* Row 3: Actions (e.g. booking buttons) */}
            {actionsNode && (
              <div className="flex items-center justify-center">
                {actionsNode}
              </div>
            )}
          </div>

          {/* Desktop / Tablet: single row */}
          <div className="hidden items-center gap-3 md:flex">
            <div className="bg-card border-border flex flex-1 items-center gap-2.5 rounded-md border px-4 py-3">
              <HugeiconsIcon
                icon={Search01Icon}
                size={18}
                className="text-muted-foreground shrink-0"
              />
              <input
                type="text"
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={placeholder}
                className="text-foreground placeholder:text-muted-foreground placeholder:[text-overflow:ellipsis] min-w-0 flex-1 bg-transparent text-sm outline-none"
              />
            </div>

            {locationNode ?? (
              <button
                type="button"
                onClick={onLocationClick}
                className="bg-card border-border flex items-center gap-2 rounded-md border px-4 py-3 text-sm font-medium"
              >
                <HugeiconsIcon
                  icon={PinLocation02Icon}
                  size={15}
                  className="text-muted-foreground shrink-0"
                />
                <span className="text-foreground/80 line-clamp-1 whitespace-nowrap">
                  {cityLabel}
                </span>
              </button>
            )}

            {/* Tablet-only filter button — sidebar appears at lg, so only show here below lg */}
            {onFilterClick && (
              <button
                type="button"
                onClick={onFilterClick}
                className="bg-card border-border text-primary flex items-center gap-2 rounded-md border px-4 py-3 text-sm font-semibold lg:hidden"
              >
                <HugeiconsIcon icon={FilterHorizontalIcon} size={16} className="shrink-0" />
                Filters
              </button>
            )}
            {sortNode}
            {actionsNode}
          </div>
        </form>
      </div>
    </div>
  );
}
