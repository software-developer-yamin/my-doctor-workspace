import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shopping Cart | My Doctor",
  description: "Review and manage your medical products and orders.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
