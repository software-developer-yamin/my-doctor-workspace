import type { Metadata } from "next";
import { AppointmentTabs } from "@/components/app-patient/appointments-page/appointment-tabs";

export const metadata: Metadata = {
  title: "My Appointments",
  description: "View and manage your upcoming and past doctor appointments.",
};

export default function AppointmentsPage() {
  return (
    <div className="w-full space-y-8 sm:space-y-10">
      <div className="flex flex-col gap-1 sm:gap-2">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          My Appointments
        </h1>
        <p className="text-muted-foreground text-body-sm sm:text-sm font-semibold">
          View and manage your upcoming and past medical consultations.
        </p>
      </div>

      <AppointmentTabs />
    </div>
  );
}
