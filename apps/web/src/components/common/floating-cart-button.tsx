"use client";

import { ShoppingCart01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

interface FloatingCartButtonProps {
  count?: number;
  onClick?: () => void;
  label?: string;
}

export function FloatingCartButton({
  count = 0,
  onClick,
  label = "Checkout",
}: FloatingCartButtonProps) {
  return (
    <div className="fixed top-[30vh] right-0 z-40 transition-transform duration-300">
      <button
        type="button"
        onClick={onClick}
        className="bg-card border-border text-primary hover:bg-primary/5 active:bg-primary/10 border-l-primary flex flex-col items-center justify-center gap-1 rounded-l-xl border-y border-l-2 py-3 pr-2 pl-3 shadow-lg transition-all"
      >
        <div className="relative">
          <HugeiconsIcon icon={ShoppingCart01Icon} className="h-6 w-6" />
          <span className="bg-destructive text-destructive-foreground absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full text-micro font-bold">
            {count}
          </span>
        </div>
        <span className="mt-1 max-w-[40px] text-center text-xs leading-tight font-bold">
          {label}
        </span>
      </button>
    </div>
  );
}
