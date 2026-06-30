import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Search | My Doctor",
  description: "Search for doctors, hospitals, diagnostic tests, and healthcare services across Bangladesh on My Doctor.",
  alternates: { canonical: "https://mydoctor.com.bd/search" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
