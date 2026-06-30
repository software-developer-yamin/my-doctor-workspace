import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Doctor Profile | My Doctor",
  description: "View and update your professional doctor profile, specializations, and availability on My Doctor.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
