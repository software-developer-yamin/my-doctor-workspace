import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Doctor Sign In | My Doctor",
  description: "Sign in to the My Doctor doctor portal to manage appointments, view patient bookings, and write prescriptions.",
  alternates: { canonical: "https://mydoctor.com.bd/doctor-sign-in" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
