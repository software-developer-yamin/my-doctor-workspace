"use client";

import {
  RECENTLY_VIEWED_KEYS,
  useRecentlyViewed,
} from "@/hooks/use-recently-viewed";
import { getImageUrl } from "@/lib/utils";
import { RecentDoctor, RecentHospital } from "@/types/recently-viewed.type";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselDots,
} from "@/components/ui/carousel";
import {
  Calendar03Icon,
  Cancel01Icon,
  PinLocation02Icon,
  StarIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";

// ─── Doctor mini card ────────────────────────────────────────────────────────

function DoctorMiniCard({ doctor }: { doctor: RecentDoctor }) {
  return (
    <Link
      href={`/doctors/${doctor.slug}`}
      className="bg-card border-border hover:border-primary/30 hover:shadow-md group flex h-full flex-col overflow-hidden rounded-2xl border shadow-sm transition-all duration-200"
    >
      <div className="flex gap-3 p-3">
        <div className="bg-muted h-14 w-14 shrink-0 overflow-hidden rounded-xl">
          {doctor.photo && !doctor.photo.includes("default") ? (
            <img
              src={getImageUrl(doctor.photo)}
              alt={doctor.name}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="bg-primary/5 flex h-full w-full items-center justify-center">
              <span className="text-primary/30 text-[9px] font-bold uppercase">
                No Photo
              </span>
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-foreground group-hover:text-primary line-clamp-2 text-xs leading-tight font-bold transition-colors">
            {doctor.name}
          </p>
          <p className="text-muted-foreground mt-0.5 line-clamp-1 text-micro font-medium">
            {doctor.primarySpecialty}
          </p>
          {doctor.degrees.length > 0 && (
            <p className="text-muted-foreground mt-0.5 line-clamp-1 text-[9px]">
              {doctor.degrees.slice(0, 2).join(", ")}
            </p>
          )}
        </div>
      </div>

      <div className="border-border bg-muted/40 mt-auto flex items-center justify-between border-t px-3 py-2">
        {doctor.fee ? (
          <span className="text-foreground text-xs font-semibold">
            ৳{doctor.fee}
          </span>
        ) : (
          <span className="text-muted-foreground text-micro">Fee varies</span>
        )}
        <div className="text-primary flex items-center gap-1 text-micro font-semibold">
          <HugeiconsIcon icon={Calendar03Icon} size={11} />
          Book
        </div>
      </div>
    </Link>
  );
}

// ─── Hospital mini card ──────────────────────────────────────────────────────

function HospitalMiniCard({ hospital }: { hospital: RecentHospital }) {
  return (
    <Link
      href={`/hospitals/${hospital.slug}`}
      className="bg-card border-border hover:border-primary/30 hover:shadow-md group flex h-full flex-col overflow-hidden rounded-2xl border shadow-sm transition-all duration-200"
    >
      <div className="flex gap-3 p-3">
        <div className="bg-muted h-14 w-14 shrink-0 overflow-hidden rounded-xl">
          {hospital.thumbnail ? (
            <img
              src={getImageUrl(hospital.thumbnail)}
              alt={hospital.name}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="bg-primary/5 flex h-full w-full items-center justify-center">
              <span className="text-primary/30 text-[9px] font-bold uppercase">
                No Logo
              </span>
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-foreground group-hover:text-primary line-clamp-2 text-xs leading-tight font-bold transition-colors">
            {hospital.name}
          </p>
          <div className="mt-0.5 flex items-center gap-1">
            <HugeiconsIcon
              icon={PinLocation02Icon}
              size={10}
              className="text-primary/60 shrink-0"
            />
            <p className="text-muted-foreground line-clamp-1 text-micro font-medium">
              {hospital.district}
            </p>
          </div>
          {hospital.specialtyStats && (
            <p className="text-muted-foreground mt-0.5 line-clamp-1 text-[9px]">
              {hospital.specialtyStats}
            </p>
          )}
        </div>
      </div>

      <div className="border-border bg-muted/40 mt-auto flex items-center justify-between border-t px-3 py-2">
        {hospital.rating > 0 ? (
          <div className="flex items-center gap-1">
            <HugeiconsIcon
              icon={StarIcon}
              size={11}
              className="fill-yellow-400 text-yellow-400"
            />
            <span className="text-foreground text-xs font-semibold">
              {hospital.rating}
            </span>
          </div>
        ) : (
          <span className="text-muted-foreground text-micro">New</span>
        )}
        <span className="text-primary text-micro font-semibold">
          View Details →
        </span>
      </div>
    </Link>
  );
}

// ─── Section ─────────────────────────────────────────────────────────────────

interface RecentlyViewedSectionProps {
  type: "doctors" | "hospitals";
}

export function RecentlyViewedSection({ type }: RecentlyViewedSectionProps) {
  const storageKey = RECENTLY_VIEWED_KEYS[type];
  const label = type === "doctors" ? "Doctors" : "Hospitals";

  const { items, clear } = useRecentlyViewed<RecentDoctor | RecentHospital>(storageKey);

  if (items.length === 0) return null;

  return (
    <div className="mb-8">
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h2 className="text-foreground text-base font-bold">
            Recently Viewed {label}
          </h2>
          <p className="text-muted-foreground text-xs font-medium">
            Pick up where you left off
          </p>
        </div>
        <button
          type="button"
          onClick={clear}
          aria-label={`Clear recently viewed ${label.toLowerCase()}`}
          className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-xs font-semibold transition-colors"
        >
          <HugeiconsIcon icon={Cancel01Icon} size={12} />
          Clear
        </button>
      </div>

      <Carousel opts={{ align: "start", loop: false }} className="w-full">
        <CarouselContent className="-ml-3">
          {type === "doctors"
            ? (items as RecentDoctor[]).map((d) => (
                <CarouselItem key={d.id} className="basis-[60%] pl-3 sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                  <DoctorMiniCard doctor={d} />
                </CarouselItem>
              ))
            : (items as RecentHospital[]).map((h) => (
                <CarouselItem key={h.id} className="basis-[60%] pl-3 sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                  <HospitalMiniCard hospital={h} />
                </CarouselItem>
              ))}
        </CarouselContent>
        <CarouselDots className="mt-4" />
      </Carousel>
    </div>
  );
}
