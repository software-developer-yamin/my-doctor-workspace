import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type StatPillProps = {
  value: string | number;
  label: string;
  icon?: ReactNode;
  className?: string;
};

export function StatPill({ value, label, icon, className }: StatPillProps) {
  return (
    <div className={cn("flex flex-col items-center gap-0.5", className)}>
      <div className="flex items-center gap-1">
        {icon}
        <span className="text-foreground text-lg font-bold">{value}</span>
      </div>
      <span className="text-muted-foreground text-2xs">{label}</span>
    </div>
  );
}

type StatBarProps = {
  stats: StatPillProps[];
  className?: string;
};

// Horizontal divider-separated stats row — used on doctor/hospital profile pages
export function StatBar({ stats, className }: StatBarProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-4 sm:gap-8",
        className,
      )}
    >
      {stats.map((stat, i) => (
        <div key={i} className="flex items-center gap-4 sm:gap-8">
          <StatPill {...stat} />
          {i < stats.length - 1 && (
            <div className="bg-border hidden h-8 w-px sm:block" />
          )}
        </div>
      ))}
    </div>
  );
}
