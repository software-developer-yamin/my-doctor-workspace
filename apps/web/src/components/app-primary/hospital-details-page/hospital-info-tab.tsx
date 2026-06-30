"use client";

import { Hospital } from "@/types/hospital.type";
import {
  Call02Icon,
  Clock01Icon,
  UserGroupIcon,
  BedIcon,
  Pulse01Icon,
  AmbulanceIcon,
  HospitalIcon,
  Calendar01Icon,
  StarIcon,
  Home01Icon,
  SmartPhone01Icon,
  HelpCircleIcon,
  SecurityCheckIcon,
  CertificateIcon,
  ArrowDown01Icon,
} from "@hugeicons/core-free-icons";
import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";

type THospitalInfoTabProps = {
  hospital: Hospital;
};

export const HospitalInfoTab = ({ hospital }: THospitalInfoTabProps) => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const emergency =
    hospital.contact?.emergency || hospital.contact?.phones?.[0];

  const hospitalType = hospital.type || "—";

  const attributes = [
    {
      label: "Established",
      value: hospital.yearsInService ? String(hospital.yearsInService) : "—",
      icon: Calendar01Icon,
    },
    {
      label: "Hospital Type",
      value: hospitalType,
      icon: HospitalIcon,
    },
    {
      label: "Rating",
      value: hospital.rating ? `${hospital.rating.toFixed(1)} / 5` : "Not Rated",
      icon: StarIcon,
    },
    {
      label: "Total Beds",
      value: hospital.stats?.totalBeds ? `${hospital.stats.totalBeds}+` : "—",
      icon: BedIcon,
    },
  ];

  const quickInfo = [
    {
      label: "Total Doctors",
      value: `${hospital.stats?.doctorsCount ?? hospital.doctors?.length ?? "—"}+`,
      icon: UserGroupIcon,
      valueClass: "text-sm font-bold text-foreground",
    },
    {
      label: "Total Beds",
      value: `${hospital.stats?.totalBeds ?? "—"}+`,
      icon: BedIcon,
      valueClass: "text-sm font-bold text-foreground",
    },
    {
      label: "ICU Beds",
      value: String(hospital.stats?.icuBeds ?? "—"),
      icon: Pulse01Icon,
      valueClass: "text-sm font-bold text-foreground",
    },
    {
      label: "Ambulance",
      value: hospital.hasAmbulance ? "Available" : "Not Available",
      icon: AmbulanceIcon,
      valueClass: hospital.hasAmbulance ? "text-sm font-bold text-primary" : "text-sm font-bold text-muted-foreground",
    },
    {
      label: "Cabin Facility",
      value: hospital.hasCabinFacility ? "Available" : "Not Available",
      icon: Home01Icon,
      valueClass: hospital.hasCabinFacility ? "text-sm font-bold text-primary" : "text-sm font-bold text-muted-foreground",
    },
    {
      label: "Visiting Hours",
      value: hospital.visitingHours || hospital.openingHours?.[0]?.time || "—",
      icon: Clock01Icon,
      valueClass: "text-sm font-bold text-foreground",
    },
  ];

  const hasFaqs = Array.isArray(hospital.faqs) && hospital.faqs.length > 0;
  const hasInsurances = Array.isArray(hospital.insurances) && hospital.insurances.length > 0;
  const hasAccreditations = Array.isArray(hospital.accreditations) && hospital.accreditations.length > 0;

  return (
    <div className="flex flex-col gap-8">
      {/* ── Top row: About/Emergency (left) + Quick Info (right) ── */}
      <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
      {/* ── Left: About + Attributes + Emergency ── */}
      <div className="flex flex-1 flex-col gap-6">
        {/* About Hospital */}
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center gap-2">
            <HugeiconsIcon
              icon={HospitalIcon}
              size={16}
              className="text-foreground shrink-0"
            />
            <h3 className="text-foreground text-base font-bold">
              About Hospital
            </h3>
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {hospital.about || hospital.description ||
              "Information about this facility is not yet available."}
          </p>
        </div>

        {/* Attributes Row */}
        <div className="sm:divide-border grid grid-cols-2 gap-4 sm:flex sm:items-stretch sm:gap-0 sm:divide-x">
          {attributes.map((attr, i) => (
            <div
              key={i}
              className="flex items-center gap-3 sm:min-w-0 sm:flex-1 sm:px-4 sm:first:pl-0 sm:last:pr-0"
            >
              <div className="bg-primary/10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
                <HugeiconsIcon
                  icon={attr.icon}
                  size={18}
                  className="text-primary"
                />
              </div>
              <div className="min-w-0">
                <p className="text-muted-foreground truncate text-xs">
                  {attr.label}
                </p>
                <p className="text-foreground truncate text-sm font-bold">
                  {attr.value}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Emergency Support Banner — only when hospital offers emergency services */}
        {hospital.isEmergency && <div className="flex flex-col gap-4 rounded-xl border border-destructive/20 bg-destructive/5 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-destructive/10">
              <HugeiconsIcon
                icon={Call02Icon}
                size={20}
                className="text-destructive"
              />
            </div>
            <div>
              <p className="text-base font-bold text-destructive">
                Emergency Support 24/7
              </p>
              <p className="text-muted-foreground mt-0.5 text-sm">
                {hospital.emergencyMessage || "যেকোনো জরুরি প্রয়োজনে আমরা আছি আপনার পাশে।"}
              </p>
            </div>
          </div>
          <div className="flex shrink-0 flex-col items-start gap-2 sm:items-end">
            <a
              href={emergency ? `tel:${emergency}` : "#"}
              className="inline-flex items-center gap-2 rounded-lg bg-destructive px-5 py-2.5 text-sm font-bold text-destructive-foreground transition-colors hover:bg-destructive/90"
            >
              <HugeiconsIcon icon={Call02Icon} size={16} />
              Call Emergency Now
            </a>
            {emergency && (
              <span className="text-muted-foreground flex items-center gap-1.5 text-xs">
                <HugeiconsIcon
                  icon={SmartPhone01Icon}
                  size={12}
                  className="shrink-0"
                />
                {emergency}
              </span>
            )}
          </div>
        </div>}
      </div>

      {/* ── Right: Quick Information ── */}
      <div className="w-full shrink-0 lg:w-72 xl:w-80">
        <div className="border-border bg-surface rounded-xl border p-5">
          <h4 className="text-foreground mb-4 text-base font-bold">
            Quick Information
          </h4>
          <div className="flex flex-col">
            {quickInfo.map((item, i) => (
              <div key={i}>
                <div className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-2.5">
                    <HugeiconsIcon
                      icon={item.icon}
                      size={16}
                      className="text-primary shrink-0"
                    />
                    <span className="text-muted-foreground text-sm">
                      {item.label}
                    </span>
                  </div>
                  <span className={item.valueClass}>{item.value}</span>
                </div>
                {i < quickInfo.length - 1 && (
                  <div className="bg-border/60 h-px" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      </div>

      {/* FAQs */}
      {hasFaqs && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <HugeiconsIcon icon={HelpCircleIcon} size={16} className="text-foreground shrink-0" />
            <h3 className="text-foreground text-base font-bold">Frequently Asked Questions</h3>
          </div>
          <div className="flex flex-col gap-2">
            {hospital.faqs.map((faq: { question: string; answer: string }, i: number) => (
              <div key={i} className="rounded-xl border border-border bg-card overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                >
                  <span className="text-sm font-semibold text-foreground">{faq.question}</span>
                  <HugeiconsIcon
                    icon={ArrowDown01Icon}
                    size={16}
                    className={`text-muted-foreground shrink-0 transition-transform ${openFaq === i ? "rotate-180" : ""}`}
                  />
                </button>
                {openFaq === i && (
                  <div className="border-t border-border px-5 py-4">
                    <p className="text-sm text-muted-foreground leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Insurance & Accreditations */}
      {(hasInsurances || hasAccreditations) && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {hasInsurances && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <HugeiconsIcon icon={SecurityCheckIcon} size={16} className="text-foreground shrink-0" />
                <h3 className="text-foreground text-base font-bold">Accepted Insurance</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {hospital.insurances.map((ins: string, i: number) => (
                  <span key={i} className="rounded-md border border-border bg-muted/30 px-3 py-1.5 text-xs font-medium text-foreground">
                    {ins}
                  </span>
                ))}
              </div>
            </div>
          )}
          {hasAccreditations && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <HugeiconsIcon icon={CertificateIcon} size={16} className="text-foreground shrink-0" />
                <h3 className="text-foreground text-base font-bold">Accreditations</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {hospital.accreditations.map((acc, i) => (
                  <span key={i} className="rounded-md border border-primary/20 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary">
                    {acc.name}{acc.body ? ` — ${acc.body}` : ""}{acc.year ? ` (${acc.year})` : ""}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
