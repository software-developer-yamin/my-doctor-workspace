"use client";

import { TServiceCard } from "@/data/services.data";
import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

export const ServiceCard = ({
  service,
  className,
}: {
  service: TServiceCard;
  className?: string;
}) => {
  return (
    <Link
      href={service.href}
      className={cn(
        "group bg-card border-primary/20 hover:border-primary/40 flex flex-col rounded-2xl border p-3 transition-all duration-300 hover:shadow-md md:flex-row md:items-center md:gap-4 md:p-4",
        className,
      )}
    >
      {/* Image */}
      <div className="relative w-full overflow-hidden rounded-xl md:w-40 md:shrink-0 lg:w-48 xl:w-52">
        <div className="relative aspect-[4/3] w-full">
          <Image
            src={service.image}
            alt={service.title}
            fill
            className="object-cover"
          />
        </div>
      </div>

      {/* Text */}
      <div className="mt-3 text-center md:mt-0 md:text-left">
        <p className="text-foreground text-sm font-bold leading-tight sm:text-base lg:text-[1.05rem]">
          {service.title}
        </p>
        <p className="text-muted-foreground mt-1.5 text-xs leading-snug sm:text-sm">
          {service.description}
        </p>
      </div>
    </Link>
  );
};
