import { PageHeader } from "@/components/common/page-header";
import { SectionHeader } from "@/components/common/section-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  CAREERS_BENEFITS,
  CAREERS_HIRING_STEPS,
  CAREERS_STATS,
} from "@/data/careers.data";
import {
  Briefcase01Icon,
  CheckmarkCircle02Icon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { CareersJobs } from "./_components/careers-jobs";

export const metadata: Metadata = {
  title: "Careers | Healthcare & Tech Jobs Bangladesh",
  description: "Join My Doctor and help shape the future of healthcare in Bangladesh. Open roles in medicine, engineering, product, design, and operations. Apply now.",
  keywords: ["My Doctor careers", "healthcare jobs Bangladesh", "medical jobs Dhaka", "health tech careers", "jobs at My Doctor", "healthcare startup jobs Bangladesh"],
  alternates: { canonical: "https://mydoctor.com.bd/careers" },
  openGraph: {
    title: "Careers at My Doctor | Build Bangladesh's Healthcare Future",
    description: "Explore open positions at My Doctor — Bangladesh's leading digital healthcare platform.",
    url: "https://mydoctor.com.bd/careers",
  },
};

const BENEFIT_ICONS = [
  CheckmarkCircle02Icon,
  Briefcase01Icon,
  CheckmarkCircle02Icon,
  CheckmarkCircle02Icon,
  CheckmarkCircle02Icon,
  UserGroupIcon,
];

export default function CareersPage() {
  return (
    <main className="bg-background min-h-screen">
      <PageHeader
        title="Join Our Team"
        description="Help us make quality healthcare accessible to every Bangladeshi. We are a mission-driven team building the future of digital health."
      />

      {/* Stats bar */}
      <div className="bg-primary py-6 sm:py-8">
        <div className="container">
          <div className="grid grid-cols-3 gap-2 text-center text-white sm:gap-4">
            <div>
              <p className="text-xl font-bold sm:text-2xl md:text-3xl">{CAREERS_STATS.employees}+</p>
              <p className="mt-0.5 text-xs font-medium text-white/80 sm:mt-1 sm:text-sm">Team Members</p>
            </div>
            <div>
              <p className="text-xl font-bold sm:text-2xl md:text-3xl">{CAREERS_STATS.cities}</p>
              <p className="mt-0.5 text-xs font-medium text-white/80 sm:mt-1 sm:text-sm">Cities</p>
            </div>
            <div>
              <p className="text-xl font-bold sm:text-2xl md:text-3xl">{CAREERS_STATS.openRoles}</p>
              <p className="mt-0.5 text-xs font-medium text-white/80 sm:mt-1 sm:text-sm">Open Roles</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container space-y-10 py-10 md:space-y-16 md:py-20">
        {/* Open Positions */}
        <section>
          <SectionHeader
            label="Open Positions"
            title="Find Your Role"
            description="Browse open positions across all departments. We are hiring across medicine, engineering, operations, and patient support."
          />
          <CareersJobs />
        </section>

        {/* Benefits */}
        <section>
          <SectionHeader
            label="Benefits"
            title="Why Work With Us"
            description="We invest in our people because great healthcare starts with a great team."
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CAREERS_BENEFITS.map((benefit, index) => (
              <Card
                key={benefit.title}
                className="border-border/60 hover:border-primary/20 transition-all"
              >
                <CardContent className="p-4 sm:p-5">
                  <div className="bg-primary/8 border-primary/15 mb-4 flex h-10 w-10 items-center justify-center rounded-xl border">
                    <HugeiconsIcon
                      icon={BENEFIT_ICONS[index % BENEFIT_ICONS.length]}
                      size={20}
                      className="text-primary"
                    />
                  </div>
                  <h3 className="text-foreground mb-2 text-sm font-semibold">
                    {benefit.title}
                  </h3>
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    {benefit.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Hiring Process */}
        <section>
          <SectionHeader
            label="Process"
            title="Our Hiring Process"
            description="We keep it simple, transparent, and respectful of your time."
          />

          {/* Mobile: vertical stepper */}
          <div className="flex flex-col gap-0 sm:hidden">
            {CAREERS_HIRING_STEPS.map((step, index) => (
              <div key={step.value} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-white text-sm font-bold">
                    {index + 1}
                  </div>
                  {index < CAREERS_HIRING_STEPS.length - 1 && (
                    <div className="my-1 flex-1 w-px bg-border" />
                  )}
                </div>
                <div className="pb-6">
                  <h3 className="text-foreground mb-1 text-sm font-semibold leading-tight">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* sm+: horizontal stepper */}
          <div className="relative hidden sm:block">
            <div className="absolute top-[1.125rem] left-10 right-10 h-px bg-border" />
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
              {CAREERS_HIRING_STEPS.map((step, index) => (
                <div key={step.value} className="flex flex-col items-center text-center">
                  <div className="relative z-10 mb-4 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-white text-sm font-bold">
                    {index + 1}
                  </div>
                  <h3 className="text-foreground mb-1 text-sm font-semibold">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Culture */}
        <section>
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12">
            <div>
              <SectionHeader
                label="Culture"
                title="Our Culture"
                description="We are a team of doctors, engineers, and operators united by one mission: making healthcare accessible to all Bangladeshis."
              />
              <ul className="space-y-3">
                {[
                  "Mission-first decisions",
                  "Open and transparent leadership",
                  "Diversity and inclusion",
                  "Learning and continuous growth",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-muted-foreground">
                    <HugeiconsIcon icon={CheckmarkCircle02Icon} size={16} className="text-primary shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex items-center justify-center rounded-2xl bg-primary/5 p-4 sm:p-8">
              <Image
                src="/images/hero/03.svg"
                alt="My Doctor team culture"
                width={400}
                height={300}
                className="h-auto w-full max-w-xs sm:max-w-sm"
              />
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="rounded-2xl bg-primary/8 border border-primary/15 px-4 py-8 text-center sm:px-8 sm:py-10">
          <h2 className="text-foreground mb-2 text-lg font-bold tracking-tight sm:text-xl md:text-2xl">
            Don&apos;t see the right role?
          </h2>
          <p className="text-muted-foreground mx-auto mb-6 max-w-md text-sm leading-relaxed">
            We are always looking for talented people who share our mission. Send us your CV and we will reach out when the right opportunity opens.
          </p>
          <Button asChild size="lg" className="h-10 w-full rounded-xl px-8 text-sm font-bold sm:w-auto">
            <Link href="/contact">Contact Us</Link>
          </Button>
        </section>
      </div>
    </main>
  );
}
