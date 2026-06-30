import { TInboundService } from "@/data/inbound-services.data";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import React from "react";

import { cn } from "@/lib/utils";

export const InboundServiceCard = ({
  service,
  className,
}: {
  service: TInboundService;
  className?: string;
}) => {
  return (
    <Link
      href={service.href}
      className={cn(
        "group bg-background border border-border/50 hover:border-primary/20 hover:shadow-md flex flex-col items-center text-center p-[2em] rounded-[1em] transition-all duration-300 active:scale-95",
        className
      )}
    >
      {/* Icon Wrapper */}
      <div
        className={cn(
          "flex h-[4em] w-[4em] items-center justify-center rounded-[1em] mb-[1.5em] transition-transform duration-300 group-hover:rotate-6",
          service.bgColor,
          service.color
        )}
      >
        <HugeiconsIcon icon={service.icon} size={32} />
      </div>

      {/* Content */}
      <div className="space-y-[0.75em]">
        <h4 className="text-foreground text-[1.25em] font-bold leading-tight group-hover:text-primary transition-colors">
          {service.title}
        </h4>
        <p className="text-muted-foreground text-[0.875em] line-clamp-3 leading-relaxed font-medium">
          {service.description}
        </p>
      </div>

      {/* Small Decorative Indicator */}
      <div className="mt-[1.5em] flex h-[0.25em] w-[2em] rounded-full bg-muted/30 overflow-hidden">
        <div className="bg-primary h-full w-0 transition-all duration-300 group-hover:w-full" />
      </div>
    </Link>
  );
};
