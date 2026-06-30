import { cn } from "@/lib/utils";
import { HugeiconsIcon } from "@hugeicons/react";
import type { IconSvgElement } from "@hugeicons/react";

type FeatureStatProps = {
  icon: IconSvgElement;
  title: string;
  description: string;
  iconClassName?: string;
  className?: string;
};

export function FeatureStat({
  icon,
  title,
  description,
  iconClassName,
  className,
}: FeatureStatProps) {
  return (
    <div
      className={cn("flex flex-col items-center gap-3 text-center", className)}
    >
      <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-full">
        <HugeiconsIcon
          icon={icon}
          size={24}
          className={cn("text-primary", iconClassName)}
        />
      </div>
      <div>
        <p className="text-foreground text-sm font-bold">{title}</p>
        <p className="text-muted-foreground mt-0.5 text-xs">{description}</p>
      </div>
    </div>
  );
}

type FeatureStatRowProps = {
  items: Omit<FeatureStatProps, "className">[];
  className?: string;
};

export function FeatureStatRow({ items, className }: FeatureStatRowProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-6 sm:grid-cols-4",
        className,
      )}
    >
      {items.map((item, i) => (
        <FeatureStat key={i} {...item} />
      ))}
    </div>
  );
}
