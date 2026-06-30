"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Calendar01Icon,
  Clock01Icon,
  Hospital01Icon,
  CameraVideoIcon,
  Queue01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { AppointmentRecord } from "@/services/appointment.service";
import { format, isValid, parseISO } from "date-fns";
import { getImageUrl } from "@/lib/utils";
import Link from "next/link";
import { BookingActions } from "@/components/app-patient/shared/booking-actions";
import { AppointmentRescheduleDialog } from "@/components/app-patient/appointments-page/appointment-reschedule-dialog";
import {
  useCancelAppointment,
  useRescheduleAppointment,
} from "@/hooks/queries/use-my-bookings";
import { useState } from "react";

const StatusBadge = ({ status }: { status: string }) => {
  const getStatusColor = (s: string) => {
    switch (s.toLowerCase()) {
      case "pending": return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
      case "confirmed": return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
      case "in progress": return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20";
      case "completed": return "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20";
      case "cancelled": return "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20";
      default: return "bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20";
    }
  };
  return (
    <Badge className={`rounded-xl px-3 py-1 text-micro font-bold border shadow-none pointer-events-none whitespace-nowrap ${getStatusColor(status)}`}>
      {status}
    </Badge>
  );
};

const PaymentBadge = ({ status }: { status: string }) => {
  const config: Record<string, { color: string; label: string }> = {
    paid:    { color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20", label: "Paid" },
    pending: { color: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",         label: "Unpaid" },
    failed:  { color: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",                 label: "Failed" },
  };
  const { color, label } = config[status.toLowerCase()] ?? { color: "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20", label: status };
  return (
    <Badge className={`rounded-xl px-3 py-1 text-micro font-bold border shadow-none pointer-events-none whitespace-nowrap ${color}`}>
      {label}
    </Badge>
  );
};


interface AppointmentCardProps {
  appointment: AppointmentRecord;
}

export function AppointmentCard({ appointment }: AppointmentCardProps) {
  const doctorObj = typeof appointment.doctor === "object" ? appointment.doctor : null;
  const doctorName = doctorObj?.name || "Doctor";
  const doctorPhoto = doctorObj?.photo || "";
  const doctorSpecialty = doctorObj?.short_description || doctorObj?.primarySpecialty || "";
  const doctorDegrees = doctorObj?.degrees || "";
  const doctorId = doctorObj?._id || (typeof appointment.doctor === "string" ? appointment.doctor : "");

  const hospitalObj = typeof appointment.hospital === "object" ? appointment.hospital : null;
  const hospitalName = hospitalObj?.name || "Clinic";
  const hospitalId = hospitalObj?._id || (typeof appointment.hospital === "string" ? appointment.hospital : "");

  const [rescheduleOpen, setRescheduleOpen] = useState(false);
  const cancelMutation = useCancelAppointment();
  const rescheduleMutation = useRescheduleAppointment();

  const parsedDate = appointment.appointmentDate ? parseISO(appointment.appointmentDate) : null;
  const appointmentDate = (parsedDate && isValid(parsedDate))
    ? format(parsedDate, "EEEE, dd MMM yyyy")
    : "-";



  return (
    <Card className="bg-card group relative overflow-hidden transition-all duration-300 border shadow-xs rounded-md">
      <div className="p-4">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-8">

          {/* Section 1: Doctor Info (Left) */}
          <div className="flex items-center gap-4 lg:w-1/4 min-w-0">
            <Avatar className="h-14 w-14 sm:h-16 sm:w-16 rounded-2xl! after:rounded-2xl! border-2 border-background shadow-md ring-1 ring-border/50 shrink-0 transition-transform group- overflow-hidden">
              <AvatarImage src={getImageUrl(doctorPhoto)} className="rounded-2xl! object-cover" />
              <AvatarFallback className="rounded-2xl! bg-muted p-1">
                <img src="/images/services/doctor-icon.png" alt={doctorName} className="w-full h-full object-contain" />
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col min-w-0">
              <h3 className="text-foreground text-sm sm:text-base font-bold truncate leading-tight mb-1">
                {doctorName}
              </h3>
              {doctorSpecialty && (
                <p className="text-muted-foreground text-micro sm:text-2xs font-semibold truncate mb-1.5 leading-tight max-w-full">
                  {doctorSpecialty}
                  {doctorDegrees && <span className="ml-1 opacity-70 border-l border-border/50 pl-1 hidden sm:inline">{doctorDegrees}</span>}
                </p>
              )}
            </div>
          </div>

          {/* Section 2: Details Grid (Middle) - Formalized with Status and Payment */}
          <div className="grid grid-cols-1 gap-x-5 gap-y-4 sm:grid-cols-2 lg:grid-cols-5 grow lg:border-l lg:border-border/40 lg:pl-8 min-w-0">
            {/* Serial No */}
            {appointment.serialNo != null && (
              <div className="flex flex-col gap-1.5 min-w-0">
                <div className="flex items-center gap-1.5 text-foreground/60">
                  <span className="text-micro font-bold tracking-wider uppercase leading-none">Serial</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-primary text-lg font-black leading-tight">
                    #{appointment.serialNo}
                  </span>
                  {(appointment.status === "Pending" || appointment.status === "Confirmed") && (
                    <Link href={`/tracker/${appointment._id}`}>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-6 px-2 rounded-lg text-2xs font-bold gap-1 border-primary/30 text-primary hover:bg-primary/5"
                      >
                        <HugeiconsIcon icon={Queue01Icon} size={10} />
                        Track
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            )}
            {/* Date Container */}
            <div className="flex flex-col gap-1.5 min-w-0">
              <div className="flex items-center gap-1.5 text-foreground/60">
                <HugeiconsIcon icon={Calendar01Icon} size={12} />
                <span className="text-micro font-bold tracking-wider uppercase leading-none">Date</span>
              </div>
              <span className="text-foreground text-sm font-bold truncate sm:truncate leading-tight">
                {appointmentDate}
              </span>
            </div>

            {/* Time Container */}
            <div className="flex flex-col gap-1.5 min-w-0">
              <div className="flex items-center gap-1.5 text-foreground/60">
                <HugeiconsIcon icon={Clock01Icon} size={12} />
                <span className="text-micro font-bold tracking-wider uppercase leading-none">Time</span>
              </div>
              <span className="text-foreground text-sm font-bold truncate leading-tight">
                {appointment.selectedSchedule?.startTime || "N/A"}
              </span>
            </div>

            {/* Location Container */}
            <div className="flex flex-col gap-1.5 min-w-0">
              <div className="flex items-center gap-1.5 text-foreground/60">
                <HugeiconsIcon icon={appointment.consultationType === "online" ? CameraVideoIcon : Hospital01Icon} size={12} />
                <span className="text-micro font-bold tracking-wider uppercase leading-none">Location</span>
              </div>
              <div className="flex items-center gap-2 min-w-0">
                {!appointment.consultationType || appointment.consultationType === "in-person" ? (
                  <div className="flex flex-col min-w-0">
                    <span className="text-foreground text-sm font-bold line-clamp-1 sm:truncate" title={hospitalName}>
                      {hospitalName}
                    </span>
                  </div>
                ) : (
                  <span className="text-foreground text-sm font-bold">
                    Online
                  </span>
                )}
              </div>
            </div>

            {/* Type Container */}
            <div className="flex flex-col gap-1.5 min-w-0">
              <div className="flex items-center gap-1.5 text-foreground/60">
                <span className="text-micro font-bold tracking-wider uppercase leading-none">Type</span>
              </div>
              <span className="text-foreground text-sm font-bold truncate leading-tight">
                {appointment.appointmentType}
              </span>
              {appointment.appointmentType === "Reference" && (appointment as any).referralSource && (
                <span className="text-muted-foreground text-micro font-medium truncate">
                  via {(appointment as any).referralSource}
                </span>
              )}
            </div>

            {/* Status Container */}
            <div className="flex flex-col gap-1.5 min-w-0">
              <div className="flex items-center gap-1.5 text-foreground/60">
                <span className="text-micro font-bold tracking-wider uppercase leading-none">Status</span>
              </div>
              <div className="flex items-center">
                <StatusBadge status={appointment.status} />
              </div>
            </div>

            {/* Payment Container */}
            <div className="flex flex-col gap-1.5 min-w-0">
              <div className="flex items-center gap-1.5 text-foreground/60">
                <span className="text-micro font-bold tracking-wider uppercase leading-none">Payment</span>
              </div>
              <div className="flex items-center">
                <PaymentBadge status={appointment.paymentStatus || "Unpaid"} />
              </div>
            </div>
          </div>


          {/* Section 3: Actions (Right) */}
          <div className="flex items-center justify-between gap-3 border-t pt-4 sm:justify-start lg:border-t-0 lg:border-l lg:border-border/40 lg:pl-8 shrink-0 lg:pt-0">
            {appointment.status === "Confirmed" && appointment.consultationType === "online" && (
              <Button size="sm" className="h-9 rounded-xl text-2xs font-bold px-5 shadow-sm">
                Join
              </Button>
            )}

            <div className="flex items-center gap-2 ml-auto lg:ml-0">
              <BookingActions
                status={appointment.status}
                isCancelling={cancelMutation.isPending}
                onCancel={() => cancelMutation.mutate(appointment._id)}
                onReschedule={() => setRescheduleOpen(true)}
                cancelConfirmTitle="Cancel this appointment?"
                cancelConfirmDescription="This will notify the doctor's office. You will need to book again if you change your mind."
              />
            </div>

            <AppointmentRescheduleDialog
              open={rescheduleOpen}
              onOpenChange={setRescheduleOpen}
              doctorId={doctorId}
              hospitalId={hospitalId}
              isSubmitting={rescheduleMutation.isPending}
              onConfirm={({ appointmentDate, selectedSchedule }) =>
                rescheduleMutation.mutate(
                  { id: appointment._id, appointmentDate, selectedSchedule },
                  { onSuccess: () => setRescheduleOpen(false) },
                )
              }
            />
          </div>


        </div>
      </div>
    </Card>
  );
}
