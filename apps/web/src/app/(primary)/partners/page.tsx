import { PageHeader } from "@/components/common/page-header";
import { SectionHeader } from "@/components/common/section-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Metadata } from "next";
import Link from "next/link";
import { PartnersTabs } from "./_components/partners-tabs";

export const metadata: Metadata = {
  title: "Our Partners | Hospitals, Labs & Healthcare Partners",
  description: "My Doctor partners with leading hospitals, diagnostic centres, emergency services, and healthcare technology companies across Bangladesh. Become a partner today.",
  keywords: ["My Doctor partners", "healthcare partners Bangladesh", "hospital network Bangladesh", "diagnostic lab partners", "become My Doctor partner"],
  alternates: { canonical: "https://mydoctor.com.bd/partners" },
  openGraph: {
    title: "My Doctor Partners | Bangladesh Healthcare Network",
    description: "Join My Doctor's partner network of hospitals, clinics, labs, and healthcare providers across Bangladesh.",
    url: "https://mydoctor.com.bd/partners",
  },
};

const PARTNERSHIP_BENEFITS = [
  "Access to 500,000+ registered patients",
  "Verified partner badge on your profile",
  "Dedicated account manager",
  "Co-marketing and promotion opportunities",
  "Real-time analytics and reporting",
  "Priority support and onboarding",
];

export default function PartnersPage() {
  return (
    <main className="bg-background min-h-screen">
      <PageHeader
        title="Our Partners"
        description="We work with trusted hospitals, clinics, diagnostic labs, and technology companies to deliver the best healthcare experience in Bangladesh."
      />

      <div className="container space-y-10 py-8 md:space-y-16 md:py-20">
        {/* Partners grid with tabs */}
        <section>
          <SectionHeader
            label="Network"
            title="Healthcare Partner Network"
            description="Browse our partners by category."
          />
          <PartnersTabs />
        </section>

        {/* Become a Partner */}
        <section>
          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-2 lg:gap-12">
            {/* Benefits list */}
            <div>
              <SectionHeader
                label="Partnership"
                title="Become a Partner"
                description="Join Bangladesh's fastest-growing healthcare network. We partner with hospitals, diagnostic centres, pharmacies, ambulance services, and healthcare technology companies."
              />
              <ul className="space-y-3">
                {PARTNERSHIP_BENEFITS.map((benefit) => (
                  <li
                    key={benefit}
                    className="flex items-center gap-3 text-sm text-muted-foreground"
                  >
                    <HugeiconsIcon
                      icon={CheckmarkCircle02Icon}
                      size={16}
                      className="text-primary shrink-0"
                    />
                    {benefit}
                  </li>
                ))}
              </ul>
              <div className="mt-6">
                <Button
                  asChild
                  size="lg"
                  className="h-10 w-full rounded-xl px-8 text-sm font-bold sm:w-auto"
                >
                  <Link href="/contact">Contact Our Partnership Team</Link>
                </Button>
              </div>
            </div>

            {/* Enquiry card */}
            <Card className="border-primary/15 bg-primary/5">
              <CardContent className="p-5 sm:p-8">
                <h3 className="text-foreground mb-2 text-lg font-bold">
                  Partnership Enquiry
                </h3>
                <p className="text-muted-foreground mb-5 text-sm leading-relaxed">
                  Whether you are a hospital, diagnostic lab, ambulance service, pharmacy, or health-tech company — we want to hear from you.
                </p>
                <div className="space-y-3">
                  <div className="rounded-xl bg-background border border-border/60 p-3 sm:p-4">
                    <p className="text-foreground text-sm font-semibold">Hospitals & Clinics</p>
                    <p className="text-muted-foreground mt-1 text-xs">List your facility, manage appointments, and reach verified patients.</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/60 p-3 sm:p-4">
                    <p className="text-foreground text-sm font-semibold">Diagnostic Centres</p>
                    <p className="text-muted-foreground mt-1 text-xs">Accept test bookings, share results digitally, and grow your patient base.</p>
                  </div>
                  <div className="rounded-xl bg-background border border-border/60 p-3 sm:p-4">
                    <p className="text-foreground text-sm font-semibold">Technology & Pharma</p>
                    <p className="text-muted-foreground mt-1 text-xs">Integrate your services and reach Bangladesh&apos;s growing digital health market.</p>
                  </div>
                </div>
                <Button
                  asChild
                  className="mt-5 h-9 w-full rounded-xl text-sm font-semibold"
                >
                  <Link href="/contact">Get in Touch</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </main>
  );
}
