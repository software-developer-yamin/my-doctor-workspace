"use client";

import { useLiveQueueForDoctor, useLiveQueueForHospital } from "@/hooks/queries/use-queue";
import { TLiveQueue } from "@/types/queue.type";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Activity01Icon,
  Clock01Icon,
  Calendar01Icon,
  ArrowRight01Icon,
  Hospital01Icon,
  StethoscopeIcon,
  Call02Icon,
  Location01Icon,
} from "@hugeicons/core-free-icons";

import { getImageUrl } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type LiveSerialBannerProps = {
  type: "doctor" | "hospital";
  id: string;
};

export const LiveSerialBanner = ({ type, id }: LiveSerialBannerProps) => {
  const isDoctor = type === "doctor";

  const { data: doctorQueue, isLoading: docLoading } = useLiveQueueForDoctor(isDoctor ? id : "");
  const { data: hospitalQueues, isLoading: hospLoading } = useLiveQueueForHospital(!isDoctor ? id : "");

  const isLoading = isDoctor ? docLoading : hospLoading;

  if (isLoading) {
    return (
      <div className="w-full mb-6">
        <div className="h-6 w-36 bg-muted/40 rounded animate-pulse mb-4" />
        <div className="flex gap-4 overflow-x-auto pb-2">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="h-36 bg-muted/30 rounded-xl w-[85vw] sm:w-[380px] shrink-0 border border-border/50 animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  const queues: TLiveQueue[] = isDoctor ? (doctorQueue ?? []) : (hospitalQueues ?? []);
  const activeQueues = queues.filter((q) => q.isActive);

  if (activeQueues.length === 0) return null;

  return (
    <div className="w-full mb-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-foreground">
          {isDoctor ? "Active Hospitals" : "Active Doctors"}
        </h2>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-muted/40 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border">
        {activeQueues.map((queue) => {
          const avgMin = queue.avgWaitTimeInMin;
          const waitLabel =
            avgMin >= 60
              ? `~${Math.round(avgMin / 60)} hr`
              : `~${avgMin} min`;

          const linkHref = isDoctor
            ? `/hospitals/${queue.hospitalId}`
            : `/doctors/${queue.doctorId}`;

          const photoSrc = isDoctor
            ? getImageUrl(queue.hospitalLogo || "")
            : getImageUrl(queue.doctorPhoto || "");

          const displayName = isDoctor ? queue.hospitalName : queue.doctorName;
          const subtitleLine = isDoctor ? queue.hospitalAddress : queue.doctorShortDescription;
          const tertiaryLine = isDoctor ? queue.hospitalPhone : queue.doctorDegrees;

          return (
            <div
              key={queue.id}
              className="relative flex shrink-0 snap-start flex-col gap-3 rounded-xl border border-border bg-card p-4 w-[85vw] sm:w-[380px] lg:w-[calc((100%-2rem)/3)]"
            >
              {/* Live badge — absolute top-right */}
              <span className="absolute right-4 top-4 flex items-center gap-1.5 rounded-md border border-primary/30 bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary z-10">
                <span className="h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-primary" />
                Live
              </span>

              {/* Top row: photo + info (always row) */}
              <div className="flex items-start gap-3">
                {/* Photo */}
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full bg-primary/10 ring-2 ring-primary/20">
                  {photoSrc ? (
                    <Image
                      src={photoSrc}
                      alt={displayName ?? ""}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <HugeiconsIcon
                        icon={isDoctor ? Hospital01Icon : StethoscopeIcon}
                        size={26}
                        className="text-primary/40"
                      />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex min-w-0 flex-1 flex-col gap-0.5 pr-16 pt-0.5">
                  <Link href={linkHref}>
                    <h3 className="text-base font-bold leading-tight text-foreground transition-colors hover:text-primary line-clamp-2">
                      {displayName ?? "—"}
                    </h3>
                  </Link>
                  {subtitleLine && (
                    <div className="flex items-start gap-1 mt-0.5">
                      <HugeiconsIcon
                        icon={isDoctor ? Location01Icon : Activity01Icon}
                        size={12}
                        className="text-muted-foreground shrink-0 mt-0.5"
                      />
                      <span className="text-xs text-muted-foreground line-clamp-2 leading-snug">
                        {subtitleLine}
                      </span>
                    </div>
                  )}
                  {tertiaryLine && (
                    <div className="flex items-center gap-1 mt-0.5">
                      <HugeiconsIcon
                        icon={isDoctor ? Call02Icon : StethoscopeIcon}
                        size={11}
                        className="text-muted-foreground shrink-0"
                      />
                      <span className="text-xs text-muted-foreground truncate">
                        {tertiaryLine}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom row: serial + button */}
              <div className="flex items-center justify-between gap-3 pt-1 border-t border-border/50">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <HugeiconsIcon icon={Calendar01Icon} size={18} className="text-primary" />
                  </div>
                  <div className="flex flex-col gap-0">
                    <span className="text-sm font-bold text-foreground leading-tight">
                      Serial {queue.currentSerial}/{queue.totalSerial}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <HugeiconsIcon icon={Clock01Icon} size={10} className="shrink-0" />
                      <span>{waitLabel}/patient</span>
                    </div>
                  </div>
                </div>

                <Link href={linkHref}>
                  <Button
                    size="sm"
                    className="h-9 rounded-lg bg-primary font-medium text-white hover:bg-primary/90 gap-1.5 px-4"
                  >
                    {isDoctor ? "View" : "Book"}
                    <HugeiconsIcon icon={ArrowRight01Icon} size={13} />
                  </Button>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
