import { GuideBookingForm } from "@/components/app-primary/guides-page/guide-booking-form";
import { GuidesListSection } from "@/components/app-primary/guides-page/guides-list-section";
import { BookingContactButtons } from "@/components/common/booking-contact-buttons";
import {
  AmbulanceIcon,
  Call02Icon,
  Clock01Icon,
  ClipboardIcon,
  Hospital02Icon,
  NavigationIcon,
  SecurityCheckIcon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Hospital Guide & Patient Assistant Service Bangladesh",
  description: "Request a personal hospital guide or patient assistant in Bangladesh to help navigate your hospital visit — registration, queue management, doctor escort, and more via My Doctor.",
  keywords: ["hospital guide Bangladesh", "patient assistant Bangladesh", "hospital navigation help", "hospital guide service Dhaka", "medical escort Bangladesh"],
  alternates: { canonical: "https://mydoctor.com.bd/guides" },
  openGraph: {
    title: "Hospital Guide & Patient Assistant | My Doctor",
    description: "Personal hospital guides available to help patients navigate hospital visits across Bangladesh.",
    url: "https://mydoctor.com.bd/guides",
  },
};

const BULLET_FEATURES = [
  { text: "Verified & Trained Support Staff", icon: SecurityCheckIcon },
  { text: "Quick Response & Real-Time Support", icon: Clock01Icon },
  { text: "Safe, Reliable & Confidential Service", icon: SecurityCheckIcon },
];

const SERVICE_FEATURES = [
  {
    icon: UserGroupIcon,
    title: "Elderly Patient Support",
    desc: "Special care and mobility support for senior citizens.",
  },
  {
    icon: ClipboardIcon,
    title: "Registration Assistance",
    desc: "Help with hospital registration, token, and documentation.",
  },
  {
    icon: NavigationIcon,
    title: "Diagnostic Navigation",
    desc: "Guidance for tests, reports, and different departments.",
  },
  {
    icon: Hospital02Icon,
    title: "Cabin & Ward Support",
    desc: "Assistance for find cabins, wards, ICU, and other facilities.",
  },
];

export default function GuidesPage() {
  return (
    <main className="bg-background min-h-screen">

      {/* ── Hero Section: text left + team photo right ── */}
      <section className="bg-muted px-4 py-10 lg:py-14">
        <div className="container mx-auto">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12">
          {/* LEFT: text content */}
          <div>
            <div className="mb-4 inline-flex items-center rounded-md border border-primary/20 bg-primary/10 px-3 py-1">
              <span className="text-2xs font-bold tracking-widest text-primary uppercase">
                Trusted Healthcare Support
              </span>
            </div>
            <h1 className="mb-4 text-3xl font-extrabold leading-tight text-gray-900 lg:text-[2.4rem]">
              Hospital Assistant &<br />
              <span className="text-primary">Personal Guide</span>
            </h1>
            <p className="mb-6 max-w-lg text-sm leading-relaxed text-gray-500">
              Get real-time hospital assistance for appointments, diagnostics,
              registrations, and patient support — all in one place.
            </p>
            <ul className="mb-6 space-y-4">
              {BULLET_FEATURES.map((feat) => (
                <li key={feat.text} className="flex items-center gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/10">
                    <HugeiconsIcon
                      icon={feat.icon}
                      size={20}
                      className="text-primary"
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-700">{feat.text}</span>
                </li>
              ))}
            </ul>
            <BookingContactButtons />
          </div>

          {/* RIGHT: team photo */}
          <div className="relative overflow-hidden rounded-md">
            <Image
              src="/images/services/guide-hero.png"
              alt="My Doctor guide team with patient"
              width={640}
              height={480}
              className="h-72 w-full object-cover lg:h-[420px]"
              priority
            />
            {/* My Doctor logo badge */}
            <div className="absolute left-3 top-3 flex items-center gap-2 rounded-md bg-white/90 px-3 py-1.5 shadow-md backdrop-blur-sm">
              <Image
                src="/logo-squer.svg"
                alt="My Doctor"
                width={22}
                height={22}
                className="shrink-0"
              />
              <div>
                <p className="text-foreground text-xs font-bold leading-none">My Doctor</p>
                <p className="text-muted-foreground mt-0.5 text-micro">আপনার স্বাস্থ্য সহযোগী</p>
              </div>
            </div>
            {/* Availability badge */}
            <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-md bg-white/90 px-3 py-1.5 shadow-md backdrop-blur-sm">
              <span className="inline-block h-2 w-2 rounded-full bg-primary" />
              <div>
                <p className="text-foreground text-xs font-bold leading-none">Available Now</p>
                <p className="text-muted-foreground mt-0.5 text-micro">Hospital Guides Ready</p>
              </div>
            </div>
          </div>
        </div>
        </div>
      </section>

      {/* ── Guide Listings (dynamic, from backend) ── */}
      <GuidesListSection />

      {/* ── Features + Form Section ── */}
      <section className="border-border border-t">
        <div className="container mx-auto px-4 py-10">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Form: first on mobile, right column on desktop */}
            <div className="lg:order-last">
              <GuideBookingForm />
            </div>

            {/* Service features: second on mobile, left col on desktop */}
            <div className="lg:order-first">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {SERVICE_FEATURES.map((feat) => (
                  <div key={feat.title} className="bg-card border-border rounded-md border p-4 sm:p-5">
                    <div className="bg-primary/10 mb-3 flex h-10 w-10 items-center justify-center rounded-md">
                      <HugeiconsIcon
                        icon={feat.icon}
                        size={20}
                        className="text-primary"
                      />
                    </div>
                    <p className="text-foreground text-sm font-bold">{feat.title}</p>
                    <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
                      {feat.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Emergency Strip ── */}
      <section className="container mx-auto mb-8 px-4">
        <div className="bg-rose-50 border-rose-100 flex items-center justify-between gap-4 rounded-xl border px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-rose-100">
              <HugeiconsIcon
                icon={AmbulanceIcon}
                size={20}
                className="text-rose-500"
              />
            </div>
            <div>
              <p className="text-rose-600 text-sm font-bold">
                Emergency Priority Support
              </p>
              <p className="text-muted-foreground text-xs">
                For urgent assistance, our team is always ready.
              </p>
            </div>
          </div>
          <a
            href="tel:+8809604-202302"
            className="inline-flex shrink-0 items-center rounded-lg bg-rose-600 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-rose-700"
          >
            Call Now
          </a>
        </div>
      </section>
    </main>
  );
}
