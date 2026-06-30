"use client";

import { useGuides } from "@/hooks/queries/use-guide";
import { Guide } from "@/types/guide.type";
import { API } from "@/config/api";
import {
  StarIcon,
  UserGroupIcon,
  Call02Icon,
  CheckmarkCircle01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { GuideBookingForm } from "./guide-booking-form";
import { useState } from "react";

function GuideCardSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card p-5 flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <Skeleton className="h-16 w-16 rounded-full shrink-0" />
        <div className="flex-1 flex flex-col gap-2">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-3 w-28" />
        </div>
      </div>
      <Skeleton className="h-10 w-full" />
      <div className="flex gap-2">
        <Skeleton className="h-9 flex-1" />
        <Skeleton className="h-9 flex-1" />
      </div>
    </div>
  );
}

function GuideCard({ guide }: { guide: Guide }) {
  const [open, setOpen] = useState(false);

  const photo = guide.photo || "/images/profile.jpeg";

  return (
    <div className="rounded-xl border border-border bg-card p-5 flex flex-col gap-4 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="relative shrink-0">
          <img
            src={photo}
            alt={guide.name}
            className="h-16 w-16 rounded-full object-cover border-2 border-primary/20"
            onError={(e) => { (e.target as HTMLImageElement).src = "/images/profile.jpeg"; }}
          />
          {guide.isVerified && (
            <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary">
              <HugeiconsIcon icon={CheckmarkCircle01Icon} size={12} className="text-white" />
            </span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-foreground font-bold text-sm truncate">{guide.name}</h3>
          {guide.hospitalName && (
            <p className="text-muted-foreground text-xs mt-0.5 truncate">{guide.hospitalName}</p>
          )}
          <div className="flex items-center gap-1 mt-1">
            <HugeiconsIcon icon={StarIcon} size={12} className="text-amber-400 fill-amber-400" />
            <span className="text-xs font-semibold text-foreground">
              {guide.rating > 0 ? guide.rating.toFixed(1) : "—"}
            </span>
            {guide.totalReviews > 0 && (
              <span className="text-xs text-muted-foreground">({guide.totalReviews})</span>
            )}
          </div>
        </div>
        <span className="shrink-0 rounded-md border border-primary/30 bg-primary/10 px-2 py-0.5 text-micro font-semibold text-primary">
          {guide.status === "Active" ? "Available" : "Unavailable"}
        </span>
      </div>

      {/* Details */}
      <div className="flex flex-col gap-1.5">
        {guide.yearsOfExperience > 0 && (
          <p className="text-xs text-muted-foreground">
            <span className="font-medium text-foreground">{guide.yearsOfExperience}+</span> years experience
          </p>
        )}
        {guide.languages.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {guide.languages.map((lang) => (
              <span key={lang} className="rounded-md bg-muted/50 px-2 py-0.5 text-micro font-medium text-muted-foreground">
                {lang}
              </span>
            ))}
          </div>
        )}
        {guide.expertise.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {guide.expertise.slice(0, 3).map((exp) => (
              <span key={exp} className="rounded-md border border-border px-2 py-0.5 text-micro font-medium text-foreground">
                {exp}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-auto">
        {guide.contactNumber && (
          <Button variant="outline" className="flex-1 h-9 gap-1.5 text-xs rounded-lg border-primary/30 text-primary hover:bg-primary/5" asChild>
            <a href={`tel:${guide.contactNumber}`}>
              <HugeiconsIcon icon={Call02Icon} size={14} />
              Call
            </a>
          </Button>
        )}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="flex-1 h-9 text-xs rounded-lg">
              Request Guide
            </Button>
          </DialogTrigger>
          <DialogContent
            showCloseButton={false}
            className="max-h-[90vh] w-[95vw] overflow-y-auto rounded-xl border-0 p-0 sm:max-w-lg"
          >
            <DialogTitle className="sr-only">Request Hospital Guide</DialogTitle>
            <GuideBookingForm />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

export function GuidesListSection() {
  const { data, isLoading } = useGuides();
  const guides = data?.data || [];

  if (isLoading) {
    return (
      <section className="container mx-auto px-4 py-10">
        <div className="mb-6 flex items-center gap-2">
          <HugeiconsIcon icon={UserGroupIcon} size={20} className="text-primary" />
          <h2 className="text-xl font-bold text-foreground">Our Hospital Guides</h2>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => <GuideCardSkeleton key={i} />)}
        </div>
      </section>
    );
  }

  if (guides.length === 0) return null;

  return (
    <section className="container mx-auto px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <HugeiconsIcon icon={UserGroupIcon} size={20} className="text-primary" />
          <h2 className="text-xl font-bold text-foreground">Our Hospital Guides</h2>
        </div>
        <span className="text-sm text-muted-foreground">{guides.length} guides available</span>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {guides.map((guide) => (
          <GuideCard key={guide.id} guide={guide} />
        ))}
      </div>
    </section>
  );
}
