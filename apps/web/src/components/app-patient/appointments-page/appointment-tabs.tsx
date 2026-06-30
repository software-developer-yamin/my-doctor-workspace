"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AppointmentCard } from "./appointment-card";
import { useMyBookings } from "@/hooks/queries/use-my-bookings";
import { Skeleton } from "@/components/ui/skeleton";

export function AppointmentTabs() {
  const { data: bookingData, isLoading } = useMyBookings();
  const appointments = bookingData?.data || [];

  const upcoming = appointments.filter((a) => 
    ["Pending", "Confirmed", "In Progress"].includes(a.status)
  );
  const completed = appointments.filter((a) => a.status === "Completed");
  const cancelled = appointments.filter((a) => a.status === "Cancelled");

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-32 sm:h-40 w-full rounded-2xl" />
        ))}
      </div>
    );
  }

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

      <TabsContent value="upcoming" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        {upcoming.length === 0 ? (
          <div className="text-center py-24 border-2 border-dashed border-muted rounded-2xl bg-muted/5">
            <p className="text-muted-foreground font-medium">No upcoming appointments found.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {upcoming.map((apt) => (
              <AppointmentCard key={apt._id} appointment={apt as any} />
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="completed" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        {completed.length === 0 ? (
          <div className="text-center py-24 border-2 border-dashed border-muted rounded-2xl bg-muted/5">
            <p className="text-muted-foreground font-medium">No completed appointments found.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {completed.map((apt) => (
              <AppointmentCard key={apt._id} appointment={apt as any} />
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="cancelled" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        {cancelled.length === 0 ? (
          <div className="text-center py-24 border-2 border-dashed border-muted rounded-2xl bg-muted/5">
            <p className="text-muted-foreground font-medium">No cancelled appointments found.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {cancelled.map((apt) => (
              <AppointmentCard key={apt._id} appointment={apt as any} />
            ))}
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
}
