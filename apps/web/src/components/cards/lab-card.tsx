"use client";

import { Button } from "@/components/ui/button";
import { Phantom } from "@/components/ui/phantom";
import { getImageUrl } from "@/lib/utils";
import { Lab } from "@/types/diagnostic.type";
import {
  Call02Icon,
  PinLocation02Icon,
  StarIcon,
  ViewIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";

export const LabCard = ({ lab, loading }: { lab?: Lab; loading?: boolean }) => {
  const l = lab ?? ({} as Lab);

  return (
    <Phantom loading={loading ?? false}>
      <div className="bg-card border-border flex h-full flex-col overflow-hidden rounded-[1.5em] border shadow-sm transition-all duration-300 hover:shadow-[0_0.5em_1.5em_rgba(0,0,0,0.1)]">
        <div className="flex gap-[1.5em] p-[1.25em] pb-[1em]">
          {/* Left Column: Logo */}
          <div className="flex flex-col items-center gap-[0.5em]">
            <div className="relative shrink-0">
              <div className="bg-muted ring-muted/10 flex h-[5.5em] w-[5.5em] items-center justify-center overflow-hidden rounded-[1em] ring-[0.25em] sm:h-[6.25em] sm:w-[6.25em]">
                {l.logo ? (
                  <img
                    src={getImageUrl(l.logo)}
                    alt={l.name ?? ""}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="bg-primary/5 text-primary/40 flex h-full w-full items-center justify-center p-[0.5em] text-center text-[0.625em] leading-tight font-semibold tracking-widest">
                    No logo
                  </div>
                )}
              </div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-[0.25em]">
                <HugeiconsIcon
                  icon={StarIcon}
                  size={10}
                  className="fill-yellow-400 text-yellow-400"
                />
                <span className="text-foreground text-[0.625em] font-semibold">
                  {(l.rating ?? 0) > 0 ? (l.rating ?? 0).toFixed(1) : "New"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex min-w-0 flex-1 flex-col pt-[0.5em]">
            <Link href={`/diagnostic-labs/${l.id ?? "#"}`} className="group">
              <h3 className="text-foreground group-hover:text-primary line-clamp-1 text-[1.125em] leading-normal font-bold transition-colors pb-[0.25em]">
                {l.name}
              </h3>
            </Link>
            <p className="text-muted-foreground mt-[0.25em] line-clamp-1 text-[0.75em] font-medium">
              {l.bdLocation?.district}
            </p>

            <div className="mt-[0.625em] flex items-center gap-[0.5em]">
              <span className="bg-primary/10 text-primary rounded-full px-[0.75em] py-[0.25em] text-[0.625em] font-semibold">
                {l.type || "Diagnostic Lab"}
              </span>
            </div>

            <div className="mt-[1em] flex flex-col gap-[0.5em]">
              <div className="flex min-w-0 items-center gap-[0.375em]">
                <HugeiconsIcon
                  icon={PinLocation02Icon}
                  size={14}
                  className="text-primary/70 shrink-0"
                />
                <span className="text-muted-foreground line-clamp-1 text-[0.6875em] leading-none font-medium">
                  {l.address}
                </span>
              </div>
              <div className="flex items-center gap-[0.375em]">
                <HugeiconsIcon
                  icon={Call02Icon}
                  size={14}
                  className="text-primary/70 shrink-0"
                />
                <span className="text-muted-foreground text-[0.6875em] leading-none font-medium">
                  {l.hotline || "Contact for info"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Footer: Tests Count & Action ── */}
        <div className="border-border bg-muted/30 mt-auto flex items-center justify-between border-t p-[1em] px-[1.25em]">
          <div className="flex flex-col">
            <span className="text-muted-foreground text-[0.625em] font-medium">
              Available tests
            </span>
            <span className="text-foreground text-[0.875em] font-semibold">
              {(l.testsCount ?? 0) > 0 ? `${l.testsCount} tests` : l.type || "Diagnostic Lab"}
            </span>
          </div>

          <Link href={`/diagnostic-labs/${l.id ?? "#"}`} className="shrink-0">
            <Button
              variant="outline"
              className="border-primary text-primary hover:bg-primary flex h-[2.75em] cursor-pointer items-center gap-[0.5em] rounded-[0.75em] px-[1.25em] text-[0.75em] font-bold transition-all hover:text-white"
            >
              <HugeiconsIcon icon={ViewIcon} size={16} />
              View Details
            </Button>
          </Link>
        </div>
      </div>
    </Phantom>
  );
};
