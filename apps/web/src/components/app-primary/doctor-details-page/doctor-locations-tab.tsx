"use client";

import Link from "next/link";
import { getImageUrl } from "@/lib/utils";
import { Doctor } from "@/types/doctor.type";
import { LiveSerialBanner } from "@/components/common/live-serial-banner";
import {
    Call02Icon,
    HospitalIcon,
    // Location01Icon,
    Mail01Icon,
    Calendar01Icon,
    Calendar03Icon,
    CheckmarkCircle01Icon,
    Cancel01Icon,
    Notebook01Icon,
    Clock01Icon,
    // UserIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@/components/ui/button";

type TDoctorLocationsTabProps = {
    doctor: Doctor;
    onBookNow?: () => void;
    doctorId?: string;
};

const DAYS_ORDER = ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const DAY_SHORT: Record<string, string> = {
    Saturday: "Sat",
    Sunday: "Sun",
    Monday: "Mon",
    Tuesday: "Tue",
    Wednesday: "Wed",
    Thursday: "Thu",
    Friday: "Fri",
};

import { parse, format } from "date-fns";

function to12h(time: string): string {
    if (!time || !time.includes(":")) return time;
    try { return format(parse(time, "HH:mm", new Date()), "h:mm a"); } catch { return time; }
}

function scheduleSummary(schedules: { day: string; startTime: string; endTime: string; isAvailable: boolean }[]): string {
    const avail = schedules.filter((s) => s.isAvailable);
    if (avail.length === 0) return "No Schedule";
    const first = avail[0];
    const sameTime = avail.every((s) => s.startTime === first.startTime && s.endTime === first.endTime);
    const timeRange = `${to12h(first.startTime)} - ${to12h(first.endTime)}`;
    if (sameTime) {
        const days = avail.map((s) => DAY_SHORT[s.day] ?? s.day.slice(0, 3)).join(", ");
        return `${days}  ${timeRange}`;
    }
    return `${DAY_SHORT[first.day] ?? first.day.slice(0, 3)}  ${timeRange}`;
}

export const DoctorLocationsTab = ({ doctor, onBookNow, doctorId }: TDoctorLocationsTabProps) => {
    const locations = doctor.locationSchedules || [];

    if (locations.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center rounded-xl border border-dashed border-border">
                <div className="bg-muted/20 mb-4 flex h-14 w-14 items-center justify-center rounded-xl">
                    <HugeiconsIcon icon={HospitalIcon} size={24} className="text-muted-foreground" />
                </div>
                <h3 className="text-sm font-semibold text-foreground">No chambers listed</h3>
                <p className="text-muted-foreground mt-1 max-w-xs text-xs font-medium">
                    This doctor has no active clinical location schedules.
                </p>
            </div>
        );
    }

    // Summary bar at top
    const totalChambers = locations.length;
    const today = format(new Date(), "EEEE");
    const locWithToday = locations.find((l) => l.schedules.some((s) => s.day === today && s.isAvailable));
    const firstLoc = locWithToday || locations[0];
    const todaySched = firstLoc.schedules.find((s) => s.day === today && s.isAvailable);
    const hasOnlineBooking = doctor.chambers.some((ch) => ch.consultationMethod.includes("VIRTUAL"));

    return (
        <div className="flex flex-col gap-6">
            {/* Summary stats row */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {/* Total Chambers */}
                <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 lg:flex-col lg:items-start lg:p-5">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                        <HugeiconsIcon icon={Notebook01Icon} size={28} className="text-primary" />
                    </div>
                    <div className="min-w-0 lg:w-full">
                        <div className="text-sm text-muted-foreground mb-1">Total Chambers</div>
                        <div className="text-2xl font-bold text-foreground">{totalChambers}</div>
                        <div className="text-sm font-medium text-primary">Hospitals / Centers</div>
                    </div>
                </div>

                {/* Next Available Chamber */}
                <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 lg:flex-col lg:items-start lg:p-5">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                        <HugeiconsIcon icon={Calendar03Icon} size={28} className="text-primary" />
                    </div>
                    <div className="min-w-0 lg:w-full">
                        <div className="text-sm text-muted-foreground mb-1">Next Available Chamber</div>
                        <div className="text-base font-bold text-foreground truncate">{firstLoc.hospitalName}</div>
                        <div className="text-sm font-medium text-primary truncate">
                            {todaySched ? `Today, ${to12h(todaySched.startTime)} – ${to12h(todaySched.endTime)}` : "No availability today"}
                        </div>
                    </div>
                </div>

                {/* Today's Available Time */}
                <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 lg:flex-col lg:items-start lg:p-5">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                        <HugeiconsIcon icon={Clock01Icon} size={28} className="text-primary" />
                    </div>
                    <div className="min-w-0 lg:w-full">
                        <div className="text-sm text-muted-foreground mb-1">{"Today's Available Time"}</div>
                        <div className="text-base font-bold text-foreground">
                            {todaySched ? `${to12h(todaySched.startTime)} – ${to12h(todaySched.endTime)}` : "N/A"}
                        </div>
                        <div className="text-sm font-medium text-primary">{today}</div>
                    </div>
                </div>

                {/* Online Booking */}
                <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 lg:flex-col lg:items-start lg:p-5">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                        <HugeiconsIcon icon={CheckmarkCircle01Icon} size={28} className="text-primary" />
                    </div>
                    <div className="min-w-0 lg:w-full">
                        <div className="text-sm text-muted-foreground mb-1">Online Booking</div>
                        <div className="text-base font-bold text-foreground">
                            {hasOnlineBooking ? "Available" : "Not Available"}
                        </div>
                        <div className="text-sm font-medium text-primary">
                            {hasOnlineBooking ? "Instant Confirmation" : "In-Person Only"}
                        </div>
                    </div>
                </div>
            </div>

            {/* Active Hospitals */}
            {doctorId && <LiveSerialBanner type="doctor" id={doctorId} />}

            {/* Chamber cards */}
            {locations.map((loc) => {
                const sortedSchedules = [...loc.schedules].sort(
                    (a, b) => DAYS_ORDER.indexOf(a.day) - DAYS_ORDER.indexOf(b.day)
                );
                const locTodaySched = loc.schedules.find((s) => s.day === today && s.isAvailable);

                return (
                    /* Mobile: two stacked cards; Desktop: outer card wrapping two inner cards */
                    <div
                        key={loc.hospitalId}
                        className="flex flex-col gap-4 lg:flex-row lg:gap-4 lg:rounded-2xl lg:border lg:border-border lg:bg-muted/30 lg:p-4 lg:shadow-sm"
                    >
                        {/* LEFT: Hospital info */}
                        <div className="relative flex flex-col gap-4 rounded-md border border-border bg-card p-5 lg:flex-none lg:w-[42%]">
                            <div className="flex flex-col items-center gap-2 sm:flex-row sm:items-start sm:gap-4">
                                {/* Logo — rounded-full with ring */}
                                <div className="relative h-[88px] w-[88px] shrink-0 overflow-hidden rounded-full bg-primary/10 ring-2 ring-primary/20">
                                    {loc.hospitalLogo ? (
                                        <img
                                            src={getImageUrl(loc.hospitalLogo)}
                                            alt={loc.hospitalName}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center">
                                            <HugeiconsIcon icon={HospitalIcon} size={30} className="text-primary/40" />
                                        </div>
                                    )}
                                </div>

                                {/* Info */}
                                <div className="flex min-w-0 flex-1 flex-col items-center gap-0.5 text-center sm:items-start sm:pt-1 sm:text-left">
                                    <h3 className="text-xl font-bold leading-tight text-foreground">
                                        <Link href={`/hospitals/${loc.hospitalId}`} className="transition-colors hover:text-primary">
                                            {loc.hospitalName}
                                        </Link>
                                    </h3>
                                    {loc.hospitalAddress && (
                                        <span className="text-sm text-muted-foreground leading-snug line-clamp-2">
                                            {loc.hospitalAddress}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Contact details */}
                            <div className="flex flex-col gap-2.5">
                                {loc.hospitalPhone && (
                                    <div className="flex items-center gap-2">
                                        <HugeiconsIcon icon={Call02Icon} size={15} className="text-primary shrink-0" />
                                        <span className="text-sm text-muted-foreground">{loc.hospitalPhone}</span>
                                    </div>
                                )}
                                {loc.hospitalEmail && (
                                    <div className="flex items-center gap-2">
                                        <HugeiconsIcon icon={Mail01Icon} size={15} className="text-primary shrink-0" />
                                        <span className="text-sm text-muted-foreground truncate">{loc.hospitalEmail}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* RIGHT: Schedule */}
                        <div className="rounded-2xl border border-border bg-card p-5 lg:flex-1">
                            {/* Available Today */}
                            {locTodaySched && (
                                <div className="flex items-center gap-1.5">
                                    <div className="h-2 w-2 rounded-full bg-primary" />
                                    <span className="text-sm font-semibold text-primary">Available Today</span>
                                </div>
                            )}

                            {/* Next Available label + time */}
                            <div className="mt-1 text-sm text-muted-foreground">Next Available</div>
                            <div className="mt-1 flex items-center gap-2">
                                <HugeiconsIcon icon={Clock01Icon} size={20} className="text-amber-500 shrink-0" />
                                <span className="text-2xl font-bold text-foreground">
                                    {locTodaySched
                                        ? `${to12h(locTodaySched.startTime)} - ${to12h(locTodaySched.endTime)}`
                                        : scheduleSummary(sortedSchedules)}
                                </span>
                            </div>

                            {/* Weekly Schedule */}
                            <div className="mt-4 text-sm font-semibold text-foreground mb-3">Weekly Schedule</div>
                            <div className="grid grid-cols-4 gap-2 md:grid-cols-7">
                                {sortedSchedules.map((sched, idx) => {
                                    const isActiveDay = sched.day === today && sched.isAvailable;
                                    return (
                                        <div
                                            key={idx}
                                            className={`flex flex-col items-center justify-center rounded-lg border py-2.5 px-1 gap-0.5 ${
                                                isActiveDay
                                                    ? "bg-primary border-primary"
                                                    : "bg-card border-border"
                                            }`}
                                        >
                                            <span className={`text-xs font-bold ${isActiveDay ? "text-white" : "text-foreground"}`}>
                                                {DAY_SHORT[sched.day] ?? sched.day.slice(0, 3)}
                                            </span>
                                            {sched.isAvailable ? (
                                                <>
                                                    <span className={`text-2xs leading-tight ${isActiveDay ? "text-white/80" : "text-muted-foreground"}`}>
                                                        {to12h(sched.startTime)}
                                                    </span>
                                                    <span className={`text-2xs leading-tight ${isActiveDay ? "text-white/80" : "text-muted-foreground"}`}>
                                                        {to12h(sched.endTime)}
                                                    </span>
                                                </>
                                            ) : (
                                                <span className="text-2xs font-semibold text-red-500 leading-tight">Closed</span>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Action buttons — mobile: Call first then Book; desktop: Book flex-1 then Call */}
                            <div className="mt-5 flex flex-col gap-3 md:flex-row">
                                {loc.hospitalPhone && (
                                    <Button
                                        variant="outline"
                                        className="order-1 md:order-2 w-full md:w-auto gap-2 rounded-xl h-11 text-sm font-semibold border-border"
                                        onClick={() => window.open(`tel:${loc.hospitalPhone}`, "_self")}
                                    >
                                        <HugeiconsIcon icon={Call02Icon} size={16} />
                                        Call Chamber
                                    </Button>
                                )}
                                <Button
                                    onClick={onBookNow}
                                    className="order-2 md:order-1 md:flex-1 w-full gap-2 rounded-xl h-11 text-sm font-semibold"
                                >
                                    <HugeiconsIcon icon={Calendar01Icon} size={16} />
                                    Book Appointment
                                </Button>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
