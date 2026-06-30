import { DoctorSidebar } from "@/components/app-dashboard/doctor-sidebar";
import React from "react";

export default function DoctorDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full w-full overflow-hidden">
      <DoctorSidebar />
      <div className="flex-1 overflow-y-auto bg-background/50">
        <div className="container mx-auto px-4 py-5 sm:px-6 sm:py-5 lg:px-10 lg:py-6">
          {children}
        </div>
      </div>
    </div>
  );
}
