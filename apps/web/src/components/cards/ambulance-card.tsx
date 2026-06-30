"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Phantom } from "@/components/ui/phantom";
import { API } from "@/config/api";
import { cn } from "@/lib/utils";
import { Ambulance } from "@/types/ambulance.type";
import {
  Calendar01Icon,
  Call02Icon,
  Clock01Icon,
  Route01Icon,
  SecurityCheckIcon,
  StarIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import { AmbulanceRequestForm } from "../app-primary/ambulance-page/ambulance-request-form";


type AmbulanceCardProps = {
  ambulance?: Ambulance;
  className?: string;
  loading?: boolean;
};

export const AmbulanceCard = ({ ambulance, className, loading = false }: AmbulanceCardProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const a = ambulance ?? ({} as Ambulance);
  const isAvailable = a.status === "Active";
  const image = a.image
    ? (a.image.startsWith("http") || a.image.startsWith("//"))
      ? a.image
      : `${API.ASSETS_URL}${a.image}`
    : "/images/default-ambulance.png";

  return (
    <Phantom loading={loading}>
      <div
        className={cn(
          "bg-card border-primary/30 flex overflow-hidden rounded-md border shadow-sm",
          className,
        )}
      >
        {/* Left: image panel */}
        <div className="relative w-[32%] shrink-0 py-2 pr-0 pl-2 sm:w-[40%] sm:py-3 sm:pr-0 sm:pl-3">
          <div className="bg-surface border-border/40 relative flex h-full min-h-[140px] items-center justify-center overflow-hidden rounded-md border sm:min-h-[220px]">
            <div className="bg-surface absolute inset-0 m-auto aspect-square w-[70%] rounded-md" />
            <img
              src={image}
              alt={a.name ?? ""}
              className="bg-surface relative z-10 h-full w-full object-contain"
              loading="lazy"
            />
          </div>
          {/* Available badge */}
          <span
            className={cn(
              "absolute top-2.5 left-2.5 z-20 flex items-center gap-1 rounded-md border px-2 py-0.5 text-micro font-semibold sm:top-5 sm:left-5 sm:gap-1.5 sm:px-3 sm:py-1 sm:text-2xs",
              isAvailable
                ? "border-primary/30 bg-primary-light text-primary"
                : "border-red-200 bg-red-50 text-red-600",
            )}
          >
            <span
              className={cn(
                "inline-block h-1.5 w-1.5 rounded-md",
                isAvailable ? "bg-primary" : "bg-red-500",
              )}
            />
            {isAvailable ? "Available" : "Unavailable"}
          </span>
        </div>

        {/* Right: info + buttons */}
        <div className="flex min-w-0 flex-1 flex-col py-2.5 pr-2.5 pl-1.5 sm:py-4 sm:pr-4 sm:pl-2">
          {/* Name + Rating */}
          <div className="flex items-start justify-between gap-1">
            <h3 className="text-foreground line-clamp-2 flex-1 text-sm leading-tight font-bold sm:text-2xl">
              {a.name}
            </h3>
            <div className="border-primary/60 hidden shrink-0 items-center gap-1 rounded-md border px-3 py-1.5 sm:flex">
              <HugeiconsIcon icon={StarIcon} size={14} className="text-primary" />
              <span className="text-primary text-sm font-bold">{(a.rating ?? 0) > 0 ? (a.rating ?? 0).toFixed(1) : "—"}</span>
            </div>
          </div>

          {/* Reg */}
          <p className="text-primary/70 mt-0.5 text-micro sm:text-xs">
            Reg: {a.ambulanceNumber}
          </p>

          {/* Type badge */}
          <span className="bg-primary-light text-primary mt-1 inline-flex w-fit items-center rounded-md px-2 py-0.5 text-micro font-semibold sm:px-2.5 sm:py-1 sm:text-xs">
            {a.ambulanceType}
          </span>

          {/* Stats row */}
          <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 sm:mt-2 sm:flex-nowrap sm:gap-3">
            <div className="flex min-w-0 items-center gap-1.5 sm:gap-2">
              <div className="border-primary/60 bg-primary-light flex h-6 w-6 shrink-0 items-center justify-center rounded-md border sm:h-8 sm:w-8">
                <HugeiconsIcon
                  icon={Route01Icon}
                  size={14}
                  className="text-primary sm:hidden"
                />
                <HugeiconsIcon
                  icon={Route01Icon}
                  size={16}
                  className="text-primary hidden sm:block"
                />
              </div>
              <div className="flex min-w-0 flex-col">
                <span className="text-foreground text-micro leading-tight font-bold sm:text-base">
                  {a.responseTime || "—"}
                </span>
                <span className="text-muted-foreground hidden text-micro leading-tight sm:block sm:text-sm">
                  Response Time
                </span>
              </div>
            </div>

            <div className="bg-border/60 hidden h-6 w-px shrink-0 sm:block sm:h-8" />

            <div className="flex min-w-0 items-center gap-1.5 sm:gap-2">
              <div className="border-primary/60 bg-primary-light flex h-6 w-6 shrink-0 items-center justify-center rounded-md border sm:h-8 sm:w-8">
                <HugeiconsIcon
                  icon={Clock01Icon}
                  size={14}
                  className="text-primary sm:hidden"
                />
                <HugeiconsIcon
                  icon={Clock01Icon}
                  size={16}
                  className="text-primary hidden sm:block"
                />
              </div>
              <div className="flex min-w-0 flex-col">
                <span className="text-foreground text-micro leading-tight font-bold sm:text-base">
                  {a.services || "24/7"}
                </span>
                <span className="text-muted-foreground hidden text-micro leading-tight sm:block sm:text-sm">
                  Services
                </span>
              </div>
            </div>

            <div className="bg-border/60 hidden h-6 w-px shrink-0 sm:block sm:h-8" />

            <div className="flex min-w-0 items-center gap-1.5 sm:gap-2">
              <div className="border-primary/60 bg-primary-light flex h-6 w-6 shrink-0 items-center justify-center rounded-md border sm:h-8 sm:w-8">
                <HugeiconsIcon
                  icon={SecurityCheckIcon}
                  size={14}
                  className="text-primary sm:hidden"
                />
                <HugeiconsIcon
                  icon={SecurityCheckIcon}
                  size={16}
                  className="text-primary hidden sm:block"
                />
              </div>
              <div className="flex min-w-0 flex-col">
                <span className="text-foreground text-micro leading-tight font-bold sm:text-base">
                  {isAvailable ? "Verified" : "Inactive"}
                </span>
                <span className="text-muted-foreground hidden text-micro leading-tight sm:block sm:text-sm">
                  Status
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-auto flex flex-col gap-1.5 pt-2 sm:gap-2 sm:flex-row">
            <Button
              variant="outline"
              className="border-primary/30 text-primary hover:bg-primary/5 flex h-9 w-full items-center justify-center gap-1.5 !rounded-md font-semibold text-xs sm:h-12 sm:text-sm sm:gap-2 sm:flex-1"
              asChild
            >
              <a href={a.phone ? `tel:${a.phone}` : "#"}>
                <HugeiconsIcon
                  icon={Call02Icon}
                  size={16}
                  className="text-primary"
                />
                Call Now
              </a>
            </Button>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90 flex h-9 w-full items-center justify-center gap-1 !rounded-md font-semibold text-white text-xs sm:h-12 sm:text-sm sm:gap-1.5 sm:flex-1">
                  <HugeiconsIcon
                    icon={Calendar01Icon}
                    size={16}
                    className="text-white"
                  />
                  Book Now
                  <span className="ml-1">→</span>
                </Button>
              </DialogTrigger>
              <DialogContent
                showCloseButton={false}
                className="max-h-[90vh] w-[95vw] overflow-y-auto rounded-md border-0 p-0 [-ms-overflow-style:none] [scrollbar-width:none] sm:max-w-5xl [&::-webkit-scrollbar]:hidden"
              >
                <DialogTitle className="sr-only">
                  Request an Ambulance
                </DialogTitle>
                <AmbulanceRequestForm
                  onSuccess={() => setIsOpen(false)}
                  ambulanceTypes={ambulance ? [
                    {
                      id: ambulance.ambulanceType,
                      title: ambulance.ambulanceType,
                    },
                  ] : []}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </Phantom>
  );
};
