import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home Healthcare & Domiciliary Services Bangladesh | My Doctor",
  description: "Professional home healthcare services in Bangladesh — wound care, IV therapy, physiotherapy, nursing care, and medical assistance delivered to your doorstep. Book via My Doctor.",
  keywords: ["domiciliary services Bangladesh", "home healthcare Bangladesh", "home nursing care Dhaka", "wound care at home", "IV therapy home", "physiotherapy home service"],
  alternates: { canonical: "https://mydoctor.com.bd/domiciliary-services" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
