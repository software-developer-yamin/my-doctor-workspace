import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Health Checkup Packages Bangladesh | Full Body Screening | My Doctor",
  description: "Book comprehensive health checkup packages in Bangladesh for individuals and families. Full body screening, cardiac, diabetes, cancer screening packages from certified labs. Book online via My Doctor.",
  keywords: ["health checkup package Bangladesh", "full body checkup Dhaka", "preventive health screening", "cardiac screening Bangladesh", "diabetes checkup package", "wellness package Bangladesh"],
  alternates: { canonical: "https://mydoctor.com.bd/health-checkup-services" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
