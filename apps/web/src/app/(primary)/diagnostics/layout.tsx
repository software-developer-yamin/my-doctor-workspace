import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Diagnostic Tests & Lab Bookings Bangladesh",
  description: "Book blood tests, X-ray, MRI, CT scan, ECG, and other diagnostic tests at accredited labs across Bangladesh. Home sample collection available. Results delivered fast via My Doctor.",
  keywords: ["diagnostic tests Bangladesh", "blood test booking Dhaka", "MRI scan Bangladesh", "lab test home collection", "CT scan booking", "ECG test Bangladesh"],
  alternates: { canonical: "https://mydoctor.com.bd/diagnostics" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://mydoctor.com.bd" },
      { "@type": "ListItem", position: 2, name: "Diagnostics", item: "https://mydoctor.com.bd/diagnostics" },
    ],
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      {children}
    </>
  );
}
