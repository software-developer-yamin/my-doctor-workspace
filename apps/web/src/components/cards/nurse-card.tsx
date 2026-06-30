"use client";

import { Button } from "@/components/ui/button";
import { Phantom } from "@/components/ui/phantom";
import { TNurse } from "@/data/nurses.data";
import {
  Clock01Icon,
  StarIcon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";

type NurseCardProps = {
  nurse?: TNurse;
  loading?: boolean;
};

export function NurseCard({ nurse, loading = false }: NurseCardProps) {
  const n = nurse ?? ({} as TNurse);
  const isAvailableHome = n.isAvailableForHome;

  return (
    <Phantom loading={loading}>
      <div className="bg-card border-border flex h-full flex-col overflow-hidden rounded-[1.5em] border shadow-sm transition-all duration-300 hover:shadow-lg">
        <div className="flex gap-[1em] p-[1.25em] pb-[1em]">
          {/* Left Column: Image + Experience */}
          <div className="flex flex-col items-center gap-[0.5em]">
            <div className="relative shrink-0">
              <div className="bg-muted ring-muted/10 h-[6.25em] w-[6.25em] overflow-hidden rounded-[1em] ring-[0.25em]">
                {n.image && !n.image.includes("default") ? (
                  <img
                    src={n.image}
                    alt={n.name ?? ""}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="bg-primary/5 flex h-full w-full items-center justify-center p-[0.5em] text-center">
                    <span className="text-primary/40 text-[0.625em] font-bold tracking-[0.1em] uppercase">
                      No Photo
                    </span>
                  </div>
                )}
              </div>
              {/* Status Dot */}
              <div className="absolute -top-[0.25em] -right-[0.25em] h-[1em] w-[1em] rounded-full border-[0.125em] border-white shadow-sm bg-primary" />
            </div>
            <div className="text-center">
              <p className="text-foreground text-[0.75em] leading-tight font-bold">
                {n.experienceYears || "0+"} Years
              </p>
              <p className="text-muted-foreground text-[0.625em] font-medium">
                Experience
              </p>
            </div>
          </div>

          {/* Right Column: Info */}
          <div className="flex min-w-0 flex-1 flex-col pt-[0.25em]">
            <Link href={n.slug ? `/nurses/${n.slug}` : "#"} className="group">
              <h3 className="text-foreground group-hover:text-primary line-clamp-1 text-[1.125em] leading-tight font-bold transition-colors">
                {n.name}
              </h3>
            </Link>
            <p className="text-muted-foreground mt-[0.25em] line-clamp-1 text-[0.75em] font-bold">
              {(n.certifications ?? []).slice(0, 2).join(", ")}
            </p>

            <div className="mt-[0.625em] flex">
              <span
                className="bg-muted text-foreground px-[0.75em] py-[0.25em] text-[0.625em] font-medium"
                style={{ borderRadius: "0.25em 1em 0.25em 1em" }}
              >
                {n.specialty}
              </span>
            </div>

            <div className="mt-[0.75em] flex flex-wrap items-center gap-x-[0.75em] gap-y-[0.25em]">
              <div className="flex items-center gap-[0.25em]">
                <HugeiconsIcon
                  icon={StarIcon}
                  size={14}
                  className="fill-yellow-400 text-yellow-400"
                />
                <span className="text-foreground text-[0.75em] font-black">
                  5.0
                </span>
                <span className="text-muted-foreground text-[0.625em] font-bold">
                  (24)
                </span>
              </div>
              <div className="flex items-center gap-[0.375em]">
                <HugeiconsIcon
                  icon={UserGroupIcon}
                  size={14}
                  className="text-primary"
                />
                <span className="text-muted-foreground text-[0.625em] font-medium">
                  100+ visits
                </span>
              </div>
            </div>

            <div className="mt-[0.75em]">
              <p className="text-muted-foreground text-[0.625em] font-medium">
                Location
              </p>
              <p className="text-foreground line-clamp-1 text-[0.6875em] leading-tight font-bold">
                {n.location?.name}
              </p>
            </div>
          </div>
        </div>

        {/* ── Footer: Availability & Action ── */}
        <div className="border-border bg-muted/50 mt-auto flex items-center justify-between border-t p-[1em] px-[1.25em]">
          <div className="flex flex-col">
            <span className="text-muted-foreground text-[0.625em] font-medium">
              Next Available
            </span>
            <span className="text-foreground text-[0.875em] font-medium">
              {(n.availability ?? [])[0]}
            </span>
          </div>

          <Link href={n.slug ? `/nurses/${n.slug}` : "#"} className="shrink-0">
            <Button
              variant="outline"
              className="border-primary text-primary hover:bg-primary flex h-[2.75em] items-center gap-[0.5em] rounded-[0.75em] px-[1.25em] text-[0.75em] font-medium transition-all hover:text-white"
            >
              <HugeiconsIcon icon={Clock01Icon} size={16} />
              Schedule
            </Button>
          </Link>
        </div>
      </div>
    </Phantom>
  );
}
