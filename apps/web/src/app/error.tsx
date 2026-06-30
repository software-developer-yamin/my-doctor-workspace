"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Alert01Icon, RefreshIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="bg-background flex min-h-[70vh] flex-col items-center justify-center px-4 py-12 text-center md:py-20">
      <div className="bg-destructive/10 mb-6 flex h-20 w-20 items-center justify-center rounded-2xl">
        <HugeiconsIcon
          icon={Alert01Icon}
          size={40}
          className="text-destructive animate-pulse"
        />
      </div>

      <h1 className="text-foreground mb-3 text-2xl font-bold tracking-tight sm:text-4xl">
        Something Went Wrong
      </h1>
      <p className="text-muted-foreground mx-auto mb-8 max-w-md text-sm font-medium leading-relaxed sm:text-base">
        Something went wrong on our end. Our tech team has been notified.
        Please try refreshing the page or contact support if the issue persists.
      </p>

      <Button
        onClick={() => reset()}
        size="lg"
        className="h-10 gap-2 rounded-xl px-10 text-xs font-bold shadow-md transition-all active:scale-95"
      >
        <HugeiconsIcon icon={RefreshIcon} size={18} className="animate-spin-slow" />
        Try Again
      </Button>
    </div>
  );
}
