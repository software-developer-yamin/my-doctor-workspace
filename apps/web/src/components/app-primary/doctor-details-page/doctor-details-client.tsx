"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Doctor } from "@/types/doctor.type";
import { saveRecentlyViewed, RECENTLY_VIEWED_KEYS } from "@/hooks/use-recently-viewed";
import { DoctorHero } from "./doctor-hero";
import { DoctorProfileTabs } from "./doctor-profile-tabs";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft02Icon } from "@hugeicons/core-free-icons";
import { useDoctorReviews } from "@/hooks/queries/use-doctor-mock-data";

const BookingDrawer = dynamic(
  () => import("./booking-drawer").then((mod) => ({ default: mod.BookingDrawer })),
  { ssr: false }
);

type DoctorDetailsClientProps = {
  doctor: Doctor;
  resumeBooking?: boolean;
};

export function DoctorDetailsClient({ doctor, resumeBooking }: DoctorDetailsClientProps) {
  const [bookingOpen, setBookingOpen] = useState(false);

  useEffect(() => {
    if (!resumeBooking) return;

    const timer = setTimeout(() => {
      setBookingOpen(true);
    }, 0);

    window.history.replaceState(null, "", "/doctors/" + doctor.slug);

    return () => clearTimeout(timer);
  }, [resumeBooking, doctor.slug]);

  useEffect(() => {
    saveRecentlyViewed(RECENTLY_VIEWED_KEYS.doctors, {
      id: doctor.id,
      slug: doctor.slug,
      name: doctor.name,
      photo: doctor.photo,
      primarySpecialty: doctor.primarySpecialty,
      degrees: doctor.degrees,
      fee: doctor.fee,
      experience: doctor.experience,
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doctor.id]);

  const { data: reviews = [] } = useDoctorReviews(doctor.id);
  const faqs = doctor.faqs ?? [];
  const awards = doctor.awards ?? [];
  const conditions = doctor.conditionsTreated ?? [];
  const insurances = doctor.insuranceAccepted ?? [];

  return (
    <main className="container mx-auto py-6 lg:py-10">
      {/* ── Back to Doctors breadcrumb ── */}
      <Link
        href="/doctors"
        className="inline-flex w-fit items-center gap-2 rounded-xl border border-primary/30 bg-primary/10 px-4 py-2.5 text-sm font-bold text-primary transition-colors hover:bg-primary/15 mb-5"
      >
        <HugeiconsIcon icon={ArrowLeft02Icon} size={16} />
        <span>Back to Doctors</span>
      </Link>

      <div className="flex w-full flex-col gap-6">
        {/* Hero card */}
        <DoctorHero doctor={doctor} onBookNow={() => setBookingOpen(true)} />

        {/* Tabs: Overview | Chamber Info — with inline appointment panel */}
        <DoctorProfileTabs
          doctor={doctor}
          reviews={reviews}
          faqs={faqs}
          awards={awards}
          conditions={conditions}
          insurances={insurances}
          onBookNow={() => setBookingOpen(true)}
        />
      </div>

      <BookingDrawer
        doctor={doctor}
        open={bookingOpen}
        onOpenChange={setBookingOpen}
      />
    </main>
  );
}
