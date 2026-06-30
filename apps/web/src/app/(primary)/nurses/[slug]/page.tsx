import type { Metadata } from "next";
import { NURSE_DETAILS_DATA } from "@/data/nurse-details.data";
import { NurseInfoCard } from "@/components/app-primary/nurse-details-page/nurse-info-card";
import { NurseProfileTabs } from "@/components/app-primary/nurse-details-page/nurse-profile-tabs";
import { NurseBookingSidebar } from "@/components/app-primary/nurse-details-page/nurse-booking-sidebar";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const nurse = NURSE_DETAILS_DATA.find((n) => n.id === slug) || NURSE_DETAILS_DATA[0];
  if (!nurse) return { title: "Nurse Profile" };
  return {
    title: `${nurse.name} | Home Nursing Professional Bangladesh`,
    description: `Book ${nurse.name} for home nursing care in Bangladesh. Qualified, verified nurse available for patient care, post-operative assistance, and medical support.`,
    alternates: { canonical: `https://mydoctor.com.bd/nurses/${slug}` },
    openGraph: {
      title: `${nurse.name} | Nursing Professional | My Doctor`,
      description: `Book ${nurse.name} for professional home nursing care in Bangladesh.`,
      url: `https://mydoctor.com.bd/nurses/${slug}`,
    },
  };
}

const getNurseData = (slug: string) => {
  return NURSE_DETAILS_DATA.find((n) => n.id === slug) || NURSE_DETAILS_DATA[0];
};

export default async function NurseDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const nurse = getNurseData(slug);

  if (!nurse) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-6 lg:py-12">
      {/* Back Button */}
      <Link
        href="/nurses"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm font-semibold group mb-6"
      >
        <HugeiconsIcon
          icon={ArrowLeft02Icon}
          size={20}
          className="group-hover:-translate-x-1 transition-transform"
        />
        <span>Back to Nurses</span>
      </Link>

      <div className="flex flex-col items-start gap-6 lg:grid lg:grid-cols-12">
        {/* Left Column — Main Content */}
        <div className="flex w-full flex-col gap-0 lg:col-span-8">
          <NurseInfoCard nurse={nurse} />
          <NurseProfileTabs nurse={nurse} />
        </div>

        {/* Right Column — Booking Sidebar */}
        <div className="w-full lg:col-span-4">
          <NurseBookingSidebar nurse={nurse} />
        </div>
      </div>
    </div>
  );
}
