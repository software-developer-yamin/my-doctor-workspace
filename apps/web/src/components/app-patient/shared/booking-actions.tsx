"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Cancel01Icon, Calendar03Icon, MoreVerticalIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";

interface BookingActionsProps {
  status: string;
  cancellableStatuses?: string[];
  onCancel?: () => void;
  onReschedule?: () => void;
  isCancelling?: boolean;
  cancelLabel?: string;
  cancelConfirmTitle?: string;
  cancelConfirmDescription?: string;
}

export function BookingActions({
  status,
  cancellableStatuses = ["Pending", "Confirmed", "In Progress"],
  onCancel,
  onReschedule,
  isCancelling = false,
  cancelLabel = "Cancel Booking",
  cancelConfirmTitle = "Cancel this booking?",
  cancelConfirmDescription = "This action cannot be undone. The booking will be marked as cancelled.",
}: BookingActionsProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const canCancel = !!onCancel && cancellableStatuses.includes(status);
  const canReschedule = !!onReschedule && cancellableStatuses.includes(status);

  if (!canCancel && !canReschedule) {
    return (
      <Button
        variant="ghost"
        size="icon"
        disabled
        className="text-muted-foreground/50 h-9 w-9 rounded-xl border-border/40 ml-auto border"
      >
        <HugeiconsIcon icon={MoreVerticalIcon} size={18} />
      </Button>
    );
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:bg-muted/50 h-9 w-9 rounded-xl border-border/40 ml-auto border transition-colors"
          >
            <HugeiconsIcon icon={MoreVerticalIcon} size={18} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          sideOffset={8}
          className="min-w-[170px]"
        >
          {canReschedule && (
            <DropdownMenuItem
              className="py-2.5 text-xs font-medium"
              onClick={onReschedule}
            >
              <HugeiconsIcon icon={Calendar03Icon} size={14} />
              Reschedule
            </DropdownMenuItem>
          )}
          {canReschedule && canCancel && <DropdownMenuSeparator />}
          {canCancel && (
            <DropdownMenuItem
              variant="destructive"
              className="py-2.5 text-xs font-medium"
              onClick={() => setConfirmOpen(true)}
            >
              <HugeiconsIcon icon={Cancel01Icon} size={14} />
              {cancelLabel}
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{cancelConfirmTitle}</AlertDialogTitle>
            <AlertDialogDescription>
              {cancelConfirmDescription}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isCancelling}>Keep it</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                onCancel?.();
                setConfirmOpen(false);
              }}
              disabled={isCancelling}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isCancelling ? "Cancelling..." : "Yes, Cancel"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
