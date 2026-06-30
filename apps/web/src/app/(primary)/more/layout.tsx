import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "More Services | My Doctor",
  description: "Explore all healthcare services available on My Doctor — ambulances, guides, and more.",
  alternates: { canonical: "https://mydoctor.com.bd/more" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
