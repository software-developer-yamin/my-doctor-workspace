import type { Metadata } from "next";
import { DiagnosticBookingsList } from "@/components/app-patient/diagnostic-bookings-page/diagnostic-bookings-list";

export const metadata: Metadata = {
  title: "Diagnostic Bookings",
  description: "Track your lab test bookings and diagnostic reports.",
};

export default function DiagnosticBookingsPage() {
  return (
    <div className="w-full space-y-8 sm:space-y-10">
      <div className="flex flex-col gap-1 sm:gap-2">
        <h1 className="text-foreground text-2xl sm:text-3xl font-bold tracking-tight">
          My Diagnostic Tests
        </h1>
        <p className="text-muted-foreground text-body-sm sm:text-sm font-semibold">
          Track your lab test bookings and reports.
        </p>
      </div>

      <DiagnosticBookingsList />
    </div>
  );
}
