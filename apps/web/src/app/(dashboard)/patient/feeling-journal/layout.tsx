import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Feeling Journal | My Doctor",
  description: "Log and track your daily health feelings and symptoms.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
