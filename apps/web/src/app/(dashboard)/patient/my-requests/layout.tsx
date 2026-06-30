import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Requests | My Doctor",
  description: "View and track all your healthcare service requests.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
