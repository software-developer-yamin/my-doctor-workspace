"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft02Icon,
  Clock01Icon,
  Doctor02Icon,
  Home01Icon,
  HospitalIcon,
  CustomerService01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface ServiceDeactivatedProps {
  serviceName?: string;
  description?: string;
  launchDate?: string;
}

export const ServiceDeactivated = ({
  serviceName = "This Service",
  description,
  launchDate,
}: ServiceDeactivatedProps) => {
  const router = useRouter();

  return (
    <div className="flex min-h-[75vh] flex-col items-center justify-center px-4 py-16 text-center">
      {/* Icon */}
      <div className="bg-primary/8 border-primary/15 mb-6 flex h-20 w-20 items-center justify-center rounded-3xl border">
        <HugeiconsIcon icon={Clock01Icon} className="text-primary h-10 w-10" />
      </div>

      {/* Badge */}
      <Badge variant="secondary" className="mb-4 px-3 py-1 text-xs font-semibold">
        Coming Soon
      </Badge>

      {/* Heading */}
      <h1 className="text-foreground mb-3 text-2xl font-bold tracking-tight sm:text-3xl">
        {serviceName}
      </h1>

      {launchDate && (
        <p className="text-muted-foreground mb-3 text-sm">
          Expected launch:{" "}
          <span className="text-foreground font-semibold">{launchDate}</span>
        </p>
      )}

      {/* Description */}
      <p className="text-muted-foreground mx-auto mb-8 max-w-sm text-sm leading-relaxed">
        {description ??
          `We are working hard to bring you ${serviceName}. It will be available soon. Thank you for your patience.`}
      </p>

      {/* Actions */}
      <div className="mb-10 flex flex-wrap items-center justify-center gap-3">
        <Button
          onClick={() => router.back()}
          variant="outline"
          className="h-9 rounded-xl px-5 text-sm font-semibold"
        >
          <HugeiconsIcon icon={ArrowLeft02Icon} size={15} className="mr-1.5" />
          Go Back
        </Button>
        <Button asChild className="h-9 rounded-xl px-5 text-sm font-semibold">
          <Link href="/">
            <HugeiconsIcon icon={Home01Icon} size={15} className="mr-1.5" />
            Return Home
          </Link>
        </Button>
      </div>

      {/* Secondary links */}
      <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
        <Link
          href="/doctors"
          className="flex items-center gap-1.5 font-medium hover:text-primary transition-colors"
        >
          <HugeiconsIcon icon={Doctor02Icon} size={13} />
          Browse Doctors
        </Link>
        <span className="h-3 w-px bg-border" />
        <Link
          href="/hospitals"
          className="flex items-center gap-1.5 font-medium hover:text-primary transition-colors"
        >
          <HugeiconsIcon icon={HospitalIcon} size={13} />
          Browse Hospitals
        </Link>
        <span className="h-3 w-px bg-border" />
        <Link
          href="/contact"
          className="flex items-center gap-1.5 font-medium hover:text-primary transition-colors"
        >
          <HugeiconsIcon icon={CustomerService01Icon} size={13} />
          Contact Support
        </Link>
      </div>
    </div>
  );
};
