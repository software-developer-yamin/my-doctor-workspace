"use client";

import { BookingActions } from "@/components/app-patient/shared/booking-actions";
import { RescheduleDialog } from "@/components/app-patient/shared/reschedule-dialog";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useCancelDiagnosticBooking,
  useMyDiagnosticBookings,
  useRescheduleDiagnosticBooking,
} from "@/hooks/queries/use-diagnostics";
import { DiagnosticBooking } from "@/types/diagnostic.type";
import {
  Calendar01Icon,
  Call02Icon,
  Hospital01Icon,
  Location01Icon,
  Money01Icon,
  TestTube01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { format, isValid, parseISO } from "date-fns";
import { useState } from "react";

const StatusBadge = ({ status }: { status: string }) => {
  const getStatusColor = (s: string) => {
    switch (s?.toLowerCase()) {
      case "pending":
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
      case "confirmed":
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
      case "in progress":
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20";
      case "completed":
        return "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20";
      case "cancelled":
        return "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20";
      default:
        return "bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20";
    }
  };
  return (
    <Badge
      className={`pointer-events-none rounded-xl border px-3 py-1 text-micro font-bold whitespace-nowrap shadow-none ${getStatusColor(status)}`}
    >
      {status || "Pending"}
    </Badge>
  );
};

function BookingCard({ booking }: { booking: DiagnosticBooking }) {
  const testName =
    typeof booking.test === "object" ? booking.test?.name : "Diagnostic Test";
  const labName =
    typeof booking.lab === "object" ? booking.lab?.name : "Lab";
  const parsedDateTime = booking.preferred_date_time
    ? parseISO(booking.preferred_date_time)
    : null;
  const preferredDateTime = (parsedDateTime && isValid(parsedDateTime))
    ? format(parsedDateTime, "EEE, dd MMM • hh:mm a")
    : "-";
  const [rescheduleOpen, setRescheduleOpen] = useState(false);
  const cancelMutation = useCancelDiagnosticBooking();
  const rescheduleMutation = useRescheduleDiagnosticBooking();

  return (
    <Card className="bg-card border-border/50 rounded-md border p-4 shadow-xs transition-all duration-300">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-8">
        {/* Left: Icon + Test */}
        <div className="flex items-center gap-4 lg:w-1/4">
          <div className="bg-primary/10 text-primary flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl">
            <HugeiconsIcon icon={TestTube01Icon} size={28} />
          </div>
          <div className="min-w-0">
            <h3 className="text-foreground truncate text-sm font-bold">
              {testName}
            </h3>
            <p className="text-muted-foreground mt-1 truncate text-xs font-semibold">
              {labName}
            </p>
          </div>
        </div>

        {/* Middle: Details */}
        <div className="lg:border-border/40 grid grow grid-cols-1 gap-x-5 gap-y-4 sm:grid-cols-2 lg:grid-cols-4 lg:border-l lg:pl-8">
          <InfoField icon={Calendar01Icon} label="Preferred" value={preferredDateTime} />
          <InfoField icon={Location01Icon} label="Address" value={booking.address} />
          <InfoField icon={Call02Icon} label="Phone" value={booking.phone} />
          <InfoField
            icon={Money01Icon}
            label="Price"
            value={booking.price ? `৳ ${booking.price}` : "-"}
          />
        </div>

        {/* Right: Status + Actions */}
        <div className="lg:border-border/40 flex shrink-0 items-center justify-between gap-3 border-t pt-4 sm:justify-start lg:border-t-0 lg:border-l lg:pl-8 lg:pt-0">
          <StatusBadge status={booking.status} />
          <div className="flex items-center gap-2">
            <BookingActions
              status={booking.status}
              isCancelling={cancelMutation.isPending}
              onCancel={() => cancelMutation.mutate(booking._id)}
              onReschedule={() => setRescheduleOpen(true)}
              cancelConfirmTitle="Cancel diagnostic test booking?"
              cancelConfirmDescription="This will cancel your lab test booking. You will need to book again if you change your mind."
            />
          </div>
        </div>
      </div>

      <RescheduleDialog
        open={rescheduleOpen}
        onOpenChange={setRescheduleOpen}
        title="Reschedule diagnostic test"
        description="Pick a new preferred date and time for your lab test."
        initialDate={booking.preferred_date_time}
        isSubmitting={rescheduleMutation.isPending}
        onConfirm={(iso) =>
          rescheduleMutation.mutate(
            { id: booking._id, preferred_date_time: iso },
            { onSuccess: () => setRescheduleOpen(false) },
          )
        }
      />
    </Card>
  );
}

function InfoField({
  icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value?: string;
}) {
  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <div className="text-foreground/60 flex items-center gap-1.5">
        <HugeiconsIcon icon={icon} size={12} />
        <span className="text-micro font-bold tracking-wider uppercase leading-none">
          {label}
        </span>
      </div>
      <span className="text-foreground line-clamp-2 text-sm font-semibold sm:truncate">
        {value || "-"}
      </span>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="border-muted bg-muted/5 rounded-2xl border-2 border-dashed py-24 text-center">
      <p className="text-muted-foreground font-semibold">{message}</p>
    </div>
  );
}

export function DiagnosticBookingsList() {
  const { data: bookings = [], isLoading } = useMyDiagnosticBookings();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-28 w-full rounded-2xl" />
        ))}
      </div>
    );
  }

  const upcoming = bookings.filter((b: any) =>
    ["Pending", "Confirmed", "In Progress"].includes(b.status),
  );
  const completed = bookings.filter((b: any) => b.status === "Completed");
  const cancelled = bookings.filter((b: any) => b.status === "Cancelled");

  return (
    <Tabs defaultValue="upcoming" className="w-full space-y-6">
      <TabsList className="bg-muted/50 border border-border/50 h-12 sm:h-14 w-full justify-start gap-1 sm:gap-2 rounded-xl p-1 sm:p-1.5 overflow-x-auto overflow-y-hidden no-scrollbar">
        <TabsTrigger
          value="upcoming"
          className="data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm h-full flex-1 rounded-lg px-4 sm:px-8 text-2xs sm:text-xs font-bold transition-all whitespace-nowrap text-muted-foreground/70 hover:text-foreground"
        >
          Upcoming ({upcoming.length})
        </TabsTrigger>
        <TabsTrigger
          value="completed"
          className="data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm h-full flex-1 rounded-lg px-4 sm:px-8 text-2xs sm:text-xs font-bold transition-all whitespace-nowrap text-muted-foreground/70 hover:text-foreground"
        >
          Completed ({completed.length})
        </TabsTrigger>
        <TabsTrigger
          value="cancelled"
          className="data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm h-full flex-1 rounded-lg px-4 sm:px-8 text-2xs sm:text-xs font-bold transition-all whitespace-nowrap text-muted-foreground/70 hover:text-foreground"
        >
          Cancelled ({cancelled.length})
        </TabsTrigger>
      </TabsList>

      <TabsContent value="upcoming">
        {upcoming.length === 0 ? (
          <EmptyState message="No upcoming diagnostic bookings." />
        ) : (
          <div className="flex flex-col gap-4 sm:gap-6">
            {upcoming.map((b: any) => (
              <BookingCard key={b._id} booking={b} />
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="completed">
        {completed.length === 0 ? (
          <EmptyState message="No completed diagnostic bookings." />
        ) : (
          <div className="flex flex-col gap-4">
            {completed.map((b: any) => (
              <BookingCard key={b._id} booking={b} />
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="cancelled">
        {cancelled.length === 0 ? (
          <EmptyState message="No cancelled diagnostic bookings." />
        ) : (
          <div className="flex flex-col gap-4">
            {cancelled.map((b: any) => (
              <BookingCard key={b._id} booking={b} />
            ))}
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
}
