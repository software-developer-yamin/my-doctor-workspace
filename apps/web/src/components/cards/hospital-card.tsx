"use client";

import { Phantom } from "@/components/ui/phantom";
import { getImageUrl } from "@/lib/utils";
import { Hospital } from "@/types/hospital.type";
import {
  CheckmarkBadge01Icon,
  PinLocation02Icon,
  StethoscopeIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const HospitalCard = ({
  hospital,
  loading,
}: {
  hospital?: Hospital;
  loading?: boolean;
}) => {
  const h = hospital ?? ({} as Hospital);

  const icuBeds = h.stats?.icuBeds ?? 0;
  const doctorsCount = h.stats?.doctorsCount ?? 0;
  const totalBeds = h.stats?.totalBeds ?? 0;
  const href = `/hospitals/${h.id ?? "#"}`;
  const displaySpecialities = h.specialities ?? [];

  return (
    <Phantom loading={loading ?? false}>
      <div className="bg-card border-primary/20 flex h-full flex-col overflow-hidden rounded-md border shadow-xs transition-all duration-200 hover:shadow-md">
        {/* ── Body: image + info ── */}
        <div className="flex items-start gap-3 p-4 lg:gap-4 lg:p-5">
          {/* Logo — mobile */}
          <div className="h-24 w-24 shrink-0 overflow-hidden rounded-md bg-white shadow-sm lg:hidden">
            <img
              src={getImageUrl(h.thumbnail ?? "")}
              alt={h.name ?? ""}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>

          {/* Logo — desktop */}
          <div className="bg-primary/5 hidden h-32 w-32 shrink-0 overflow-hidden rounded-md lg:block">
            <img
              src={getImageUrl(h.thumbnail ?? "")}
              alt={h.name ?? ""}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>

          {/* Info */}
          <div className="min-w-0 flex-1">
            {/* Name */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href={href} className="group/name">
                  <h3 className="text-foreground group-hover/name:text-primary text-body line-clamp-2 leading-snug font-bold transition-colors lg:text-xl">
                    {h.name}
                  </h3>
                </Link>
              </TooltipTrigger>
              <TooltipContent>{h.name}</TooltipContent>
            </Tooltip>

            {/* Location + Verified */}
            <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
              <div className="flex items-center gap-1">
                <HugeiconsIcon
                  icon={PinLocation02Icon}
                  size={13}
                  className="text-muted-foreground shrink-0"
                />
                <span className="text-muted-foreground text-xs">
                  {h.bdLocation?.district}
                  {h.bdLocation?.district ? ", Bangladesh" : "Bangladesh"}
                </span>
              </div>
              {h.isVerified && (
                <span className="border-primary/20 bg-primary/10 text-2xs text-primary flex items-center gap-1 rounded-full border px-2 py-0.5 font-semibold">
                  <HugeiconsIcon
                    icon={CheckmarkBadge01Icon}
                    size={11}
                    className="text-primary"
                  />
                  Verified
                </span>
              )}
            </div>

            {/* Speciality chips */}
            {displaySpecialities.length > 0 && (
              <div className="mt-2 flex max-h-16 min-h-[1.5rem] flex-wrap gap-1.5 overflow-y-auto pr-0.5">
                {displaySpecialities.map((s) => (
                  <span
                    key={s._id}
                    className="border-primary/20 bg-primary/10 text-2xs text-primary flex items-center gap-1 rounded-md border px-2 py-1 font-medium"
                  >
                    <HugeiconsIcon
                      icon={StethoscopeIcon}
                      size={11}
                      className="hidden md:block"
                    />
                    {s.name}
                  </span>
                ))}
              </div>
            )}

            {/* Description — desktop only */}
            {h.description && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <p className="text-muted-foreground mt-2 hidden text-xs leading-relaxed lg:line-clamp-2">
                    {h.description}
                  </p>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  {h.description}
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        </div>

        {/* Description — mobile */}
        {h.description && (
          <div className="px-4 pb-2 lg:hidden">
            <Tooltip>
              <TooltipTrigger asChild>
                <p className="text-muted-foreground line-clamp-2 text-xs leading-relaxed">
                  {h.description}
                </p>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                {h.description}
              </TooltipContent>
            </Tooltip>
          </div>
        )}

        {/* ── Stats section ── */}
        <div className="divide-primary/20 border-primary/20 mx-3 mb-3 grid grid-cols-3 divide-x overflow-hidden rounded-md border">
          <div className="flex items-center justify-center px-2 py-3">
            <span className="text-primary text-body-sm text-center leading-tight font-bold lg:text-sm">
              {doctorsCount > 0 ? `${doctorsCount} Doctors` : "Doctors"}
            </span>
          </div>
          <div className="flex items-center justify-center px-2 py-3">
            <span className="text-primary text-body-sm text-center leading-tight font-bold lg:text-sm">
              {icuBeds > 0 ? "ICU Available" : "No ICU"}
            </span>
          </div>
          <div className="flex items-center justify-center px-2 py-3">
            <span className="text-primary text-body-sm text-center leading-tight font-bold lg:text-sm">
              {totalBeds > 0 ? `${totalBeds} Beds` : "—"}
            </span>
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="mt-auto px-4 pb-4">
          {/* Mobile: full-width View Details */}
          <div className="lg:hidden">
            <Link href={href} className="w-full">
              <button
                type="button"
                className="bg-primary hover:bg-primary/90 text-body-sm flex w-full items-center justify-center gap-2 rounded-md py-2.5 font-semibold text-white transition-colors"
              >
                View Details
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M7 17L17 7" />
                  <path d="M7 7h10v10" />
                </svg>
              </button>
            </Link>
          </div>

          {/* Desktop: service charges + View Details */}
          <div className="hidden items-center gap-2 lg:flex">
            <div className="border-primary/20 bg-primary/5 flex shrink-0 items-center gap-2 rounded-md border px-3 py-2">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-primary shrink-0"
                aria-hidden="true"
              >
                <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                <circle cx="7" cy="7" r="1.5" fill="currentColor" />
              </svg>
              <div className="flex flex-col gap-0.5">
                <span className="text-muted-foreground text-micro leading-none font-medium">
                  Service Charges
                </span>
                <span className="text-primary text-xs leading-none font-bold">
                  Price on Request
                </span>
              </div>
            </div>

            <Link href={href} className="flex-1">
              <button
                type="button"
                className="bg-primary hover:bg-primary/90 h-[42px] w-full rounded-md text-sm font-semibold text-white transition-colors"
              >
                View Details
              </button>
            </Link>
          </div>
        </div>
      </div>
    </Phantom>
  );
};
