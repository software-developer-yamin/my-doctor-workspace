"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { Doctor } from "@/types/doctor.type";
import { format } from "date-fns";
import { useDoctorSchedules } from "@/hooks/queries/use-doctor-schedules";
import { useHomeDoctorSchedules } from "@/hooks/queries/use-home-doctor-schedules";
import { useAuth } from "@/hooks/use-auth";
import { saveIntent, readIntent, clearIntent } from "@/lib/booking-intent";
import { appointmentService } from "@/services/appointment.service";
import { homeDoctorService } from "@/services/home-doctor.service";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Building01Icon,
  Hospital01Icon,
  Home11Icon,
  Home01Icon,
  Calendar01Icon,
  Tick01Icon,
  RecordIcon,
  WorkflowSquare02Icon,
} from "@hugeicons/core-free-icons";
import Image from "next/image";
import { cn, getImageUrl } from "@/lib/utils";
import { getNextDays } from "@/lib/booking-utils";
import { useDoctorAvailableSlots } from "@/hooks/queries/use-doctor-available-slots";
import { useIsDesktop } from "@/hooks/use-is-desktop";
import { StepIndicator } from "./booking-drawer/step-indicator";
import { SummaryRow } from "./booking-drawer/summary-row";
import { AuthModal } from "@/components/auth/auth-modal";

/* ─── Types ──────────────────────────────────────────────────── */

type ServiceType = "clinic" | "home";

type BookingDrawerProps = {
  doctor: Doctor;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

/* ═══════════════════════════════════════════════════════════════
 MAIN COMPONENT
 ═══════════════════════════════════════════════════════════════ */

export function BookingDrawer({
  doctor,
  open,
  onOpenChange,
}: BookingDrawerProps) {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const isDesktop = useIsDesktop();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const clinicDates = useMemo(() => getNextDays(30), []);
  const homeDates = useMemo(() => getNextDays(14), []);

  /* ── Service Mode ── */
  const [serviceType, setServiceType] = useState<ServiceType>("clinic");
  const [step, setStep] = useState(1);

  /* ── Clinic State ── */
  const [selectedChamberId, setSelectedChamberId] = useState("");
  const [selectedConsultation, setSelectedConsultation] = useState("in-person");
  const [selectedAppointmentType, setSelectedAppointmentType] =
    useState("New Patient");
  const [referralSource, setReferralSource] = useState("");
  const [selectedDateIdx, setSelectedDateIdx] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState("");

  /* ── Home State ── */
  const [homeSelectedDateIdx, setHomeSelectedDateIdx] = useState<number | null>(
    null,
  );

  /* ── Common ── */
  const [isBooking, setIsBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [createdAppointment, setCreatedAppointment] = useState<
    import("@/services/appointment.service").AppointmentRecord | null
  >(null);

  /* ── Data Hooks ── */
  const { data: scheduleData, isLoading: isSchedulesLoading } =
    useDoctorSchedules(doctor.id);
  const { data: homeScheduleData, isLoading: isHomeLoading } =
    useHomeDoctorSchedules(doctor.id);

  /* ── Clinic Computed ── */
  const scheduleDocs = scheduleData?.data || [];
  const uniqueHospitals = scheduleDocs
    .map((s: any) => s.hospital)
    .filter(
      (h: any, idx: number, arr: any[]) =>
        h && arr.findIndex((x: any) => x?._id === h._id) === idx,
    );

  useEffect(() => {
    if (uniqueHospitals.length > 0 && !selectedChamberId) {
      setSelectedChamberId(uniqueHospitals[0]?._id || "");
    }
  }, [uniqueHospitals.length, selectedChamberId]);

  const selectedDate = clinicDates[selectedDateIdx];
  const selectedDayName = format(selectedDate, "EEEE");

  const hospitalScheduleDoc = scheduleDocs.find(
    (s: any) => s.hospital._id === selectedChamberId,
  );
  const activeSchedule = hospitalScheduleDoc?.schedules?.find(
    (s: any) => s.day === selectedDayName && s.isAvailable,
  );

  /* ── Fee based on appointment type ── */
  const chamberConsultationFee = hospitalScheduleDoc?.consultationFee;
  const chamberFollowUpFee = hospitalScheduleDoc?.followUpFee;
  const effectiveFee = (() => {
    if (
      selectedAppointmentType === "Follow Up" ||
      selectedAppointmentType === "Report Show"
    ) {
      return chamberFollowUpFee ?? chamberConsultationFee ?? doctor.fee ?? 0;
    }
    // New Patient
    return chamberConsultationFee ?? doctor.fee ?? 0;
  })();

  /* ── Available slots from backend ── */
  const isOnSlotStep = serviceType === "clinic" && step === 2;
  const selectedDateStr = format(selectedDate, "yyyy-MM-dd");
  const { data: slotData, isLoading: isSlotsLoading } = useDoctorAvailableSlots(
    doctor.id,
    hospitalScheduleDoc?._id,
    selectedDateStr,
    isOnSlotStep && !!hospitalScheduleDoc,
  );
  const availableSlots = slotData?.slots ?? [];

  /* ── Home Computed ── */
  const homeSchedules = homeScheduleData?.schedules || [];
  const homeVisitFee = homeScheduleData?.homeVisitFee ?? doctor.fee ?? 0;
  const availableDaysMap = useMemo(() => {
    const map = new Map();
    homeSchedules.forEach((schedule: any) => {
      if (schedule.isAvailable) map.set(schedule.day, schedule);
    });
    return map;
  }, [homeSchedules]);

  const homeSelectedDate =
    homeSelectedDateIdx !== null ? homeDates[homeSelectedDateIdx] : null;
  const homeSelectedDayName = homeSelectedDate
    ? homeSelectedDate.toLocaleDateString("en-US", { weekday: "long" })
    : null;
  const homeActiveSchedule = homeSelectedDayName
    ? availableDaysMap.get(homeSelectedDayName)
    : null;

  const selectedHospital = uniqueHospitals.find(
    (h: any) => h?._id === selectedChamberId,
  );

  /* ── Steps Config ── */
  const totalSteps = serviceType === "clinic" ? 3 : 2;
  const stepLabels =
    serviceType === "clinic"
      ? ["Location", "Schedule", "Confirm"]
      : ["Schedule", "Confirm"];

  useEffect(() => {
    setStep(1);
  }, [serviceType]);

  useEffect(() => {
    const intent = readIntent();
    if (
      !intent ||
      intent.source !== "booking-drawer" ||
      intent.doctorId !== doctor.id
    )
      return;
    setServiceType(intent.serviceType);
    setStep(intent.step);
    setSelectedChamberId(intent.selectedChamberId);
    setSelectedConsultation(intent.selectedConsultation);
    setSelectedAppointmentType(intent.selectedAppointmentType);
    setReferralSource(intent.referralSource ?? "");
    setSelectedDateIdx(intent.selectedDateIdx);
    setSelectedSlot(intent.selectedSlot);
    setHomeSelectedDateIdx(intent.homeSelectedDateIdx);
    clearIntent();
    toast.success("Your booking has been restored.");
  }, [doctor.id]);

  /* ── Validation ── */
  const canProceed = (): boolean => {
    if (serviceType === "clinic") {
      if (step === 1) return !!selectedChamberId;
      if (step === 2) return !!selectedSlot && !!activeSchedule;
    } else {
      if (step === 1)
        return homeSelectedDateIdx !== null && !!homeActiveSchedule;
    }
    return true;
  };

  /* ── Booking Handlers ── */
  const handleClinicBooking = async () => {
    if (!isAuthenticated) {
      saveIntent({
        source: "booking-drawer",
        doctorSlug: doctor.slug,
        doctorId: doctor.id,
        serviceType,
        step: Math.max(1, step - 1),
        selectedChamberId,
        selectedConsultation,
        selectedAppointmentType,
        referralSource,
        selectedDateIdx,
        selectedSlot,
        homeSelectedDateIdx,
        savedAt: Date.now(),
      });
      setShowAuthModal(true);
      return;
    }
    if (!activeSchedule) {
      toast.error("No schedule available");
      return;
    }
    setIsBooking(true);
    try {
      const payload = {
        customer: user?.id || "",
        doctor: doctor.id,
        hospital: selectedChamberId,
        appointmentDate: selectedDate.toISOString(),
        selectedSchedule: (() => {
          const [rawStart, rawEnd] = selectedSlot
            .split("–")
            .map((s) => s.trim());
          const endMeridiem = rawEnd.slice(-2) as "AM" | "PM";
          const startHour = parseInt(rawStart.split(":")[0], 10);
          // Only AM→PM crossing happens at 11:xx AM → 12:xx PM
          const startMeridiem =
            endMeridiem === "PM" && startHour === 11 ? "AM" : endMeridiem;
          return {
            day: activeSchedule.day,
            startTime: `${rawStart} ${startMeridiem}`,
            endTime: rawEnd,
          };
        })(),
        consultationType: selectedConsultation.toLowerCase() as any,
        appointmentType: selectedAppointmentType as any,
        ...(selectedAppointmentType === "Reference" && referralSource.trim()
          ? { referralSource: referralSource.trim() }
          : {}),
        totalFee: effectiveFee,
      };
      const res = await appointmentService.create(payload);
      if (res.success) {
        setCreatedAppointment(res.data as any);
        setBookingSuccess(true);
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Booking failed. Please try again.",
      );
    } finally {
      setIsBooking(false);
    }
  };

  const handleHomeBooking = async () => {
    if (!isAuthenticated) {
      saveIntent({
        source: "booking-drawer",
        doctorSlug: doctor.slug,
        doctorId: doctor.id,
        serviceType,
        step: Math.max(1, step - 1),
        selectedChamberId,
        selectedConsultation,
        selectedAppointmentType,
        referralSource,
        selectedDateIdx,
        selectedSlot,
        homeSelectedDateIdx,
        savedAt: Date.now(),
      });
      setShowAuthModal(true);
      return;
    }
    if (!homeSelectedDate || !homeActiveSchedule) {
      toast.error("Please select an available date");
      return;
    }
    setIsBooking(true);
    try {
      const payload = {
        customer: user?.id || "",
        doctor: doctor.id,
        schedule: `${homeActiveSchedule.startTime} - ${homeActiveSchedule.endTime}`,
        booking_date: homeSelectedDate.toISOString(),
        totalFee: homeVisitFee,
      };
      const res = await homeDoctorService.createBooking(payload);
      if (res.success) {
        setBookingSuccess(true);
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to request home visit.",
      );
    } finally {
      setIsBooking(false);
    }
  };

  const handleConfirm = () => {
    if (serviceType === "clinic") handleClinicBooking();
    else handleHomeBooking();
  };

  /* ═════════════════════════════════════════════════════════════
    STEP RENDERERS — CLINIC
    ═════════════════════════════════════════════════════════════ */

  const renderClinicStep1 = () => (
    <div className="flex flex-col gap-8">
      {/* Chamber Selection */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <HugeiconsIcon
            icon={Building01Icon}
            size={16}
            className="text-primary"
          />
          <h3 className="text-foreground text-sm font-semibold">
            Select Chamber
          </h3>
        </div>

        {isSchedulesLoading ? (
          <div className="flex flex-col gap-3">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        ) : uniqueHospitals.length === 0 ? (
          <div className="border-muted-foreground/20 flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed p-8 text-center">
            <div className="bg-muted/40 text-muted-foreground flex h-12 w-12 items-center justify-center rounded-xl">
              <HugeiconsIcon icon={Hospital01Icon} size={24} />
            </div>
            <div className="space-y-1">
              <p className="text-foreground text-sm font-semibold">
                No chambers available
              </p>
              <p className="text-muted-foreground text-xs font-medium">
                This doctor has no listed clinic locations. Try Home Service
                instead.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => setServiceType("home")}
              className="border-primary/30 bg-primary/5 text-primary hover:bg-primary/10 hover:border-primary/50 mt-1 h-9 rounded-xl px-5 text-xs font-semibold"
            >
              <HugeiconsIcon icon={Home11Icon} size={14} className="mr-1.5" />
              Switch to Home Service
            </Button>
          </div>
        ) : (
          <RadioGroup
            value={selectedChamberId}
            onValueChange={setSelectedChamberId}
            className="flex flex-col gap-2.5"
          >
            {uniqueHospitals.map((hospital: any) => (
              <Label
                key={hospital?._id}
                htmlFor={`drawer-${hospital?._id}`}
                className={`group relative flex cursor-pointer items-center justify-between gap-3 rounded-2xl border p-4 transition-all duration-300 ${
                  selectedChamberId === hospital?._id
                    ? "border-primary bg-primary/5 ring-primary shadow-primary/5 shadow-md ring-1"
                    : "border-border bg-card hover:border-primary/40"
                }`}
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border transition-colors ${
                      selectedChamberId === hospital?._id
                        ? "border-primary/40 bg-primary/10 text-primary"
                        : "border-border bg-muted/30 text-muted-foreground"
                    }`}
                  >
                    <HugeiconsIcon icon={Building01Icon} size={18} />
                  </div>
                  <div className="flex min-w-0 flex-col">
                    <span
                      className={`truncate text-sm font-semibold transition-colors ${
                        selectedChamberId === hospital?._id
                          ? "text-primary"
                          : "text-foreground"
                      }`}
                    >
                      {hospital?.name}
                    </span>
                    <span className="text-muted-foreground line-clamp-3 text-xs font-medium">
                      {hospital?.address}
                    </span>
                  </div>
                </div>
                <RadioGroupItem
                  value={hospital?._id || ""}
                  id={`drawer-${hospital?._id}`}
                  className="sr-only"
                />
                <div
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all ${
                    selectedChamberId === hospital?._id
                      ? "border-primary bg-primary scale-110 text-white"
                      : "border-border"
                  }`}
                >
                  {selectedChamberId === hospital?._id && (
                    <HugeiconsIcon
                      icon={Tick01Icon}
                      size={10}
                      strokeWidth={3}
                    />
                  )}
                </div>
              </Label>
            ))}
          </RadioGroup>
        )}
      </div>

      {/* Appointment Type */}
      <div className="border-border flex flex-col gap-3 border-t pt-6">
        <h3 className="text-muted-foreground text-xs font-semibold">
          Appointment Type
        </h3>
        <div className="flex flex-wrap gap-2">
          {(() => {
            const base: string[] = hospitalScheduleDoc?.appointmentTypes?.length
              ? hospitalScheduleDoc.appointmentTypes
              : ["New Patient", "Follow Up", "Report Show"];
            return base.includes("Reference") ? base : [...base, "Reference"];
          })().map((type: string) => (
            <Button
              key={type}
              type="button"
              variant="outline"
              onClick={() => {
                setSelectedAppointmentType(type);
                if (type !== "Reference") setReferralSource("");
              }}
              className={`border-border h-10 rounded-xl px-5 text-xs font-medium transition-all ${
                selectedAppointmentType === type
                  ? "bg-primary text-primary-foreground border-primary shadow-primary/15 shadow-md"
                  : "text-muted-foreground hover:bg-primary/5 hover:border-primary/40 bg-transparent"
              }`}
            >
              {type}
            </Button>
          ))}
        </div>
        {selectedAppointmentType === "Reference" && (
          <div className="animate-in fade-in slide-in-from-top-1 flex flex-col gap-1.5 duration-200">
            <span className="text-muted-foreground text-xs font-medium">
              Referred by{" "}
              <span className="text-muted-foreground/50">(optional)</span>
            </span>
            <input
              type="text"
              value={referralSource}
              onChange={(e) => setReferralSource(e.target.value)}
              placeholder="Dr. Name or clinic"
              className="border-primary/30 bg-primary/5 text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:ring-primary h-10 w-full rounded-xl border px-4 text-xs font-medium transition-all outline-none focus:ring-1"
            />
          </div>
        )}
      </div>

      {/* Consultation Method */}
      <div className="border-border flex flex-col gap-3 border-t pt-6">
        <h3 className="text-muted-foreground text-xs font-semibold">
          Consultation Method
        </h3>
        <div className="grid grid-cols-2 gap-2.5">
          {(hospitalScheduleDoc?.consultationTypes?.length
            ? hospitalScheduleDoc.consultationTypes
            : ["in-person"]
          ).map((method: string) => (
            <Button
              key={method}
              type="button"
              variant="outline"
              onClick={() => setSelectedConsultation(method)}
              className={`border-border flex h-12 items-center justify-start gap-2.5 rounded-xl px-4 text-xs font-medium transition-all ${
                selectedConsultation === method
                  ? "bg-primary/5 text-primary border-primary ring-primary shadow-sm ring-1"
                  : "text-muted-foreground hover:bg-primary/5 hover:border-primary/40 bg-transparent"
              }`}
            >
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-lg ${
                  selectedConsultation === method
                    ? "bg-primary text-white"
                    : "bg-muted/50"
                }`}
              >
                <HugeiconsIcon icon={RecordIcon} size={14} />
              </div>
              {method}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderClinicStep2 = () => (
    <div className="flex flex-col gap-6">
      {/* Schedule Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <HugeiconsIcon
            icon={Calendar01Icon}
            size={16}
            className="text-primary"
          />
          <h3 className="text-foreground text-sm font-semibold">
            Select Date & Time
          </h3>
        </div>
        {hospitalScheduleDoc && (
          <Badge
            variant="outline"
            className="text-primary border-primary/20 bg-primary/5 text-micro rounded-lg font-medium"
          >
            {
              hospitalScheduleDoc.schedules?.filter((s: any) => s.isAvailable)
                .length
            }
            {""}
            Days
          </Badge>
        )}
      </div>

      {/* Date Picker */}
      <div
        className="border-border bg-muted/5 rounded-2xl border p-3"
        data-vaul-no-drag
      >
        <ScrollArea className="w-full whitespace-nowrap" data-vaul-no-drag>
          <div className="flex w-max gap-1.5 pb-1" data-vaul-no-drag>
            {clinicDates.map((d, index) => {
              const dayFullName = format(d, "EEEE");
              const dateNum = format(d, "dd");
              const monthName = format(d, "MMM");
              const isSelected = selectedDateIdx === index;
              const daySchedule = hospitalScheduleDoc?.schedules?.find(
                (s: any) => s.day === dayFullName && s.isAvailable,
              );
              const hasSlots = !!daySchedule;

              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => {
                    setSelectedDateIdx(index);
                    setSelectedSlot("");
                  }}
                  className={`group relative flex min-w-[58px] flex-col items-center justify-center rounded-xl py-2.5 transition-all duration-300 ${
                    isSelected
                      ? "bg-primary text-primary-foreground shadow-primary/20 scale-105 shadow-lg"
                      : hasSlots
                        ? "bg-card text-foreground border-border hover:border-primary/40 border"
                        : "text-muted-foreground cursor-not-allowed border border-transparent"
                  }`}
                >
                  <span className="text-micro font-semibold">{monthName}</span>
                  <span className="text-lg leading-none font-semibold">
                    {dateNum}
                  </span>
                  <span className="text-micro font-medium">
                    {format(d, "EEE")}
                  </span>
                  {hasSlots && !isSelected && (
                    <div className="absolute top-1 right-1 flex h-1.5 w-1.5">
                      <span className="bg-primary absolute inline-flex h-full w-full animate-ping rounded-full" />
                      <span className="bg-primary relative inline-flex h-1.5 w-1.5 rounded-full" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      {/* Time Slots */}
      <div className="flex flex-col gap-3">
        <h3 className="text-muted-foreground text-xs font-semibold">
          Available Slots
        </h3>
        {!hospitalScheduleDoc ? (
          <div className="flex items-center justify-center p-8 text-center">
            <p className="text-xs font-medium">Select a location first</p>
          </div>
        ) : !activeSchedule ? (
          <div className="text-muted-foreground flex flex-col items-center justify-center gap-2 p-6 text-center">
            <HugeiconsIcon icon={Calendar01Icon} size={28} />
            <p className="text-xs font-medium">No visiting hours</p>
          </div>
        ) : isSlotsLoading ? (
          <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-muted h-9 animate-pulse rounded-lg" />
            ))}
          </div>
        ) : availableSlots.length === 0 ? (
          <div className="border-muted-foreground/20 flex items-center justify-center rounded-xl border border-dashed p-6">
            <p className="text-muted-foreground text-sm font-semibold">
              {activeSchedule ? "Schedule Full" : "No visiting hours"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
            {availableSlots.map((slot) => (
              <Button
                key={slot}
                type="button"
                variant="outline"
                onClick={() => setSelectedSlot(slot)}
                className={`h-9 rounded-lg border px-0 text-xs font-medium transition-all ${
                  selectedSlot === slot
                    ? "bg-primary text-primary-foreground border-primary shadow-primary/15 shadow-md"
                    : "border-border bg-card text-foreground hover:border-primary hover:text-primary"
                }`}
              >
                {slot.replace("", "")}
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderClinicSummary = () => (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <h3 className="text-foreground text-base font-semibold">
          Booking Summary
        </h3>
        <p className="text-muted-foreground mt-1 text-xs font-medium">
          Please review your appointment details
        </p>
      </div>

      {/* Doctor Card */}
      <div className="bg-primary/5 border-primary/15 flex items-center gap-4 rounded-2xl border p-4">
        <div className="border-border bg-muted h-14 w-14 shrink-0 overflow-hidden rounded-xl border">
          <Image
            src={getImageUrl(doctor.photo) ?? ""}
            alt={doctor.name}
            width={56}
            height={56}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="text-foreground truncate text-sm font-semibold">
            {doctor.name}
          </span>
          <span className="text-muted-foreground text-xs font-medium">
            {doctor.primarySpecialty}
          </span>
        </div>
        <div className="shrink-0 text-right">
          <span className="text-primary text-lg font-semibold">
            {effectiveFee}৳
          </span>
          <span className="text-micro text-primary block font-medium">
            {selectedAppointmentType === "Follow Up" ||
            selectedAppointmentType === "Report Show"
              ? "Follow-up Fee"
              : "Consultation Fee"}
          </span>
        </div>
      </div>

      {/* Details */}
      <div className="border-border bg-card divide-border/30 divide-y rounded-2xl border px-5">
        <SummaryRow label="Location" value={selectedHospital?.name || "—"} />
        <SummaryRow
          label="Date"
          value={format(selectedDate, "EEE, MMM dd, yyyy")}
        />
        <SummaryRow label="Time" value={selectedSlot || "—"} />
        <SummaryRow label="Type" value={selectedAppointmentType} />
        {selectedAppointmentType === "Reference" && referralSource.trim() && (
          <SummaryRow label="Referred by" value={referralSource.trim()} />
        )}
        <SummaryRow
          label="Method"
          value={selectedConsultation
            .replace("-", "")
            .replace(/\b\w/g, (c) => c.toUpperCase())}
        />
      </div>

      {!isAuthenticated && (
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-center">
          <p className="text-xs font-medium text-amber-700 dark:text-amber-400">
            You&apos;ll need to log in to confirm your appointment
          </p>
        </div>
      )}
    </div>
  );

  /* ═════════════════════════════════════════════════════════════
    STEP RENDERERS — HOME SERVICE
    ═════════════════════════════════════════════════════════════ */

  const renderHomeStep1 = () => (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <HugeiconsIcon
            icon={Calendar01Icon}
            size={16}
            className="text-primary"
          />
          <h3 className="text-foreground text-sm font-semibold">
            Select Visit Date
          </h3>
        </div>
        <Badge className="bg-primary hover:bg-primary text-micro shadow-primary/15 rounded-md px-2 py-0.5 font-medium shadow-md">
          Elite
        </Badge>
      </div>

      {isHomeLoading ? (
        <div className="flex flex-col gap-3">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      ) : homeSchedules.length === 0 ? (
        <div className="border-muted-foreground/20 flex flex-col items-center justify-center rounded-2xl border border-dashed p-10 text-center">
          <div className="bg-muted/30 text-muted-foreground mb-4 rounded-2xl p-4">
            <HugeiconsIcon icon={Home01Icon} size={28} />
          </div>
          <p className="text-muted-foreground text-sm font-semibold">
            Home visits not available
          </p>
          <p className="text-muted-foreground mt-1 text-xs font-medium">
            This specialist does not accept home visit requests
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {homeDates.map((d, index) => {
            const dayName = d.toLocaleDateString("en-US", {
              weekday: "long",
            });
            const isAvailable = availableDaysMap.has(dayName);
            const isSelected = homeSelectedDateIdx === index;

            return (
              <button
                key={index}
                onClick={() => {
                  if (isAvailable) setHomeSelectedDateIdx(index);
                }}
                disabled={!isAvailable}
                className={`flex items-center justify-between rounded-2xl border p-3.5 transition-all duration-300 ${
                  isSelected
                    ? "border-primary bg-primary/5 ring-primary shadow-primary/5 shadow-md ring-1"
                    : isAvailable
                      ? "border-border bg-card hover:border-primary/40"
                      : "border-border/20 bg-muted/10 text-muted-foreground cursor-not-allowed"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-11 w-11 flex-col items-center justify-center rounded-xl border transition-all ${
                      isSelected
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-muted/40 text-foreground border-border"
                    }`}
                  >
                    <span className="text-micro font-semibold">
                      {d.toLocaleDateString("en-US", { weekday: "short" })}
                    </span>
                    <span className="text-lg leading-none font-semibold">
                      {d.getDate()}
                    </span>
                  </div>
                  <div className="flex flex-col text-left">
                    {isAvailable ? (
                      <>
                        <span
                          className={`text-sm font-semibold ${
                            isSelected ? "text-primary" : "text-foreground"
                          }`}
                        >
                          {availableDaysMap.get(dayName).startTime} –{""}
                          {availableDaysMap.get(dayName).endTime}
                        </span>
                        <span className="text-muted-foreground text-xs font-medium">
                          Confirmed Visit Slots
                        </span>
                      </>
                    ) : (
                      <span className="text-muted-foreground text-xs font-medium">
                        Not Available
                      </span>
                    )}
                  </div>
                </div>
                {isAvailable && (
                  <div
                    className={`flex h-5 w-5 items-center justify-center rounded-full border-2 transition-all ${
                      isSelected
                        ? "border-primary bg-primary scale-110 text-white"
                        : "border-border"
                    }`}
                  >
                    {isSelected && (
                      <HugeiconsIcon
                        icon={Tick01Icon}
                        size={10}
                        strokeWidth={3}
                      />
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );

  const renderHomeSummary = () => (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <h3 className="text-foreground text-base font-semibold">
          Visit Summary
        </h3>
        <p className="text-muted-foreground mt-1 text-xs font-medium">
          Review your home visit request
        </p>
      </div>

      <div className="bg-primary/5 border-primary/15 flex items-center gap-4 rounded-2xl border p-4">
        <div className="border-border bg-muted h-14 w-14 shrink-0 overflow-hidden rounded-xl border">
          <Image
            src={getImageUrl(doctor.photo) ?? ""}
            alt={doctor.name}
            width={56}
            height={56}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="text-foreground truncate text-sm font-semibold">
            {doctor.name}
          </span>
          <span className="text-muted-foreground text-xs font-medium">
            {doctor.primarySpecialty}
          </span>
        </div>
        <div className="shrink-0 text-right">
          <Badge className="bg-primary hover:bg-primary text-micro shadow-primary/15 font-medium shadow-md">
            Home Visit
          </Badge>
        </div>
      </div>

      <div className="border-border bg-card divide-border/30 divide-y rounded-2xl border px-5">
        <SummaryRow label="Service" value="Home Concierge Visit" />
        {homeSelectedDate && (
          <SummaryRow
            label="Date"
            value={homeSelectedDate.toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          />
        )}
        {homeActiveSchedule && (
          <SummaryRow
            label="Time Window"
            value={`${homeActiveSchedule.startTime} – ${homeActiveSchedule.endTime}`}
          />
        )}
        <SummaryRow label="Home Visit Fee" value={`${homeVisitFee}৳`} />
      </div>

      {/* Home-service fee from doctor-home-schedules */}
      {!isAuthenticated && (
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-center">
          <p className="text-xs font-medium text-amber-700 dark:text-amber-400">
            You&apos;ll need to log in to confirm your request
          </p>
        </div>
      )}
    </div>
  );

  /* ── Step Router ── */
  const renderStep = () => {
    if (bookingSuccess) return renderSuccess();

    if (serviceType === "clinic") {
      switch (step) {
        case 1:
          return renderClinicStep1();
        case 2:
          return renderClinicStep2();
        case 3:
          return renderClinicSummary();
      }
    } else {
      switch (step) {
        case 1:
          return renderHomeStep1();
        case 2:
          return renderHomeSummary();
      }
    }
  };

  const renderSuccess = () => (
    <div className="animate-in fade-in zoom-in-95 flex flex-col items-center justify-center gap-6 py-8 text-center duration-500">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 ring-4 ring-emerald-500/20">
        <HugeiconsIcon icon={Tick01Icon} size={36} strokeWidth={3} />
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="text-foreground text-lg font-semibold">
          {serviceType === "clinic"
            ? "Appointment Confirmed!"
            : "Home Visit Requested!"}
        </h3>
        <p className="text-muted-foreground mx-auto max-w-xs text-xs leading-relaxed font-medium">
          {serviceType === "clinic"
            ? "Your appointment has been successfully booked. You will receive a confirmation notification shortly."
            : "Your home visit request has been submitted. Our team will confirm your schedule shortly."}
        </p>
      </div>

      {serviceType === "clinic" && createdAppointment?.serialNo != null && (
        <div className="bg-primary/10 border-primary/20 flex w-full flex-col items-center gap-1.5 rounded-2xl border px-4 py-5">
          <span className="text-micro text-primary/70 font-bold tracking-widest uppercase">
            Your Serial Number
          </span>
          <span className="text-primary text-5xl leading-none font-black">
            #{createdAppointment.serialNo}
          </span>
          <span className="text-muted-foreground mt-1 text-xs font-medium">
            Show this number at the reception
          </span>
        </div>
      )}

      <div className="border-border bg-card divide-border/30 mt-2 w-full divide-y rounded-2xl border px-5">
        <SummaryRow label="Doctor" value={doctor.name} />
        <SummaryRow
          label="Service"
          value={serviceType === "clinic" ? "Hospital Visit" : "Home Visit"}
        />
        {serviceType === "clinic" && selectedHospital && (
          <SummaryRow label="Location" value={selectedHospital.name} />
        )}
        {serviceType === "clinic" ? (
          <SummaryRow
            label="Date"
            value={format(selectedDate, "EEE, MMM dd, yyyy")}
          />
        ) : homeSelectedDate ? (
          <SummaryRow
            label="Date"
            value={homeSelectedDate.toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          />
        ) : null}
        {serviceType === "clinic" && selectedSlot && (
          <SummaryRow label="Time" value={selectedSlot} />
        )}
        {selectedAppointmentType === "Reference" && referralSource.trim() && (
          <SummaryRow label="Referred by" value={referralSource.trim()} />
        )}
        <SummaryRow
          label={
            selectedAppointmentType === "Follow Up" ||
            selectedAppointmentType === "Report Show"
              ? "Follow-up Fee"
              : "Consultation Fee"
          }
          value={`${effectiveFee}৳`}
        />
      </div>

      <div className="mt-2 flex w-full flex-col gap-3">
        {serviceType === "clinic" && createdAppointment?._id && (
          <Button
            variant="outline"
            onClick={() => {
              onOpenChange(false);
              router.push(`/tracker/${createdAppointment._id}`);
            }}
            className="border-primary/30 bg-primary/5 text-primary hover:bg-primary/10 h-12 w-full rounded-xl text-xs font-medium"
          >
            <HugeiconsIcon
              icon={WorkflowSquare02Icon}
              size={15}
              className="mr-2"
            />
            Track My Queue Position
          </Button>
        )}
        <Button
          onClick={() => {
            onOpenChange(false);
            router.push(
              serviceType === "clinic"
                ? "/patient/appointments"
                : "/patient/my-requests",
            );
          }}
          className="shadow-primary/15 h-12 w-full rounded-xl text-xs font-medium shadow-lg"
        >
          View My Appointments
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            setBookingSuccess(false);
            setStep(1);
            setSelectedSlot("");
            setHomeSelectedDateIdx(null);
            setCreatedAppointment(null);
            setReferralSource("");
            onOpenChange(false);
          }}
          className="border-border h-12 w-full rounded-xl text-xs font-medium"
        >
          Close
        </Button>
      </div>
    </div>
  );

  const isLastStep = step === totalSteps;

  /* ═════════════════════════════════════════════════════════════
    RENDER
    ═════════════════════════════════════════════════════════════ */

  return (
    <>
      <Drawer
        direction={isDesktop ? "right" : "bottom"}
        open={open}
        onOpenChange={onOpenChange}
      >
        <DrawerContent
          className={cn(
            "gap-0 outline-none",
            "data-[vaul-drawer-direction=right]:sm:max-w-[520px]",
            "data-[vaul-drawer-direction=bottom]:max-h-[92vh]",
          )}
        >
          {/* ── Header ── */}
          {!bookingSuccess && (
            <DrawerHeader className="border-border/20 relative shrink-0 gap-4 border-b pb-4 text-left">
              {/* Title Bar */}
              <div className="flex items-start justify-between">
                <div className="min-w-0 flex-1">
                  <DrawerTitle className="text-foreground truncate text-base font-semibold">
                    Book Appointment
                  </DrawerTitle>
                  <DrawerDescription className="text-muted-foreground mt-0.5 line-clamp-3 text-xs font-medium">
                    {doctor.name} · {doctor.primarySpecialty}
                  </DrawerDescription>
                </div>
              </div>

              {/* Service Type Toggle */}
              <div className="bg-muted/30 border-border mb-2 rounded-xl border p-1">
                <div className="grid grid-cols-2 gap-1">
                  {(
                    [
                      {
                        value: "clinic" as ServiceType,
                        label: "Hospital Visit",
                        icon: Hospital01Icon,
                      },
                      {
                        value: "home" as ServiceType,
                        label: "Home Service",
                        icon: Home11Icon,
                      },
                    ] as const
                  ).map((tab) => (
                    <button
                      key={tab.value}
                      onClick={() => setServiceType(tab.value)}
                      className={`flex h-9 items-center justify-center gap-2 rounded-lg text-xs font-medium transition-all ${
                        serviceType === tab.value
                          ? "bg-primary text-primary-foreground shadow-primary/15 shadow-md"
                          : "bg-background text-muted-foreground border-border hover:text-foreground hover:border-primary/40 hover:bg-primary/5 border"
                      }`}
                    >
                      <HugeiconsIcon icon={tab.icon} size={14} />
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step Indicator */}
              <StepIndicator current={step} labels={stepLabels} />
            </DrawerHeader>
          )}

          {/* ── Scrollable Content ── */}
          <div className="min-h-0 flex-1 overflow-y-auto py-5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div
              key={`${serviceType}-${step}`}
              className="animate-in fade-in slide-in-from-right-3 px-4 duration-300"
            >
              {renderStep()}
            </div>
          </div>

          {/* ── Footer ── */}
          {!bookingSuccess && (
            <DrawerFooter className="border-border/20 shrink-0 flex-row gap-3 border-t">
              {step > 1 && (
                <Button
                  variant="outline"
                  onClick={() => setStep((s) => s - 1)}
                  className="border-border h-12 rounded-xl px-5 text-xs font-medium"
                >
                  ← Back
                </Button>
              )}

              {!isLastStep ? (
                <div className="flex flex-1 flex-col gap-1.5">
                  <Button
                    onClick={() => setStep((s) => s + 1)}
                    disabled={!canProceed()}
                    className="shadow-primary/15 h-12 w-full rounded-xl text-xs font-medium shadow-lg transition-all"
                  >
                    Continue →
                  </Button>
                  {serviceType === "clinic" &&
                    step === 1 &&
                    uniqueHospitals.length === 0 &&
                    !isSchedulesLoading && (
                      <p className="text-2xs text-muted-foreground text-center font-medium">
                        Select Home Service above to proceed
                      </p>
                    )}
                </div>
              ) : (
                <Button
                  onClick={handleConfirm}
                  disabled={isBooking}
                  className="shadow-primary/15 h-12 flex-1 rounded-xl text-xs font-medium shadow-lg transition-all"
                >
                  {isBooking ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Processing...
                    </div>
                  ) : serviceType === "clinic" ? (
                    <div className="flex items-center gap-2">
                      <HugeiconsIcon icon={Tick01Icon} size={16} />
                      Confirm Appointment
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <HugeiconsIcon icon={Tick01Icon} size={16} />
                      Request Home Visit
                    </div>
                  )}
                </Button>
              )}
            </DrawerFooter>
          )}
        </DrawerContent>
      </Drawer>
      <AuthModal open={showAuthModal} onOpenChange={setShowAuthModal} />
    </>
  );
}
