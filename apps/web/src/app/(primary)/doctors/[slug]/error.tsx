"use client";

import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { Alert02Icon, ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import { useRouter } from "next/navigation";

export default function DoctorDetailsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  return (
    <main className="container mx-auto max-w-[1440px] px-4 py-10 lg:py-20">
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-8 text-center">
        <div className="flex h-24 w-24 items-center justify-center rounded-[2rem] bg-destructive/10 text-destructive shadow-xl shadow-destructive/5">
          <HugeiconsIcon icon={Alert02Icon} size={40} />
        </div>
        <div className="flex flex-col gap-3 max-w-md">
          <h2 className="text-2xl font-black tracking-tight text-foreground">
            Something went wrong
          </h2>
          <p className="text-sm font-bold text-muted-foreground/60 leading-relaxed">
            We couldn&apos;t load this doctor&apos;s profile. This might be a temporary issue — please try again.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="h-12 gap-2 rounded-xl border-border/60 px-6 text-micro font-black uppercase tracking-wider"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} size={16} />
            Go Back
          </Button>
          <Button
            onClick={() => reset()}
            className="h-12 rounded-xl px-8 text-micro font-black uppercase tracking-[0.15em] shadow-lg shadow-primary/15"
          >
            Try Again
          </Button>
        </div>
      </div>
    </main>
  );
}
