"use client";

import { ReactNode } from "react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

export function MobileFilterSheet({
  open,
  onOpenChange,
  title,
  children,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title: string;
  children: ReactNode;
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        showCloseButton={false}
        className="overflow-hidden rounded-t-3xl p-0 data-[side=bottom]:h-[85vh]"
      >
        <div className="flex h-full flex-col">
          {/* Drag handle */}
          <div className="flex justify-center pt-3 pb-1">
            <div className="bg-muted-foreground/30 h-1 w-10 rounded-full" />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-5 pt-4 pb-4">
            <SheetTitle className="text-foreground text-lg font-bold">
              {title}
            </SheetTitle>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="border-border bg-muted/40 text-foreground/70 hover:text-foreground flex h-8 w-8 items-center justify-center rounded-full border transition-colors"
            >
              <HugeiconsIcon icon={Cancel01Icon} size={16} />
            </button>
          </div>

          {/* Scrollable content */}
          <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-4">
            {children}
          </div>

          {/* Footer divider */}
          <div className="border-border border-t px-5 py-4" />
        </div>
      </SheetContent>
    </Sheet>
  );
}
