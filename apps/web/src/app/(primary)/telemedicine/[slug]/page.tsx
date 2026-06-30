"use client";

import { TELEMEDICINE_DOCTORS_DATA } from "@/data/telemedicine-doctors.data";
import { TELEMEDICINE_SPECIALIZATIONS } from "@/data/telemedicine.data";
import { TelemedicineDoctorCard } from "@/components/app-primary/telemedicine-page/telemedicine-doctor-card";
import { TelemedicineFiltersSidebar } from "@/components/app-primary/telemedicine-page/telemedicine-filters-sidebar";
import { SearchEmptyState } from "@/components/common/search-empty-state";
import { ArrowLeft02Icon, FilterIcon, Video01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { use } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function TelemedicineDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  
  const specialization = TELEMEDICINE_SPECIALIZATIONS.find(s => s.id === slug);
  const doctors = TELEMEDICINE_DOCTORS_DATA.filter(d => d.specializationSlug === slug);

  return (
    <div className="bg-[#F8FAFC] dark:bg-background min-h-screen py-6">
      <div className="container mx-auto px-4 max-w-[1280px]">
        {/* Back Button */}
        <Link 
          href="/telemedicine" 
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm font-semibold mb-6 group"
        >
          <HugeiconsIcon 
            icon={ArrowLeft02Icon} 
            size={20} 
            className="group-hover:-translate-x-1 transition-transform" 
          />
          <span>Back</span>
        </Link>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Desktop */}
          <aside className="hidden lg:block w-[300px] shrink-0">
             <TelemedicineFiltersSidebar />
          </aside>

          {/* Main Results Area */}
          <main className="flex-1">
             <div className="flex items-center justify-between mb-6">
                <h2 className="text-base md:text-lg font-bold text-muted-foreground">
                  Showing {doctors.length} for &ldquo;<span className="text-foreground">{specialization?.name || slug}</span>&rdquo;.
                </h2>

                {/* Mobile Filter Trigger */}
                <div className="lg:hidden">
                   <Sheet>
                     <SheetTrigger asChild>
                       <Button variant="outline" size="sm" className="bg-background dark:bg-card border-border gap-2 text-muted-foreground font-bold">
                         <span>Filters</span>
                         <HugeiconsIcon icon={FilterIcon} size={20} />
                       </Button>
                     </SheetTrigger>
                     <SheetContent side="left" className="p-0 border-none w-[320px]">
                       <SheetHeader className="p-6 pb-0 sr-only">
                         <SheetTitle>Filters</SheetTitle>
                       </SheetHeader>
                       <div className="h-full overflow-y-auto pt-4">
                         <TelemedicineFiltersSidebar />
                       </div>
                     </SheetContent>
                   </Sheet>
                </div>
             </div>

             {/* Doctor Cards List */}
             <div className="flex flex-col gap-4">
               {doctors.length > 0 ? (
                 doctors.map((doctor) => (
                   <TelemedicineDoctorCard key={doctor.id} doctor={doctor} />
                 ))
               ) : (
                 <SearchEmptyState
                   icon={Video01Icon}
                   title="No doctors available"
                   description="There are no doctors available for this specialization right now. Please try a different specialty or check back later."
                 />
               )}
             </div>
          </main>
        </div>
      </div>
    </div>
  );
}
