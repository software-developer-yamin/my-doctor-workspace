import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset Password | My Doctor",
  description: "Securely reset your My Doctor account password using your registered phone number.",
  alternates: { canonical: "https://mydoctor.com.bd/forgot-password" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
