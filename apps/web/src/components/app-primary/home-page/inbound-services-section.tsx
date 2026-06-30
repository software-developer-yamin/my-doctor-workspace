"use client";

import { InboundServiceCard } from "@/components/cards/inbound-service-card";
import { SectionHeader } from "@/components/common/section-header";
import { INBOUND_SERVICES_DATA } from "@/data/inbound-services.data";

export const InboundServicesSection = () => {
  return (
    <section className="bg-background py-12 lg:py-16">
      <div className="container">
        <SectionHeader
          label="Services"
          title="Our Core Services"
          description="Comprehensive healthcare services tailored for you."
          centeredOnMobile
        />
        {/* Services Grid */}
        <div className="grid grid-cols-2 gap-6 text-[0.5em] md:grid-cols-3 md:text-base lg:grid-cols-4">
          {INBOUND_SERVICES_DATA.map((service) => (
            <InboundServiceCard key={service.id} service={service} />
          ))}
        </div>
      </div>
    </section>
  );
};
