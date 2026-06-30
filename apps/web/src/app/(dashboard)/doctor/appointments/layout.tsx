import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Doctor Appointments | My Doctor",
  description: "View and manage your patient appointments, schedules, and consultation requests on My Doctor.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
