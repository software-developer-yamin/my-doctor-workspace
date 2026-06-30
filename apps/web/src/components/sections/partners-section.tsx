"use client";

import { SectionHeader } from "@/components/common/section-header";
import { PARTNERS_DATA } from "@/data/partners.data";

import { PartnerCard } from "@/components/cards/partner-card";

import { cn } from "@/lib/utils";

export const PartnersSection = ({ className }: { className?: string }) => {
  return (
    <section className={cn("bg-background py-8 md:py-16", className)}>
      <div className="container">
        {/* Section Header */}
        <SectionHeader
          label="Partners"
          title="Our Trusted Partners"
          description="We work with the top medical institutions and labs."
          centeredOnMobile
        />

        {/* Partners Grid */}
        <div className="grid grid-cols-3 gap-4 text-xs md:gap-6 md:text-base lg:grid-cols-6">
          {PARTNERS_DATA.slice(0, 6).map((partner) => (
            <PartnerCard key={partner.id} partner={partner} />
          ))}
        </div>
      </div>
    </section>
  );
};
