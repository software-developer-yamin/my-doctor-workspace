"use client";

import { Doctor } from "@/types/doctor.type";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import {
 Calendar01Icon,
 Call02Icon,
 Message01Icon,
 Share05Icon,
 Home01Icon,
} from "@hugeicons/core-free-icons";
import { toast } from "sonner";

type DoctorQuickActionsProps = {
 doctor: Doctor;
 onBookNow: () => void;
};

export function DoctorQuickActions({
 doctor,
 onBookNow,
}: DoctorQuickActionsProps) {
 const handleShare = async () => {
 try {
 if (navigator.share) {
 await navigator.share({
 title: `${doctor.name} - MyDoctor`,
 text: `Book an appointment with ${doctor.name}, specialist in ${doctor.primarySpecialty}`,
 url: window.location.href,
 });
 } else {
 await navigator.clipboard.writeText(window.location.href);
 toast.success("Profile link copied to clipboard!");
 }
 } catch {
 // User cancelled sharing
 }
 };

 const handleCall = () => {
 if (doctor.phone) {
 window.open(`tel:${doctor.phone}`, "_self");
 } else {
 toast.info("Phone number not available yet.");
 }
 };

 const handleMessage = () => {
 toast.info("Messaging feature coming soon!");
 };

 return (
 <div className="sticky top-20 z-30 hidden lg:block">
 <div className="flex items-center justify-between rounded-[2rem] border border-border bg-card/80 px-8 py-4 shadow-xl backdrop-blur-xl transition-all">
 {/* Left: Doctor quick info */}
 <div className="flex items-center gap-4">
 {doctor.isAvailableToday ? (
 <div className="flex items-center gap-2">
   <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
   <span className="text-xs font-medium text-emerald-600">Available Today</span>
 </div>
 ) : (
 <div className="flex items-center gap-2">
   <div className="h-2 w-2 rounded-full bg-gray-300" />
   <span className="text-xs font-medium text-gray-400">Not Available Today</span>
 </div>
 )}
 <div className="h-4 w-px bg-border" />
 <span className="text-sm font-medium text-muted-foreground">
 {doctor.name} · {doctor.primarySpecialty}
 </span>
 {doctor.isAvailableHome && (
 <>
 <div className="h-4 w-px bg-border" />
 <div className="flex items-center gap-1.5 text-violet-600">
 <HugeiconsIcon icon={Home01Icon} size={14} />
 <span className="text-xs font-medium">
 Home Visits
 </span>
 </div>
 </>
 )}
 </div>

 {/* Right: Action buttons */}
 <div className="flex items-center gap-2">
 <Button
 variant="outline"
 size="sm"
 onClick={handleCall}
 className="h-10 gap-2 rounded-xl border-border px-4 text-xs font-medium hover:border-primary/40 hover:text-primary transition-all"
 >
 <HugeiconsIcon icon={Call02Icon} size={14} />
 Call
 </Button>
 <Button
 variant="outline"
 size="sm"
 onClick={handleMessage}
 className="h-10 gap-2 rounded-xl border-border px-4 text-xs font-medium hover:border-primary/40 hover:text-primary transition-all"
 >
 <HugeiconsIcon icon={Message01Icon} size={14} />
 Message
 </Button>
 <Button
 variant="outline"
 size="sm"
 onClick={handleShare}
 className="h-10 gap-2 rounded-xl border-border px-4 text-xs font-medium hover:border-primary/40 hover:text-primary transition-all"
 >
 <HugeiconsIcon icon={Share05Icon} size={14} />
 Share
 </Button>
 <div className="ml-2 h-6 w-px bg-border" />
 <Button
 onClick={onBookNow}
 className="h-10 gap-2 rounded-xl px-6 text-xs font-medium shadow-lg shadow-primary/15 hover:shadow-primary/30 active:scale-[0.98] transition-all duration-300"
 >
 <HugeiconsIcon icon={Calendar01Icon} size={16} />
 Book Now
 </Button>
 </div>
 </div>
 </div>
 );
}
