"use client";

import { useState } from "react";
import { startOfMonth, endOfMonth, subMonths, startOfYear, format } from "date-fns";
// import { Button } from "@/components/ui/button";
// import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  // Download01Icon,
  PrescriptionsIcon,
  // TestTube01Icon,
  // Certificate01Icon,
  Calendar01Icon,
  // Image01Icon,
  // HardDriveIcon,
  Search01Icon,
  // FilterIcon,
  // Alert01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { RecordCard } from "@/components/app-patient/medical-records-page/record-card";
// import { MedicalHistoryTimeline } from "@/components/app-patient/medical-records-page/medical-history-timeline";
import { cn } from "@/lib/utils";
// import { TRecordType } from "@/types/medical-record.type";
import { useMyPrescriptions } from "@/hooks/queries/use-medical-records";
import { prescriptionsToMedicalRecords } from "@/adapters/prescription.adapter";
import { MyPrescriptionsParams } from "@/services/medical-records.service";
import { useDebounce } from "@/hooks/use-debounce";

// ─── Tabs ─────────────────────────────────────────────────────────────────────

// type TabKey = "all" | TRecordType;

// const TABS: { value: TabKey; label: string }[] = [
//   { value: "all", label: "All Records" },
//   { value: "prescription", label: "Prescriptions" },
//   { value: "xray", label: "X-Ray" },
//   { value: "lab-report", label: "Lab Reports" },
//   { value: "certificate", label: "Medical Certificates" },
// ];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function MedicalRecordsPage() {
  // const [activeTab, setActiveTab] = useState<TabKey>("all");
  const [page, setPage] = useState(1);
  const [dateFilter, setDateFilter] = useState("all-dates");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 400);

  const now = new Date();
  const dateRanges: Record<string, { dateFrom: string; dateTo: string }> = {
    "this-month": {
      dateFrom: startOfMonth(now).toISOString(),
      dateTo: endOfMonth(now).toISOString(),
    },
    "last-3": {
      dateFrom: subMonths(now, 3).toISOString(),
      dateTo: now.toISOString(),
    },
    "this-year": {
      dateFrom: startOfYear(now).toISOString(),
      dateTo: now.toISOString(),
    },
  };

  const queryParams: MyPrescriptionsParams = {
    page,
    limit: 10,
    sort: sortOrder,
    ...(debouncedSearch && { search: debouncedSearch }),
    ...(dateRanges[dateFilter] ?? {}),
  };

  const { data: apiResponse, isLoading, isError } = useMyPrescriptions(queryParams);

  const prescriptions = apiResponse?.data ?? [];
  const meta = apiResponse?.meta;
  const records = prescriptionsToMedicalRecords(prescriptions);
  // const filteredRecords = activeTab === "all" || activeTab === "prescription" ? records : [];

  const latestPrescription = prescriptions[0];
  const latestVisitDate = latestPrescription?.createdAt
    ? format(new Date(latestPrescription.createdAt), "dd MMM yyyy")
    : "—";
  const latestDoctorName = latestPrescription?.doctor?.name
    ? `Dr. ${latestPrescription.doctor.name}`
    : "—";

  const STATS = [
    {
      label: "Prescriptions",
      value: meta ? String(meta.total) : String(records.length),
      subLabel: "Total Records",
      icon: PrescriptionsIcon,
      iconBg: "bg-emerald-50 dark:bg-emerald-900/30",
      iconColor: "text-emerald-600 dark:text-emerald-400",
    },
    // { label: "X-Ray Reports", value: "—", subLabel: "Coming soon", icon: Image01Icon, iconBg: "bg-blue-50 dark:bg-blue-900/30", iconColor: "text-blue-600 dark:text-blue-400" },
    // { label: "Lab Reports", value: "—", subLabel: "Coming soon", icon: TestTube01Icon, iconBg: "bg-purple-50 dark:bg-purple-900/30", iconColor: "text-purple-600 dark:text-purple-400" },
    // { label: "Certificates", value: "—", subLabel: "Coming soon", icon: Certificate01Icon, iconBg: "bg-orange-50 dark:bg-orange-900/30", iconColor: "text-orange-500 dark:text-orange-400" },
    {
      label: "Last Visit",
      value: latestVisitDate,
      subLabel: latestDoctorName,
      icon: Calendar01Icon,
      iconBg: "bg-teal-50 dark:bg-teal-900/30",
      iconColor: "text-teal-600 dark:text-teal-400",
    },
  ];

  return (
    <div className="w-full space-y-5">
      {/* ── Page Header ── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl lg:text-3xl">
            My Health Records
          </h1>
          <p className="mt-0.5 hidden text-body-sm font-medium text-muted-foreground sm:block">
            Access your prescriptions, reports and medical history securely.
          </p>
        </div>

        {/* Mobile: icon-only buttons */}
        <div className="flex items-center gap-2 sm:hidden">
          <button className="flex h-12 w-12 items-center justify-center rounded-md border border-border/50 bg-card shadow-xs text-foreground/70">
            <HugeiconsIcon icon={Search01Icon} size={20} />
          </button>
          {/* <button className="flex h-12 w-12 items-center justify-center rounded-md border border-border/50 bg-card shadow-xs text-foreground/70">
            <HugeiconsIcon icon={FilterIcon} size={20} />
          </button> */}
          {/* <button className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary shadow-sm text-primary-foreground">
            <HugeiconsIcon icon={Download01Icon} size={20} />
          </button> */}
        </div>

        {/* Desktop: full search + buttons */}
        <div className="hidden items-center gap-2 sm:flex">
          <div className="relative">
            <HugeiconsIcon
              icon={Search01Icon}
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50"
            />
            <input
              type="search"
              placeholder="Search by diagnosis..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              className="h-10 w-72 rounded-xl border border-border/50 bg-card pl-9 pr-3 text-body-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          {/* <Button variant="outline" className="h-10 gap-2 rounded-xl border-border/50 px-4 text-body-sm font-semibold">
            <HugeiconsIcon icon={FilterIcon} size={15} />
            Filters
          </Button> */}
          {/* <Button className="h-10 gap-2 rounded-xl bg-primary px-5 text-body-sm font-bold text-primary-foreground hover:bg-primary/90 shadow-none">
            <HugeiconsIcon icon={Download01Icon} size={15} />
            Download All
          </Button> */}
        </div>
      </div>

      {/* ── Stats Bar ── */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-2">
        {STATS.map((stat) => (
          <div
            key={stat.label}
            className="flex items-center gap-3 rounded-md border border-border/40 bg-card px-4 py-3 shadow-xs"
          >
            <div
              className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                stat.iconBg,
              )}
            >
              <HugeiconsIcon
                icon={stat.icon}
                size={20}
                className={stat.iconColor}
              />
            </div>
            <div className="min-w-0">
              <p className="truncate text-2xs font-semibold text-muted-foreground">
                {stat.label}
              </p>
              <p
                className={cn(
                  "font-black leading-tight text-foreground",
                  stat.value.length > 4
                    ? "text-sm"
                    : "text-base sm:text-lg",
                )}
              >
                {stat.value}
              </p>
              <p className="truncate text-micro font-medium text-muted-foreground/60">
                {stat.subLabel}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Main Layout: Records ── */}
      <div>
        <div className="w-full">
            {/* Filter row */}
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <Select
                value={dateFilter}
                onValueChange={(v) => {
                  setDateFilter(v);
                  setPage(1);
                }}
              >
                <SelectTrigger className="h-8 w-auto min-w-[110px] rounded-lg border-border/50 bg-card text-xs font-semibold">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-dates">All Dates</SelectItem>
                  <SelectItem value="this-month">This Month</SelectItem>
                  <SelectItem value="last-3">Last 3 Months</SelectItem>
                  <SelectItem value="this-year">This Year</SelectItem>
                </SelectContent>
              </Select>

              {/* <Select defaultValue="all-hospitals">
                <SelectTrigger className="h-8 w-auto min-w-[120px] rounded-lg border-border/50 bg-card text-xs font-semibold">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-hospitals">All Hospitals</SelectItem>
                </SelectContent>
              </Select> */}

              {/* <Select defaultValue="all-doctors">
                <SelectTrigger className="h-8 w-auto min-w-[115px] rounded-lg border-border/50 bg-card text-xs font-semibold">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-doctors">All Doctors</SelectItem>
                </SelectContent>
              </Select> */}

              {/* All Types — hidden on mobile (tabs handle type filter) */}
              {/* <div className="hidden sm:block">
                <Select defaultValue="all-types">
                  <SelectTrigger className="h-8 w-auto min-w-[110px] rounded-lg border-border/50 bg-card text-xs font-semibold">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-types">All Types</SelectItem>
                    <SelectItem value="prescription">Prescription</SelectItem>
                    <SelectItem value="xray">X-Ray</SelectItem>
                    <SelectItem value="lab-report">Lab Report</SelectItem>
                    <SelectItem value="certificate">Certificate</SelectItem>
                  </SelectContent>
                </Select>
              </div> */}

              <div className="ml-auto flex items-center gap-1 text-xs font-semibold text-muted-foreground">
                <span>Sort by:</span>
                <button
                  onClick={() => {
                    setSortOrder((s) => (s === "newest" ? "oldest" : "newest"));
                    setPage(1);
                  }}
                  className="font-bold text-primary underline-offset-2 hover:underline"
                >
                  {sortOrder === "newest" ? "Most Recent" : "Oldest First"}
                </button>
              </div>
            </div>

            {/* Records list */}
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="h-24 animate-pulse rounded-xl border border-border/30 bg-muted/40"
                  />
                ))}
              </div>
            ) : isError ? (
              <div className="flex h-60 items-center justify-center rounded-xl border border-border/30 bg-card/60 text-sm font-semibold text-destructive">
                Failed to load records. Please try again.
              </div>
            ) : records.length === 0 ? (
              <div className="flex h-60 items-center justify-center rounded-xl border border-border/30 bg-card/60 text-sm font-semibold text-muted-foreground">
                No prescriptions found.
              </div>
            ) : (
              <div className="space-y-3">
                {records.map((record) => (
                  <RecordCard key={record.id} record={record} />
                ))}
              </div>
            )}

          {/* Pagination */}
          {meta && meta.totalPages > 1 && (
            <div className="mt-6 flex items-center justify-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-body-sm text-muted-foreground hover:bg-muted disabled:opacity-40"
              >
                ‹
              </button>
              {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map(
                (p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-lg text-body-sm font-bold transition-colors",
                      p === page
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted",
                    )}
                  >
                    {p}
                  </button>
                ),
              )}
              <button
                onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
                disabled={page === meta.totalPages}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-body-sm text-muted-foreground hover:bg-muted disabled:opacity-40"
              >
                ›
              </button>
            </div>
          )}
        </div>

        {/* ── Right Sidebar ── (desktop only) */}
        {/* <aside className="hidden w-64 shrink-0 xl:flex xl:flex-col xl:gap-4">
          <MedicalHistoryTimeline />

          <div className="rounded-md border border-border/40 bg-card p-4 shadow-xs">
            <div className="mb-2 flex items-center gap-2">
              <HugeiconsIcon icon={HardDriveIcon} size={15} className="text-muted-foreground" />
              <h2 className="flex-1 text-sm font-black text-foreground">Storage Usage</h2>
              <span className="text-xs font-bold text-primary">68% Used</span>
            </div>
            <Progress value={68} className="h-2 rounded-full" />
            <div className="mt-2 flex items-center justify-between text-micro font-semibold text-muted-foreground">
              <span>Used: 1.36 GB</span>
              <span>Total: 2 GB</span>
            </div>
            <Button variant="outline" size="sm" className="mt-3 h-8 w-full rounded-lg border-border/50 text-xs font-bold">
              Manage Storage
            </Button>
          </div>

          {latestPrescription?.followUpDate && (
            <div className="rounded-md border border-border/40 bg-card p-4 shadow-xs">
              <div className="mb-2 flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 dark:bg-primary/20">
                  <HugeiconsIcon icon={Alert01Icon} size={14} className="text-primary" />
                </div>
                <h2 className="text-sm font-black text-foreground">Follow-up Reminder</h2>
              </div>
              <p className="text-xs font-medium leading-relaxed text-muted-foreground">
                You have a follow-up with{" "}
                <span className="font-bold text-foreground">
                  {latestPrescription.doctor?.name ? `Dr. ${latestPrescription.doctor.name}` : "your doctor"}
                </span>{" "}
                on{" "}
                <span className="font-bold text-primary">
                  {format(new Date(latestPrescription.followUpDate), "dd MMM yyyy")}
                </span>.
              </p>
              <Button variant="outline" size="sm" className="mt-3 h-8 w-full rounded-lg border-border/50 text-xs font-bold">
                View Appointments
              </Button>
            </div>
          )}
        </aside> */}
      </div>
    </div>
  );
}
