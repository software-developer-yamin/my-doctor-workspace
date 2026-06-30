import { cn } from "@/lib/utils";

type AvailabilityBadgeProps = {
  available: boolean;
  label?: { available?: string; unavailable?: string };
  size?: "sm" | "md";
  className?: string;
};

export function AvailabilityBadge({
  available,
  label,
  size = "md",
  className,
}: AvailabilityBadgeProps) {
  const text = available
    ? (label?.available ?? "Available")
    : (label?.unavailable ?? "Unavailable");

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full font-semibold text-white",
        available ? "bg-emerald-500" : "bg-red-500",
        size === "sm" ? "px-2 py-0.5 text-micro" : "px-2.5 py-1 text-xs",
        className,
      )}
    >
      <span
        className={cn(
          "inline-block rounded-full bg-white/80",
          size === "sm" ? "h-1.5 w-1.5" : "h-2 w-2",
        )}
      />
      {text}
    </span>
  );
}

// Dot-only variant — used as status indicator on card thumbnails
type StatusDotProps = {
  available: boolean;
  className?: string;
};

export function StatusDot({ available, className }: StatusDotProps) {
  return (
    <div
      className={cn(
        "h-4 w-4 rounded-full border-2 border-white shadow-sm",
        available ? "bg-primary" : "bg-slate-300",
        className,
      )}
    />
  );
}
