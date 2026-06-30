import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Medical Specializations in Bangladesh | Find Specialists",
  description: "Browse all medical specializations and find the right specialist doctor for your health condition in Bangladesh. Cardiology, dermatology, orthopedics, neurology, and more via My Doctor.",
  keywords: ["medical specializations Bangladesh", "cardiology specialist Dhaka", "dermatologist Bangladesh", "orthopedic doctor Bangladesh", "neurology specialist", "pediatrician Bangladesh"],
  alternates: { canonical: "https://mydoctor.com.bd/specializations" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://mydoctor.com.bd" },
      { "@type": "ListItem", position: 2, name: "Specializations", item: "https://mydoctor.com.bd/specializations" },
    ],
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      {children}
    </>
  );
}
