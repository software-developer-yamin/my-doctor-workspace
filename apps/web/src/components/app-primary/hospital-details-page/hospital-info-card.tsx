"use client";

import { useEffect } from "react";
import { getImageUrl } from "@/lib/utils";
import { Hospital } from "@/types/hospital.type";
import {
  saveRecentlyViewed,
  RECENTLY_VIEWED_KEYS,
} from "@/hooks/use-recently-viewed";
import {
  ArrowLeft02Icon,
  Call02Icon,
  HospitalIcon,
  Location01Icon,
  StarIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { VerifiedBadge } from "@/components/ui/verified-badge";
import Image from "next/image";
import Link from "next/link";

type THospitalInfoCardProps = {
  hospital: Hospital;
};

export const HospitalInfoCard = ({ hospital }: THospitalInfoCardProps) => {
  useEffect(() => {
    saveRecentlyViewed(RECENTLY_VIEWED_KEYS.hospitals, {
      id: hospital.id,
      slug: hospital.id,
      name: hospital.name,
      thumbnail: hospital.thumbnail,
      district: hospital.bdLocation?.district,
      specialtyStats: hospital.specialtyStats,
      rating: hospital.rating,
      feeRange: hospital.feeRange,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hospital.id]);

  return (
    <div className="border-border bg-card relative flex w-full flex-col overflow-hidden rounded-2xl border shadow-sm">
      {/* ── Cover ── */}
      <div className="relative h-[220px] w-full overflow-hidden md:h-[260px]">
        {/* Back to Hospitals breadcrumb — overlaid on cover */}
        <div className="absolute top-4 left-4 z-20">
          <Link
            href="/hospitals"
            className="text-primary inline-flex items-center gap-2 rounded-full bg-card px-4 py-2 text-sm font-bold shadow-sm transition-colors hover:bg-muted"
          >
            <HugeiconsIcon
              icon={ArrowLeft02Icon}
              size={16}
              className="text-primary"
            />
            Back to Hospitals
          </Link>
        </div>

        {hospital.coverPhoto ? (
          <Image
            src={getImageUrl(hospital.coverPhoto) ?? ""}
            alt={`${hospital.name} Cover`}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="from-primary/20 to-primary/5 absolute inset-0 flex items-center justify-center bg-gradient-to-br">
            <HugeiconsIcon
              icon={HospitalIcon}
              size={60}
              className="text-primary/15"
            />
          </div>
        )}
      </div>

      {/* ── Info Row ── */}
      <div className="border-border bg-card flex flex-row items-start gap-4 rounded-t-2xl border-t px-4 py-5 md:gap-6 md:px-6 md:py-6">
        {/* Logo */}
        <div className="relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-card shadow-sm md:h-20 md:w-20">
          <div className="relative h-full w-full">
            <Image
              src={getImageUrl(hospital.thumbnail) ?? ""}
              alt={hospital.name}
              fill
              className="object-contain p-1"
            />
          </div>
        </div>

        {/* Text */}
        <div className="flex flex-1 flex-col gap-1.5 pt-0.5">
          {/* Name + Verified badge */}
          <div className="flex flex-col gap-1 md:flex-row md:flex-wrap md:items-center md:gap-2">
            <h1 className="text-foreground text-xl leading-tight font-bold md:text-2xl">
              {hospital.name}
            </h1>
            {hospital.isVerified && (
              <VerifiedBadge
                label={`Verified ${hospital.type || "Hospital"}`}
                size="sm"
              />
            )}
          </div>

          {/* Address */}
          <div className="text-muted-foreground flex items-start gap-1.5">
            <HugeiconsIcon
              icon={Location01Icon}
              size={14}
              className="text-primary mt-0.5 shrink-0"
            />
            <span className="text-sm leading-snug">{hospital.address}</span>
          </div>

          {/* Phone */}
          {(hospital.contact?.emergency || hospital.contact?.phones?.[0]) && (
            <div className="text-muted-foreground flex items-center gap-1.5">
              <HugeiconsIcon
                icon={Call02Icon}
                size={14}
                className="text-primary shrink-0"
              />
              <span className="text-sm">
                {hospital.contact.emergency || hospital.contact.phones[0]}
              </span>
            </div>
          )}

          {/* Rating */}
          <div className="flex items-center gap-1.5">
            <HugeiconsIcon
              icon={StarIcon}
              size={14}
              className="text-amber-400"
            />
            <span className="text-foreground text-sm font-bold">
              {hospital.rating?.toFixed(1) || "0.0"}
            </span>
            {hospital.reviewCount > 0 && (
              <span className="text-muted-foreground text-sm">
                ({hospital.reviewCount})
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
