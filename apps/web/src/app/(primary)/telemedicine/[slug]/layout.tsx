import type { Metadata } from "next";
import { TELEMEDICINE_SPECIALIZATIONS } from "@/data/telemedicine.data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const spec = TELEMEDICINE_SPECIALIZATIONS.find((s) => s.id === slug || s.slug === slug);
  const name = spec?.name ?? "Specialist";
  return {
    title: `${name} Telemedicine Consultation Bangladesh`,
    description: `Consult experienced ${name.toLowerCase()} doctors online via video or chat through My Doctor's telemedicine service. Safe, fast, and convenient consultations from home.`,
    alternates: { canonical: `https://mydoctor.com.bd/telemedicine/${slug}` },
    openGraph: {
      title: `${name} Telemedicine | My Doctor`,
      description: `Online ${name.toLowerCase()} consultation — video or chat, available 24/7.`,
      url: `https://mydoctor.com.bd/telemedicine/${slug}`,
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
