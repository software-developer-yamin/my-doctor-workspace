import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Appointment Tracker | My Doctor",
  description: "Track your live appointment queue status and estimated wait time at hospitals and clinics through My Doctor.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
