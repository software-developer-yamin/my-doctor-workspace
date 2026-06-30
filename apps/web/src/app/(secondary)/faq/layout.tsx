import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Frequently Asked Questions | My Doctor",
  description: "Find answers to common questions about My Doctor's services, appointments, payments, and healthcare platform.",
  alternates: { canonical: "https://mydoctor.com.bd/faq" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
