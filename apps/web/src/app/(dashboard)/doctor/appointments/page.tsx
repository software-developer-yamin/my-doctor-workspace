"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useMyAppointments, useUpdateAppointmentStatus } from "@/hooks/queries/use-doctor-dashboard";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { DoctorAppointment, AppointmentStatus } from "@/types/doctor-dashboard.type";
import { useState } from "react";
import { format } from "date-fns";
import { CONSTANT } from "@/config/constant";
import { Calendar03Icon, Clock01Icon, UserIcon, HospitalIcon, FileEditIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { appointmentStatus } from "@/lib/tokens";

const STATUS_TABS: { value: AppointmentStatus | "All"; label: string }[] = [
  { value: "All", label: "All" },
  { value: "Pending", label: "Pending" },
  { value: "In Progress", label: "In Progress" },
  { value: "Completed", label: "Completed" },
  { value: "Cancelled", label: "Cancelled" },
];

export default function DoctorAppointmentsPage() {
  const { user } = useSelector((state: RootState) => state.auth);
  const today = new Date().toISOString().split("T")[0];
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus | "All">("All");
  const [selectedAppointment, setSelectedAppointment] = useState<DoctorAppointment | null>(null);

  const { data, isLoading, isError } = useMyAppointments(
    user?.id ?? "",
    { appointmentDate: today }
  );
  const { mutate: updateStatus, isPending: isUpdating } = useUpdateAppointmentStatus();

  const appointments: DoctorAppointment[] = data?.data ?? [];
  const filtered = statusFilter === "All"
    ? appointments
    : appointments.filter((a) => a.status === statusFilter);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-foreground text-2xl font-bold tracking-tight">Today's Appointments</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          {format(new Date(), "EEEE, dd MMMM yyyy")} · {appointments.length} total
        </p>
      </div>

      <Tabs value={statusFilter} onValueChange={(v) => setStatusFilter(v as AppointmentStatus | "All")}>
        <TabsList className="flex-wrap h-auto gap-1">
          {STATUS_TABS.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value} className="text-xs font-semibold">
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {isLoading && (
        <div className="grid gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-card border-border h-20 animate-pulse rounded-xl border" />
          ))}
        </div>
      )}

      {isError && (
        <div className="bg-destructive/10 border-destructive/20 rounded-xl border p-6 text-center">
          <p className="text-destructive text-sm font-medium">Failed to load appointments. Please refresh.</p>
        </div>
      )}

      {!isLoading && !isError && filtered.length === 0 && (
        <div className="bg-muted/30 rounded-xl border border-dashed p-12 text-center">
          <HugeiconsIcon icon={Calendar03Icon} className="text-muted-foreground mx-auto mb-3 h-10 w-10" />
          <p className="text-muted-foreground font-medium">No appointments for today</p>
        </div>
      )}

      {!isLoading && !isError && filtered.length > 0 && (
        <div className="grid gap-3">
          {filtered.map((appt) => (
            <button
              key={appt._id}
              onClick={() => setSelectedAppointment(appt)}
              className="bg-card border-border hover:border-primary/30 hover:shadow-sm w-full rounded-xl border p-4 text-left transition-all duration-200"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold">
                    {appt.serialNo ?? "—"}
                  </div>
                  <div>
                    <p className="text-foreground font-semibold">{appt.customer?.name}</p>
                    <p className="text-muted-foreground text-xs mt-0.5">{appt.appointmentType}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <Badge variant="outline" className={appointmentStatus[appt.status].badge}>
                    {appt.status}
                  </Badge>
                  <span className="text-muted-foreground text-xs">
                    {appt.selectedSchedule?.startTime}
                  </span>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <HugeiconsIcon icon={HospitalIcon} className="h-3.5 w-3.5" />
                  {appt.hospital?.name}
                </span>
                <span className="flex items-center gap-1">
                  <HugeiconsIcon icon={Clock01Icon} className="h-3.5 w-3.5" />
                  {appt.consultationType}
                </span>
                <span className="flex items-center gap-1 font-medium text-foreground/80">
                  {CONSTANT.CURRENCY.SYMBOL}{appt.totalFee}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Appointment Detail Sheet */}
      <Sheet open={!!selectedAppointment} onOpenChange={() => setSelectedAppointment(null)}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          {selectedAppointment && (
            <>
              <SheetHeader className="mb-6">
                <SheetTitle>Appointment Details</SheetTitle>
              </SheetHeader>
              <div className="space-y-5">
                <div className="bg-muted/30 rounded-xl p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
                      <HugeiconsIcon icon={UserIcon} className="text-primary h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-bold">{selectedAppointment.customer?.name}</p>
                      <p className="text-muted-foreground text-sm">{selectedAppointment.customer?.phone}</p>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {[
                    { label: "Date", value: format(new Date(selectedAppointment.appointmentDate), "dd MMM yyyy") },
                    { label: "Time", value: selectedAppointment.selectedSchedule?.startTime },
                    { label: "Serial No.", value: `#${selectedAppointment.serialNo ?? "—"}` },
                    { label: "Type", value: selectedAppointment.appointmentType },
                    { label: "Consultation", value: selectedAppointment.consultationType },
                    { label: "Status", value: selectedAppointment.status },
                    { label: "Hospital", value: selectedAppointment.hospital?.name },
                    { label: "Fee", value: `${CONSTANT.CURRENCY.SYMBOL}${selectedAppointment.totalFee}` },
                    { label: "Payment", value: selectedAppointment.paymentStatus },
                    ...(selectedAppointment.appointmentType === "Reference" && (selectedAppointment as any).referralSource
                      ? [{ label: "Referred by", value: (selectedAppointment as any).referralSource }]
                      : []),
                  ].map(({ label, value }) => (
                    <div key={label} className="bg-muted/20 rounded-lg p-3">
                      <p className="text-muted-foreground text-xs font-medium">{label}</p>
                      <p className="text-foreground font-semibold mt-0.5">{value}</p>
                    </div>
                  ))}
                </div>
                {selectedAppointment.status === "Pending" && (
                  <Button
                    variant="default"
                    className="w-full"
                    disabled={isUpdating}
                    onClick={() => {
                      updateStatus({ id: selectedAppointment._id, status: "In Progress" }, {
                        onSuccess: () => setSelectedAppointment(null),
                      });
                    }}
                  >
                    {isUpdating ? "Updating..." : "Start Appointment"}
                  </Button>
                )}
                {selectedAppointment.status === "In Progress" && (
                  <Button
                    variant="default"
                    className="w-full"
                    disabled={isUpdating}
                    onClick={() => {
                      updateStatus({ id: selectedAppointment._id, status: "Completed" }, {
                        onSuccess: () => setSelectedAppointment(null),
                      });
                    }}
                  >
                    {isUpdating ? "Updating..." : "Mark as Completed"}
                  </Button>
                )}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
