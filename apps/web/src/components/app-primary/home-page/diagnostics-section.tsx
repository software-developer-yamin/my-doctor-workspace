"use client";

import { DiagnosticCard } from "@/components/cards/diagnostic-card";
import { SectionHeader } from "@/components/common/section-header";
import { diagnosticService } from "@/services/diagnostic.service";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { cn } from "@/lib/utils";

export const DiagnosticsSection = ({ className }: { className?: string }) => {
  const { data, isLoading } = useQuery({
    queryKey: ["home-diagnostics"],
    queryFn: () => diagnosticService.getAllTests({ limit: 10 }),
    staleTime: 3600 * 1000,
  });

  const tests = data?.data ?? [];
  const skeletons = Array.from({ length: 10 });

  return (
    <section className={cn("bg-surface py-8 md:py-12", className)}>
      <div className="container">
        <SectionHeader
          label="Diagnostics"
          title="Reliable Diagnostic Care"
          description="Book tests with labs and get high quality care."
        >
          <Link
            href="/diagnostics"
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

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-6 md:grid-cols-3 lg:grid-cols-5">
          {isLoading
            ? skeletons.map((_, i) => <DiagnosticCard key={i} loading={true} />)
            : tests.map((test) => (
                <DiagnosticCard key={test.id} test={test} loading={false} />
              ))}
        </div>
      </div>
    </section>
  );
};
