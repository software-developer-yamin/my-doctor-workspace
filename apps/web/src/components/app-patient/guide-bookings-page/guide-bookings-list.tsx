"use client";

import { BookingActions } from "@/components/app-patient/shared/booking-actions";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useCancelGuideBooking,
  useMyGuideBookings,
} from "@/hooks/queries/use-guide";
import {
  Calendar01Icon,
  Hospital01Icon,
  Location01Icon,
  UserIcon,
  Book02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

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

function BookingCard({ booking }: { booking: any }) {
  const hospitalName = booking.hospitalName || "Hospital";
  const district = booking.bdLocation?.district || "";
  const date = booking.date || "-";
  const cancelMutation = useCancelGuideBooking();

  return (
    <Card className="bg-card border-border/50 rounded-md border p-4 shadow-xs transition-all duration-300">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-8">
        {/* Left: Icon + Hospital */}
        <div className="flex items-center gap-3.5 lg:w-1/3">
          <div className="bg-primary/10 text-primary flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl">
            <HugeiconsIcon icon={Book02Icon} size={28} />
          </div>
          <div className="min-w-0">
            <h3 className="text-foreground truncate text-sm font-bold">
              {hospitalName}
            </h3>
            {district && (
              <p className="text-muted-foreground mt-1 flex items-center gap-1.5 truncate text-xs font-semibold">
                <HugeiconsIcon icon={Location01Icon} size={12} />
                {district}
              </p>
            )}
          </div>
        </div>

        {/* Middle: Details */}
        <div className="lg:border-border/40 grid grow grid-cols-1 gap-x-5 gap-y-4 sm:grid-cols-2 lg:grid-cols-4 lg:border-l lg:pl-8">
          <InfoField icon={Calendar01Icon} label="Requested On" value={date} />
          <InfoField icon={UserIcon} label="Patient Name" value={booking.patientName || "-"} />
          <InfoField icon={UserIcon} label="Patient Age" value={booking.age ? `${booking.age} years` : "-"} />
          <InfoField
            icon={Hospital01Icon}
            label="Description"
            value={booking.description}
          />
        </div>

        {/* Right: Status + Actions */}
        <div className="lg:border-border/40 flex shrink-0 items-center justify-between gap-3 border-t pt-4 sm:justify-start lg:border-t-0 lg:border-l lg:pl-8 lg:pt-0">
          <StatusBadge status={booking.status} />
          <div className="flex items-center gap-2">
            <BookingActions
              status={booking.status}
              cancellableStatuses={["Pending", "Confirmed"]}
              isCancelling={cancelMutation.isPending}
              onCancel={() => cancelMutation.mutate(booking.id)}
              cancelConfirmTitle="Cancel hospital guide request?"
              cancelConfirmDescription="This will cancel your personal hospital guide request."
            />
          </div>
        </div>
      </div>
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

export function GuideBookingsList() {
  const { data: bookings = [], isLoading } = useMyGuideBookings();

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
    ["Pending", "Confirmed"].includes(b.status),
  );
  const completed = bookings.filter((b: any) => b.status === "Completed");
  const cancelled = bookings.filter((b: any) => b.status === "Cancelled");

  return (
    <Tabs defaultValue="upcoming" className="w-full space-y-6">
      <div className="w-full overflow-x-auto pb-1 no-scrollbar">
        <TabsList className="bg-muted/50 border border-border/50 h-12 sm:h-14 flex w-full justify-start gap-1 rounded-xl p-1 sm:gap-2">
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
      </div>
      <TabsContent value="upcoming">
        {upcoming.length === 0 ? (
          <EmptyState message="No active hospital guide requests." />
        ) : (
          <div className="flex flex-col gap-4">
            {upcoming.map((b: any) => (
              <BookingCard key={b.id} booking={b} />
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="completed">
        {completed.length === 0 ? (
          <EmptyState message="No completed hospital guide requests." />
        ) : (
          <div className="flex flex-col gap-4">
            {completed.map((b: any) => (
              <BookingCard key={b.id} booking={b} />
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="cancelled">
        {cancelled.length === 0 ? (
          <EmptyState message="No cancelled hospital guide requests." />
        ) : (
          <div className="flex flex-col gap-4">
            {cancelled.map((b: any) => (
              <BookingCard key={b.id} booking={b} />
            ))}
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
}
