"use client";

import { Phantom } from "@/components/ui/phantom";
import { getImageUrl } from "@/lib/utils";
import { DiagnosticTest } from "@/types/diagnostic.type";
import Link from "next/link";

import { cn } from "@/lib/utils";

export const HomePageDiagnosticCard = ({
  test,
  className,
  loading,
}: {
  test?: DiagnosticTest;
  className?: string;
  loading?: boolean;
}) => {
  const t = test ?? ({} as DiagnosticTest);
  const defaultImage = "/images/default-specialization.png";

  return (
    <Phantom loading={loading ?? false}>
      <div className={cn("group flex flex-col items-center text-center", className)}>
        <Link href={t.name ? `/diagnostics?search=${encodeURIComponent(t.name)}` : "#"} className="block w-full">
          <div className="relative mx-auto mb-[1em] h-[6em] w-[6em] overflow-hidden rounded-full transition-all duration-300 group-hover:shadow-lg group-hover:shadow-primary/10">
            <img
              src={
                (t as any).image
                  ? getImageUrl((t as any).image)
                  : defaultImage
              }
              alt={t.name ?? ""}
              className="h-full w-full object-cover p-[1em] opacity-80 transition-transform"
              loading="lazy"
            />
            <div className="bg-primary/5 absolute inset-0 transition-colors group-hover:bg-primary/10" />
          </div>

          <h6 className="text-foreground group-hover:text-primary mb-[0.25em] px-[0.5em] text-[1em] leading-tight font-bold transition-colors">
            {t.name}
          </h6>

          <div className="flex flex-col gap-[0.125em]">
            <span className="text-muted-foreground text-[0.625em] font-bold tracking-tight uppercase">
              Starts from
            </span>
            <span className="text-primary hover:text-primary/80 inline-block text-[0.875em] font-bold transition-all">
              ৳{t.priceStartFrom || "0"}
            </span>
          </div>
        </Link>
      </div>
    </Phantom>
  );
};
