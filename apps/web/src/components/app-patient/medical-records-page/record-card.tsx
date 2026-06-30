"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Calendar01Icon,
  Download01Icon,
  MedicalFileIcon,
  MedicineBottle01Icon,
  TestTube01Icon,
  Certificate01Icon,
  StethoscopeIcon,
  Image01Icon,
  MoreVerticalIcon,
  Delete02Icon,
  Share01Icon,
  Hospital02Icon,
  EyeIcon,
  PrescriptionsIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { TMedicalRecord, TRecordType } from "@/types/medical-record.type";
import { cn } from "@/lib/utils";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type HugeIcon = any;

interface RecordCardProps {
  record: TMedicalRecord;
}

const TYPE_CONFIG: Record<
  TRecordType,
  {
    label: string;
    iconBg: string;
    iconColor: string;
    badgeText: string;
    icon: HugeIcon;
    subTypeIcon?: HugeIcon;
  }
> = {
  prescription: {
    label: "Prescription",
    iconBg: "bg-emerald-50 dark:bg-emerald-900/30",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    badgeText: "text-emerald-600 dark:text-emerald-400",
    icon: PrescriptionsIcon,
    subTypeIcon: MedicineBottle01Icon,
  },
  "lab-report": {
    label: "Lab Report",
    iconBg: "bg-purple-50 dark:bg-purple-900/30",
    iconColor: "text-purple-600 dark:text-purple-400",
    badgeText: "text-purple-600 dark:text-purple-400",
    icon: TestTube01Icon,
  },
  xray: {
    label: "X-Ray",
    iconBg: "bg-slate-800 dark:bg-slate-700",
    iconColor: "text-white",
    badgeText: "text-blue-600 dark:text-blue-400",
    icon: Image01Icon,
  },
  certificate: {
    label: "Certificate",
    iconBg: "bg-orange-50 dark:bg-orange-900/30",
    iconColor: "text-orange-500 dark:text-orange-400",
    badgeText: "text-orange-500 dark:text-orange-400",
    icon: Certificate01Icon,
  },
  diagnostic: {
    label: "Diagnostic",
    iconBg: "bg-teal-50 dark:bg-teal-900/30",
    iconColor: "text-teal-600 dark:text-teal-400",
    badgeText: "text-teal-600 dark:text-teal-400",
    icon: StethoscopeIcon,
  },
  other: {
    label: "Other",
    iconBg: "bg-gray-100 dark:bg-gray-800",
    iconColor: "text-gray-600 dark:text-gray-400",
    badgeText: "text-gray-600 dark:text-gray-400",
    icon: MedicalFileIcon,
  },
};

export function RecordCard({ record }: RecordCardProps) {
  const config = TYPE_CONFIG[record.type] ?? TYPE_CONFIG.other;
  const IconComponent = config.icon;
  const SubTypeIconComponent = config.subTypeIcon ?? config.icon;

  const detailLabel =
    record.type === "prescription"
      ? "Diagnosis:"
      : record.type === "xray"
        ? "Findings:"
        : record.type === "certificate"
          ? "Purpose:"
          : record.type === "lab-report"
            ? "Findings:"
            : "Note:";

  const detailValue =
    record.diagnosis || record.findings || record.purpose || "";

  // Icon badge with type label — shared between mobile and desktop
  const iconBadge = (
    <div
      className={cn(
        "flex w-[72px] shrink-0 flex-col items-center justify-center gap-1 rounded-xl p-2",
        "min-h-[72px]",
        config.iconBg,
      )}
    >
      <HugeiconsIcon
        icon={IconComponent as never}
        size={26}
        className={config.iconColor}
      />
      <span
        className={cn(
          "text-center text-[9px] font-bold leading-tight",
          config.iconColor,
        )}
      >
        {config.label}
      </span>
    </div>
  );

  // Sub-info row: diagnostic center or doctor name (mutually exclusive)
  const subInfo = record.diagnosticCenter ? (
    <div className="mt-0.5 flex items-center gap-1">
      <HugeiconsIcon
        icon={Hospital02Icon}
        size={10}
        className="shrink-0 text-muted-foreground/50"
      />
      <p className="truncate text-micro text-muted-foreground/70">
        {record.diagnosticCenter}
      </p>
    </div>
  ) : record.doctorName ? (
    <div className="mt-0.5 flex items-center gap-1">
      <HugeiconsIcon
        icon={StethoscopeIcon}
        size={10}
        className="shrink-0 text-muted-foreground/50"
      />
      <p className="truncate text-micro text-muted-foreground/70">
        {record.doctorName}
      </p>
    </div>
  ) : null;

  // Date + subType chips row
  const chipRow = (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-1.5">
        <HugeiconsIcon
          icon={Calendar01Icon}
          size={13}
          className="text-primary"
        />
        <span className="text-2xs font-semibold text-muted-foreground">
          {record.date}
        </span>
      </div>
      {record.subType && (
        <div className="flex items-center gap-1.5">
          <HugeiconsIcon
            icon={SubTypeIconComponent as never}
            size={13}
            className="text-primary"
          />
          <span className="text-2xs font-semibold text-muted-foreground">
            {record.subType}
          </span>
        </div>
      )}
    </div>
  );

  // Three-dot context menu
  const menu = (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0 rounded-lg text-muted-foreground hover:bg-muted"
        >
          <HugeiconsIcon icon={MoreVerticalIcon} size={16} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {record.fileUrl && (
          <DropdownMenuItem
            className="gap-2 text-xs font-semibold"
            onClick={() => window.open(record.fileUrl, '_blank')}
          >
            <HugeiconsIcon icon={EyeIcon} size={14} />
            View File
          </DropdownMenuItem>
        )}
        {record.fileUrl && (
          <DropdownMenuItem
            className="gap-2 text-xs font-semibold"
            onClick={() => {
              const a = document.createElement('a');
              a.href = record.fileUrl;
              a.download = '';
              a.click();
            }}
          >
            <HugeiconsIcon icon={Download01Icon} size={14} />
            Download
          </DropdownMenuItem>
        )}
        {/* <DropdownMenuItem className="gap-2 text-xs font-semibold">
          <HugeiconsIcon icon={Share01Icon} size={14} />
          Share
        </DropdownMenuItem> */}
        {/* <DropdownMenuItem className="gap-2 text-xs font-semibold text-destructive focus:text-destructive">
          <HugeiconsIcon icon={Delete02Icon} size={14} />
          Delete
        </DropdownMenuItem> */}
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <div className="rounded-md border border-border/40 bg-card shadow-xs transition-shadow">
      {/* ── Mobile layout (< lg) ── */}
      <div className="lg:hidden">
        {/* Row 1: icon + info + 3-dot */}
        <div className="flex items-start gap-3 p-4 pb-2">
          {iconBadge}
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-bold leading-tight text-foreground">
              {record.title}
            </h3>
            <p className="mt-0.5 truncate text-2xs font-semibold text-muted-foreground">
              {record.hospitalName}
            </p>
            {subInfo}
          </div>
          {/* Three-dot: mobile only */}
          <div className="sm:hidden">{menu}</div>
          {/* Inline buttons: tablet only (sm → lg) */}
          {record.fileUrl && (
            <div className="hidden sm:flex lg:hidden shrink-0 flex-col items-stretch gap-1.5">
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-1.5 rounded-lg border-border/50 px-3 text-2xs font-bold shadow-none"
                onClick={() => window.open(record.fileUrl, "_blank")}
              >
                <HugeiconsIcon icon={EyeIcon} size={13} />
                View File
              </Button>
              <Button
                size="sm"
                className="h-8 gap-1.5 rounded-lg bg-primary px-3 text-2xs font-bold text-primary-foreground shadow-none hover:bg-primary/90"
                asChild
              >
                <a href={record.fileUrl} download>
                  <HugeiconsIcon icon={Download01Icon} size={13} />
                  Download
                </a>
              </Button>
            </div>
          )}
        </div>

        {/* Row 2: date + type chips */}
        <div className="px-4 pb-2">{chipRow}</div>

        {/* Row 3: diagnosis / findings / purpose */}
        {detailValue && (
          <p className="px-4 pb-4 text-2xs font-medium text-muted-foreground">
            <span className="font-bold text-foreground/70">{detailLabel}</span>{" "}
            {detailValue}
          </p>
        )}
      </div>

      {/* ── Desktop layout (lg+) ── */}
      <div className="hidden items-center gap-4 px-4 py-3.5 lg:flex">
        {iconBadge}

        {/* Title / Hospital / Center-or-Doctor */}
        <div className="w-52 min-w-0 shrink-0">
          <h3 className="truncate text-sm font-bold leading-tight text-foreground">
            {record.title}
          </h3>
          <p className="mt-0.5 truncate text-2xs font-semibold text-muted-foreground">
            {record.hospitalName}
          </p>
          {subInfo}
        </div>

        {/* Date + Type + Diagnosis */}
        <div className="min-w-0 flex-1 space-y-1">
          {chipRow}
          {detailValue && (
            <p className="text-2xs font-medium text-muted-foreground">
              <span className="font-bold text-foreground/70">{detailLabel}</span>{" "}
              {detailValue}
            </p>
          )}
        </div>

        {/* Action buttons — only when attachment exists */}
        {record.fileUrl && (
          <div className="flex shrink-0 flex-col items-stretch gap-1.5">
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1.5 rounded-lg border-border/50 px-3 text-2xs font-bold shadow-none"
              onClick={() => window.open(record.fileUrl, "_blank")}
            >
              <HugeiconsIcon icon={EyeIcon} size={13} />
              View File
            </Button>
            <Button
              size="sm"
              className="h-8 gap-1.5 rounded-lg bg-primary px-3 text-2xs font-bold text-primary-foreground shadow-none hover:bg-primary/90"
              asChild
            >
              <a href={record.fileUrl} download>
                <HugeiconsIcon icon={Download01Icon} size={13} />
                Download
              </a>
            </Button>
          </div>
        )}

      </div>
    </div>
  );
}
