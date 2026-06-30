import { Header } from "@/components/common/header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import React from "react";

export default function PrimaryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="relative flex min-h-screen w-full flex-col">
        <Header layout="dashboard" />
        <SidebarInset className="flex-1 overflow-x-hidden">{children}</SidebarInset>
      </div>
    </SidebarProvider>
  );
}
