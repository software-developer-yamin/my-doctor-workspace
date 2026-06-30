import { DoctorDetailsClient } from "@/components/app-primary/doctor-details-page/doctor-details-client";
import { doctorService } from "@/services/doctor.service";
import { Metadata } from "next";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ booking?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const doctor = await doctorService.getById(slug);
    if (!doctor) return { title: "Doctor Not Found" };

    const description =
      doctor.shortDescription ||
      `Schedule an appointment with ${doctor.name}, ${doctor.primarySpecialty} specialist. Book online or call now.`;

    return {
      title: `${doctor.name} | ${doctor.primarySpecialty} Specialist`,
      description,
      alternates: {
        canonical: `https://mydoctor.com.bd/doctors/${slug}`,
      },
      openGraph: {
        title: `${doctor.name} — ${doctor.primarySpecialty} Specialist | My Doctor`,
        description,
        url: `https://mydoctor.com.bd/doctors/${slug}`,
        images: doctor.photo ? [{ url: doctor.photo, alt: doctor.name }] : [],
      },
    };
  } catch {
    return { title: "Doctor Profile" };
  }
}

export default async function DoctorDetailsPage({
  params,
  searchParams,
}: Props) {
  const { slug } = await params;
  const { booking } = await searchParams;
  const resumeBooking = booking === "resume";

  let doctor;
  try {
    doctor = await doctorService.getById(slug);
  } catch (error) {
    console.error(`Error fetching doctor details for slug: ${slug}`, error);
    notFound();
  }

  if (!doctor) {
    notFound();
  }

  const physicianSchema = {
    "@context": "https://schema.org",
    "@type": "Physician",
    name: doctor.name,
    description: doctor.shortDescription || doctor.about,
    image: doctor.photo || undefined,
    url: `https://mydoctor.com.bd/doctors/${doctor.slug}`,
    medicalSpecialty: doctor.primarySpecialty,
    knowsAbout: doctor.specializations?.map((s) => s.name) ?? [],
    ...(doctor.degrees?.length > 0 && {
      hasCredential: doctor.degrees.map((d) => ({
        "@type": "EducationalOccupationalCredential",
        credentialCategory: "degree",
        name: d,
      })),
    }),
    ...(doctor.rating > 0 && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: doctor.rating,
        reviewCount: doctor.reviewCount || 1,
        bestRating: 5,
        worstRating: 1,
      },
    }),
    ...(doctor.fee > 0 && {
      priceRange: `৳${doctor.fee}`,
    }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(physicianSchema) }}
      />
      <DoctorDetailsClient doctor={doctor} resumeBooking={resumeBooking} />
    </>
  );
}
