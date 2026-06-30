import { PatientSidebar } from "@/components/app-dashboard/patient-sidebar";
import React from "react";

export default function PatientDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full w-full overflow-hidden">
      <PatientSidebar />
      <div className="flex-1 overflow-y-auto bg-background/50">
        <div className="container mx-auto p-4 sm:p-6 lg:p-10">
          {children}
        </div>
      </div>
    </div>
  );
}
