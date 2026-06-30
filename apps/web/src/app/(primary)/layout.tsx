import { Footer } from "@/components/common/footer";
import { Header } from "@/components/common/header";
import { MobileBottomNav } from "@/components/common/mobile-bottom-nav";
import React from "react";

export default function PrimaryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[9999] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-white focus:shadow-lg focus:outline-none"
      >
        Skip to main content
      </a>
      <Header />

      <main id="main-content" className="flex-1 pb-16 lg:pb-0">{children}</main>

      <Footer className="hidden lg:block" />
      <MobileBottomNav />
    </div>
  );
}
