import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home Nursing Services Bangladesh | Hire Qualified Nurses",
  description: "Hire verified, qualified nurses for home care, post-operative recovery, ICU-trained nursing, elderly care, and patient assistance across Bangladesh. Book via My Doctor.",
  keywords: ["home nursing Bangladesh", "hire nurse Dhaka", "post-operative nursing care", "elderly care nurse Bangladesh", "ICU nurse home care", "nursing service Bangladesh"],
  alternates: { canonical: "https://mydoctor.com.bd/nurses" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://mydoctor.com.bd" },
      { "@type": "ListItem", position: 2, name: "Nurses", item: "https://mydoctor.com.bd/nurses" },
    ],
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      {children}
    </>
  );
}
