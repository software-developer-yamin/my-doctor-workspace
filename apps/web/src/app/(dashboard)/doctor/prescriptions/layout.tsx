import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Write Prescription | My Doctor",
  description: "Create and manage patient prescriptions digitally through My Doctor's secure prescription system.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
