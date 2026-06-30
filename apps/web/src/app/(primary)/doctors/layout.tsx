import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Find & Book Specialist Doctors in Bangladesh",
  description: "Search and book appointments with 1000+ verified specialist doctors in Bangladesh. Filter by specialty, location, availability, and consultation fee. Book online instantly via My Doctor.",
  keywords: ["specialist doctors Bangladesh", "book doctor appointment Dhaka", "find doctor online Bangladesh", "cardiologist Bangladesh", "dermatologist Dhaka", "gynecologist Bangladesh"],
  alternates: { canonical: "https://mydoctor.com.bd/doctors" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://mydoctor.com.bd" },
      { "@type": "ListItem", position: 2, name: "Doctors", item: "https://mydoctor.com.bd/doctors" },
    ],
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      {children}
    </>
  );
}
