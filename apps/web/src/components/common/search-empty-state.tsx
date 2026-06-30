import { Button } from "@/components/ui/button";
import { HugeiconsIcon, IconSvgElement } from "@hugeicons/react";

interface SearchEmptyStateProps {
  icon: IconSvgElement;
  title: string;
  description: string;
  onClear?: () => void;
  clearLabel?: string;
}

export function SearchEmptyState({
  icon,
  title,
  description,
  onClear,
  clearLabel = "Clear all filters",
}: SearchEmptyStateProps) {
  return (
    <div className="border-border bg-muted/5 flex min-h-[400px] flex-col items-center justify-center rounded-3xl border-2 border-dashed p-12 text-center">
      <div className="bg-muted mb-4 rounded-full p-6">
        <HugeiconsIcon icon={icon} size={48} className="text-muted-foreground" />
      </div>
      <h3 className="text-foreground text-xl font-bold">{title}</h3>
      <p className="text-muted-foreground mt-2 max-w-sm text-sm font-medium">
        {description}
      </p>
      {onClear && (
        <Button
          variant="outline"
          className="mt-6 rounded-xl font-semibold"
          onClick={onClear}
        >
          {clearLabel}
        </Button>
      )}
    </div>
  );
}
