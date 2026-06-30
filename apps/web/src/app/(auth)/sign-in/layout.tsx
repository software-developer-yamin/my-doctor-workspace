import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In | My Doctor",
  description: "Log in to your My Doctor account to book appointments, track orders, and manage your health records.",
  alternates: { canonical: "https://mydoctor.com.bd/sign-in" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
