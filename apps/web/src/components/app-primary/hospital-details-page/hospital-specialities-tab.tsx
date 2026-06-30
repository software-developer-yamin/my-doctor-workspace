"use client";

import { Hospital } from "@/types/hospital.type";
import { Settings01Icon, StethoscopeIcon, CheckmarkCircle01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

type THospitalSpecialitiesTabProps = {
    hospital: Hospital;
};

export const HospitalSpecialitiesTab = ({ hospital }: THospitalSpecialitiesTabProps) => {
    return (
        <div className="flex flex-col gap-8">
            {/* Specialities */}
            <section>
                <div className="mb-4 flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/8 text-primary">
                        <HugeiconsIcon icon={StethoscopeIcon} size={16} />
                    </div>
                    <h3 className="text-sm font-semibold text-foreground">Medical Specialities</h3>
                </div>

                {hospital.specialities && hospital.specialities.length > 0 ? (
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {hospital.specialities.map((speciality) => (
                            <div
                                key={speciality._id}
                                className="flex items-center gap-3 rounded-xl border border-border bg-card p-4"
                            >
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                                    <HugeiconsIcon icon={CheckmarkCircle01Icon} size={16} className="text-primary" />
                                </div>
                                <p className="text-sm font-medium text-foreground leading-tight">
                                    {speciality.name}
                                </p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="rounded-xl border border-dashed border-border py-12 text-center">
                        <p className="text-sm font-medium text-muted-foreground">
                            No specialities listed yet.
                        </p>
                    </div>
                )}
            </section>

            {/* Facilities */}
            {hospital.facilities && hospital.facilities.length > 0 && (
                <section>
                    <div className="mb-4 flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary/10 text-secondary">
                            <HugeiconsIcon icon={Settings01Icon} size={16} />
                        </div>
                        <h3 className="text-sm font-semibold text-foreground">Facilities</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {hospital.facilities.map((facility, idx) => (
                            <div
                                key={idx}
                                className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 px-3.5 py-2 text-xs font-medium text-foreground"
                            >
                                <div className="h-1.5 w-1.5 rounded-full bg-secondary" />
                                {facility}
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
};
