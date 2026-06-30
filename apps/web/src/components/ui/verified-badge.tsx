import { cn } from "@/lib/utils";
import { CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

type VerifiedBadgeProps = {
  label?: string;
  size?: "sm" | "md";
  className?: string;
};

export function VerifiedBadge({
  label = "Verified",
  size = "md",
  className,
}: VerifiedBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center gap-1 rounded-full bg-primary/10 font-medium text-primary",
        size === "sm" ? "px-2 py-0.5 text-micro" : "px-2.5 py-1 text-xs",
        className,
      )}
    >
      <HugeiconsIcon
        icon={CheckmarkCircle02Icon}
        size={size === "sm" ? 10 : 12}
      />
      {label}
    </span>
  );
}
