"use client";

import { ApiMeta } from "@/types/api.type";
import { parse, format } from "date-fns";

function formatTime(time: string): string {
  try {
    return format(parse(time, "HH:mm", new Date()), "h:mm a");
  } catch {
    return time;
  }
}
import { Button } from "@/components/ui/button";
import { getImageUrl } from "@/lib/utils";
import {
  StethoscopeIcon,
  StarIcon,
  Briefcase01Icon,
  Calendar03Icon,
  CheckmarkBadge01Icon,
  MessageMultiple01Icon,
  Tv01Icon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Image from "next/image";
import Link from "next/link";

type TDoctorListTabProps = {
  doctors: {
    id: string;
    slug?: string;
    name: string;
    specialty: string;
    image: string;
    degrees: string[];
    bmdc?: string;
    experience?: string;
    fee?: number;
    consultationFee?: number;
    followUpFee?: number;
    schedules: Array<{
      day: string;
      startTime: string;
      endTime: string;
      isAvailable: boolean;
    }>;
    rating?: number;
    reviewCount?: number;
    shortDescription?: string;
    languages?: string[];
    isMostBooked?: boolean;
    specialtyTags?: string[];
    slotsLeft?: number;
    consultationTypes?: string[];
    nextAvailableSchedule?: {
      day: string;
      startTime: string;
      endTime: string;
      isAvailable: boolean;
    } | null;
  }[];
  hospitalName: string;
  meta?: ApiMeta;
  currentPage?: number;
  onPageChange?: (page: number) => void;
};

export function DoctorListTab({ doctors, hospitalName, meta, currentPage = 1, onPageChange }: TDoctorListTabProps) {
  if (!doctors || doctors.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <div className="bg-primary/5 mb-4 flex h-16 w-16 items-center justify-center rounded-full">
          <HugeiconsIcon
            icon={StethoscopeIcon}
            size={28}
            className="text-primary/40"
          />
        </div>
        <h3 className="text-foreground mb-2 text-lg font-semibold">
          No Doctors Found
        </h3>
        <p className="text-muted-foreground max-w-sm text-sm font-medium">
          There are currently no doctors listed for {hospitalName}.
        </p>
      </div>
    );
  }

  const totalPages = meta?.totalPages ?? 1;

  const buildPages = (): (number | "...")[] => {
    if (totalPages <= 5)
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages: (number | "...")[] = [1, 2, 3];
    if (totalPages > 4) pages.push("...");
    pages.push(totalPages);
    return pages;
  };

  return (
    <div className="flex flex-col gap-4" id="all-doctors">
      <h2 className="text-foreground text-sm font-bold">
        All Doctors ({meta?.total ?? doctors.length})
      </h2>

      <div className="flex flex-col gap-3">
        {doctors.map((doc) => {
          const slug = doc.id;
          const fee = doc.consultationFee ?? doc.fee ?? 0;
          const rating = doc.rating ?? null;
          const reviewCount = doc.reviewCount ?? null;
          const slotsLeft = doc.slotsLeft ?? null;
          const languages = doc.languages ?? [];
          const specialtyTags =
            doc.specialtyTags ?? [doc.specialty].filter(Boolean);
          const nextSchedule = doc.nextAvailableSchedule ?? undefined;
          const experienceLabel = doc.experience
            ? doc.experience.replace(/\s*years?\s*/i, "").trim()
            : null;

          return (
            <div
              key={doc.id}
              className="border-border bg-card flex flex-col rounded-xl border p-4 shadow-sm lg:flex-row lg:items-stretch lg:gap-4"
            >
              {/* Image + Info (side-by-side on all sizes) */}
              <div className="flex flex-row gap-3 lg:min-w-0 lg:flex-1 lg:gap-4">
                {/* Avatar */}
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-gray-200 lg:h-full lg:w-auto lg:aspect-square">
                  {doc.image && !doc.image.includes("default") ? (
                    <Image
                      src={getImageUrl(doc.image) ?? ""}
                      alt={doc.name}
                      fill
                      className="object-cover"
                    />
                  ) : null}
                </div>

                {/* Info column */}
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  {/* Name + Most Booked badge */}
                  <div className="flex flex-wrap items-center gap-2">
                    <Link href={`/doctors/${slug}`}>
                      <h3 className="text-foreground hover:text-primary text-sm leading-snug font-bold transition-colors">
                        {doc.name}
                      </h3>
                    </Link>
                    {doc.isMostBooked && (
                      <span className="bg-destructive/10 text-destructive rounded-full px-3 py-1 text-xs font-bold whitespace-nowrap">
                        Most Booked
                      </span>
                    )}
                  </div>

                  {/* Degrees */}
                  {doc.degrees && doc.degrees.length > 0 && (
                    <p className="text-muted-foreground line-clamp-1 text-2xs">
                      {doc.degrees.join(", ")}
                    </p>
                  )}

                  {/* Specialty */}
                  <p className="text-foreground text-xs font-bold">
                    {doc.specialty}
                  </p>

                  {/* Hospital / short description */}
                  {doc.shortDescription && (
                    <p className="text-muted-foreground line-clamp-1 text-2xs">
                      {doc.shortDescription}
                    </p>
                  )}

                  {/* Stats row */}
                  <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                    {experienceLabel && (
                      <div className="flex items-start gap-1">
                        <HugeiconsIcon
                          icon={Briefcase01Icon}
                          size={12}
                          className="text-muted-foreground mt-0.5 shrink-0"
                        />
                        <div className="flex flex-col leading-none">
                          <span className="text-foreground text-2xs font-semibold">
                            {experienceLabel} Years
                          </span>
                          <span className="text-muted-foreground text-micro">
                            Experience
                          </span>
                        </div>
                      </div>
                    )}
                    {doc.bmdc && (
                      <div className="flex items-center gap-1">
                        <HugeiconsIcon
                          icon={CheckmarkBadge01Icon}
                          size={12}
                          className="text-muted-foreground shrink-0"
                        />
                        <span className="text-foreground text-2xs font-semibold">
                          BMDC {doc.bmdc}
                        </span>
                      </div>
                    )}
                    {rating !== null && (
                      <div className="flex items-center gap-1">
                        <HugeiconsIcon
                          icon={StarIcon}
                          size={12}
                          className="shrink-0 fill-amber-400 text-amber-400"
                        />
                        <span className="text-foreground text-2xs font-bold">
                          {rating}
                        </span>
                        {reviewCount !== null && (
                          <span className="text-muted-foreground text-2xs">
                            ({reviewCount} Reviews)
                          </span>
                        )}
                      </div>
                    )}
                    {languages.length > 0 && (
                      <div className="flex items-center gap-1">
                        <HugeiconsIcon
                          icon={MessageMultiple01Icon}
                          size={12}
                          className="text-muted-foreground shrink-0"
                        />
                        <span className="text-muted-foreground text-2xs">
                          {languages.join(", ")}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Specialty chips */}
                  {specialtyTags.length > 0 && (
                    <div className="mt-1 flex flex-wrap gap-1.5">
                      {specialtyTags.map((tag) => (
                        <span
                          key={tag}
                          className="text-muted-foreground rounded-full border border-gray-200 bg-gray-100 px-3 py-1 text-xs font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Availability + Fee panel */}
              {/* Mobile: flex-row (left=availability, right=fee+button), border-t */}
              {/* Desktop lg: flex-col, w-52, border-l */}
              <div className="border-border mt-3 flex shrink-0 flex-row items-start justify-between gap-3 border-t pt-3 lg:mt-0 lg:w-52 lg:flex-col lg:items-start lg:justify-start lg:border-t-0 lg:border-l lg:pt-0 lg:pl-4">
                {/* Availability (left col on mobile, top on desktop) */}
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-1">
                    <HugeiconsIcon
                      icon={Calendar03Icon}
                      size={11}
                      className="text-muted-foreground shrink-0"
                    />
                    <span className="text-muted-foreground text-2xs">
                      Next Available
                    </span>
                  </div>
                  {nextSchedule && (
                    <>
                      <span className="text-primary text-sm leading-snug font-bold">
                        {nextSchedule.day}, {formatTime(nextSchedule.startTime)} –{" "}
                        {formatTime(nextSchedule.endTime)}
                      </span>
                      {slotsLeft !== null && (
                        <span className="text-muted-foreground text-2xs">
                          {slotsLeft} Slots Left
                        </span>
                      )}
                    </>
                  )}
                  {/* Consultation types — mobile only */}
                  {doc.consultationTypes && doc.consultationTypes.length > 0 && (
                    <div className="mt-0.5 flex items-center gap-1 lg:hidden">
                      <HugeiconsIcon
                        icon={Tv01Icon}
                        size={11}
                        className="text-muted-foreground shrink-0"
                      />
                      <span className="text-muted-foreground text-2xs">
                        {doc.consultationTypes.join(" & ")}
                      </span>
                    </div>
                  )}
                </div>

                {/* Fee + Button (right col on mobile, bottom on desktop) */}
                <div className="flex flex-col items-end gap-1.5 lg:mt-2 lg:w-full lg:items-start">
                  <div>
                    <span className="text-muted-foreground block text-micro">
                      Consultation Fee
                    </span>
                    <span className="text-foreground text-2xl leading-tight font-bold">
                      ৳ {fee}
                    </span>
                  </div>
                  <Link href={`/doctors/${slug}`} className="lg:w-full">
                    <Button
                      size="sm"
                      className="bg-primary hover:bg-primary/90 h-11 rounded-md text-sm font-semibold text-white lg:w-full"
                    >
                      Book Appointment
                    </Button>
                  </Link>
                  {/* Consultation types — desktop only */}
                  {doc.consultationTypes && doc.consultationTypes.length > 0 && (
                    <div className="hidden items-center gap-1 lg:flex">
                      <HugeiconsIcon
                        icon={Tv01Icon}
                        size={11}
                        className="text-muted-foreground shrink-0"
                      />
                      <span className="text-muted-foreground text-2xs">
                        {doc.consultationTypes.join(" & ")}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2">
          <button
            onClick={() => onPageChange?.(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="border-border bg-card text-muted-foreground hover:border-primary/30 hover:text-primary flex h-8 w-8 items-center justify-center rounded-lg border transition-colors disabled:cursor-not-allowed disabled:opacity-40"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} size={14} />
          </button>
          {buildPages().map((p, idx) => {
            if (p === "...") {
              return (
                <span
                  key={`e-${idx}`}
                  className="text-muted-foreground px-1 text-sm"
                >
                  ...
                </span>
              );
            }
            return (
              <button
                key={p}
                onClick={() => onPageChange?.(p as number)}
                className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold transition-colors ${
                  p === currentPage
                    ? "bg-primary text-white shadow"
                    : "border-border bg-card text-muted-foreground hover:border-primary/30 hover:text-primary border"
                }`}
              >
                {p}
              </button>
            );
          })}
          <button
            onClick={() => onPageChange?.(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="border-border bg-card text-muted-foreground hover:border-primary/30 hover:text-primary flex h-8 w-8 items-center justify-center rounded-lg border transition-colors disabled:cursor-not-allowed disabled:opacity-40"
          >
            <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
