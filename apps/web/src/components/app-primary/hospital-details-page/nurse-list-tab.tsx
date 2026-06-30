"use client";

import { NurseCard } from"@/components/cards/nurse-card";
import { Button } from"@/components/ui/button";
import { TNurse } from"@/data/nurses.data";

type TNurseListTabProps = {
 nurses?: {
 id: string;
 slug?: string;
 name: string;
 specialty: string;
 image: string;
 certifications: string[];
 }[];
 hospitalName: string;
};

export function NurseListTab({ nurses, hospitalName }: TNurseListTabProps) {
 if (!nurses || nurses.length === 0) {
 return (
 <div className="flex flex-col items-center justify-center p-12 text-center">
 <div className="bg-primary/5 mb-4 flex h-16 w-16 items-center justify-center rounded-full">
 <span className="text-primary text-2xl font-semibold">N</span>
 </div>
 <h3 className="text-foreground mb-2 text-lg font-semibold">
 No Nurses Found
 </h3>
 <p className="text-muted-foreground max-w-sm text-sm font-medium">
 There are currently no nurses listed for {hospitalName}.
 </p>
 </div>
 );
 }

 return (
 <div className="flex flex-col gap-6">
 <div className="flex items-center justify-between">
 <h2 className="text-foreground text-lg font-semibold">
 Nurses at {hospitalName} ({nurses.length})
 </h2>
 </div>

 <div className="grid gap-4">
 {nurses.map((nurseData) => {
 // Transform hospital nurse data to TNurse type for NurseCard
 const nurseCardData: TNurse = {
 id: nurseData.id,
 slug: nurseData.slug || nurseData.id,
 name: nurseData.name,
 image: nurseData.image,
 certifications: nurseData.certifications,
 specialty: nurseData.specialty,
 experienceYears: 0, // Placeholder
 gender:"Female", // Placeholder
 isAvailableForHome: false, // Default context for hospital tab
 location: {
 name: hospitalName,
 address:"",
 },
 availability: ["Available upon request"],
 services: [],
 };

 return <NurseCard key={nurseCardData.id} nurse={nurseCardData} />;
 })}
 </div>

 {nurses.length > 5 && (
 <div className="mt-4 flex justify-center">
 <Button
 variant="outline"
 className="text-primary border-primary hover:bg-primary/5 font-semibold"
 >
 Load More Nurses
 </Button>
 </div>
 )}
 </div>
 );
}
