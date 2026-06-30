import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile Settings | My Doctor",
  description: "Update your personal information, contact details, and account preferences.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
