"use client";

import { use } from "react";
import { useQuery } from "@tanstack/react-query";
import { appointmentService } from "@/services/appointment.service";
import { useLiveQueueForDoctor } from "@/hooks/queries/use-queue";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getImageUrl } from "@/lib/utils";
import { format, parseISO, isValid } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Queue01Icon,
  Clock01Icon,
  UserIcon,
  Hospital01Icon,
  ArrowLeft01Icon,
  CheckmarkCircle01Icon,
} from "@hugeicons/core-free-icons";

export default function QueueTrackerPage({
  params,
}: {
  params: Promise<{ appointmentId: string }>;
}) {
  const { appointmentId } = use(params);

  const {
    data: appointmentRes,
    isLoading: appointmentLoading,
    isError: appointmentError,
  } = useQuery({
    queryKey: ["appointment", appointmentId],
    queryFn: () => appointmentService.getOne(appointmentId),
    enabled: !!appointmentId,
    retry: 1,
  });

  const appointment = (appointmentRes as any)?.data ?? null;

  const doctorId =
    typeof appointment?.doctor === "object"
      ? appointment.doctor._id
      : appointment?.doctor ?? "";
  const hospitalId =
    typeof appointment?.hospital === "object"
      ? appointment.hospital._id
      : appointment?.hospital ?? "";

  const { data: queues = [], isLoading: queueLoading } = useLiveQueueForDoctor(
    doctorId,
    hospitalId
  );

  const activeQueue = queues.find((q) => q.hospitalId === hospitalId && q.isActive) ?? queues[0] ?? null;

  const serialNo: number | undefined = appointment?.serialNo;
  const currentSerial = activeQueue?.currentSerial ?? 0;
  const totalSerial = activeQueue?.totalSerial ?? 0;
  const avgWait = activeQueue?.avgWaitTimeInMin ?? 15;

  const patientsAhead = serialNo != null ? Math.max(0, serialNo - currentSerial - 1) : null;
  const isBeingCalled = serialNo != null && currentSerial === serialNo;
  // Wait = visits remaining before yours (current patient + those between)
  const estimatedWaitMin =
    serialNo != null && !isBeingCalled && serialNo > currentSerial
      ? (serialNo - currentSerial) * avgWait
      : null;
  const alreadySeen = serialNo != null && currentSerial > serialNo;
  const queueEnded = activeQueue != null && !activeQueue.isActive;

  const doctorObj = typeof appointment?.doctor === "object" ? appointment.doctor : null;
  const hospitalObj = typeof appointment?.hospital === "object" ? appointment.hospital : null;

  const parsedDate = appointment?.appointmentDate
    ? parseISO(appointment.appointmentDate)
    : null;
  const appointmentDateStr =
    parsedDate && isValid(parsedDate)
      ? format(parsedDate, "EEEE, dd MMM yyyy")
      : "—";

  if (appointmentLoading) {
    return (
      <div className="min-h-screen bg-background p-4 max-w-lg mx-auto space-y-4 pt-8">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32 w-full rounded-2xl" />
        <Skeleton className="h-40 w-full rounded-2xl" />
        <Skeleton className="h-24 w-full rounded-2xl" />
      </div>
    );
  }

  if (appointmentError || !appointment) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4 p-4">
        <div className="bg-destructive/10 text-destructive flex h-14 w-14 items-center justify-center rounded-full">
          <HugeiconsIcon icon={Queue01Icon} size={24} />
        </div>
        <p className="text-sm font-semibold text-foreground">Appointment not found</p>
        <p className="text-xs text-muted-foreground">
          This appointment may not exist or you may not have access.
        </p>
        <Link href="/patient/appointments">
          <Button variant="outline" size="sm" className="rounded-xl gap-2">
            <HugeiconsIcon icon={ArrowLeft01Icon} size={14} />
            My Appointments
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-lg mx-auto p-4 space-y-5 pt-6 pb-10">
        {/* Back */}
        <Link
          href="/patient/appointments"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} size={14} />
          My Appointments
        </Link>

        {/* Page Title */}
        <div>
          <h1 className="text-xl font-bold text-foreground tracking-tight">Queue Tracker</h1>
          <p className="text-xs font-medium text-muted-foreground mt-0.5">{appointmentDateStr}</p>
        </div>

        {/* Serial Number Hero */}
        {serialNo != null && (
          <div
            className={`flex flex-col items-center gap-2 rounded-2xl border p-6 text-center transition-colors ${
              isBeingCalled
                ? "bg-emerald-500/10 border-emerald-500/30"
                : alreadySeen || queueEnded
                ? "bg-muted/30 border-border"
                : "bg-primary/10 border-primary/20"
            }`}
          >
            <span className="text-micro font-bold tracking-widest uppercase text-muted-foreground">
              Your Serial Number
            </span>
            <span
              className={`text-6xl font-black leading-none ${
                isBeingCalled
                  ? "text-emerald-500"
                  : alreadySeen || queueEnded
                  ? "text-muted-foreground"
                  : "text-primary"
              }`}
            >
              #{serialNo}
            </span>
            {isBeingCalled && (
              <Badge className="bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 mt-1 text-xs font-bold px-4 py-1 animate-pulse">
                It&apos;s Your Turn!
              </Badge>
            )}
            {alreadySeen && (
              <Badge variant="outline" className="mt-1 text-xs font-semibold gap-1.5">
                <HugeiconsIcon icon={CheckmarkCircle01Icon} size={12} />
                Completed
              </Badge>
            )}
            {queueEnded && !alreadySeen && (
              <Badge variant="outline" className="mt-1 text-xs font-semibold text-muted-foreground">
                Queue Ended
              </Badge>
            )}
          </div>
        )}

        {/* Live Queue Status */}
        <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
              <HugeiconsIcon icon={Queue01Icon} size={15} className="text-primary" />
              Live Queue
            </h2>
            {activeQueue ? (
              activeQueue.isActive ? (
                <div className="flex items-center gap-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                  <span className="text-micro font-bold text-emerald-600 dark:text-emerald-400">Live</span>
                </div>
              ) : (
                <Badge variant="outline" className="text-micro font-bold">Ended</Badge>
              )
            ) : null}
          </div>

          {queueLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-3 w-3/4" />
            </div>
          ) : !activeQueue ? (
            <p className="text-xs font-medium text-muted-foreground py-4 text-center">
              No active queue found for this appointment. The doctor may not have started the queue yet.
            </p>
          ) : (
            <div className="space-y-4">
              {/* Current vs Total */}
              <div className="flex items-end justify-between">
                <div className="flex flex-col gap-0.5">
                  <span className="text-micro font-bold uppercase tracking-wider text-muted-foreground">Now Serving</span>
                  <span className="text-3xl font-black text-foreground leading-none">
                    #{currentSerial}
                  </span>
                </div>
                <div className="flex flex-col gap-0.5 text-right">
                  <span className="text-micro font-bold uppercase tracking-wider text-muted-foreground">Total</span>
                  <span className="text-lg font-bold text-muted-foreground">{totalSerial}</span>
                </div>
              </div>

              {/* Progress */}
              <div className="space-y-1.5">
                <Progress
                  value={totalSerial > 0 ? Math.round((currentSerial / totalSerial) * 100) : 0}
                  className="h-2.5"
                />
                <p className="text-micro font-semibold text-muted-foreground">
                  {activeQueue.remainingPatients} patients remaining
                </p>
              </div>

              {/* Your Position */}
              {patientsAhead != null && !alreadySeen && !queueEnded && !isBeingCalled && (
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="flex flex-col gap-1 rounded-xl bg-muted/30 p-3">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <HugeiconsIcon icon={UserIcon} size={12} />
                      <span className="text-micro font-bold uppercase tracking-wider">Ahead of you</span>
                    </div>
                    <span className="text-xl font-black text-foreground">
                      {patientsAhead === 0 ? "You're next!" : patientsAhead}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1 rounded-xl bg-muted/30 p-3">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <HugeiconsIcon icon={Clock01Icon} size={12} />
                      <span className="text-micro font-bold uppercase tracking-wider">Est. wait</span>
                    </div>
                    <span className="text-xl font-black text-foreground">
                      {estimatedWaitMin != null
                        ? estimatedWaitMin < 60
                          ? `~${estimatedWaitMin}m`
                          : `~${Math.floor(estimatedWaitMin / 60)}h ${estimatedWaitMin % 60}m`
                        : "—"}
                    </span>
                  </div>
                </div>
              )}

              <p className="text-micro font-medium text-muted-foreground text-center pt-1">
                Auto-refreshes every 30 seconds
              </p>
            </div>
          )}
        </div>

        {/* Appointment Details */}
        <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
          <h2 className="text-sm font-bold text-foreground">Appointment Details</h2>

          {/* Doctor */}
          {doctorObj && (
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl overflow-hidden border border-border shrink-0 bg-muted">
                <Image
                  src={getImageUrl(doctorObj.photo) ?? ""}
                  alt={doctorObj.name ?? "Doctor"}
                  width={48}
                  height={48}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-foreground truncate">{doctorObj.name}</p>
                <p className="text-xs font-medium text-muted-foreground truncate">
                  {doctorObj.short_description ?? doctorObj.degrees ?? ""}
                </p>
              </div>
            </div>
          )}

          {/* Hospital */}
          {hospitalObj && (
            <div className="flex items-center gap-3 pt-1 border-t border-border/40">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted/40 text-muted-foreground">
                <HugeiconsIcon icon={Hospital01Icon} size={16} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-foreground truncate">{hospitalObj.name}</p>
                {hospitalObj.address && (
                  <p className="text-micro font-medium text-muted-foreground truncate">{hospitalObj.address}</p>
                )}
              </div>
            </div>
          )}

          {/* Time */}
          {appointment?.selectedSchedule?.startTime && (
            <div className="flex items-center gap-3 pt-1 border-t border-border/40">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted/40 text-muted-foreground">
                <HugeiconsIcon icon={Clock01Icon} size={16} />
              </div>
              <div>
                <p className="text-xs font-bold text-foreground">
                  {appointment.selectedSchedule.startTime}
                </p>
                <p className="text-micro font-medium text-muted-foreground">{appointmentDateStr}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
