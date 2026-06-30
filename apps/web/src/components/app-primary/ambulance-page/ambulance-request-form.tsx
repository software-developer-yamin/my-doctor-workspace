"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DialogClose } from "@/components/ui/dialog";
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
import { useBookAmbulance } from "@/hooks/queries/use-ambulances";
import { useAmbulanceFilters } from "@/hooks/queries/use-ambulance-filters";
import { Cancel01Icon, InformationCircleIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";

import { RootState } from "@/redux/store";
import { saveIntent, readIntent, clearIntent } from "@/lib/booking-intent";

type TAmbulanceRequestFormProps = {
  ambulanceTypes: { id: string; title: string }[];
  onSuccess?: () => void;
};

export const AmbulanceRequestForm = ({
  ambulanceTypes,
  onSuccess,
}: TAmbulanceRequestFormProps) => {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [ambulanceType, setAmbulanceType] = useState("");
  const [date, setDate] = useState("");
  const [roundTrip, setRoundTrip] = useState(false);
  const [phone, setPhone] = useState("");

  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { mutate, isPending } = useBookAmbulance();
  const FALLBACK_TYPES = ['AC', 'Non-AC', 'ACLS', 'ALS', 'Freezing', 'ICU', 'NICU', 'AIR'].map((t) => ({ id: t, title: t }));
  const { data: filtersData } = useAmbulanceFilters();
  const apiTypes = (filtersData?.types ?? []).map((t) => ({ id: t, title: t }));
  const resolvedApiTypes = apiTypes.length > 0 ? apiTypes : FALLBACK_TYPES;
  const displayTypes = ambulanceTypes.length > 0 ? ambulanceTypes : resolvedApiTypes;

  useEffect(() => {
    const intent = readIntent();
    if (!intent || intent.source !== "ambulance-form") return;
    setFrom(intent.from);
    setTo(intent.to);
    setAmbulanceType(intent.ambulanceType);
    setDate(intent.date);
    setPhone(intent.phone);
    setRoundTrip(intent.roundTrip);
    clearIntent();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error("Please sign in to book an ambulance.");
      saveIntent({ source: "ambulance-form", from, to, ambulanceType, date, phone, roundTrip, savedAt: Date.now() });
      router.push(`/sign-in?callbackUrl=${encodeURIComponent(pathname)}`);
      return;
    }

    if (!from.trim()) { toast.error("Pickup Point is required."); return; }
    if (!to.trim()) { toast.error("Destination is required."); return; }
    if (!ambulanceType) { toast.error("Please select an ambulance type."); return; }
    if (!date) { toast.error("Please select a service date."); return; }

    const cleanPhone = phone.replace(/\D/g, "");
    if (!cleanPhone || cleanPhone.length < 8) {
      toast.error("Please enter a valid phone number.");
      return;
    }

    mutate(
      {
        from_address: from,
        to_address: to,
        ambulance_type: ambulanceType,
        date_time: new Date(date).toISOString(),
        isRoundTrip: roundTrip,
        phone: phone,
      },
      { onSuccess: () => { onSuccess?.(); } },
    );
  };

  return (
    <div className="bg-card flex min-h-0 w-full flex-1 flex-col overflow-hidden rounded-md">
      <DialogClose asChild>
        <Button
          variant="ghost"
          className="absolute top-3 right-3 z-50 h-7 w-7 shrink-0 rounded-md bg-primary/10 text-primary transition-all duration-200 hover:bg-primary hover:text-white sm:top-4 sm:right-4 sm:h-8 sm:w-8"
          size="icon"
        >
          <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} size={14} className="sm:hidden" />
          <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} size={16} className="hidden sm:block" />
          <span className="sr-only">Close</span>
        </Button>
      </DialogClose>

      {/* Header */}
      <div className="border-border bg-muted/30 flex shrink-0 items-start border-b px-4 py-3 sm:px-6 sm:py-4 md:px-8 md:py-5">
        <div>
          <h2 className="text-foreground text-base font-bold tracking-tight sm:text-xl md:text-2xl">
            Request Ambulance
          </h2>
          <p className="text-muted-foreground mt-0.5 text-xs font-medium sm:mt-1 sm:text-sm">
            Fill in the details below to request an emergency ambulance service.
          </p>
        </div>
      </div>

      {/* Body */}
      <form className="flex min-h-0 flex-1 flex-col" onSubmit={handleSubmit}>
        <div className="flex-1 overflow-y-auto p-3 sm:p-5 md:p-6 lg:p-8">
          <div className="space-y-2.5 md:space-y-3">

            <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2 md:gap-3">
              {/* From */}
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="from" className="text-xs font-bold opacity-80 sm:text-sm">
                  Pickup Point <span className="text-destructive ml-0.5">*</span>
                </Label>
                <Input
                  id="from"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  placeholder="Where should we pick you up?"
                  className="border-border h-10 rounded-md border bg-transparent focus:ring-1 sm:h-11 md:h-12"
                  required
                />
              </div>

              {/* Destination */}
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="to" className="text-xs font-bold opacity-80 sm:text-sm">
                  Destination <span className="text-destructive ml-0.5">*</span>
                </Label>
                <Input
                  id="to"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  placeholder="Where do you need to go?"
                  className="border-border h-10 rounded-md border bg-transparent focus:ring-1 sm:h-11 md:h-12"
                  required
                />
              </div>

              {/* Ambulance Type */}
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="ambulanceType" className="text-xs font-bold opacity-80 sm:text-sm">
                  Ambulance Category <span className="text-destructive ml-0.5">*</span>
                </Label>
                <Select onValueChange={setAmbulanceType} value={ambulanceType}>
                  <SelectTrigger
                    id="ambulanceType"
                    className="border-border h-10! w-full rounded-md border bg-transparent focus:ring-1 sm:h-11! md:h-12!"
                  >
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent className="rounded-md">
                    {displayTypes.map((type) => (
                      <SelectItem
                        key={type.id || "unknown"}
                        value={type.id || "unknown"}
                        className="rounded-md"
                      >
                        {type.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Date */}
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="date" className="text-xs font-bold opacity-80 sm:text-sm">
                  Service Date <span className="text-destructive ml-0.5">*</span>
                </Label>
                <Input
                  id="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  type="date"
                  className="border-border h-10 rounded-md border bg-transparent focus:ring-1 sm:h-11 md:h-12"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2 md:gap-3">
              {/* Phone */}
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="phone" className="text-xs font-bold opacity-80 sm:text-sm">
                  Phone Number <span className="text-destructive ml-0.5">*</span>
                </Label>
                <PhoneInput
                  id="phone"
                  value={phone}
                  onChange={(val) => setPhone((val as string) || "")}
                  placeholder="Enter phone number"
                  className="[&_button]:h-10 [&_button]:rounded-s-md [&_button]:border-border [&_button]:bg-transparent [&_input]:h-10 [&_input]:rounded-e-md [&_input]:border-border [&_input]:bg-transparent sm:[&_button]:h-11 sm:[&_input]:h-11 md:[&_button]:h-12 md:[&_input]:h-12"
                />
              </div>

              {/* Round Trip */}
              <div className="space-y-1.5 sm:space-y-2">
                <Label className="text-xs font-bold opacity-0 select-none sm:text-sm">Hidden</Label>
                <label className="border-border bg-muted/10 flex h-10 items-center gap-2.5 rounded-md border px-3 sm:h-11 sm:gap-3 md:h-12">
                  <Checkbox
                    id="roundTrip"
                    checked={roundTrip}
                    onCheckedChange={(c) => setRoundTrip(c as boolean)}
                    className="h-4 w-4 rounded-md sm:h-5 sm:w-5"
                  />
                  <Label
                    htmlFor="roundTrip"
                    className="cursor-pointer text-xs font-semibold opacity-80 sm:text-sm"
                  >
                    Include return trip (Round Trip)
                  </Label>
                </label>
              </div>
            </div>

            {/* Info note */}
            <div className="bg-muted/30 hover:bg-muted/40 flex items-start gap-2 rounded-md p-3 transition-colors sm:gap-3 sm:p-4 md:gap-4">
              <HugeiconsIcon
                icon={InformationCircleIcon}
                className="text-primary mt-0.5 h-4 w-4 shrink-0 sm:h-5 sm:w-5"
              />
              <div className="space-y-0.5 sm:space-y-1">
                <p className="text-foreground text-xs font-bold sm:text-sm">
                  Important Information
                </p>
                <p className="text-muted-foreground text-xs leading-relaxed font-medium">
                  After submitting your request, our specialized ambulance
                  coordination team will contact you within 15-30 minutes to
                  confirm vehicle availability and transit logistics.
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="border-border bg-card shrink-0 border-t p-3 sm:px-5 sm:py-4 md:px-6 md:py-4 lg:px-8 lg:py-5">
          <Button
            type="submit"
            size="lg"
            disabled={isPending}
            className="bg-primary hover:bg-primary/95 h-10 w-full rounded-md text-sm font-bold text-white shadow-xl transition-all active:scale-[0.98] sm:h-11 sm:text-base md:h-12 lg:h-14"
          >
            {isPending ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Processing Request...
              </span>
            ) : (
              "Confirm Ambulance Request"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};
