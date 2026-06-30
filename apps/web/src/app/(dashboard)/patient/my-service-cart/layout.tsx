import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Service Cart | My Doctor",
  description: "Review and confirm your selected healthcare services.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
