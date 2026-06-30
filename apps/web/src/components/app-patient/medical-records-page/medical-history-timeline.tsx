import { HugeiconsIcon } from "@hugeicons/react";
import {
  PrescriptionsIcon,
  LungsIcon,
  Bone01Icon,
  TestTube01Icon,
  Certificate01Icon,
} from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";

const TIMELINE_ITEMS = [
  {
    date: "20 May",
    type: "Prescription",
    subtitle: "Dr. Sarowar Islam",
    icon: PrescriptionsIcon,
    iconBg: "bg-emerald-100 dark:bg-emerald-900/30",
    iconColor: "text-emerald-600 dark:text-emerald-400",
  },
  {
    date: "18 May",
    type: "X-Ray Report",
    subtitle: "Chest X-Ray (P.A. View)",
    icon: LungsIcon,
    iconBg: "bg-blue-100 dark:bg-blue-900/30",
    iconColor: "text-blue-500 dark:text-blue-400",
  },
  {
    date: "15 May",
    type: "Lab Report",
    subtitle: "CBC Test",
    icon: TestTube01Icon,
    iconBg: "bg-purple-100 dark:bg-purple-900/30",
    iconColor: "text-purple-600 dark:text-purple-400",
  },
  {
    date: "10 May",
    type: "Prescription",
    subtitle: "Dr. Moumita Saha",
    icon: PrescriptionsIcon,
    iconBg: "bg-emerald-100 dark:bg-emerald-900/30",
    iconColor: "text-emerald-600 dark:text-emerald-400",
  },
  {
    date: "05 May",
    type: "X-Ray Report",
    subtitle: "Knee X-Ray",
    icon: Bone01Icon,
    iconBg: "bg-blue-100 dark:bg-blue-900/30",
    iconColor: "text-blue-500 dark:text-blue-400",
  },
  {
    date: "01 May",
    type: "Certificate",
    subtitle: "Medical Fitness",
    icon: Certificate01Icon,
    iconBg: "bg-orange-100 dark:bg-orange-900/30",
    iconColor: "text-orange-500 dark:text-orange-400",
  },
];

export function MedicalHistoryTimeline() {
  return (
    <div className="rounded-md border border-border/40 bg-card p-4 shadow-xs">
      <h2 className="mb-3 text-sm font-black text-foreground">
        Medical History Timeline
      </h2>

      <div className="mb-4">
        <span className="inline-flex items-center rounded-full bg-primary px-4 py-1.5 text-body-sm font-bold text-primary-foreground">
          2026
        </span>
      </div>

      <div className="relative">
        {/* Vertical connecting line */}
        <div className="absolute left-[6px] top-3 bottom-3 w-0.5 bg-border/50 dark:bg-border/30" />

        <div className="space-y-4">
          {TIMELINE_ITEMS.map((item, idx) => (
            <div key={idx} className="relative flex gap-3.5">
              {/* Dot */}
              <div className="relative z-10 mt-[6px] h-3.5 w-3.5 shrink-0 rounded-full bg-primary ring-2 ring-card" />

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="mb-2 text-2xs font-semibold text-muted-foreground">
                  {item.date}
                </p>
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl",
                      item.iconBg,
                    )}
                  >
                    <HugeiconsIcon
                      icon={item.icon}
                      size={24}
                      className={item.iconColor}
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-body-sm font-bold leading-snug text-foreground">
                      {item.type}
                    </p>
                    <p className="mt-0.5 truncate text-2xs font-medium text-muted-foreground">
                      {item.subtitle}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 text-center">
        <button className="text-body-sm font-bold text-primary hover:underline">
          View All Timeline
        </button>
      </div>
    </div>
  );
}
