"use client";

import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Tabs as RadixTabs } from "radix-ui";
import { Hospital } from "@/types/hospital.type";
import { ApiMeta } from "@/types/api.type";
import { DoctorListTab } from "./doctor-list-tab";
import { HospitalInfoTab } from "./hospital-info-tab";
import { HospitalContactTab } from "./hospital-contact-tab";
import { HospitalSpecialitiesTab } from "./hospital-specialities-tab";
import { LiveSerialBanner } from "@/components/common/live-serial-banner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useSpecialities } from "@/hooks/queries/use-specialities";
import {
  Search01Icon,
  ArrowDown01Icon,
  UserGroupIcon,
  Calendar01Icon,
  BedIcon,
  StarIcon,
  Cancel01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

type THospitalProfileTabsProps = {
  hospital: Hospital;
  activeDoctors?: Array<{
    id: string;
    slug: string;
    name: string;
    specialty: string;
    image: string;
    degrees: string[];
    bmdc: string;
    experience: string;
    fee: number;
    consultationFee?: number;
    followUpFee?: number;
    schedules: Array<{
      day: string;
      startTime: string;
      endTime: string;
      isAvailable: boolean;
    }>;
    status: string;
  }>;
  doctorSearch?: string;
  onDoctorSearchChange?: (v: string) => void;
  doctorsMeta?: ApiMeta;
  doctorsPage?: number;
  onDoctorsPageChange?: (page: number) => void;
  doctorSpecialty?: string | null;
  onDoctorSpecialtyChange?: (v: string | null) => void;
  doctorGender?: string | null;
  onDoctorGenderChange?: (v: string | null) => void;
  doctorAvailability?: string | null;
  onDoctorAvailabilityChange?: (v: string | null) => void;
  doctorMinFee?: number | null;
  doctorMaxFee?: number | null;
  onDoctorFeeRangeChange?: (min: number | null, max: number | null) => void;
  doctorMinExp?: number | null;
  doctorMaxExp?: number | null;
  onDoctorExperienceChange?: (min: number | null, max: number | null) => void;
  doctorConsultationType?: string | null;
  onDoctorConsultationTypeChange?: (v: string | null) => void;
  filterOptions?: {
    consultationTypes?: string[];
    genders: string[];
    feeRanges: Array<{ label: string; min: number | null; max: number | null }>;
    experienceRanges: Array<{
      label: string;
      min: number | null;
      max: number | null;
    }>;
  } | null;
};

function FilterChipOption({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full rounded-lg px-3 py-2 text-left text-xs font-medium transition-colors ${
        active ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted"
      }`}
    >
      {label}
    </button>
  );
}

export const HospitalProfileTabs = ({
  hospital,
  activeDoctors,
  doctorSearch = "",
  onDoctorSearchChange,
  doctorsMeta,
  doctorsPage = 1,
  onDoctorsPageChange,
  doctorSpecialty,
  onDoctorSpecialtyChange,
  doctorGender,
  onDoctorGenderChange,
  doctorAvailability,
  onDoctorAvailabilityChange,
  doctorMinFee,
  doctorMaxFee,
  onDoctorFeeRangeChange,
  doctorMinExp,
  doctorMaxExp,
  onDoctorExperienceChange,
  doctorConsultationType,
  onDoctorConsultationTypeChange,
  filterOptions,
}: THospitalProfileTabsProps) => {
  const { data: specData } = useSpecialities();
  const specialties = specData?.data ?? [];

  const CONSULTATION_TYPE_LABELS: Record<string, string> = {
    IN_PREMISES: "Chamber Visit",
    VIRTUAL: "Online",
    HOME_VISIT: "Home Visit",
  };
  const consultationTypes = filterOptions?.consultationTypes ?? [];

  const availableGenders = filterOptions?.genders?.length
    ? filterOptions.genders
    : ["Male", "Female"];
  const expRanges = filterOptions?.experienceRanges ?? [];
  const backendFeeRanges = filterOptions?.feeRanges ?? [];
  const EXTRA_FEE_RANGES = [
    { label: "৳800+", min: 800, max: null },
    { label: "৳1000+", min: 1000, max: null },
  ];
  const existingLabels = new Set(backendFeeRanges.map((r) => r.label));
  const feeRanges = [
    ...backendFeeRanges,
    ...EXTRA_FEE_RANGES.filter((r) => !existingLabels.has(r.label)),
  ];

  const doctorCount =
    hospital.stats?.doctorsCount ?? hospital.doctors?.length ?? 0;
  const availableTodayCount = activeDoctors?.length ?? 0;

  const activeFilterCount = [
    doctorSpecialty,
    doctorGender,
    doctorAvailability,
    doctorConsultationType,
    doctorMinFee != null || doctorMaxFee != null ? "fee" : null,
    doctorMinExp != null || doctorMaxExp != null ? "exp" : null,
  ].filter(Boolean).length;

  const stats = [
    {
      icon: UserGroupIcon,
      value: doctorCount,
      label: "Total Doctors",
      iconColor: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      icon: Calendar01Icon,
      value: availableTodayCount,
      label: "Available Today",
      iconColor: "text-blue-500",
      bgColor: "bg-blue-50",
    },
    {
      icon: BedIcon,
      value: hospital.stats?.totalBeds ? `${hospital.stats.totalBeds}+` : "—",
      label: "Total Beds",
      iconColor: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      icon: StarIcon,
      value: hospital.rating ? hospital.rating.toFixed(1) : "N/A",
      label: "Average Rating",
      iconColor: "text-amber-500",
      bgColor: "bg-amber-50",
    },
  ];

  const currentExpRange = expRanges.find(
    (r) => r.min === (doctorMinExp ?? null) && r.max === (doctorMaxExp ?? null),
  );
  const currentFeeRange = feeRanges.find(
    (r) => r.min === (doctorMinFee ?? null) && r.max === (doctorMaxFee ?? null),
  );

  const chipBase =
    "flex h-8 shrink-0 items-center gap-1.5 rounded-lg border px-3 text-xs font-medium transition-colors";
  const chipInactive =
    "border-border bg-card text-foreground hover:border-primary/40 hover:text-primary";
  const chipActive = "border-primary/50 bg-primary/5 text-primary";

  return (
    <div className="w-full">
      <div className="border-border bg-card rounded-xl border">
        <Tabs defaultValue="overview" className="w-full">
          {/* ── Tab Headers ── */}
          <div className="overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <RadixTabs.List className="border-border flex h-auto w-max min-w-full gap-0 border-b bg-transparent p-0">
              <RadixTabs.Trigger
                value="overview"
                className="group text-muted-foreground hover:text-foreground data-[state=active]:text-primary relative h-auto shrink-0 cursor-pointer bg-transparent px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors outline-none"
              >
                Overview
                <span className="group-data-[state=active]:bg-primary absolute right-0 bottom-0 left-0 h-0.5 bg-transparent transition-colors" />
              </RadixTabs.Trigger>

              <RadixTabs.Trigger
                value="doctors"
                className="group text-muted-foreground hover:text-foreground data-[state=active]:text-primary relative inline-flex h-auto shrink-0 cursor-pointer items-center gap-1.5 bg-transparent px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors outline-none"
              >
                Doctors
                {doctorCount > 0 && (
                  <span className="bg-primary/10 text-micro text-primary inline-flex items-center justify-center rounded-full px-1.5 py-0.5 leading-none font-bold">
                    {doctorCount}
                  </span>
                )}
                <span className="group-data-[state=active]:bg-primary absolute right-0 bottom-0 left-0 h-0.5 bg-transparent transition-colors" />
              </RadixTabs.Trigger>

              <RadixTabs.Trigger
                value="specialities"
                className="group text-muted-foreground hover:text-foreground data-[state=active]:text-primary relative h-auto shrink-0 cursor-pointer bg-transparent px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors outline-none"
              >
                Specialities
                <span className="group-data-[state=active]:bg-primary absolute right-0 bottom-0 left-0 h-0.5 bg-transparent transition-colors" />
              </RadixTabs.Trigger>

              <RadixTabs.Trigger
                value="contact"
                className="group text-muted-foreground hover:text-foreground data-[state=active]:text-primary relative h-auto shrink-0 cursor-pointer bg-transparent px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors outline-none"
              >
                Contact
                <span className="group-data-[state=active]:bg-primary absolute right-0 bottom-0 left-0 h-0.5 bg-transparent transition-colors" />
              </RadixTabs.Trigger>
            </RadixTabs.List>
          </div>

          {/* ── Tab Content ── */}
          <div className="p-5">
            <TabsContent value="overview" className="mt-0 outline-none">
              <HospitalInfoTab hospital={hospital} />
            </TabsContent>

            <TabsContent value="doctors" className="mt-0 outline-none">
              <div className="flex flex-col gap-5">
                {/* ── Search + Filters ── */}
                <div className="flex flex-col gap-3">
                  {/* Search */}
                  <div className="relative w-full">
                    <HugeiconsIcon
                      icon={Search01Icon}
                      size={16}
                      className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 -translate-y-1/2"
                    />
                    <input
                      type="text"
                      value={doctorSearch}
                      onChange={(e) => onDoctorSearchChange?.(e.target.value)}
                      placeholder="Search doctors by name or specialist..."
                      className="border-border bg-background placeholder:text-muted-foreground focus:ring-primary/20 focus:border-primary/40 h-11 w-full rounded-lg border pr-4 pl-9 text-sm focus:ring-2 focus:outline-none"
                    />
                  </div>

                  {/* Filter chips */}
                  <div className="flex items-center gap-2 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    {/* Speciality */}
                    <Popover>
                      <PopoverTrigger asChild>
                        <button
                          className={`${chipBase} ${doctorSpecialty ? chipActive : chipInactive}`}
                        >
                          {doctorSpecialty
                            ? (specialties.find(
                                (s: any) => s.id === doctorSpecialty,
                              )?.name ?? "Speciality")
                            : "Speciality"}
                          <HugeiconsIcon
                            icon={ArrowDown01Icon}
                            size={11}
                            className="text-muted-foreground"
                          />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-52 rounded-xl p-2"
                        align="start"
                      >
                        <div className="flex max-h-60 flex-col gap-0.5 overflow-y-auto">
                          <FilterChipOption
                            label="All Specialities"
                            active={!doctorSpecialty}
                            onClick={() => onDoctorSpecialtyChange?.(null)}
                          />
                          {specialties.map((s: any) => (
                            <FilterChipOption
                              key={s.id}
                              label={s.name}
                              active={doctorSpecialty === s.id}
                              onClick={() => onDoctorSpecialtyChange?.(s.id)}
                            />
                          ))}
                        </div>
                      </PopoverContent>
                    </Popover>

                    {/* Availability */}
                    <Popover>
                      <PopoverTrigger asChild>
                        <button
                          className={`${chipBase} ${doctorAvailability ? chipActive : chipInactive}`}
                        >
                          {doctorAvailability === "today"
                            ? "Available Today"
                            : "Availability"}
                          <HugeiconsIcon
                            icon={ArrowDown01Icon}
                            size={11}
                            className="text-muted-foreground"
                          />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-44 rounded-xl p-2"
                        align="start"
                      >
                        <div className="flex flex-col gap-0.5">
                          <FilterChipOption
                            label="Any"
                            active={!doctorAvailability}
                            onClick={() => onDoctorAvailabilityChange?.(null)}
                          />
                          <FilterChipOption
                            label="Available Today"
                            active={doctorAvailability === "today"}
                            onClick={() =>
                              onDoctorAvailabilityChange?.("today")
                            }
                          />
                        </div>
                      </PopoverContent>
                    </Popover>

                    {/* Gender */}
                    <Popover>
                      <PopoverTrigger asChild>
                        <button
                          className={`${chipBase} ${doctorGender ? chipActive : chipInactive}`}
                        >
                          {doctorGender ?? "Gender"}
                          <HugeiconsIcon
                            icon={ArrowDown01Icon}
                            size={11}
                            className="text-muted-foreground"
                          />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-40 rounded-xl p-2"
                        align="start"
                      >
                        <div className="flex flex-col gap-0.5">
                          <FilterChipOption
                            label="All"
                            active={!doctorGender}
                            onClick={() => onDoctorGenderChange?.(null)}
                          />
                          {availableGenders.map((g) => (
                            <FilterChipOption
                              key={g}
                              label={g}
                              active={doctorGender === g}
                              onClick={() => onDoctorGenderChange?.(g)}
                            />
                          ))}
                        </div>
                      </PopoverContent>
                    </Popover>

                    {/* Experience */}
                    {expRanges.length > 0 && (
                      <Popover>
                        <PopoverTrigger asChild>
                          <button
                            className={`${chipBase} ${doctorMinExp != null || doctorMaxExp != null ? chipActive : chipInactive}`}
                          >
                            {currentExpRange
                              ? currentExpRange.label
                              : "Experience"}
                            <HugeiconsIcon
                              icon={ArrowDown01Icon}
                              size={11}
                              className="text-muted-foreground"
                            />
                          </button>
                        </PopoverTrigger>
                        <PopoverContent
                          className="w-44 rounded-xl p-2"
                          align="start"
                        >
                          <div className="flex flex-col gap-0.5">
                            <FilterChipOption
                              label="Any"
                              active={
                                doctorMinExp == null && doctorMaxExp == null
                              }
                              onClick={() =>
                                onDoctorExperienceChange?.(null, null)
                              }
                            />
                            {expRanges.map((r) => (
                              <FilterChipOption
                                key={r.label}
                                label={r.label}
                                active={currentExpRange?.label === r.label}
                                onClick={() =>
                                  onDoctorExperienceChange?.(r.min, r.max)
                                }
                              />
                            ))}
                          </div>
                        </PopoverContent>
                      </Popover>
                    )}

                    {/* Fee Range */}
                    {feeRanges.length > 0 && (
                      <Popover>
                        <PopoverTrigger asChild>
                          <button
                            className={`${chipBase} ${doctorMinFee != null || doctorMaxFee != null ? chipActive : chipInactive}`}
                          >
                            {currentFeeRange
                              ? currentFeeRange.label
                              : "Fee Range"}
                            <HugeiconsIcon
                              icon={ArrowDown01Icon}
                              size={11}
                              className="text-muted-foreground"
                            />
                          </button>
                        </PopoverTrigger>
                        <PopoverContent
                          className="w-44 rounded-xl p-2"
                          align="start"
                        >
                          <div className="flex flex-col gap-0.5">
                            <FilterChipOption
                              label="Any"
                              active={
                                doctorMinFee == null && doctorMaxFee == null
                              }
                              onClick={() =>
                                onDoctorFeeRangeChange?.(null, null)
                              }
                            />
                            {feeRanges.map((r) => (
                              <FilterChipOption
                                key={r.label}
                                label={r.label}
                                active={currentFeeRange?.label === r.label}
                                onClick={() =>
                                  onDoctorFeeRangeChange?.(r.min, r.max)
                                }
                              />
                            ))}
                          </div>
                        </PopoverContent>
                      </Popover>
                    )}

                    {/* Clear all filters */}
                    {/* Consultation Type */}
                    {consultationTypes.length > 0 && (
                      <Popover>
                        <PopoverTrigger asChild>
                          <button
                            className={`${chipBase} ${doctorConsultationType ? chipActive : chipInactive}`}
                          >
                            {doctorConsultationType
                              ? (CONSULTATION_TYPE_LABELS[
                                  doctorConsultationType
                                ] ?? doctorConsultationType)
                              : "Consult Type"}
                            <HugeiconsIcon
                              icon={ArrowDown01Icon}
                              size={11}
                              className="text-muted-foreground"
                            />
                          </button>
                        </PopoverTrigger>
                        <PopoverContent
                          className="w-44 rounded-xl p-2"
                          align="start"
                        >
                          <div className="flex flex-col gap-0.5">
                            <FilterChipOption
                              label="All"
                              active={!doctorConsultationType}
                              onClick={() =>
                                onDoctorConsultationTypeChange?.(null)
                              }
                            />
                            {consultationTypes.map((ct) => (
                              <FilterChipOption
                                key={ct}
                                label={CONSULTATION_TYPE_LABELS[ct] ?? ct}
                                active={doctorConsultationType === ct}
                                onClick={() =>
                                  onDoctorConsultationTypeChange?.(ct)
                                }
                              />
                            ))}
                          </div>
                        </PopoverContent>
                      </Popover>
                    )}

                    {activeFilterCount > 0 && (
                      <button
                        onClick={() => {
                          onDoctorSpecialtyChange?.(null);
                          onDoctorGenderChange?.(null);
                          onDoctorAvailabilityChange?.(null);
                          onDoctorFeeRangeChange?.(null, null);
                          onDoctorExperienceChange?.(null, null);
                          onDoctorConsultationTypeChange?.(null);
                        }}
                        className="flex h-8 shrink-0 items-center gap-1 rounded-lg px-2 text-xs font-medium text-red-500 transition-colors hover:text-red-600"
                      >
                        <HugeiconsIcon icon={Cancel01Icon} size={11} />
                        Clear
                      </button>
                    )}
                  </div>
                </div>

                {/* ── Stats Row ── */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {stats.map((stat, i) => (
                    <div
                      key={i}
                      className="border-border bg-card flex items-center gap-3 rounded-xl border px-4 py-3"
                    >
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${stat.bgColor}`}
                      >
                        <HugeiconsIcon
                          icon={stat.icon}
                          size={20}
                          className={stat.iconColor}
                        />
                      </div>
                      <div className="flex min-w-0 flex-col gap-0.5">
                        <span className="text-foreground text-base leading-tight font-bold">
                          {stat.value}
                        </span>
                        <span className="text-2xs text-muted-foreground leading-tight font-medium">
                          {stat.label}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* ── Available Doctors Carousel ── */}
                <LiveSerialBanner type="hospital" id={hospital.id} />

                {/* ── All Doctors List ── */}
                <DoctorListTab
                  doctors={hospital.doctors || []}
                  hospitalName={hospital.name}
                  meta={doctorsMeta}
                  currentPage={doctorsPage}
                  onPageChange={onDoctorsPageChange}
                />
              </div>
            </TabsContent>

            <TabsContent value="specialities" className="mt-0 outline-none">
              <HospitalSpecialitiesTab hospital={hospital} />
            </TabsContent>

            <TabsContent value="contact" className="mt-0 outline-none">
              <HospitalContactTab hospital={hospital} />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};
