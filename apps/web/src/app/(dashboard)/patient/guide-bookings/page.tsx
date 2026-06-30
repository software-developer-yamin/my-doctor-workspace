import type { Metadata } from "next";
import { GuideBookingsList } from "@/components/app-patient/guide-bookings-page/guide-bookings-list";

export const metadata: Metadata = {
  title: "Guide Bookings",
  description: "Track your personal hospital guide assistant requests.",
};

export default function GuideBookingsPage() {
  return (
    <div className="w-full space-y-8 sm:space-y-10">
      <div className="flex flex-col gap-1 sm:gap-2">
        <h1 className="text-foreground text-2xl sm:text-3xl font-bold tracking-tight">
          My Hospital Guide Bookings
        </h1>
        <p className="text-muted-foreground text-body-sm sm:text-sm font-semibold">
          Track your personal hospital guide assistant requests.
        </p>
      </div>

      <GuideBookingsList />
    </div>
  );
}
