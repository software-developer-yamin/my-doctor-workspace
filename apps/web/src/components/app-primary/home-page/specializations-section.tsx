"use client";

import { SpecializationCard } from "@/components/cards/specialization-card";
import { SectionHeader } from "@/components/common/section-header";
import { specialtyService } from "@/services/specialty.service";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { cn } from "@/lib/utils";

export const SpecializationsSection = ({ className }: { className?: string }) => {
  const { data, isLoading } = useQuery({
    queryKey: ["home-specializations"],
    queryFn: () => specialtyService.getPublic({ page: 1, limit: 10 }),
    staleTime: 3600 * 1000,
  });

  const specializations = data?.data ?? [];
  const skeletons = Array.from({ length: 10 });

  return (
    <section className={cn("bg-background py-8 md:py-12", className)}>
      <div className="container">
        <SectionHeader
          label="Specialists"
          title="Top Specialisations"
          description="Consult with our highly experienced doctor"
        >
          <Link
            href="/specializations"
            className="text-primary hover:bg-primary/5 group flex shrink-0 items-center gap-1.5 rounded-lg border border-primary/40 px-4 py-2 text-sm font-bold transition-all hover:border-primary"
          >
            <span>View All</span>
            <HugeiconsIcon
              icon={ArrowRight01Icon}
              size={16}
              className="transition-transform group-hover:translate-x-0.5"
            />
          </Link>
        </SectionHeader>

        <div className="grid grid-cols-2 items-stretch gap-3 sm:gap-4 lg:grid-cols-5">
          {isLoading
            ? skeletons.map((_, i) => <SpecializationCard key={i} loading={true} />)
            : specializations.map((spec) => (
                <SpecializationCard key={spec.id} specialization={spec} loading={false} />
              ))}
        </div>
      </div>
    </section>
  );
};
