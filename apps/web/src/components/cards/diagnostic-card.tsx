"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Phantom } from "@/components/ui/phantom";
import { getImageUrl } from "@/lib/utils";
import { DiagnosticTest } from "@/types/diagnostic.type";
import { useState } from "react";
import { DiagnosticBookingForm } from "../app-primary/diagnostics/diagnostic-booking-form";

const FALLBACK_IMAGE = "/images/diagnostic-fallback.jpg";

export const DiagnosticCard = ({ test, loading }: { test?: DiagnosticTest; loading?: boolean }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [imgError, setImgError] = useState(false);

  const t = test ?? ({} as DiagnosticTest);

  const imageSrc =
    !imgError && t.image
      ? getImageUrl(t.image)
      : FALLBACK_IMAGE;

  return (
    <Phantom loading={loading ?? false}>
      <div className="bg-card border-primary/30 hover:border-primary/30 flex flex-row overflow-hidden rounded-md border shadow-sm transition-[box-shadow] duration-200 hover:shadow-md sm:flex-col">

        {/* Image panel */}
        <div className="relative w-[38%] shrink-0 p-2 sm:w-full sm:p-2">
          <div className="bg-surface border-border/30 relative h-full min-h-[90px] overflow-hidden rounded-md border sm:aspect-4/3 sm:min-h-0">
            <img
              src={imageSrc}
              alt={t.name ?? ""}
              className="h-full w-full object-cover"
              loading="lazy"
              onError={() => setImgError(true)}
            />
          </div>
        </div>

        {/* Card body */}
        <div className="flex flex-1 flex-col p-3 pl-2 sm:pl-3">
          <h3 className="text-foreground line-clamp-1 text-sm font-bold leading-tight">
            {t.name}
          </h3>
          <p className="text-muted-foreground mt-0.5 line-clamp-1 text-xs">
            {t.description || "Complete Blood Count"}
          </p>

          {/* Price + Book Test */}
          <div className="mt-auto flex items-center justify-between gap-2 pt-2">
            <p className="text-foreground text-base font-bold sm:text-sm">
              ৳{t.priceStartFrom ?? 0}
            </p>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button
                  size="default"
                  className="bg-primary hover:bg-primary/90 !rounded-md font-bold text-white"
                >
                  Book Test
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[95vw] max-w-2xl! sm:max-w-2xl! rounded-[1.5em] border-0 p-0 max-h-[90vh] flex flex-col overflow-hidden">
                <DialogTitle className="sr-only">Book Diagnostic Test</DialogTitle>
                {test && (
                  <DiagnosticBookingForm
                    test={test}
                    onSuccess={() => setIsOpen(false)}
                  />
                )}
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </Phantom>
  );
};
