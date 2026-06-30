"use client";

import { Button } from "@/components/ui/button";
import { Phantom } from "@/components/ui/phantom";
import { cn, getImageUrl } from "@/lib/utils";
import { Doctor } from "@/types/doctor.type";
import {
  Calendar03Icon,
  CameraVideoIcon,
  ClinicIcon,
  Clock01Icon,
  Hospital02Icon,
  Location01Icon,
  StarIcon,
  StethoscopeIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

type DoctorCardProps = {
  doctor?: Doctor;
  className?: string;
  loading?: boolean;
};

export const DoctorCard = ({ doctor, className, loading = false }: DoctorCardProps) => {
  const d = doctor ?? ({} as Doctor);

  const displayRating =
    (d.rating ?? 0) > 0 && (d.reviewCount ?? 0) > 0 ? (d.rating ?? 0).toFixed(1) : null;
  const displayReviews = (d.reviewCount ?? 0) > 0 ? d.reviewCount : null;

  const academicTitle = d.shortDescription || "Specialist";

  const primaryChamber = d.chambers?.[0];
  const hasVideo = d.isAvailableHome || d.chambers?.some((c) => c.consultationMethod?.includes("VIRTUAL"));
  const hasChamber = d.chambers?.some((c) => c.consultationMethod?.includes("ON_PREMISES")) ?? true;

  const locationText =
    d.chamber?.address ||
    primaryChamber?.address ||
    "Narsingdi, Bangladesh";

  const rawExperience = d.experience
    ? d.experience.replace(/\s*years?\s*/i, "").trim()
    : null;
  const experienceYears = rawExperience && rawExperience !== "0" ? rawExperience : null;

  const displayChambers = d.chambers?.slice(0, 2) || [];

  return (
    <Phantom loading={loading}>
      <div
        className={cn(
          "bg-card flex h-full flex-col overflow-hidden rounded-md border border-primary/20 shadow-xs transition-all duration-200 hover:shadow-md",
          className,
        )}
      >
        {/* ── Card Body ── */}
        <div className="flex items-start gap-3 p-4 lg:gap-4 lg:p-5">
          {/* Mobile avatar — square rounded-md */}
          <div className="shrink-0 lg:hidden">
            <div className="h-24 w-24 overflow-hidden rounded-md bg-white shadow-xs">
              {d.photo && !d.photo.includes("default") ? (
                <img
                  src={getImageUrl(d.photo)}
                  alt={d.name}
                  className="h-full w-full object-cover object-top"
                  loading="lazy"
                />
              ) : (
                <div className="bg-primary/5 flex h-full w-full items-center justify-center">
                  <span className="text-primary/40 text-2xs font-bold uppercase tracking-wide">
                    Dr
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Desktop avatar — circular + experience badge below */}
          <div className="hidden shrink-0 flex-col items-start gap-2 lg:flex">
            <div className="h-32 w-32 overflow-hidden rounded-full bg-primary/10">
              {d.photo && !d.photo.includes("default") ? (
                <img
                  src={getImageUrl(d.photo)}
                  alt={d.name}
                  className="h-full w-full object-cover object-top"
                  loading="lazy"
                />
              ) : (
                <div className="bg-primary/10 flex h-full w-full items-center justify-center">
                  <span className="text-primary/40 text-body-sm font-bold uppercase tracking-wide">
                    Dr
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Info column */}
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                {/* Academic title — desktop only */}
                <p className="text-muted-foreground mb-0.5 hidden text-xs font-medium lg:block">
                  {academicTitle}
                </p>

                {/* Name */}
                <Link href={`/doctors/${d.slug ?? d.id ?? "#"}`} className="group/name">
                  <h3 className="text-foreground group-hover/name:text-primary text-body font-bold leading-snug transition-colors lg:text-xl">
                    {d.name}
                  </h3>
                </Link>

                {/* Specializations */}
                <div className="mt-1 flex h-16 flex-wrap content-start gap-1 overflow-y-auto pr-0.5 scrollbar-thin">
                  {(d.specializations && d.specializations.length > 0
                    ? d.specializations.map((s) =>
                        typeof s === "string" ? s : (s as { name?: string }).name ?? ""
                      ).filter(Boolean)
                    : d.primarySpecialty
                      ? [d.primarySpecialty]
                      : []
                  ).map((name, i) => (
                    <span
                      key={i}
                      className="flex items-center gap-1 rounded-md border border-primary/20 bg-primary/10 px-2 py-1 text-2xs font-medium text-primary"
                    >
                      <HugeiconsIcon
                        icon={StethoscopeIcon}
                        size={11}
                        className="hidden md:block"
                      />
                      {name}
                    </span>
                  ))}
                </div>
              </div>

            </div>

            {/* Location + Rating — desktop only */}
            <div className="mt-2 hidden items-center gap-3 lg:flex">
              <div className="flex items-center gap-1">
                <HugeiconsIcon
                  icon={Location01Icon}
                  size={14}
                  className="text-muted-foreground shrink-0"
                />
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="text-muted-foreground line-clamp-1 text-body-sm">
                      {locationText}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>{locationText}</TooltipContent>
                </Tooltip>
              </div>
              {displayRating && (
                <div className="flex items-center gap-1">
                  <HugeiconsIcon
                    icon={StarIcon}
                    size={14}
                    className="fill-amber-400 text-amber-400"
                  />
                  <span className="text-body-sm font-bold text-amber-500">
                    {displayRating}
                  </span>
                  {displayReviews && (
                    <span className="text-xs text-amber-500">
                      ({displayReviews})
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Consultation chips — desktop only, shown based on actual methods */}
          </div>
        </div>


        {/* ── Footer ── */}
        <div className="mt-auto px-4 py-3">
          {/* Mobile: stacked buttons */}
          <div className="flex flex-col gap-2 lg:hidden">
            <Link href={`/doctors/${d.slug ?? d.id ?? "#"}#book`} className="w-full">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground h-11 w-full rounded-md text-body-sm font-semibold">
                <HugeiconsIcon icon={Calendar03Icon} size={15} className="mr-1.5" />
                Book Appointment
              </Button>
            </Link>
            <Link href={`/doctors/${d.slug ?? d.id ?? "#"}`} className="w-full">
              <Button
                variant="outline"
                className="h-11 w-full rounded-md border-primary/30 text-body-sm font-semibold text-primary hover:bg-primary/5"
              >
                View Profile ↗
              </Button>
            </Link>
          </div>

          {/* Desktop: side-by-side */}
          <div className="hidden items-center gap-2 lg:flex">
            <Link href={`/doctors/${d.slug ?? d.id ?? "#"}`} className="flex-1">
              <Button
                variant="outline"
                className="h-12 w-full rounded-md border-primary text-sm font-semibold text-primary hover:bg-primary/5"
              >
                View Profile
              </Button>
            </Link>
            <Link href={`/doctors/${d.slug ?? d.id ?? "#"}#book`} className="flex-1">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground h-12 w-full rounded-md text-sm font-semibold">
                Book Appointment
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Phantom>
  );
};
