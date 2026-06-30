import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Account | My Doctor",
  description: "Sign up for My Doctor to book doctor appointments, diagnostic tests, ambulance services, and more. Join thousands of patients across Bangladesh.",
  alternates: { canonical: "https://mydoctor.com.bd/sign-up" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
