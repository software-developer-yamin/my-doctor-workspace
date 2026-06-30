"use client";

import { getImageUrl } from "@/lib/utils";
import { Doctor } from "@/types/doctor.type";
import {
    DiplomaIcon,
    StarIcon,
    UserGroupIcon,
    Award01Icon,
    ThumbsUpIcon,
    Calendar01Icon,
    Clock01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Image from "next/image";

type TDoctorHeroProps = {
    doctor: Doctor;
    onBookNow?: () => void;
};

export const DoctorHero = ({ doctor, onBookNow: _onBookNow }: TDoctorHeroProps) => {
    const stats = [
        {
            icon: StarIcon,
            iconBg: "bg-amber-100",
            iconClass: "text-amber-400 fill-amber-400",
            value: doctor.rating && Number(doctor.rating) > 0 ? `${Number(doctor.rating).toFixed(1)}/5.0` : "—",
            label: "Patient Rating",
            mobileLabel: "Patient Rating",
        },
        {
            icon: UserGroupIcon,
            iconBg: "bg-primary/10",
            iconClass: "text-primary",
            value: doctor.reviewCount > 0 ? `${doctor.reviewCount}+` : doctor.totalPatients ? `${doctor.totalPatients}+` : "—",
            label: "Patients Reviewed",
            mobileLabel: "Reviewed",
        },
        {
            icon: Award01Icon,
            iconBg: "bg-primary/10",
            iconClass: "text-primary",
            value: doctor.experience ? `${doctor.experience}+ Yrs` : "—",
            label: "Experience",
            mobileLabel: "Experience",
        },
        {
            icon: ThumbsUpIcon,
            iconBg: "bg-primary/10",
            iconClass: "text-primary",
            value: doctor.positiveReviewPercentage
                ? `${doctor.positiveReviewPercentage}%`
                : "—",
            label: "Positive Reviews",
            mobileLabel: "Reviews",
        },
        {
            icon: Clock01Icon,
            iconBg: "bg-teal-50",
            iconClass: "text-teal-600",
            value: doctor.avgWaitingTime ? `~${doctor.avgWaitingTime} min` : "N/A",
            label: "Avg Wait Time",
            mobileLabel: "Wait Time",
        },
    ];

    return (
        <div className="w-full overflow-hidden rounded-2xl border border-border bg-white shadow-sm dark:bg-card">

            {/* Profile section — white on mobile, gradient on md+ */}
            <div className="relative bg-white px-5 py-6 md:bg-gradient-to-r md:from-[#daf0e3] md:via-[#f0f9f4] md:to-white md:px-8 md:py-10 lg:px-10 lg:py-12">

                {/* Avatar + info */}
                <div className="flex items-start gap-4 md:items-center md:gap-6 lg:gap-8">

                    {/* Mobile avatar: square rounded, no ring, no dot */}
                    <div className="relative h-[100px] w-[100px] shrink-0 overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 md:hidden">
                        <Image
                            src={getImageUrl(doctor.photo) ?? ""}
                            alt={doctor.name}
                            fill
                            className="object-cover"
                            sizes="100px"
                            priority
                        />
                    </div>

                    {/* Tablet/desktop avatar: circle with white ring + green online dot */}
                    <div className="relative hidden shrink-0 md:block">
                        <div className="rounded-full bg-white p-2.5 shadow-md lg:p-3">
                            <div className="relative h-[120px] w-[120px] overflow-hidden rounded-full bg-sky-100 lg:h-[158px] lg:w-[158px]">
                                <Image
                                    src={getImageUrl(doctor.photo) ?? ""}
                                    alt={doctor.name}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 1024px) 120px, 158px"
                                    priority
                                />
                            </div>
                        </div>
                        <span className="absolute right-1.5 top-1.5 h-4 w-4 rounded-full border-2 border-white bg-primary lg:right-2 lg:top-2 lg:h-[18px] lg:w-[18px]" />
                    </div>

                    {/* Doctor info */}
                    <div className="flex flex-1 flex-col gap-1.5 min-w-0">

                        {/* Name + BMDC badge */}
                        <div className="flex flex-wrap items-center gap-2">
                            <h1 className="text-2xl font-bold text-gray-900 leading-tight md:text-[30px] lg:text-[40px]">
                                {doctor.name}
                            </h1>
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600 md:px-2.5 md:py-[3px] md:text-2xs">
                                <HugeiconsIcon icon={DiplomaIcon} size={12} />
                                BMDC Verified
                            </span>
                        </div>

                        {/* Degrees */}
                        {doctor.degrees && doctor.degrees.length > 0 && (
                            <p className="text-sm font-semibold text-primary leading-snug md:text-body lg:text-[17px]">
                                {doctor.degrees.join(", ")}
                            </p>
                        )}

                        {/* Department */}
                        <div className="mt-1 flex items-center gap-2.5">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10">
                                <HugeiconsIcon icon={Calendar01Icon} size={16} className="text-primary" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-micro font-bold uppercase tracking-[0.12em] text-gray-400">
                                    Department
                                </span>
                                <span className="text-xs font-semibold text-gray-800 md:text-body-sm lg:text-body">
                                    {doctor.primarySpecialty}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats row: 2-col on narrow mobile, 3-col at sm, 5-col at lg */}
                <div className="mt-6 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5 md:mt-8 lg:mt-10 lg:gap-3">
                    {stats.map((stat, idx) => (
                        <div
                            key={idx}
                            className="flex items-center gap-2.5 rounded-2xl border border-gray-200 bg-white px-3 py-3 shadow-sm md:px-3.5 lg:gap-3 lg:px-4 lg:py-3.5 dark:bg-card dark:border-border"
                        >
                            <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl lg:h-10 lg:w-10 ${stat.iconBg}`}>
                                <HugeiconsIcon icon={stat.icon} size={18} className={stat.iconClass} />
                            </div>
                            <div className="flex flex-col min-w-0">
                                <span className="text-body font-bold text-gray-900 leading-tight lg:text-[17px] dark:text-foreground">
                                    {stat.value}
                                </span>
                                <span className="text-2xs text-gray-500 leading-snug lg:text-xs dark:text-muted-foreground">
                                    <span className="sm:hidden">{stat.mobileLabel}</span>
                                    <span className="hidden sm:inline">{stat.label}</span>
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
