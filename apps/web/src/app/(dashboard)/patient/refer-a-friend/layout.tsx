import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refer a Friend | My Doctor",
  description: "Invite friends to My Doctor and earn referral rewards.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
