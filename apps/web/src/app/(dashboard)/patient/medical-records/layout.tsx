import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Medical Records | My Doctor",
  description: "Store and manage your personal medical records, prescriptions, and reports.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
