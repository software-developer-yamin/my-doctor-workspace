"use client";

import { useState } from "react";
import Link from "next/link";
import { Tabs as TabsPrimitive } from "radix-ui";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Doctor } from "@/types/doctor.type";
import {
    User02Icon,
    SecurityCheckIcon,
    Mortarboard01Icon,
    Briefcase02Icon,
    Calendar01Icon,
    RecordIcon,
    ArrowRight01Icon,
    ArrowDown01Icon,
    StarIcon,
    Clock01Icon,
    Money01Icon,
    CheckmarkCircle01Icon,
    UserMultiple02Icon,
    HourglassIcon,
    CalendarCheckIn01Icon,
    Calendar03Icon,
    Alert01Icon,
    Call02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { DoctorLocationsTab } from "./doctor-locations-tab";
import { DoctorReviewsTab } from "./doctor-reviews-tab";
import { DoctorFaqTab } from "./doctor-faq-tab";
import { LiveSerialBanner } from "@/components/common/live-serial-banner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DoctorReview, DoctorFAQ, DoctorAward } from "@/types/doctor.type";
import { cn } from "@/lib/utils";

type TDoctorProfileTabsProps = {
    doctor: Doctor;
    reviews: DoctorReview[];
    faqs: DoctorFAQ[];
    awards: DoctorAward[];
    conditions: string[];
    insurances: string[];
    onBookNow?: () => void;
};

import { parse, format, addDays, isToday, isTomorrow, differenceInMinutes } from "date-fns";

const DAYS_ORDER = ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

function to12h(time: string): string {
    if (!time || !time.includes(":")) return time;
    try { return format(parse(time, "HH:mm", new Date()), "h:mm a"); } catch { return time; }
}

function computeScheduleStats(doctor: Doctor) {
    const today = format(new Date(), "EEEE");
    const dayCapacity: Record<string, number> = {};

    for (const loc of doctor.locationSchedules ?? []) {
        for (const s of loc.schedules) {
            if (!s.isAvailable || !s.startTime || !s.endTime) continue;
            try {
                const ref = new Date();
                const mins = differenceInMinutes(
                    parse(s.endTime, "HH:mm", ref),
                    parse(s.startTime, "HH:mm", ref),
                );
                if (mins > 0) {
                    dayCapacity[s.day] = (dayCapacity[s.day] || 0) + Math.floor(mins / 30);
                }
            } catch { /* skip malformed time */ }
        }
    }

    const todaySlots = dayCapacity[today] || 0;
    const capacityValues = Object.values(dayCapacity);
    const maxDailyCapacity = capacityValues.length > 0 ? Math.max(...capacityValues) : 0;

    return { slots: todaySlots, maxDailyCapacity };
}

function findNextSession(doctor: Doctor): string {
    const now = new Date();
    for (let offset = 0; offset < 7; offset++) {
        const d = addDays(now, offset);
        const dayName = format(d, "EEEE");
        for (const loc of doctor.locationSchedules ?? []) {
            const sched = loc.schedules.find((s) => s.day === dayName && s.isAvailable);
            if (sched) {
                const label = isToday(d) ? "Today" : isTomorrow(d) ? "Tomorrow" : dayName;
                return `${label}\n${to12h(sched.startTime)} - ${to12h(sched.endTime)}`;
            }
        }
    }
    return "Not scheduled";
}

function deriveBookingType(doctor: Doctor): string {
    const methods = new Set(doctor.chambers.flatMap((ch) => ch.consultationMethod));
    const hasPhysical = methods.has("ON_PREMISES");
    const hasVirtual = methods.has("VIRTUAL");
    if (hasPhysical && hasVirtual) return "Chamber Visit\n& Online Consultation";
    if (hasVirtual) return "Online Consultation";
    return "Chamber Visit";
}

/* ── Icon Box ── */
function IconBox({ icon, size = 16, className }: { icon: Parameters<typeof HugeiconsIcon>[0]["icon"]; size?: number; className?: string }) {
    return (
        <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10", className)}>
            <HugeiconsIcon icon={icon} size={size} className="text-primary" />
        </div>
    );
}

/* ── Section Header ── */
function SectionHeader({ icon, title }: { icon: Parameters<typeof HugeiconsIcon>[0]["icon"]; title: string }) {
    return (
        <div className="mb-4 flex items-center gap-3">
            <IconBox icon={icon} size={18} />
            <h3 className="text-base font-bold text-primary">{title}</h3>
        </div>
    );
}

/* ── Info Row (icon + label + value) ── */
function InfoRow({
    icon,
    label,
    value,
    valueClass,
}: {
    icon: Parameters<typeof HugeiconsIcon>[0]["icon"];
    label: string;
    value: React.ReactNode;
    valueClass?: string;
}) {
    return (
        <div className="flex items-center justify-between gap-4 border-b border-gray-100 py-3.5 last:border-0">
            <div className="flex items-center gap-3">
                <IconBox icon={icon} size={15} className="h-9 w-9" />
                <span className="text-sm text-gray-500">{label}</span>
            </div>
            <div className={cn("text-right text-sm", valueClass)}>{value}</div>
        </div>
    );
}

/* ── Mobile Accordion Row ── */
function MobileAccordionRow({
    title,
    icon,
    children,
}: {
    title: string;
    icon: Parameters<typeof HugeiconsIcon>[0]["icon"];
    children: React.ReactNode;
}) {
    const [open, setOpen] = useState(false);
    return (
        <div className="overflow-hidden rounded-2xl border border-border bg-white">
            <button
                onClick={() => setOpen(!open)}
                className="flex w-full items-center justify-between px-4 py-4"
                type="button"
            >
                <div className="flex items-center gap-3">
                    <IconBox icon={icon} size={16} />
                    <span className="text-base font-bold text-primary">{title}</span>
                </div>
                <HugeiconsIcon
                    icon={open ? ArrowDown01Icon : ArrowRight01Icon}
                    size={18}
                    className="text-gray-400 shrink-0"
                />
            </button>
            {open && (
                <div className="border-t border-border bg-white px-4 pb-4 pt-3">
                    {children}
                </div>
            )}
        </div>
    );
}

/* ── Mobile Appointment Content ── */
function MobileAppointmentContent({ doctor, onBookNow }: { doctor: Doctor; onBookNow?: () => void }) {
    const { slots, maxDailyCapacity } = computeScheduleStats(doctor);
    const displayFee = doctor.minFee ?? doctor.fee;
    const feeLabel = displayFee > 0 ? `From ৳${displayFee.toLocaleString()}` : "N/A";
    return (
        <div>
            <p className="mb-3 text-sm font-bold text-foreground">Quick Information</p>
            <div className="flex flex-col">
                <InfoRow
                    icon={Money01Icon}
                    label="Consultation Fee"
                    value={<span className="text-base font-bold text-primary">{feeLabel}</span>}
                />
                <InfoRow icon={CheckmarkCircle01Icon} label="Available Today" value={
                    slots > 0
                        ? <span className="font-bold text-primary">{slots} Slots</span>
                        : <span className="font-bold text-red-500">Not Available</span>
                } />
                <InfoRow icon={HourglassIcon} label="Average Waiting Time" value={
                    <span className="font-bold text-foreground">
                        {doctor.avgWaitingTime ? `${doctor.avgWaitingTime} Min` : "N/A"}
                    </span>
                } />
            </div>
            <div className="mt-4">
                <Button onClick={onBookNow} className="h-11 w-full gap-2 rounded-xl text-sm font-semibold">
                    <HugeiconsIcon icon={Calendar01Icon} size={16} />
                    Book Appointment
                </Button>
            </div>
        </div>
    );
}

/* ── Serial Status Content ── */
function SerialStatusContent({ doctor }: { doctor: Doctor }) {
    const sessionText = findNextSession(doctor);
    const bookingType = deriveBookingType(doctor);

    const rows = [
        { icon: Clock01Icon, label: "Next Available Session", value: sessionText, bold: true },
        { icon: CalendarCheckIn01Icon, label: "Booking Type", value: bookingType, bold: true },
        { icon: HourglassIcon, label: "Estimated Waiting Time", value: doctor.avgWaitingTime ? `${doctor.avgWaitingTime} Min` : "N/A", bold: false },
        { icon: SecurityCheckIcon, label: "Emergency Priority", value: "Emergency cases may\naffect schedule.", bold: false, muted: true },
    ];

    return (
        <div className="flex flex-col divide-y divide-gray-100">
            {rows.map((row, idx) => (
                <div key={idx} className="flex items-start justify-between gap-4 py-3.5">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                            <HugeiconsIcon icon={row.icon} size={15} className="text-primary" />
                        </div>
                        <span className="text-sm font-medium text-foreground">{row.label}</span>
                    </div>
                    <span className={cn(
                        "whitespace-pre-line text-right text-xs",
                        row.bold ? "font-bold text-foreground" : "text-muted-foreground",
                    )}>
                        {row.value}
                    </span>
                </div>
            ))}
            <div className="flex items-start gap-2 rounded-xl bg-muted/30 px-3 py-2.5 mt-2">
                <HugeiconsIcon icon={Alert01Icon} size={13} className="text-muted-foreground mt-0.5 shrink-0" />
                <p className="text-2xs text-muted-foreground leading-relaxed">
                    Schedule may change due to emergency cases or doctor availability.
                </p>
            </div>
        </div>
    );
}

/* ── Chamber Schedule Content ── */
function ChamberScheduleContent({ doctor }: { doctor: Doctor }) {
    const loc = doctor.locationSchedules?.[0];
    const chamberPhone = doctor.chambers?.[0]?.phone;
    if (!loc) return <p className="text-sm text-muted-foreground">No schedule available.</p>;

    const sortedSchedules = [...loc.schedules].sort(
        (a, b) => DAYS_ORDER.indexOf(a.day) - DAYS_ORDER.indexOf(b.day)
    );

    return (
        <div>
            <div className="flex items-start justify-between gap-3 mb-1">
                <div className="flex-1 min-w-0">
                    <Link href={`/hospitals/${loc.hospitalId}`} className="text-sm font-medium text-foreground hover:text-primary transition-colors leading-snug">
                        {loc.hospitalName}
                    </Link>
                    {loc.hospitalAddress && (
                        <p className="mt-0.5 text-sm text-gray-500 leading-snug">{loc.hospitalAddress}</p>
                    )}
                </div>
                {chamberPhone && (
                    <a
                        href={`tel:${chamberPhone}`}
                        className="flex shrink-0 items-center gap-1.5 rounded-xl border border-primary/30 bg-primary/10 px-3 py-2 text-xs font-semibold text-primary transition-colors hover:bg-primary/15"
                    >
                        <HugeiconsIcon icon={Call02Icon} size={13} />
                        Call Chamber
                    </a>
                )}
            </div>
            <div className="overflow-hidden rounded-xl border border-gray-200 mt-4">
                <div className="grid grid-cols-3 border-b border-gray-200 px-4 py-3">
                    <span className="text-sm font-semibold text-gray-500">Day</span>
                    <span className="text-sm font-semibold text-gray-500">Time</span>
                    <span className="text-sm font-semibold text-gray-500">Serial Status</span>
                </div>
                {sortedSchedules.map((sched, idx) => (
                    <div key={idx} className="grid grid-cols-3 items-center border-b border-gray-100 px-4 py-4 last:border-0">
                        <span className="text-sm text-gray-800">{sched.day}</span>
                        <span className={cn("text-sm", sched.isAvailable ? "text-gray-800" : "text-red-500")}>
                            {sched.isAvailable ? `${to12h(sched.startTime)} - ${to12h(sched.endTime)}` : "Closed"}
                        </span>
                        <span className={cn("text-sm font-semibold", sched.isAvailable ? "text-primary" : "text-red-500")}>
                            {sched.isAvailable ? "Available" : "Not Available"}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

/* ── Desktop Appointment Info Card ── */
function DesktopAppointmentCard({ doctor, onBookNow }: { doctor: Doctor; onBookNow?: () => void }) {
    const { slots, maxDailyCapacity } = computeScheduleStats(doctor);
    const displayFee = doctor.minFee ?? doctor.fee;
    const feeLabel = displayFee > 0 ? `From ৳${displayFee.toLocaleString()}` : "N/A";
    return (
        <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
            <div className="flex items-center gap-3 border-b border-border px-5 py-4">
                <IconBox icon={SecurityCheckIcon} size={18} />
                <h3 className="text-base font-bold text-primary">Appointment Information</h3>
            </div>
            <div className="flex flex-col px-5">
                <InfoRow
                    icon={Money01Icon}
                    label="Consultation Fee"
                    value={<span className="text-base font-bold text-primary">{feeLabel}</span>}
                />
                <InfoRow icon={CheckmarkCircle01Icon} label="Available Today" value={
                    slots > 0
                        ? <span className="font-bold text-primary">{slots} Slots</span>
                        : <span className="font-bold text-red-500">Not Available</span>
                } />
                <InfoRow icon={HourglassIcon} label="Average Waiting Time" value={
                    <span className="font-bold text-foreground">
                        {doctor.avgWaitingTime ? `${doctor.avgWaitingTime} Min` : "N/A"}
                    </span>
                } />
            </div>
            <div className="px-5 py-4">
                <Button onClick={onBookNow} className="h-11 w-full gap-2 rounded-xl text-sm font-semibold">
                    <HugeiconsIcon icon={Calendar01Icon} size={16} />
                    Book Appointment
                </Button>
            </div>
        </div>
    );
}

/* ── Desktop Chamber Schedule Card ── */
function DesktopChamberCard({ doctor }: { doctor: Doctor }) {
    return (
        <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
            <div className="flex items-center gap-3 border-b border-border px-5 py-4">
                <IconBox icon={Calendar03Icon} size={18} />
                <h3 className="text-base font-bold text-primary">Chamber Schedule</h3>
            </div>
            <div className="px-5 py-4">
                <ChamberScheduleContent doctor={doctor} />
            </div>
        </div>
    );
}

/* ── Main Export ── */
export const DoctorProfileTabs = ({
    doctor,
    reviews,
    faqs,
    awards: _awards,
    conditions: _conditions,
    insurances: _insurances,
    onBookNow,
}: TDoctorProfileTabsProps) => {
    const hasFaqs = faqs && faqs.length > 0;
    return (
        <div className="w-full">
            <Tabs defaultValue="overview" className="w-full">
                {/* Tab Headers */}
                <div className="mb-6 w-full overflow-hidden rounded-md border border-gray-200 bg-white dark:border-border dark:bg-card">
                    <TabsPrimitive.List className="flex w-full">
                        <TabsPrimitive.Trigger
                            value="overview"
                            className={cn(
                                "relative px-5 py-3.5 text-sm font-semibold text-gray-500",
                                "transition-colors hover:text-gray-700 dark:hover:text-foreground",
                                "focus-visible:outline-none",
                                "data-[state=active]:bg-primary/[0.05] data-[state=active]:text-primary",
                                "after:absolute after:bottom-0 after:left-0 after:right-0 after:h-1 after:bg-primary",
                                "after:content-[''] after:opacity-0 after:transition-opacity",
                                "data-[state=active]:after:opacity-100",
                                "md:px-6 md:py-4 md:font-bold lg:px-8 lg:py-5 lg:text-base xl:py-6 xl:text-lg",
                            )}
                        >
                            Overview
                        </TabsPrimitive.Trigger>
                        <TabsPrimitive.Trigger
                            value="chamber-info"
                            className={cn(
                                "relative px-5 py-3.5 text-sm font-semibold text-gray-500",
                                "transition-colors hover:text-gray-700 dark:hover:text-foreground",
                                "focus-visible:outline-none",
                                "data-[state=active]:bg-primary/[0.05] data-[state=active]:text-primary",
                                "after:absolute after:bottom-0 after:left-0 after:right-0 after:h-1 after:bg-primary",
                                "after:content-[''] after:opacity-0 after:transition-opacity",
                                "data-[state=active]:after:opacity-100",
                                "md:px-6 md:py-4 md:font-bold lg:px-8 lg:py-5 lg:text-base xl:py-6 xl:text-lg",
                            )}
                        >
                            Chamber Info
                        </TabsPrimitive.Trigger>
                        {hasFaqs && (
                            <TabsPrimitive.Trigger
                                value="faq"
                                className={cn(
                                    "relative px-5 py-3.5 text-sm font-semibold text-gray-500",
                                    "transition-colors hover:text-gray-700 dark:hover:text-foreground",
                                    "focus-visible:outline-none",
                                    "data-[state=active]:bg-primary/[0.05] data-[state=active]:text-primary",
                                    "after:absolute after:bottom-0 after:left-0 after:right-0 after:h-1 after:bg-primary",
                                    "after:content-[''] after:opacity-0 after:transition-opacity",
                                    "data-[state=active]:after:opacity-100",
                                    "md:px-6 md:py-4 md:font-bold lg:px-8 lg:py-5 lg:text-base xl:py-6 xl:text-lg",
                                )}
                            >
                                FAQ
                            </TabsPrimitive.Trigger>
                        )}
                    </TabsPrimitive.List>
                </div>

                {/* Overview Tab */}
                <TabsContent value="overview" className="mt-0 outline-hidden">
                    {/* Mobile: 4 accordion rows */}
                    <div className="flex flex-col gap-3 lg:hidden">
                        <MobileAccordionRow title="About the Doctor" icon={User02Icon}>
                            <div className="flex flex-col gap-5">
                                {doctor.about && (
                                    <div>
                                        <p className="text-sm leading-relaxed text-muted-foreground">{doctor.about}</p>
                                        {doctor.bmdcRegNo && (
                                            <div className="mt-3 flex items-center gap-2">
                                                <span className="text-xs font-medium text-muted-foreground">BMDC Reg. No.</span>
                                                <Badge variant="outline" className="border-primary/20 bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-md">
                                                    {doctor.bmdcRegNo}
                                                </Badge>
                                            </div>
                                        )}
                                    </div>
                                )}
                                {((doctor.services && doctor.services.length > 0) || (doctor.specializations && doctor.specializations.length > 0)) && (
                                    <div>
                                        <SectionHeader icon={Briefcase02Icon} title="Expertise & Specializations" />
                                        <div className="flex flex-wrap gap-2">
                                            {doctor.services?.map((s, i) => (
                                                <span key={i} className="rounded-md border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">{s}</span>
                                            ))}
                                            {doctor.specializations?.map((s, i) => (
                                                <span key={i} className="rounded-md border border-border bg-muted/30 px-3 py-1 text-xs font-medium text-foreground">{s.name}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {doctor.educations && doctor.educations.length > 0 && (
                                    <div>
                                        <SectionHeader icon={Mortarboard01Icon} title="Education & Training" />
                                        <ul className="flex flex-col gap-2">
                                            {doctor.educations.map((edu, i) => (
                                                <li key={i} className="flex items-start gap-2.5">
                                                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                                                    <span className="text-sm font-medium text-foreground leading-relaxed">{edu}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </MobileAccordionRow>
                        <MobileAccordionRow title="Appointment Information" icon={SecurityCheckIcon}>
                            <MobileAppointmentContent doctor={doctor} onBookNow={onBookNow} />
                        </MobileAccordionRow>
                        <MobileAccordionRow title="Today's Serial Status" icon={RecordIcon}>
                            <SerialStatusContent doctor={doctor} />
                        </MobileAccordionRow>
                        <MobileAccordionRow title="Chamber Schedule" icon={Calendar03Icon}>
                            <ChamberScheduleContent doctor={doctor} />
                        </MobileAccordionRow>
                    </div>

                    {/* Desktop: 2×2 grid — row 2 aligns Serial Status & Chamber Schedule */}
                    <div className="hidden lg:grid lg:grid-cols-2 lg:gap-4">
                        {/* [row 1, col 1] About the Doctor */}
                        <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
                            {/* Card header */}
                            <div className="flex items-center gap-3 border-b border-border px-5 py-4">
                                <IconBox icon={User02Icon} size={18} />
                                <h3 className="text-base font-bold text-primary">About the Doctor</h3>
                            </div>
                            <div className="px-6 py-5">
                                {/* Bio */}
                                {doctor.about && (
                                    <div className="mb-5">
                                        <p className="text-sm leading-relaxed text-muted-foreground">{doctor.about}</p>
                                        {doctor.bmdcRegNo && (
                                            <div className="mt-3 flex items-center gap-2">
                                                <span className="text-xs font-medium text-muted-foreground">BMDC Reg. No.</span>
                                                <Badge variant="outline" className="border-primary/20 bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-md">
                                                    {doctor.bmdcRegNo}
                                                </Badge>
                                            </div>
                                        )}
                                    </div>
                                )}
                                {/* Expertise */}
                                {((doctor.services && doctor.services.length > 0) || (doctor.specializations && doctor.specializations.length > 0)) && (
                                    <div className="border-t border-border pt-5 mb-5">
                                        <SectionHeader icon={Briefcase02Icon} title="Expertise & Specializations" />
                                        <div className="flex flex-wrap gap-2">
                                            {doctor.services?.map((service, idx) => (
                                                <span key={`svc-${idx}`} className="rounded-md border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">{service}</span>
                                            ))}
                                            {doctor.specializations?.map((spec, idx) => (
                                                <span key={`spec-${idx}`} className="rounded-md border border-border bg-muted/30 px-3 py-1 text-xs font-medium text-foreground break-words max-w-full">{spec.name}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {/* Education */}
                                {doctor.educations && doctor.educations.length > 0 && (
                                    <div className="border-t border-border pt-5">
                                        <SectionHeader icon={Mortarboard01Icon} title="Education & Training" />
                                        <ul className="flex flex-col gap-2">
                                            {doctor.educations.map((edu, idx) => (
                                                <li key={idx} className="flex items-start gap-2.5">
                                                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                                                    <span className="text-sm font-medium text-foreground leading-relaxed">{edu}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* [row 1, col 2] Appointment Information */}
                        <DesktopAppointmentCard doctor={doctor} onBookNow={onBookNow} />

                        {/* [row 2, col 1] Today's Serial Status */}
                        <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
                            <div className="flex items-center gap-3 border-b border-border px-5 py-4">
                                <IconBox icon={Calendar01Icon} size={18} />
                                <h3 className="text-base font-bold text-primary">Today&apos;s Serial Status</h3>
                            </div>
                            <div className="px-5 py-4">
                                <SerialStatusContent doctor={doctor} />
                            </div>
                        </div>

                        {/* [row 2, col 2] Chamber Schedule */}
                        {doctor.locationSchedules && doctor.locationSchedules.length > 0
                            ? <DesktopChamberCard doctor={doctor} />
                            : <div />
                        }
                    </div>

                </TabsContent>

                {/* Chamber Info Tab */}
                <TabsContent value="chamber-info" className="mt-0 outline-hidden">
                    <DoctorLocationsTab doctor={doctor} onBookNow={onBookNow} doctorId={doctor.id} />
                </TabsContent>

                {/* FAQ Tab */}
                {hasFaqs && (
                    <TabsContent value="faq" className="mt-0 outline-hidden">
                        <DoctorFaqTab faqs={faqs} doctorName={doctor.name} />
                    </TabsContent>
                )}
            </Tabs>

            {/* Patient Reviews */}
            {reviews && reviews.length > 0 && (
                <div className="mt-10">
                    <div className="mb-6 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10">
                                <HugeiconsIcon icon={StarIcon} size={18} className="text-amber-400 fill-amber-400" />
                            </div>
                            <h2 className="text-base font-bold text-primary">Patient Reviews</h2>
                        </div>
                        <button className="hidden flex items-center gap-1 text-xs font-semibold text-primary hover:underline underline-offset-4">
                            View All Reviews
                            <HugeiconsIcon icon={ArrowRight01Icon} size={13} />
                        </button>
                    </div>
                    <DoctorReviewsTab
                        reviews={reviews}
                        averageRating={doctor.rating || 0}
                        totalReviews={doctor.reviewCount || 0}
                    />
                </div>
            )}
        </div>
    );
};
