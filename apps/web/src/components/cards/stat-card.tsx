import { HugeiconsIcon } from "@hugeicons/react";
import { cn } from "@/lib/utils";

type StatCardProps = {
  stat: {
    icon: any;
    value: string;
    label: string;
    color: string;
    bgColor?: string;
  };
  className?: string;
};

export const StatCard = ({ stat, className }: StatCardProps) => {
  return (
    <div className={cn("group flex flex-col items-center space-y-[1em] text-center", className)}>
      {/* Icon Circle */}
      <div
        className={cn(
          "bg-card border-border/50 group-hover:border-primary/20 flex h-[4em] w-[4em] items-center justify-center rounded-full border shadow-sm transition-all duration-300 group- lg:h-[5em] lg:w-[5em]",
          stat.bgColor
        )}
      >
        <HugeiconsIcon
          icon={stat.icon}
          size={32}
          className={cn("h-[1.625em] w-[1.625em]", stat.color)}
        />
      </div>

      {/* Text Info */}
      <div className="space-y-[0.25em]">
        <h3 className="text-foreground text-[1.25em] font-bold lg:text-[1.5em]">
          {stat.value}
        </h3>
        <p className="text-muted-foreground text-[0.75em] leading-tight font-bold lg:text-[0.875em]">
          {stat.label}
        </p>
      </div>
    </div>
  );
};
