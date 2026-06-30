import type { Metadata } from "next";
import { AmbulanceBookingsList } from "@/components/app-patient/ambulance-bookings-page/ambulance-bookings-list";

export const metadata: Metadata = {
  title: "Ambulance Bookings",
  description: "Track and manage your ambulance service requests.",
};

export default function AmbulanceBookingsPage() {
  return (
    <div className="w-full space-y-8 sm:space-y-10">
      <div className="flex flex-col gap-1 sm:gap-2">
        <h1 className="text-foreground text-2xl sm:text-3xl font-bold tracking-tight">
          My Ambulance Bookings
        </h1>
        <p className="text-muted-foreground text-body-sm sm:text-sm font-semibold">
          Track and manage all your ambulance booking requests.
        </p>
      </div>

      <AmbulanceBookingsList />
    </div>
  );
}
