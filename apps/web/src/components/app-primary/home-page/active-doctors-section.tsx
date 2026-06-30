"use client";

import { DoctorCard } from "@/components/cards/doctor-card";
import { SectionHeader } from "@/components/common/section-header";
import { doctorService } from "@/services/doctor.service";
import { Doctor } from "@/types/doctor.type";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { cn } from "@/lib/utils";

export const ActiveDoctorsSection = ({ className }: { className?: string }) => {
  const { data, isLoading } = useQuery({
    queryKey: ["home-doctors"],
    queryFn: () => doctorService.getAll({ limit: 6 }),
    staleTime: 1800 * 1000,
  });

  const doctors = data?.data ?? [];
  const skeletons = Array.from({ length: 6 });

  return (
    <section className={cn("bg-surface py-8 md:py-12", className)}>
      <div className="container">
        <SectionHeader
          title="Active Doctors"
          description="Book appointments with top verified doctors available for you."
        >
          <Link
            href="/doctors"
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

        <div className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {isLoading
            ? skeletons.map((_, i) => (
                <DoctorCard key={i} doctor={{} as Doctor} loading={true} />
              ))
            : doctors.map((doctor) => (
                <DoctorCard key={doctor.id || doctor.slug} doctor={doctor} loading={false} />
              ))}
        </div>
      </div>
    </section>
  );
};
