import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Complete Your Profile | My Doctor",
  description: "Set up your health profile to get the most out of My Doctor — faster bookings, personalized care, and emergency readiness.",
  alternates: { canonical: "https://mydoctor.com.bd/onboarding" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
