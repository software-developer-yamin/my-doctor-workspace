"use client";

import { Hospital } from "@/types/hospital.type";
import {
    Call02Icon,
    Mail01Icon,
    GlobalIcon,
    Location01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

type THospitalContactTabProps = {
    hospital: Hospital;
};

export const HospitalContactTab = ({ hospital }: THospitalContactTabProps) => {
    const mapEmbedUrl =
        hospital.coordinates?.lat && hospital.coordinates?.lng
            ? `https://maps.google.com/maps?q=${hospital.coordinates.lat},${hospital.coordinates.lng}&output=embed`
            : hospital.address
              ? `https://maps.google.com/maps?q=${encodeURIComponent(hospital.address)}&output=embed`
              : null;

    const directionsUrl =
        hospital.coordinates?.lat && hospital.coordinates?.lng
            ? `https://www.google.com/maps/dir/?api=1&destination=${hospital.coordinates.lat},${hospital.coordinates.lng}`
            : hospital.address
              ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hospital.address)}`
              : null;

    return (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {/* Contact Information */}
            <div className="rounded-2xl border border-border bg-card p-5">
                <h3 className="mb-5 text-xl font-bold text-foreground">
                    Contact Information
                </h3>
                <div className="flex flex-col gap-5">
                    {hospital.address && (
                        <div className="flex items-start gap-3">
                            <HugeiconsIcon
                                icon={Location01Icon}
                                size={20}
                                className="mt-0.5 shrink-0 text-primary"
                            />
                            <span className="text-sm leading-relaxed text-muted-foreground">
                                {hospital.address}
                            </span>
                        </div>
                    )}
                    {hospital.contact.phones.length > 0 && (
                        <div className="flex items-center gap-3">
                            <HugeiconsIcon
                                icon={Call02Icon}
                                size={20}
                                className="shrink-0 text-primary"
                            />
                            <a
                                href={`tel:${hospital.contact.phones[0]}`}
                                className="text-sm text-muted-foreground transition-colors hover:text-primary"
                            >
                                {hospital.contact.phones[0]}
                            </a>
                        </div>
                    )}
                    {hospital.contact.emails.length > 0 && (
                        <div className="flex items-center gap-3">
                            <HugeiconsIcon
                                icon={Mail01Icon}
                                size={20}
                                className="shrink-0 text-primary"
                            />
                            <a
                                href={`mailto:${hospital.contact.emails[0]}`}
                                className="text-sm text-muted-foreground transition-colors hover:text-primary"
                            >
                                {hospital.contact.emails[0]}
                            </a>
                        </div>
                    )}
                    {hospital.contact.web && (
                        <div className="flex items-center gap-3">
                            <HugeiconsIcon
                                icon={GlobalIcon}
                                size={20}
                                className="shrink-0 text-primary"
                            />
                            <a
                                href={hospital.contact.web}
                                target="_blank"
                                rel="noreferrer"
                                className="text-sm text-muted-foreground transition-colors hover:text-primary"
                            >
                                {hospital.contact.web.replace(/^https?:\/\//, "")}
                            </a>
                        </div>
                    )}
                </div>
            </div>

            {/* Working Hours */}
            {hospital.openingHours && hospital.openingHours.length > 0 && (() => {
                const seen = new Set<string>();
                const dedupedHours = hospital.openingHours!.filter(h => {
                    if (!h.day || seen.has(h.day)) return false;
                    seen.add(h.day);
                    return true;
                });
                return (
                    <div className="rounded-2xl border border-border bg-card p-5">
                        <h3 className="mb-5 text-xl font-bold text-foreground">
                            Opening Hours
                        </h3>
                        <div>
                            {dedupedHours.map((hour, i) => {
                                const isClosed =
                                    hour.isClosed ||
                                    hour.time?.toLowerCase() === "closed";
                                return (
                                    <div
                                        key={i}
                                        className="flex items-center justify-between border-b border-border py-3 first:pt-0 last:border-0 last:pb-0"
                                    >
                                        <div className="flex flex-col gap-0.5">
                                            <span className="text-sm font-semibold text-foreground">
                                                {hour.day}
                                            </span>
                                            {hour.time && hour.time.toLowerCase() !== "closed" && (
                                                <span className="text-xs text-muted-foreground">
                                                    {hour.time}
                                                </span>
                                            )}
                                        </div>
                                        <span
                                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                                isClosed
                                                    ? "bg-destructive/10 text-destructive"
                                                    : "bg-primary/10 text-primary"
                                            }`}
                                        >
                                            {isClosed ? "Closed" : "Open"}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            })()}

            {/* Map */}
            <div className="flex flex-col overflow-hidden rounded-2xl border border-border">
                {mapEmbedUrl ? (
                    <iframe
                        src={mapEmbedUrl}
                        className="min-h-60 w-full flex-1"
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Hospital Location"
                    />
                ) : (
                    <div className="flex min-h-60 flex-1 items-center justify-center bg-muted">
                        <span className="text-sm text-muted-foreground">
                            Map not available
                        </span>
                    </div>
                )}
                {directionsUrl && (
                    <a
                        href={directionsUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-center gap-2 bg-primary px-4 py-3.5 text-sm font-medium text-primary-foreground"
                    >
                        <HugeiconsIcon icon={Location01Icon} size={16} />
                        Get Directions
                    </a>
                )}
            </div>
        </div>
    );
};
