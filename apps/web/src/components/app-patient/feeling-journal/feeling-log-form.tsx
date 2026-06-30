"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Calendar01Icon,
  Calendar03Icon,
  Note01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import { FEELING_OPTIONS } from "@/data/feeling.data";
import { TFeelingType } from "@/types/feeling.type";

export function FeelingLogForm() {
  const [selectedFeeling, setSelectedFeeling] = useState<TFeelingType>("happy");

  return (
    <Card className="border-none shadow-xs overflow-hidden">
      <CardHeader className="border-border/10 border-b bg-card px-8 py-6">
        <CardTitle className="text-primary text-center text-2xl font-black">
          Feeling log for 08 April, 2026
        </CardTitle>
      </CardHeader>
      <CardContent className="p-8 lg:p-12">
        <form className="space-y-12">
          <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:gap-16">
            {/* Vitals Grid */}
            <div className="grid flex-1 grid-cols-1 gap-x-8 gap-y-10 border-border/10 pb-10 sm:grid-cols-2 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-16">
              {[
                { label: "Pulse Rate", unit: "/min", placeholder: "..." },
                { label: "Temperature", unit: "°F", placeholder: "..." },
                { label: "Body Weight", unit: "Kg", placeholder: "..." },
                { label: "SpO2 Level", unit: "%", placeholder: "..." },
                { label: "HbA1c", unit: "mmol/L", placeholder: "..." },
              ].map((vital) => (
                <div key={vital.label} className="space-y-3">
                  <Label className="text-muted-foreground/60 ml-1 text-micro font-black tracking-widest uppercase">
                    {vital.label}
                  </Label>
                  <div className="flex items-center gap-4">
                    <Input
                      placeholder={vital.placeholder}
                      className="border-border/40 bg-background/50 focus-visible:ring-primary/20 h-14 w-[120px] rounded-md px-5 font-bold"
                    />
                    <span className="text-muted-foreground text-sm font-bold italic">
                      {vital.unit}
                    </span>
                  </div>
                </div>
              ))}

              <div className="space-y-3">
                <Label className="text-muted-foreground/60 ml-1 text-micro font-black tracking-widest uppercase">
                  Blood Pressure
                </Label>
                <div className="flex items-center gap-3">
                  <div className="flex-1 space-y-1.5">
                    <Input
                      placeholder="..."
                      className="border-border/40 bg-background/50 focus-visible:ring-primary/20 h-14 rounded-md px-4 text-center font-black"
                    />
                    <p className="text-muted-foreground/40 text-center text-[9px] font-bold uppercase tracking-tighter">
                      Systolic
                    </p>
                  </div>
                  <span className="text-muted-foreground/20 text-2xl font-light">
                    /
                  </span>
                  <div className="flex-1 space-y-1.5">
                    <Input
                      placeholder="..."
                      className="border-border/40 bg-background/50 focus-visible:ring-primary/20 h-14 rounded-md px-4 text-center font-black"
                    />
                    <p className="text-muted-foreground/40 text-center text-[9px] font-bold uppercase tracking-tighter">
                      Diastolic
                    </p>
                  </div>
                  <span className="text-muted-foreground text-micro font-bold italic ml-1">
                    mmHg
                  </span>
                </div>
              </div>
            </div>

            {/* Feeling Selection */}
            <div className="flex flex-1 flex-col items-center justify-center space-y-8">
              <Label className="text-muted-foreground/60 text-2xs font-black tracking-[0.2em] uppercase">
                How are you feeling?
              </Label>
              <div className="grid w-full max-w-sm grid-cols-2 gap-5 sm:gap-6">
                {FEELING_OPTIONS.map((feeling) => (
                  <button
                    key={feeling.id}
                    type="button"
                    onClick={() => setSelectedFeeling(feeling.id)}
                    className={`group relative flex flex-col items-center justify-center gap-3 rounded-md border-2 p-6 transition-all duration-300 ${
                      selectedFeeling === feeling.id
                        ? "scale-105 shadow-xl ring-4 ring-offset-2"
                        : "border-transparent bg-secondary/20 hover:bg-secondary/40 grayscale hover:grayscale-0"
                    }`}
                    style={{
                      borderColor:
                        selectedFeeling === feeling.id
                          ? feeling.color
                          : "transparent",
                      backgroundColor:
                        selectedFeeling === feeling.id
                          ? feeling.bg
                          : undefined,
                      boxShadow:
                        selectedFeeling === feeling.id
                          ? `0 10px 25px -5px ${feeling.color}33`
                          : undefined,
                    }}
                  >
                    <HugeiconsIcon
                      icon={feeling.icon}
                      size={48}
                      style={{ color: feeling.color }}
                      className="transition-transform duration-300"
                    />
                    <span
                      className={`text-xs font-black tracking-wider uppercase transition-colors duration-300 ${
                        selectedFeeling === feeling.id
                          ? "text-foreground"
                          : "text-muted-foreground/60"
                      }`}
                    >
                      {feeling.label}
                    </span>
                    {selectedFeeling === feeling.id && (
                      <div
                        className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full text-white shadow-lg"
                        style={{ backgroundColor: feeling.color }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Form Actions */}
          <div className="border-border/10 border-t pt-10">
            <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
              <div className="flex flex-col gap-10 sm:flex-row">
                <div className="flex-1 space-y-3">
                  <Label className="text-muted-foreground/60 ml-1 text-micro font-black tracking-widest uppercase">
                    Record Date
                  </Label>
                  <div className="relative">
                    <Input
                      type="date"
                      className="border-border/40 bg-background/50 focus-visible:ring-primary/20 h-14 rounded-md pl-12 pr-5 font-bold"
                    />
                    <HugeiconsIcon
                      icon={Calendar01Icon}
                      size={20}
                      className="text-primary absolute top-1/2 left-4 -translate-y-1/2 opacity-40"
                    />
                  </div>
                </div>
                <div className="flex-1 space-y-3">
                  <Label className="text-muted-foreground/60 ml-1 text-micro font-black tracking-widest uppercase">
                    Record Time
                  </Label>
                  <div className="relative">
                    <Input
                      type="time"
                      className="border-border/40 bg-background/50 focus-visible:ring-primary/20 h-14 rounded-md pl-12 pr-5 font-bold"
                    />
                    <HugeiconsIcon
                      icon={Calendar03Icon}
                      size={20}
                      className="text-primary absolute top-1/2 left-4 -translate-y-1/2 opacity-40"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-end gap-5">
                <div className="flex-1 space-y-3">
                  <Label className="text-muted-foreground/60 ml-1 text-micro font-black tracking-widest uppercase">
                    Additional Notes
                  </Label>
                  <div className="relative">
                    <Input
                      placeholder="Write a note about your feeling..."
                      className="border-border/40 bg-background/50 focus-visible:ring-primary/20 h-14 rounded-md pl-12 pr-5 font-bold"
                    />
                    <HugeiconsIcon
                      icon={Note01Icon}
                      size={20}
                      className="text-primary absolute top-1/2 left-4 -translate-y-1/2 opacity-40"
                    />
                  </div>
                </div>
                <Button className="shadow-primary bg-primary hover:bg-primary-shade h-14 rounded-md px-14 text-2xs font-black tracking-widest uppercase">
                  Save Record
                </Button>
              </div>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
