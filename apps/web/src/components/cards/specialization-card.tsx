"use client";

import { Phantom } from "@/components/ui/phantom";
import { getImageUrl } from "@/lib/utils";
import { Specialty } from "@/types/specialty.type";
import Link from "next/link";

import { cn } from "@/lib/utils";

export const SpecializationCard = ({
  specialization,
  className,
  loading,
}: {
  specialization?: Specialty;
  className?: string;
  loading?: boolean;
}) => {
  const s = specialization ?? ({} as Specialty);
  const href = s.name ? `/doctors?q=${encodeURIComponent(s.name)}` : "#";

  return (
    <Phantom loading={loading ?? false}>
      <Link
        href={href}
        className={cn(
          "group bg-card border-primary/20 hover:border-primary/40 flex h-full min-h-50 flex-col items-center rounded-md border p-4 text-center transition-all duration-300 hover:shadow-md sm:min-h-55 sm:p-5",
          className,
        )}
      >
        {/* Icon */}
        <div className="mb-4 flex h-20 w-20 shrink-0 items-center justify-center sm:h-24 sm:w-24">
          <img
            src={
              s.image
                ? getImageUrl(s.image)
                : "/images/default-specialization.png"
            }
            alt={s.name ?? ""}
            className="h-full w-full object-contain transition-transform duration-300"
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Title */}
        <h6 className="text-foreground group-hover:text-primary line-clamp-3 flex-1 text-sm font-bold leading-snug transition-colors">
          {s.name}
        </h6>
      </Link>
    </Phantom>
  );
};
