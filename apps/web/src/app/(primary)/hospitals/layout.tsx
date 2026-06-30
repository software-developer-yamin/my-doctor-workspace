import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hospitals & Clinics in Bangladesh | Find & Book",
  description: "Find top hospitals and clinics near you in Bangladesh. Browse facilities, departments, specialist doctors, and emergency services. Book appointments online via My Doctor.",
  keywords: ["hospitals Bangladesh", "best hospital Dhaka", "clinic near me Bangladesh", "hospital appointment booking", "private hospital Bangladesh", "hospital emergency Bangladesh"],
  alternates: { canonical: "https://mydoctor.com.bd/hospitals" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://mydoctor.com.bd" },
      { "@type": "ListItem", position: 2, name: "Hospitals", item: "https://mydoctor.com.bd/hospitals" },
    ],
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      {children}
    </>
  );
}
