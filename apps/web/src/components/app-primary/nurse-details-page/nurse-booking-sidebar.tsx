"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { TNurseDetails } from "@/data/nurse-details.data";
import {
  Calendar01Icon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
  Home01Icon,
  Building01Icon,
  Clock01Icon,
  Location01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";

type TNurseBookingSidebarProps = {
  nurse: TNurseDetails;
};

const getNextDays = (n: number) => {
  const days = [];
  const today = new Date();
  for (let i = 0; i < n; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    days.push(d);
  }
  return days;
};

const DATES = getNextDays(30);
const FORMAT_DATE = (d: Date, idx: number) => {
  if (idx === 0) return { title: "Today", subtitle: "-" };
  if (idx === 1) return { title: "Tomorrow", subtitle: "Available" };
  const dayName = d.toLocaleDateString("en-US", { weekday: "short" });
  const dateNum = d.toLocaleDateString("en-US", { day: "numeric", month: "short" });
  return { title: dateNum, subtitle: dayName };
};

const HOSPITAL_SLOTS = {
  Morning: ["08:00 AM", "08:30 AM", "09:00 AM", "09:30 AM", "10:00 AM"],
  Afternoon: ["12:00 PM", "12:30 PM", "01:00 PM", "01:30 PM", "02:00 PM"],
  Evening: ["04:00 PM", "04:30 PM", "05:00 PM", "05:30 PM"],
};

const HOME_VISIT_DURATIONS = [
  { id: "4h", label: "4 Hours", price: "BDT 1,200" },
  { id: "8h", label: "8 Hours (Day Shift)", price: "BDT 2,000" },
  { id: "12h", label: "12 Hours", price: "BDT 2,800" },
  { id: "24h", label: "24 Hours", price: "BDT 4,500" },
];

const HOME_VISIT_SLOTS = {
  Morning: ["06:00 AM", "07:00 AM", "08:00 AM", "09:00 AM", "10:00 AM"],
  Afternoon: ["12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM"],
  Evening: ["04:00 PM", "05:00 PM", "06:00 PM", "07:00 PM"],
};

export function NurseBookingSidebar({ nurse }: TNurseBookingSidebarProps) {
  const [visitMode, setVisitMode] = useState<"hospital" | "home">("home");
  const [selectedLocation, setSelectedLocation] = useState<string>(
    nurse.location[0]?.id || "",
  );
  const [selectedDate, setSelectedDate] = useState<number>(0);
  const [selectedSlot, setSelectedSlot] = useState<string>("");
  const [selectedDuration, setSelectedDuration] = useState<string>("8h");

  // Home visit form state
  const [homeAddress, setHomeAddress] = useState("");
  const [homeDistrict, setHomeDistrict] = useState("");
  const [specialNotes, setSpecialNotes] = useState("");

  const isHospitalFormComplete =
    selectedLocation && selectedDate !== null && selectedSlot;

  const isHomeFormComplete =
    homeAddress.trim() !== "" &&
    homeDistrict.trim() !== "" &&
    selectedDate !== null &&
    selectedSlot &&
    selectedDuration;

  return (
    <div className="sticky top-6 flex flex-col gap-6">

      {/* Visit Mode Toggle */}
      <Card className="border-border bg-card overflow-hidden">
        <div className="border-border bg-muted/30 border-b p-4">
          <h2 className="text-foreground mb-3 text-sm font-black">
            How would you like to book?
          </h2>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => { setVisitMode("home"); setSelectedSlot(""); }}
              className={`flex items-center justify-center gap-2 rounded-lg border px-4 py-3 text-xs font-black transition-all ${
                visitMode === "home"
                  ? "border-primary bg-primary text-primary-foreground shadow-primary/20 shadow-md"
                  : "border-border text-muted-foreground hover:border-primary/40 hover:text-primary"
              }`}
            >
              <HugeiconsIcon icon={Home01Icon} size={16} />
              Home Visit
            </button>
            <button
              onClick={() => { setVisitMode("hospital"); setSelectedSlot(""); }}
              className={`flex items-center justify-center gap-2 rounded-lg border px-4 py-3 text-xs font-black transition-all ${
                visitMode === "hospital"
                  ? "border-primary bg-primary text-primary-foreground shadow-primary/20 shadow-md"
                  : "border-border text-muted-foreground hover:border-primary/40 hover:text-primary"
              }`}
            >
              <HugeiconsIcon icon={Building01Icon} size={16} />
              Hospital Visit
            </button>
          </div>
        </div>

        {/* ─── HOME VISIT FORM ─── */}
        {visitMode === "home" && (
          <div className="flex flex-col gap-5 p-4 sm:p-6">

            {/* Info Banner */}
            <div className="bg-primary/5 border-primary/20 flex items-start gap-3 rounded-xl border p-4">
              <HugeiconsIcon icon={Home01Icon} size={20} className="text-primary mt-0.5 shrink-0" />
              <div>
                <p className="text-primary text-xs font-black">Nurse comes to your home</p>
                <p className="text-muted-foreground mt-0.5 text-micro font-bold leading-relaxed">
                  {nurse.name} will visit your location. Please provide your full address below.
                </p>
              </div>
            </div>

            {/* Home Address */}
            <div className="flex flex-col gap-2">
              <Label className="text-foreground flex items-center gap-1.5 text-xs font-black uppercase tracking-tight">
                <HugeiconsIcon icon={Location01Icon} size={14} className="text-primary" />
                Your Home Address
              </Label>
              <Textarea
                placeholder="House No., Road No., Area / Locality..."
                value={homeAddress}
                onChange={(e) => setHomeAddress(e.target.value)}
                className="border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20 min-h-[80px] resize-none rounded-md text-sm font-bold transition-all outline-none focus:ring-2"
              />
            </div>

            {/* District / City */}
            <div className="flex flex-col gap-2">
              <Label className="text-foreground text-xs font-black uppercase tracking-tight">
                District / City
              </Label>
              <input
                type="text"
                placeholder="e.g. Dhaka, Chittagong..."
                value={homeDistrict}
                onChange={(e) => setHomeDistrict(e.target.value)}
                className="border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20 h-11 rounded-md border px-4 text-sm font-bold transition-all outline-none focus:ring-2"
              />
            </div>

            {/* Service Duration */}
            <div className="flex flex-col gap-3">
              <Label className="text-foreground flex items-center gap-1.5 text-xs font-black uppercase tracking-tight">
                <HugeiconsIcon icon={Clock01Icon} size={14} className="text-primary" />
                Service Duration
              </Label>
              <div className="grid grid-cols-2 gap-2">
                {HOME_VISIT_DURATIONS.map((dur) => (
                  <button
                    key={dur.id}
                    onClick={() => setSelectedDuration(dur.id)}
                    className={`flex flex-col items-start gap-0.5 rounded-lg border p-3 text-left transition-all ${
                      selectedDuration === dur.id
                        ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                        : "border-border hover:border-primary/30 hover:bg-muted/30"
                    }`}
                  >
                    <span className={`text-xs font-black ${selectedDuration === dur.id ? "text-primary" : "text-foreground"}`}>
                      {dur.label}
                    </span>
                    <span className="text-muted-foreground text-micro font-black">
                      {dur.price}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Special Notes */}
            <div className="flex flex-col gap-2">
              <Label className="text-foreground text-xs font-black uppercase tracking-tight">
                Special Instructions <span className="text-muted-foreground normal-case font-bold">(optional)</span>
              </Label>
              <Textarea
                placeholder="e.g. Patient has diabetes, needs IV care, specific floor..."
                value={specialNotes}
                onChange={(e) => setSpecialNotes(e.target.value)}
                className="border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20 min-h-[70px] resize-none rounded-md text-sm font-bold transition-all outline-none focus:ring-2"
              />
            </div>
          </div>
        )}

        {/* ─── HOSPITAL VISIT FORM ─── */}
        {visitMode === "hospital" && (
          <div className="flex max-h-[80vh] flex-col gap-5 overflow-y-auto p-4 sm:p-6">
            <div className="flex flex-col gap-3">
              <h3 className="text-foreground text-sm font-black">Select Location</h3>
              <RadioGroup
                value={selectedLocation}
                onValueChange={setSelectedLocation}
                className="flex flex-col gap-3"
              >
                {nurse.location.map((loc) => (
                  <Label
                    key={loc.id}
                    htmlFor={loc.id}
                    className={`flex cursor-pointer flex-col gap-1 rounded-md border p-4 transition-colors ${
                      selectedLocation === loc.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/40 hover:bg-muted/30"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <RadioGroupItem
                        value={loc.id}
                        id={loc.id}
                        className="border-primary text-primary"
                      />
                      <span className="text-foreground text-sm font-black">{loc.name}</span>
                    </div>
                    <span className="text-muted-foreground ml-7 text-xs font-bold italic">
                      {loc.address}
                    </span>
                  </Label>
                ))}
              </RadioGroup>
            </div>
          </div>
        )}
      </Card>

      {/* Date & Time Slot (shared for both modes) */}
      <Card className="border-primary bg-card flex flex-col overflow-hidden border shadow-[0_0_15px_rgba(0,166,239,0.12)]">
        <div className="border-border border-b p-4">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-foreground text-sm font-black">
              {visitMode === "home" ? "Select Arrival Date & Time" : "Select Date & Time"}
            </h3>
            <div className="border-border hover:border-primary flex cursor-pointer items-center gap-2 rounded-md border px-3 py-1 transition-colors">
              <span className="text-muted-foreground text-xs font-bold">
                {new Date().toLocaleDateString("en-US", { day: "2-digit", month: "2-digit", year: "numeric" })}
              </span>
              <HugeiconsIcon icon={Calendar01Icon} className="text-muted-foreground h-4 w-4" />
            </div>
          </div>

          <div className="relative flex items-center">
            <Button variant="ghost" size="icon" className="hover:bg-muted text-muted-foreground h-8 w-8 shrink-0 rounded-full">
              <HugeiconsIcon icon={ArrowLeft01Icon} className="h-4 w-4" />
            </Button>
            <ScrollArea className="w-full whitespace-nowrap">
              <div className="flex w-max">
                {DATES.map((d, index) => {
                  const { title, subtitle } = FORMAT_DATE(d, index);
                  const isSelected = selectedDate === index;
                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={() => { setSelectedDate(index); setSelectedSlot(""); }}
                      className={`flex min-w-[70px] flex-col items-center justify-center border-b-2 px-3 py-2 transition-colors sm:min-w-[80px] ${
                        isSelected
                          ? "border-primary text-primary"
                          : "border-transparent text-muted-foreground hover:bg-muted/30 hover:text-foreground"
                      }`}
                    >
                      <span className={`text-xs font-black sm:text-sm ${isSelected ? "text-primary" : "text-foreground"}`}>
                        {title}
                      </span>
                      <span className={`text-micro sm:text-xs ${isSelected ? "text-primary font-black" : "text-muted-foreground font-bold"}`}>
                        {subtitle}
                      </span>
                    </button>
                  );
                })}
              </div>
              <ScrollBar orientation="horizontal" className="hidden" />
            </ScrollArea>
            <Button variant="ghost" size="icon" className="hover:bg-muted text-foreground h-8 w-8 shrink-0 rounded-full">
              <HugeiconsIcon icon={ArrowRight01Icon} className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Time Slots */}
        <div className="bg-card flex max-h-[280px] flex-col gap-5 overflow-y-auto p-4 sm:p-6">
          {Object.entries(visitMode === "home" ? HOME_VISIT_SLOTS : HOSPITAL_SLOTS).map(
            ([period, slots]) => (
              <div key={period} className="flex flex-col gap-3">
                <h4 className="text-muted-foreground text-xs font-black uppercase tracking-tight">
                  {period}
                </h4>
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 sm:gap-3">
                  {slots.map((slot) => (
                    <Button
                      key={slot}
                      type="button"
                      variant={selectedSlot === slot ? "default" : "outline"}
                      onClick={() => setSelectedSlot(slot)}
                      className={`h-9 rounded-md border px-0 text-xs font-black sm:text-xs ${
                        selectedSlot === slot
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-primary/30 bg-background text-primary hover:border-primary hover:bg-primary/5"
                      }`}
                    >
                      {slot}
                    </Button>
                  ))}
                </div>
              </div>
            )
          )}
        </div>
      </Card>

      {/* Confirm Button */}
      <Button
        className="w-full py-6 text-base font-black"
        variant={
          (visitMode === "home" ? isHomeFormComplete : isHospitalFormComplete)
            ? "default"
            : "secondary"
        }
        disabled={
          visitMode === "home" ? !isHomeFormComplete : !isHospitalFormComplete
        }
      >
        {visitMode === "home" ? "Confirm Home Visit" : "Confirm Hospital Appointment"}
      </Button>

      {visitMode === "home" && (
        <p className="text-muted-foreground -mt-3 text-center text-micro font-bold italic">
          A coordinator will call you to confirm the booking details.
        </p>
      )}
    </div>
  );
}
