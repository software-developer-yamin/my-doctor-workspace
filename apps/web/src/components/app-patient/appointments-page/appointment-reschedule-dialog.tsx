"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDoctorSchedules } from "@/hooks/queries/use-doctor-schedules";
import { generateSlots, getNextDays } from "@/lib/booking-utils";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useEffect, useMemo, useState } from "react";

interface AppointmentRescheduleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  doctorId: string;
  hospitalId: string;
  isSubmitting?: boolean;
  onConfirm: (payload: {
    appointmentDate: string;
    selectedSchedule: { day: string; startTime: string; endTime: string };
  }) => void;
}

export function AppointmentRescheduleDialog({
  open,
  onOpenChange,
  doctorId,
  hospitalId,
  isSubmitting = false,
  onConfirm,
}: AppointmentRescheduleDialogProps) {
  const { data: scheduleData, isLoading } = useDoctorSchedules(doctorId);
  const scheduleDocs = scheduleData?.data || [];

  const hospitalScheduleDoc = useMemo(
    () => scheduleDocs.find((s: any) => s.hospital?._id === hospitalId),
    [scheduleDocs, hospitalId],
  );

  const dates = useMemo(() => getNextDays(14), []);
  const [selectedDateIdx, setSelectedDateIdx] = useState<number | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string>("");

  useEffect(() => {
    if (!open) {
      setSelectedDateIdx(null);
      setSelectedSlot("");
    }
  }, [open]);

  const selectedDate = selectedDateIdx !== null ? dates[selectedDateIdx] : null;
  const selectedDayName = selectedDate ? format(selectedDate, "EEEE") : "";

  const activeSchedule = useMemo(
    () =>
      hospitalScheduleDoc?.schedules?.find(
        (s: any) => s.day === selectedDayName && s.isAvailable,
      ),
    [hospitalScheduleDoc, selectedDayName],
  );

  const availableSlots = useMemo(
    () =>
      activeSchedule
        ? generateSlots(activeSchedule.startTime, activeSchedule.endTime)
        : [],
    [activeSchedule],
  );

  // Dates where doctor is available (for disabled state)
  const availableDayNames = useMemo(() => {
    return new Set(
      (hospitalScheduleDoc?.schedules || [])
        .filter((s: any) => s.isAvailable)
        .map((s: any) => s.day),
    );
  }, [hospitalScheduleDoc]);

  const handleConfirm = () => {
    if (!selectedDate || !selectedSlot || !activeSchedule) return;
    onConfirm({
      appointmentDate: selectedDate.toISOString(),
      selectedSchedule: {
        day: activeSchedule.day,
        startTime: selectedSlot.split("–")[0] + (selectedSlot.includes("PM") && !selectedSlot.split("–")[0].includes("PM") ? " PM" : selectedSlot.includes("AM") && !selectedSlot.split("–")[0].includes("AM") ? " AM" : ""),
        endTime: activeSchedule.endTime,
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-md md:max-w-2xl lg:max-w-4xl">
        <DialogHeader className="shrink-0 p-6 pb-4">
          <DialogTitle>Reschedule appointment</DialogTitle>
          <DialogDescription>
            Pick a new date and time based on the doctor&apos;s availability.
          </DialogDescription>
        </DialogHeader>

        {/* Scrollable content area — native overflow, works on all devices */}
        <div className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-contain p-6 pt-0">
          <div className="space-y-6">
            {/* Date strip */}
            <div>
              <p className="text-muted-foreground mb-2 text-xs font-semibold tracking-wider uppercase">
                Select date
              </p>
              {isLoading ? (
                <div className="bg-muted/30 h-24 animate-pulse rounded-xl" />
              ) : availableDayNames.size === 0 ? (
                <div className="border-muted bg-muted/20 text-muted-foreground rounded-xl border-2 border-dashed p-6 text-center text-sm font-medium">
                  No schedules available for this doctor at this chamber.
                </div>
              ) : (
                <div className="w-full -mx-1 flex gap-2 overflow-x-auto px-1 pb-2 scroll-smooth snap-x snap-mandatory">
                  {dates.map((d, idx) => {
                    const dayName = format(d, "EEEE");
                    const isAvailable = availableDayNames.has(dayName);
                    const isSelected = selectedDateIdx === idx;
                    return (
                      <button
                        key={idx}
                        type="button"
                        disabled={!isAvailable}
                        onClick={() => {
                          setSelectedDateIdx(idx);
                          setSelectedSlot("");
                        }}
                        className={cn(
                          "flex h-20 w-16 shrink-0 snap-start flex-col items-center justify-center rounded-xl border-2 p-2 text-center transition-all",
                          isSelected
                            ? "border-primary bg-primary/10 text-primary shadow-sm"
                            : isAvailable
                              ? "border-border hover:border-primary/50 text-foreground"
                              : "border-border/30 text-muted-foreground/50 bg-muted/20 cursor-not-allowed",
                        )}
                      >
                        <span className="text-micro font-bold tracking-wider uppercase">
                          {format(d, "EEE")}
                        </span>
                        <span className="mt-0.5 text-lg font-extrabold leading-none">
                          {format(d, "dd")}
                        </span>
                        <span className="mt-0.5 text-micro font-semibold">
                          {format(d, "MMM")}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Time slots */}
            {selectedDate && (
              <div>
                <p className="text-muted-foreground mb-2 text-xs font-semibold tracking-wider uppercase">
                  Available slots on {format(selectedDate, "EEE, dd MMM")}
                </p>
                {availableSlots.length === 0 ? (
                  <div className="border-muted bg-muted/20 text-muted-foreground rounded-xl border-2 border-dashed p-6 text-center text-sm font-medium">
                    No slots available for this day.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-2 min-[380px]:grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
                    {availableSlots.map((slot) => {
                      const isSelected = selectedSlot === slot;
                      return (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setSelectedSlot(slot)}
                          className={cn(
                            "rounded-lg border-2 px-2 py-3 text-xs font-semibold transition-all",
                            isSelected
                              ? "border-primary bg-primary text-primary-foreground shadow-sm"
                              : "border-border hover:border-primary/50 text-foreground",
                          )}
                        >
                          {slot}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="shrink-0 border-t p-6 pt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!selectedSlot || !activeSchedule || isSubmitting}
            className="w-full sm:w-auto"
          >
            {isSubmitting ? "Updating..." : "Confirm Reschedule"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
