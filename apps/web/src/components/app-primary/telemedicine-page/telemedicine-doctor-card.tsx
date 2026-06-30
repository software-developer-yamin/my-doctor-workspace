import { TDoctor } from "@/data/doctors.data";
import { Briefcase01Icon, StarIcon, ChampionIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Image from "next/image";
import Link from "next/link";

type TTelemedicineDoctorCardProps = {
  doctor: TDoctor;
};

export const TelemedicineDoctorCard = ({ doctor }: TTelemedicineDoctorCardProps) => {
  return (
    <div className="bg-white dark:bg-card rounded-md border border-border p-5 shadow-sm hover:shadow-md transition-shadow relative">
      <div className="flex flex-col md:flex-row gap-5">
        {/* Doctor Image */}
        <div className="w-full md:w-[120px] h-[120px] relative shrink-0">
          <Link href={`/doctors/${doctor.slug}`}>
            <Image
              src={doctor.image}
              alt={doctor.name}
              fill
              className="object-cover rounded-md"
              sizes="120px"
            />
          </Link>
        </div>

        {/* Doctor Info */}
        <div className="flex-1 flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <Link 
              href={`/doctors/${doctor.slug}`}
              className="text-lg font-bold text-foreground hover:text-primary transition-colors"
            >
              {doctor.name}
            </Link>
            
            {/* Online Status - Tablet/Desktop */}
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-xs font-semibold">Online</span>
            </div>
          </div>

          <p className="text-sm font-medium text-muted-foreground line-clamp-2 leading-relaxed">
            {doctor.specialties?.join(", ")}
          </p>
          <p className="text-xs text-muted-foreground font-medium">
            {doctor.degrees.join(", ")}
          </p>

          <div className="mt-4 flex flex-col gap-3">
             {/* Telemedicine Badge */}
             <div className="flex items-center gap-2 text-muted-foreground">
               <HugeiconsIcon icon={Briefcase01Icon} size={20} className="text-[#19B3BD]" />
               <span className="text-sm font-semibold">Telemedicine</span>
             </div>

             {/* Rating or Experience */}
             {doctor.experienceYears ? (
               <div className="flex items-center gap-2 text-muted-foreground">
                 <HugeiconsIcon icon={ChampionIcon} size={20} className="text-[#19B3BD]" />
                 <span className="text-sm font-semibold">{doctor.experienceYears} years of experience</span>
               </div>
             ) : (
               <div className="flex items-center gap-2 text-muted-foreground">
                 <HugeiconsIcon icon={StarIcon} size={20} className="text-yellow-500" />
                 <span className="text-sm font-semibold text-foreground">{doctor.rating}/5.0</span>
                 <span className="text-xs text-muted-foreground font-medium">({doctor.ratingCount} Ratings)</span>
               </div>
             )}
          </div>
        </div>

        {/* Pricing & Status - Tablet/Desktop */}
        <div className="hidden md:flex flex-col items-end justify-between min-w-[120px]">
           <div /> {/* Placeholder for top alignment */}
           
           <div className="text-right">
             <div className="flex items-center justify-end gap-1.5 font-bold">
               <span className="text-xl text-foreground">৳ {doctor.fee}</span>
               <span className="text-micro text-muted-foreground font-medium mt-1">(incl. VAT)</span>
             </div>
             <p className="text-micro text-muted-foreground font-bold tracking-tight uppercase">Per consultation</p>
           </div>
        </div>
      </div>

      {/* Mobile Only: Divider, Price, Status */}
      <div className="md:hidden mt-4 pt-4 border-t border-border flex items-center justify-between">
         <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-semibold">Online</span>
         </div>

         <div className="text-right">
             <div className="flex items-center justify-end gap-1 font-bold">
               <span className="text-lg text-foreground">৳ {doctor.fee}</span>
               <span className="text-micro text-muted-foreground font-medium mt-0.5">(incl. VAT)</span>
             </div>
             <p className="text-micro text-muted-foreground font-bold uppercase">Per consultation</p>
         </div>
      </div>
    </div>
  );
};
