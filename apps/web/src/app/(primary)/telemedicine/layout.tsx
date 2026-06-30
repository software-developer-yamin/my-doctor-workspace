import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Telemedicine & Online Doctor Consultation Bangladesh",
  description: "Consult specialist doctors online via video or chat from home. Affordable, safe, and convenient telemedicine consultations available 24/7 across Bangladesh via My Doctor.",
  keywords: ["telemedicine Bangladesh", "online doctor consultation Bangladesh", "video doctor consultation Dhaka", "chat with doctor online", "virtual consultation Bangladesh", "online medical advice"],
  alternates: { canonical: "https://mydoctor.com.bd/telemedicine" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://mydoctor.com.bd" },
      { "@type": "ListItem", position: 2, name: "Telemedicine", item: "https://mydoctor.com.bd/telemedicine" },
    ],
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      {children}
    </>
  );
}
