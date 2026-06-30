import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ambulance Service Bangladesh | AC, ICU & Freezing Ambulance",
  description: "Book AC, ICU, CCU, freezing, and air ambulances across Bangladesh 24/7. Fast emergency ambulance service in Dhaka, Chittagong, Sylhet, and nationwide via My Doctor.",
  keywords: ["ambulance service Bangladesh", "emergency ambulance Dhaka", "ICU ambulance", "freezing ambulance", "air ambulance Bangladesh", "book ambulance online"],
  alternates: { canonical: "https://mydoctor.com.bd/ambulances" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://mydoctor.com.bd" },
      { "@type": "ListItem", position: 2, name: "Ambulances", item: "https://mydoctor.com.bd/ambulances" },
    ],
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      {children}
    </>
  );
}
