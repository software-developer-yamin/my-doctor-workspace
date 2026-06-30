import type { Metadata } from "next";
import { SITE } from "@/config/site";
import { AmbulanceSection } from "@/components/app-primary/home-page/ambulance-section";
import { AppDownloadSection } from "@/components/app-primary/home-page/app-download-section";
import { ActiveDoctorsSection } from "@/components/app-primary/home-page/active-doctors-section";
import { DiagnosticsSection } from "@/components/app-primary/home-page/diagnostics-section";
import { FaqsSection } from "@/components/app-primary/home-page/faqs-section";
import { HeroSection } from "@/components/app-primary/home-page/hero-section";
import { HowItWorksSection } from "@/components/app-primary/home-page/how-it-works-section";
import { NewsSection } from "@/components/app-primary/home-page/news-section";
import { SpecializationsSection } from "@/components/app-primary/home-page/specializations-section";
import { StatsSection } from "@/components/app-primary/home-page/stats-section";
import { TestimonialsSection } from "@/components/app-primary/home-page/testimonials-section";
import { TrustSection } from "@/components/app-primary/home-page/trust-section";
import { ContactSection } from "@/components/sections/contact-section";

export const metadata: Metadata = {
  title: "Trusted Healthcare Platform in Bangladesh",
  description: SITE.description,
  alternates: {
    canonical: "https://mydoctor.com.bd",
  },
  openGraph: {
    title: "My Doctor — Trusted Healthcare Platform in Bangladesh",
    description: SITE.description,
    url: SITE.url,
    images: [{ url: SITE.ogImage, width: 1200, height: 630, alt: SITE.name }],
  },
};

export default function HomePage() {
  return (
    <>
      <link rel="preload" href="/images/hero/01.svg" as="image" />
      <div className="flex flex-col">
        <HeroSection />
        <StatsSection className="hidden sm:block" />
        <hr className="border-border/50" />
        <SpecializationsSection />
        <hr className="border-border/50" />
        <ActiveDoctorsSection />
        <AmbulanceSection />
        <hr className="border-border/50" />
        <DiagnosticsSection />
        <hr className="border-border/50" />
        <HowItWorksSection />
        <hr className="border-border/50" />
        <TestimonialsSection />
        <hr className="border-border/50" />
        <TrustSection />
        <hr className="border-border/50" />
        <AppDownloadSection />
        <hr className="border-border/50" />
        <ContactSection />
        <hr className="border-border/50" />
        <NewsSection />
        <hr className="border-border/50" />
        <FaqsSection />
      </div>
    </>
  );
}
