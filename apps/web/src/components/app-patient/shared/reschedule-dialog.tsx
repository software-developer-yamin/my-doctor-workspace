"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Calendar01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { format } from "date-fns";
import { useEffect, useState } from "react";

interface RescheduleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  initialDate?: string;
  showTime?: boolean;
  isSubmitting?: boolean;
  onConfirm: (isoDateTime: string) => void;
}

export function RescheduleDialog({
  open,
  onOpenChange,
  title = "Reschedule booking",
  description = "Pick a new date and time for your booking.",
  initialDate,
  showTime = true,
  isSubmitting = false,
  onConfirm,
}: RescheduleDialogProps) {
  const [date, setDate] = useState<Date | undefined>();
  const [time, setTime] = useState<string>("10:00");

  useEffect(() => {
    if (!open) return;
    if (initialDate) {
      const d = new Date(initialDate);
      if (!isNaN(d.getTime())) {
        setDate(d);
        setTime(format(d, "HH:mm"));
      }
    }
  }, [open, initialDate]);

  const handleConfirm = () => {
    if (!date) return;
    const [h, m] = time.split(":").map(Number);
    const out = new Date(date);
    if (showTime) out.setHours(h || 0, m || 0, 0, 0);
    onConfirm(out.toISOString());
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-md md:max-w-2xl lg:max-w-4xl">
        <DialogHeader className="shrink-0 p-6 pb-4">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        {/* Scrollable content area — native overflow, works on all devices */}
        <div className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-contain p-6 pt-0">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>New Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "h-11 w-full justify-start text-left font-semibold",
                      !date && "text-muted-foreground",
                    )}
                  >
                    <HugeiconsIcon icon={Calendar01Icon} className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="center">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {showTime && (
              <div className="space-y-2">
                <Label>New Time</Label>
                <Input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="h-11 font-semibold"
                />
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="shrink-0 border-t p-6 pt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!date || isSubmitting}
            className="w-full sm:w-auto"
          >
            {isSubmitting ? "Updating..." : "Confirm Reschedule"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
