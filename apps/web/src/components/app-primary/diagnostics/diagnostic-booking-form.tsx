"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PhoneInput } from "@/components/ui/phone-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useBookDiagnosticTest,
  useLabs,
} from "@/hooks/queries/use-diagnostics";
import { clearIntent, readIntent, saveIntent } from "@/lib/booking-intent";
import { RootState } from "@/redux/store";
import { DiagnosticTest } from "@/types/diagnostic.type";
import { InformationCircleIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";

interface DiagnosticBookingFormProps {
  test: DiagnosticTest;
  labId?: string;
  onSuccess?: () => void;
}

export const DiagnosticBookingForm = ({
  test,
  labId,
  onSuccess,
}: DiagnosticBookingFormProps) => {
  const [selectedLab, setSelectedLab] = useState<string>(labId || "");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [preferredTime, setPreferredTime] = useState("");

  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const intent = readIntent();
    if (
      !intent ||
      intent.source !== "diagnostic-form" ||
      intent.testId !== test.id
    )
      return;

    const timer = setTimeout(() => {
      setSelectedLab(intent.labId);
      setAddress(intent.address);
      setPhone(intent.phone);
      setPreferredDate(intent.preferredDate);
      setPreferredTime(intent.preferredTime);
      clearIntent();
    }, 0);

    return () => clearTimeout(timer);
  }, [test.id]);

  // Fetch only labs that offer this specific test (backend-filtered by test ID)
  const { data: labsData, isLoading: labsLoading } = useLabs({ test: test.id, limit: 100 });
  const bookMutation = useBookDiagnosticTest();

  // All returned labs offer this test — no client-side filter needed
  const filteredLabs = useMemo(() => labsData?.data ?? [], [labsData]);

  // Resolve the selected lab's price for this specific test (from LabTests junction).
  // Falls back to the test's start-from price when no lab is selected.
  const labPrice = useMemo(() => {
    if (!selectedLab) return null;
    const lab = labsData?.data.find((l) => l.id === selectedLab);
    if (!lab) return null;
    const entry = lab.tests.find((t) => t.testId === test.id);
    return entry?.price ?? null;
  }, [selectedLab, labsData, test.id]);

  const displayPrice = labPrice ?? test.priceStartFrom;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error("Please sign in to book a test.");
      saveIntent({
        source: "diagnostic-form",
        testId: test.id,
        labId: selectedLab,
        address,
        phone,
        preferredDate,
        preferredTime,
        savedAt: Date.now(),
      });
      router.push(`/sign-in?callbackUrl=${encodeURIComponent(pathname)}`);
      return;
    }

    if (!selectedLab) return;

    let preferred_date_time: string | undefined;
    if (preferredDate) {
      const [h, m] = (preferredTime || "10:00").split(":").map(Number);
      const d = new Date(preferredDate);
      d.setHours(h || 0, m || 0, 0, 0);
      preferred_date_time = d.toISOString();
    }

    bookMutation.mutate(
      {
        test: test.id,
        lab: selectedLab,
        address,
        phone: phone,
        price: displayPrice,
        preferred_date_time,
      },
      {
        onSuccess: () => {
          onSuccess?.();
        },
      },
    );
  };

  return (
    <div className="bg-card flex h-full w-full flex-col overflow-hidden rounded-3xl border shadow-2xl">
      <form
        className="flex h-full flex-col overflow-hidden"
        onSubmit={handleSubmit}
      >
        <div className="border-border bg-muted/30 border-b px-6 py-4">
          <h2 className="text-foreground text-xl font-bold tracking-tight">
            Book {test.name}
          </h2>
          <p className="text-muted-foreground mt-0.5 text-xs font-medium">
            <span className="sm:hidden">Complete form to book test</span>
            <span className="hidden sm:inline">
              Fill in the details below to request this diagnostic test.
            </span>
          </p>
        </div>

        {/* Form Body - Scrollable Area */}
        <div className="scrollbar-thin flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {/* Lab Selection */}
            <div className="col-span-2 space-y-1.5 sm:col-span-1">
              <Label className="text-body-sm font-semibold opacity-80">
                Diagnostic Center
              </Label>
              <Select
                onValueChange={setSelectedLab}
                value={selectedLab || undefined}
              >
                <SelectTrigger className="border-border h-11! w-full rounded-xl border bg-transparent focus:ring-1">
                  <SelectValue
                    placeholder={labsLoading ? "Loading..." : "Select a lab"}
                  />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {filteredLabs.length > 0 ? (
                    filteredLabs.map((lab) => (
                      <SelectItem
                        key={lab.id}
                        value={lab.id}
                        className="rounded-lg"
                      >
                        {lab.name}
                      </SelectItem>
                    ))
                  ) : labsLoading ? (
                    <div className="text-muted-foreground p-4 text-center text-xs">
                      Fetching labs...
                    </div>
                  ) : null}
                </SelectContent>
              </Select>
            </div>

            {/* Price */}
            <div className="col-span-2 space-y-1.5 sm:col-span-1">
              <Label className="text-body-sm font-semibold opacity-80">
                {selectedLab ? "Lab price" : "Estimated price"}
              </Label>
              <div className="bg-muted/10 border-border text-primary flex h-11 items-center justify-between rounded-xl border px-4 text-sm font-bold">
                <span>৳ {displayPrice}</span>
                {!selectedLab && (
                  <span className="text-muted-foreground text-micro font-medium">
                    Select lab for actual price
                  </span>
                )}
              </div>
            </div>

            {/* Preferred Date */}
            <div className="col-span-2 space-y-1.5 sm:col-span-1">
              <Label
                htmlFor="preferred-date"
                className="text-body-sm font-semibold opacity-80"
              >
                Preferred date{" "}
                <span className="text-destructive ml-0.5">*</span>
              </Label>
              <Input
                id="preferred-date"
                type="date"
                value={preferredDate}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => setPreferredDate(e.target.value)}
                className="border-border h-11 rounded-xl border bg-transparent text-xs focus:ring-1 sm:text-sm"
                required
              />
            </div>

            {/* Preferred Time */}
            <div className="col-span-2 space-y-1.5 sm:col-span-1">
              <Label
                htmlFor="preferred-time"
                className="text-body-sm font-semibold opacity-80"
              >
                Preferred time{" "}
                <span className="text-destructive ml-0.5">*</span>
              </Label>
              <Input
                id="preferred-time"
                type="time"
                value={preferredTime}
                onChange={(e) => setPreferredTime(e.target.value)}
                className="border-border h-11 rounded-xl border bg-transparent text-xs focus:ring-1 sm:text-sm"
                required
              />
            </div>

            {/* Address */}
            <div className="col-span-2 space-y-1.5">
              <Label
                htmlFor="address"
                className="text-body-sm font-semibold opacity-80"
              >
                Full address <span className="text-destructive ml-0.5">*</span>
              </Label>
              <Input
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter your address for collection/report"
                className="border-border h-11 rounded-xl border bg-transparent text-sm focus:ring-1"
                required
              />
            </div>

            {/* Phone */}
            <div className="col-span-2 space-y-1.5">
              <Label
                htmlFor="phone"
                className="text-body-sm font-semibold opacity-80"
              >
                Contact phone number{" "}
                <span className="text-destructive ml-0.5">*</span>
              </Label>
              <PhoneInput
                id="phone"
                value={phone}
                onChange={(val) => setPhone((val as string) || "")}
                placeholder="Enter phone number"
                className="[&_button]:h-11 [&_input]:h-11"
              />
            </div>
          </div>

          {/* Booking Information - Moved inside scrollable area for mobile/desktop space efficiency */}
          <div className="bg-muted/30 mt-6 flex items-start gap-3 rounded-xl p-3 transition-colors">
            <HugeiconsIcon
              icon={InformationCircleIcon}
              className="text-primary mt-0.5 h-4 w-4 shrink-0"
            />
            <div className="space-y-0.5">
              <p className="text-foreground text-body-sm font-bold">
                Booking Information
              </p>
              <p className="text-muted-foreground text-2xs leading-relaxed font-medium">
                Our team or the diagnostic center will contact you within 15-30
                minutes to confirm your schedule and details.
              </p>
            </div>
          </div>
        </div>

        <div className="border-border bg-muted/30 shrink-0 border-t p-6 pt-4">
          <div className="space-y-4">
            {/* Submit Button */}
            <Button
              type="submit"
              disabled={bookMutation.isPending || !selectedLab}
              size="lg"
              className="bg-primary hover:bg-primary/95 h-12 w-full rounded-xl text-sm font-bold text-white shadow-lg transition-all active:scale-[0.98]"
            >
              {bookMutation.isPending
                ? "Processing..."
                : "Confirm Test Booking"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};
