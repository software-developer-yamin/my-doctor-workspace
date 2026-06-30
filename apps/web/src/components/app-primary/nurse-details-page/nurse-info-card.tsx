import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { TNurseDetails } from "@/data/nurse-details.data";
import {
  InformationCircleIcon,
  Share05Icon,
  Home01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

type TNurseInfoCardProps = {
  nurse: TNurseDetails;
};

export function NurseInfoCard({ nurse }: TNurseInfoCardProps) {
  return (
    <Card className="border-border bg-card flex flex-col gap-6 p-6 md:flex-row">
      {/* Image */}
      <div className="flex shrink-0 items-start justify-center">
        <div className="relative h-[120px] w-[120px] overflow-hidden rounded-lg shadow-sm sm:h-[160px] sm:w-[160px]">
          <Image
            src={nurse.image}
            alt={nurse.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 120px, 160px"
          />
        </div>
      </div>

      {/* Info */}
      <div className="flex grow flex-col">
        <div className="flex items-start justify-between">
          <div>
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <h1 className="text-primary text-xl font-black md:text-2xl">
                {nurse.name}
              </h1>
              {nurse.isAvailableForHome && (
                <span className="bg-primary/10 text-primary flex items-center gap-1 rounded-full px-2.5 py-1 text-micro font-black uppercase tracking-tight">
                  <HugeiconsIcon icon={Home01Icon} size={10} />
                  Home Visit
                </span>
              )}
            </div>

            {/* Certifications */}
            <div className="mb-3 flex flex-wrap gap-2">
              {nurse.certifications.map((cert, i) => (
                <Badge key={i} variant="secondary" className="text-xs font-bold">
                  {cert}
                </Badge>
              ))}
            </div>

            <p className="text-muted-foreground mb-1 text-sm font-bold">
              <span className="text-foreground">Specialty: </span>
              {nurse.specialty}
            </p>
            <p className="text-muted-foreground mb-1 text-sm font-bold">
              <span className="text-primary font-black">
                {nurse.experienceYears} Years of Experience
              </span>
            </p>
            <p className="text-muted-foreground mb-1 text-sm font-bold">
              BNC Reg.: <span className="text-foreground">{nurse.bncReg}</span>
            </p>
            <p className="text-muted-foreground text-sm font-bold">
              ID: <span className="text-foreground">{nurse.displayId}</span>
            </p>
          </div>

          <button
            className="text-muted-foreground hover:text-foreground transition-colors"
            title="Share"
            type="button"
          >
            <HugeiconsIcon icon={Share05Icon} className="h-5 w-5" />
          </button>
        </div>

        {/* About */}
        <div className="border-border mt-4 border-t pt-4">
          <h2 className="text-primary mb-2 flex items-center gap-2 text-sm font-black">
            <HugeiconsIcon icon={InformationCircleIcon} className="h-4 w-4" />
            About
          </h2>
          <p className="text-muted-foreground hyphens-auto text-justify text-sm font-bold leading-relaxed">
            {nurse.about}
          </p>
        </div>

        {/* Services */}
        {nurse.services.length > 0 && (
          <div className="mt-4">
            <h2 className="text-foreground mb-2 text-sm font-black">
              Services Offered:
            </h2>
            <div className="flex flex-wrap gap-2">
              {nurse.services.map((service, i) => (
                <Badge
                  key={i}
                  variant="outline"
                  className="border-border bg-background text-muted-foreground rounded px-2 py-1 text-xs font-bold"
                >
                  {service}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
