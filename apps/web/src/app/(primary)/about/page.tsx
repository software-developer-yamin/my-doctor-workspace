import { StorySection } from "@/components/app-primary/about-page/story-section";
import { ValuesSection } from "@/components/app-primary/about-page/values-section";
import { VisionSection } from "@/components/app-primary/about-page/vision-section";
import { PageHeader } from "@/components/common/page-header";
import { PartnersSection } from "@/components/sections/partners-section";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | Healthcare Platform Bangladesh",
  description: "My Doctor is Bangladesh's leading digital healthcare platform connecting patients with verified doctors, hospitals, and medical services. Learn our story, mission, and values.",
  keywords: ["about My Doctor", "My Doctor Bangladesh", "healthcare platform Bangladesh", "digital health company Bangladesh", "My Doctor mission"],
  alternates: { canonical: "https://mydoctor.com.bd/about" },
  openGraph: {
    title: "About My Doctor | Bangladesh's Healthcare Platform",
    description: "Learn about My Doctor — Bangladesh's leading platform for doctor appointments, telemedicine, diagnostics, and emergency services.",
    url: "https://mydoctor.com.bd/about",
  },
};

export default function AboutPage() {
  return (
    <main className="bg-background min-h-screen">
      <PageHeader
        title="Our Story"
        description="Revolutionizing healthcare accessibility through technology and compassion."
        breadcrumb={[{ label: "About Us", active: true }]}
      />

      <div className="container mx-auto space-y-20 py-12 md:py-20">
        <StorySection />
        <ValuesSection />
        <PartnersSection />
        <hr className="border-border/50" />
        <VisionSection />
      </div>
    </main>
  );
}
