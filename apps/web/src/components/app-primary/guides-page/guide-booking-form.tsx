"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useBdLocations } from "@/hooks/queries/use-bd-locations";
import { BdLocation } from "@/services/bd-location.service";
import { useCreateGuideBooking } from "@/hooks/queries/use-guide";
import { useHospitals } from "@/hooks/queries/use-hospitals";
import { useAuth } from "@/hooks/use-auth";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowDown01Icon,
  Calendar01Icon,
  CheckmarkCircle01Icon,
  Hospital02Icon,
  Location01Icon,
  SmartPhone01Icon,
  Tick02Icon,
  UserGroupIcon,
  UserIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useCallback, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { saveIntent, readIntent, clearIntent } from "@/lib/booking-intent";

const guideBookingSchema = z.object({
  patientName: z.string().min(1, "Patient name is required"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  bdLocation: z.string().min(1, "Please select a district"),
  hospital: z.string().min(1, "Please select a hospital"),
  age: z.coerce.number().min(1, "Valid age required").max(120, "Invalid age"),
  description: z.string().min(10, "Tell us a bit more (min 10 chars)"),
});

type GuideFormValues = z.infer<typeof guideBookingSchema>;

export function GuideBookingForm() {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();
  const { data: bdLocations = [], isLoading: isBdLocationsLoading } = useBdLocations();
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const [selectedUpazila, setSelectedUpazila] = useState<string>("");
  const [selectedBdLocation, setSelectedBdLocation] = useState<string>("");
  const [bdLocationOpen, setBdLocationOpen] = useState(false);
  const [upazilaOpen, setUpazilaOpen] = useState(false);
  const districtOptions = [...new Set(bdLocations.map(l => l.district))].sort();
  const upazilaOptions = bdLocations.filter(l => l.district === selectedDistrict).map(l => l.upazila);
  const [hospitalOpen, setHospitalOpen] = useState(false);
  const [hospitalSearch, setHospitalSearch] = useState("");
  const [debouncedHospitalSearch, setDebouncedHospitalSearch] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleHospitalSearch = useCallback((value: string) => {
    setHospitalSearch(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setDebouncedHospitalSearch(value), 300);
  }, []);

  const { data: hospitalsData, isLoading: isHospitalsLoading } = useHospitals(
    selectedDistrict
      ? { district: selectedDistrict, ...(debouncedHospitalSearch ? { search: debouncedHospitalSearch } : {}) }
      : {},
  );

  const createBooking = useCreateGuideBooking();

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    register,
    formState: { errors },
  } = useForm<GuideFormValues>({
    resolver: zodResolver(guideBookingSchema as any) as any,
    defaultValues: {
      patientName: "",
      phoneNumber: "",
      bdLocation: "",
      hospital: "",
      age: "" as any,
      description: "",
    },
  });

  useEffect(() => {
    const intent = readIntent();
    if (!intent || intent.source !== "guide-form") return;
    setValue("bdLocation", intent.bdLocation);
    setSelectedBdLocation(intent.bdLocation);
    // Restore district/upazila from saved bdLocation if available
    const savedLoc = bdLocations.find(l => l._id === intent.bdLocation);
    if (savedLoc) { setSelectedDistrict(savedLoc.district); setSelectedUpazila(savedLoc.upazila); }
    setValue("hospital", intent.hospital);
    setValue("patientName", intent.patientName);
    setValue("phoneNumber", intent.phoneNumber);
    setValue("age", Number(intent.age) as any);
    setValue("description", intent.description);
    clearIntent();
  }, [setValue]);

  const onSubmit = (data: GuideFormValues) => {
    if (!isAuthenticated) {
      toast.error("Please sign in to request a guide", {
        description: "Authentication is required to book guide services.",
      });
      saveIntent({
        source: "guide-form",
        bdLocation: data.bdLocation,
        hospital: data.hospital,
        patientName: data.patientName,
        phoneNumber: data.phoneNumber,
        age: String(data.age),
        description: data.description,
        savedAt: Date.now(),
      });
      router.push(`/sign-in?callbackUrl=${encodeURIComponent(pathname)}`);
      return;
    }

    createBooking.mutate(
      {
        bdLocation: data.bdLocation,
        hospital: data.hospital,
        patientName: data.patientName,
        phoneNumber: data.phoneNumber,
        age: data.age,
        description: data.description,
      },
      {
        onSuccess: () => {
          reset();
          setSelectedBdLocation("");
          setSelectedDistrict("");
          setSelectedUpazila("");
          toast.success("Request Sent!", {
            description: "Our coordinator will contact you shortly.",
          });
        },
      },
    );
  };

  const selectedBdLocationObj = bdLocations.find(l => l._id === selectedBdLocation) as BdLocation | undefined;

  return (
    <Card className="border-border bg-card overflow-hidden rounded-xl shadow-sm">
      <CardHeader className="border-b px-6 py-5">
        <div className="flex items-center gap-4">
          <div className="bg-primary/10 text-primary flex h-12 w-12 shrink-0 items-center justify-center rounded-xl">
            <HugeiconsIcon icon={UserGroupIcon} size={24} />
          </div>
          <div>
            <CardTitle className="text-foreground text-xl font-bold leading-tight">
              Request Assistant
            </CardTitle>
            <CardDescription className="text-muted-foreground mt-0.5 text-sm">
              Fill details for hospital support
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Row 1: Patient Name + Phone Number */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-foreground">
                Patient Name <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <HugeiconsIcon icon={UserIcon} size={18} />
                </div>
                <Input
                  placeholder="Enter patient name"
                  className="border-border bg-muted/40 h-12 rounded-md border pl-10 text-sm"
                  {...register("patientName")}
                />
              </div>
              {errors.patientName && (
                <p className="text-destructive text-xs">{errors.patientName.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-foreground">
                Phone Number <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <HugeiconsIcon icon={SmartPhone01Icon} size={18} />
                </div>
                <Input
                  placeholder="Enter phone number"
                  type="tel"
                  className="border-border bg-muted/40 h-12 rounded-md border pl-10 text-sm"
                  {...register("phoneNumber")}
                />
              </div>
              {errors.phoneNumber && (
                <p className="text-destructive text-xs">{errors.phoneNumber.message}</p>
              )}
            </div>
          </div>

          {/* Row 2: Patient Age + Select District */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-foreground">
                Patient Age <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <HugeiconsIcon icon={Calendar01Icon} size={18} />
                </div>
                <Input
                  placeholder="Enter age"
                  type="number"
                  className="border-border bg-muted/40 h-12 rounded-md border pl-10 text-sm"
                  {...register("age")}
                />
              </div>
              {errors.age && (
                <p className="text-destructive text-xs">{errors.age.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-foreground">
                Select District <span className="text-destructive">*</span>
              </Label>
              <Controller
                control={control}
                name="bdLocation"
                render={({ field }) => (
                  <>
                    <Popover open={bdLocationOpen} onOpenChange={setBdLocationOpen}>
                      <PopoverTrigger asChild>
                        <button
                          type="button"
                          className="border-border bg-muted/40 flex h-12 w-full items-center gap-2 rounded-md border px-3 text-sm"
                        >
                          <HugeiconsIcon icon={Location01Icon} size={18} className="text-muted-foreground shrink-0" />
                          <span className={selectedDistrict ? "text-foreground" : "text-muted-foreground"}>
                            {isBdLocationsLoading ? "Loading..." : selectedDistrict || "Select District"}
                          </span>
                          <HugeiconsIcon icon={ArrowDown01Icon} size={16} className="ml-auto text-muted-foreground shrink-0" />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                        <Command>
                          <CommandInput placeholder="Search district..." />
                          <CommandList>
                            {isBdLocationsLoading ? (
                              <div className="space-y-1 p-1.5">
                                {Array.from({ length: 4 }).map((_, i) => (
                                  <Skeleton key={i} className="h-8 w-full rounded-2xl" />
                                ))}
                              </div>
                            ) : (
                              <>
                                <CommandEmpty>No district found.</CommandEmpty>
                                <CommandGroup>
                                  {districtOptions.map((d) => (
                                    <CommandItem
                                      key={d}
                                      value={d}
                                      onSelect={() => {
                                        setSelectedDistrict(d);
                                        setSelectedUpazila("");
                                        field.onChange("");
                                        setSelectedBdLocation("");
                                        setValue("hospital", "");
                                        setHospitalSearch("");
                                        setDebouncedHospitalSearch("");
                                        setBdLocationOpen(false);
                                      }}
                                    >
                                      {d}
                                      {selectedDistrict === d && (
                                        <HugeiconsIcon icon={Tick02Icon} size={14} className="ml-auto" />
                                      )}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </>
                            )}
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    {selectedDistrict && (
                      <div className="mt-2">
                        <Popover open={upazilaOpen} onOpenChange={setUpazilaOpen}>
                          <PopoverTrigger asChild>
                            <button
                              type="button"
                              className="border-border bg-muted/40 flex h-12 w-full items-center gap-2 rounded-md border px-3 text-sm"
                            >
                              <HugeiconsIcon icon={Location01Icon} size={18} className="text-muted-foreground shrink-0" />
                              <span className={selectedUpazila ? "text-foreground" : "text-muted-foreground"}>
                                {selectedUpazila || "Select Upazila"}
                              </span>
                              <HugeiconsIcon icon={ArrowDown01Icon} size={16} className="ml-auto text-muted-foreground shrink-0" />
                            </button>
                          </PopoverTrigger>
                          <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                            <Command>
                              <CommandInput placeholder="Search upazila..." />
                              <CommandList>
                                <CommandEmpty>No upazila found.</CommandEmpty>
                                <CommandGroup>
                                  {upazilaOptions.map((u) => {
                                    const loc = bdLocations.find(l => l.district === selectedDistrict && l.upazila === u);
                                    return (
                                      <CommandItem
                                        key={u}
                                        value={u}
                                        onSelect={() => {
                                          setSelectedUpazila(u);
                                          if (loc) {
                                            field.onChange(loc._id);
                                            setSelectedBdLocation(loc._id);
                                          }
                                          setUpazilaOpen(false);
                                        }}
                                      >
                                        {u}
                                        {selectedUpazila === u && (
                                          <HugeiconsIcon icon={Tick02Icon} size={14} className="ml-auto" />
                                        )}
                                      </CommandItem>
                                    );
                                  })}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      </div>
                    )}
                  </>
                )}
              />
              {errors.bdLocation && (
                <p className="text-destructive text-xs">{errors.bdLocation.message}</p>
              )}
            </div>
          </div>

          {/* Row 3: Select Hospital (full width) */}
          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-foreground">
              Select Hospital <span className="text-destructive">*</span>
            </Label>
            <Controller
              control={control}
              name="hospital"
              render={({ field }) => {
                const disabled = !selectedBdLocation;
                const selectedHospitalObj = hospitalsData?.data?.find((h) => h.id === field.value);
                return (
                  <Popover open={hospitalOpen} onOpenChange={disabled ? undefined : setHospitalOpen}>
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        disabled={disabled}
                        className="border-border bg-muted/40 flex h-12 w-full items-center gap-2 rounded-md border px-3 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <HugeiconsIcon icon={Hospital02Icon} size={18} className="text-muted-foreground shrink-0" />
                        <span className={selectedHospitalObj ? "text-foreground" : "text-muted-foreground"}>
                          {isHospitalsLoading ? "Loading..." : selectedHospitalObj?.name ?? "Select hospital"}
                        </span>
                        <HugeiconsIcon icon={ArrowDown01Icon} size={16} className="ml-auto text-muted-foreground shrink-0" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                      <Command shouldFilter={false}>
                        <CommandInput
                          placeholder="Search hospital..."
                          value={hospitalSearch}
                          onValueChange={handleHospitalSearch}
                        />
                        <CommandList>
                          {isHospitalsLoading ? (
                            <div className="space-y-1 p-1.5">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Skeleton key={i} className="h-8 w-full rounded-2xl" />
                              ))}
                            </div>
                          ) : (
                            <>
                              <CommandEmpty>No hospital found.</CommandEmpty>
                              <CommandGroup>
                                {hospitalsData?.data?.map((hospital) => (
                                  <CommandItem
                                    key={hospital.id}
                                    value={hospital.id}
                                    onSelect={() => {
                                      field.onChange(hospital.id);
                                      setHospitalSearch("");
                                      setDebouncedHospitalSearch("");
                                      setHospitalOpen(false);
                                    }}
                                  >
                                    {hospital.name}
                                    {field.value === hospital.id && (
                                      <HugeiconsIcon icon={Tick02Icon} size={14} className="ml-auto" />
                                    )}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </>
                          )}
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                );
              }}
            />
            {errors.hospital && (
              <p className="text-destructive text-xs">{errors.hospital.message}</p>
            )}
          </div>

          {/* Row 4: Describe Your Need */}
          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-foreground">
              Describe Your Need
            </Label>
            <Textarea
              placeholder="Describe how we can help you..."
              rows={4}
              className="border-border bg-muted/40 resize-none rounded-md border text-sm"
              {...register("description")}
            />
            {errors.description && (
              <p className="text-destructive text-xs">{errors.description.message}</p>
            )}
          </div>

          {/* Submit */}
          <div className="pt-1">
            <Button
              type="submit"
              size="lg"
              disabled={createBooking.isPending}
              className="bg-primary hover:bg-primary/90 h-13 w-full rounded-md text-base font-bold text-white transition-all active:scale-[0.98]"
            >
              {createBooking.isPending ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Processing...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <HugeiconsIcon icon={CheckmarkCircle01Icon} size={20} />
                  Confirm Request
                </span>
              )}
            </Button>

            <p className="text-muted-foreground mt-3 text-center text-xs leading-relaxed">
              * Our agent will contact you within 15 minutes to confirm.
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
