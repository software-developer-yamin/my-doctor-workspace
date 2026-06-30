import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Doctor Bookings | My Doctor",
  description: "Manage your patient bookings and appointment requests as a doctor on My Doctor.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
