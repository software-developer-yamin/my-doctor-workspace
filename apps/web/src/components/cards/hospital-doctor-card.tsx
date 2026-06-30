"use client";

import { Button } from "@/components/ui/button";
import { Phantom } from "@/components/ui/phantom";
import { getImageUrl } from "@/lib/utils";
import { Doctor } from "@/types/doctor.type";
import {
    ArrowRight01Icon,
    CheckmarkCircle02Icon,
    CancelCircleIcon,
    StethoscopeIcon,
    Calendar01Icon
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import Image from "next/image";

import { TLiveQueue } from "@/types/queue.type";

type HospitalDoctorCardProps = {
    doctor?: Doctor & { consultationFee?: number; followUpFee?: number };
    schedules?: Array<{
        day: string;
        startTime: string;
        endTime: string;
        isAvailable: boolean;
    }>;
    loading?: boolean;
};

export const HospitalDoctorCard = ({ doctor, schedules = [], loading = false }: HospitalDoctorCardProps) => {
    const d = doctor ?? ({} as Doctor & { consultationFee?: number; followUpFee?: number });

    return (
        <Phantom loading={loading}>
            <div className="relative overflow-hidden rounded-[2rem] border border-border bg-card p-1 shadow-sm">
                <div className="flex flex-col gap-6 p-5 sm:p-8 lg:flex-row lg:items-center lg:gap-10">

                    {/* ── Avatar Section ── */}
                    <div className="relative shrink-0 self-center">
                        <Link href={d.slug ? `/doctors/${d.slug}` : "#"} className="block">
                            <div className="relative h-32 w-32 overflow-hidden rounded-3xl border-4 border-card bg-muted shadow-2xl sm:h-40 sm:w-40">
                                {d.photo && !d.photo.includes("default") ? (
                                    <Image
                                        src={getImageUrl(d.photo) ?? ""}
                                        alt={d.name ?? ""}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center bg-primary/5">
                                        <HugeiconsIcon icon={StethoscopeIcon} size={40} className="text-primary/20" />
                                    </div>
                                )}
                            </div>
                        </Link>
                        <div className="absolute -bottom-2 -right-2 flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg ring-4 ring-card">
                            <HugeiconsIcon icon={CheckmarkCircle02Icon} size={20} />
                        </div>
                    </div>

                    {/* ── Info & Content ── */}
                    <div className="flex flex-1 flex-col justify-center">
                        <div className="flex flex-wrap items-center gap-3">
                            <Link href={d.slug ? `/doctors/${d.slug}` : "#"}>
                                <h3 className="text-xl font-bold text-foreground md:text-3xl">
                                    {d.name}
                                </h3>
                            </Link>
                            <span className="rounded-xl border border-primary/20 bg-primary/5 px-3 py-1 text-2xs font-semibold text-primary">
                                {d.primarySpecialty}
                            </span>
                        </div>

                        <p className="mt-3 text-sm font-medium leading-relaxed text-muted-foreground lg:text-base">
                            {(d.degrees ?? []).join(",")}
                        </p>

                        <div className="mt-6 flex flex-wrap items-center gap-8">
                            <div className="flex flex-col gap-1">
                                <span className="text-micro font-semibold text-muted-foreground">Experience</span>
                                <span className="text-lg font-semibold text-foreground">{d.experience}</span>
                            </div>
                            <div className="h-8 w-px bg-border" />
                            <div className="flex flex-col gap-1">
                                <span className="text-micro font-semibold text-muted-foreground">Consultation</span>
                                <span className="text-lg font-semibold text-primary">৳ {d.consultationFee ?? d.fee ?? 0}</span>
                            </div>
                            {d.followUpFee != null && (
                                <>
                                    <div className="h-8 w-px bg-border" />
                                    <div className="flex flex-col gap-1">
                                        <span className="text-micro font-semibold text-muted-foreground">Follow-up</span>
                                        <span className="text-lg font-semibold text-foreground">৳ {d.followUpFee}</span>
                                    </div>
                                </>
                            )}
                            {d.bmdcRegNo && d.bmdcRegNo !== "N/A" && (
                                <>
                                    <div className="h-8 w-px bg-border" />
                                    <div className="flex flex-col gap-1">
                                        <span className="text-micro font-semibold text-muted-foreground">BMDC Reg</span>
                                        <span className="text-lg font-semibold text-foreground">{d.bmdcRegNo}</span>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* ── Schedule Column ── */}
                    <div className="border-border flex flex-col gap-4 rounded-3xl border bg-muted/30 p-6 lg:min-w-[320px]">
                        <div className="flex items-center gap-2">
                            <HugeiconsIcon icon={Calendar01Icon} size={18} className="text-primary" />
                            <h4 className="text-2xs font-semibold text-foreground">Next Available Days</h4>
                        </div>

                        <div className="grid grid-cols-1 gap-2.5">
                            {schedules.length > 0 ? (
                                schedules.slice(0, 3).map((sched, idx) => (
                                    <div key={idx} className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3">
                                        <span className="text-xs font-semibold text-foreground">{sched.day}</span>
                                        <div className="flex items-center gap-2">
                                            {sched.isAvailable ? (
                                                <div className="flex items-center gap-1.5 text-primary">
                                                    <div className="h-1 w-1 rounded-full bg-primary" />
                                                    <span className="text-micro font-semibold">{sched.startTime} - {sched.endTime}</span>
                                                </div>
                                            ) : (
                                                <span className="text-micro font-semibold text-red-500">Reserved</span>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="flex flex-col items-center justify-center py-4 text-center">
                                    <HugeiconsIcon icon={CancelCircleIcon} size={24} className="mb-2" />
                                    <p className="text-micro font-semibold leading-none">Not Shared</p>
                                </div>
                            )}
                        </div>

                        <Link href={d.slug ? `/doctors/${d.slug}` : "#"} className="mt-2 block">
                            <Button className="h-12 w-full rounded-2xl bg-foreground text-sm font-semibold text-background shadow-xl shadow-foreground/5">
                                Schedule
                                <HugeiconsIcon icon={ArrowRight01Icon} size={20} className="ml-2" />
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* ── Expertise Badges ── */}
                {d.services && d.services.length > 0 && (
                    <div className="border-border bg-muted/10 flex flex-wrap items-center gap-3 border-t px-8 py-5">
                        <span className="text-[9px] font-semibold text-muted-foreground mr-2">Top Expertise</span>
                        {d.services.slice(0, 4).map((service, i) => (
                            <span key={i} className="text-2xs font-medium text-foreground/70 cursor-default">
                                • {service}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </Phantom>
    );
};
