import { HospitalDetailsClient } from "@/components/app-primary/hospital-details-page/hospital-details-client";
import { hospitalService } from "@/services/hospital.service";
import { Metadata } from "next";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const hospital = await hospitalService.getBySlug(slug);
    if (!hospital) return { title: "Hospital Not Found" };

    const description =
      hospital.description ||
      `Find doctors, specialities, and contact information for ${hospital.name}. Book appointments online via My Doctor.`;

    return {
      title: `${hospital.name} | Hospital in Bangladesh`,
      description,
      alternates: {
        canonical: `https://mydoctor.com.bd/hospitals/${slug}`,
      },
      openGraph: {
        title: `${hospital.name} | My Doctor`,
        description,
        url: `https://mydoctor.com.bd/hospitals/${slug}`,
        images: hospital.thumbnail
          ? [{ url: hospital.thumbnail, alt: hospital.name }]
          : [],
      },
    };
  } catch {
    return { title: "Hospital Details" };
  }
}

export default async function HospitalDetailsPage({ params }: Props) {
  const { slug } = await params;

  let hospital;
  try {
    hospital = await hospitalService.getBySlug(slug);
  } catch {
    // render page without JSON-LD if fetch fails
  }

  const hospitalSchema = hospital
    ? {
        "@context": "https://schema.org",
        "@type": "Hospital",
        name: hospital.name,
        description: hospital.description || undefined,
        url: `https://mydoctor.com.bd/hospitals/${slug}`,
        image: hospital.thumbnail || undefined,
        address: {
          "@type": "PostalAddress",
          streetAddress: hospital.address,
          addressCountry: "BD",
        },
        telephone: hospital.contact?.phones?.[0] || undefined,
        email: hospital.contact?.emails?.[0] || undefined,
        ...(hospital.coordinates?.lat && {
          geo: {
            "@type": "GeoCoordinates",
            latitude: hospital.coordinates.lat,
            longitude: hospital.coordinates.lng,
          },
        }),
        ...(hospital.rating > 0 && {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: hospital.rating,
            reviewCount: hospital.reviewCount || 1,
            bestRating: 5,
            worstRating: 1,
          },
        }),
        ...(hospital.isEmergency && {
          availableService: {
            "@type": "MedicalTherapy",
            name: "Emergency Care",
          },
        }),
      }
    : null;

  return (
    <>
      {hospitalSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(hospitalSchema) }}
        />
      )}
      <HospitalDetailsClient slug={slug} />
    </>
  );
}
