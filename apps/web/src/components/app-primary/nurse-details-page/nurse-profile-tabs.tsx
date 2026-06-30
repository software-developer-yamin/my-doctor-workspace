"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TNurseDetails } from "@/data/nurse-details.data";
import {
  BookOpen01Icon,
  Briefcase01Icon,
  Tick01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

type TNurseProfileTabsProps = {
  nurse: TNurseDetails;
};

export function NurseProfileTabs({ nurse }: TNurseProfileTabsProps) {
  return (
    <div className="mt-4 flex flex-col gap-4">
      {/* Education */}
      <Card className="border-border bg-card p-6">
        <h2 className="text-foreground mb-4 flex items-center gap-2 text-sm font-black uppercase tracking-tight">
          <HugeiconsIcon icon={BookOpen01Icon} className="text-primary h-5 w-5" />
          Education & Certifications
        </h2>
        <ul className="space-y-3">
          {nurse.education.map((edu, i) => (
            <li key={i} className="flex items-start gap-3">
              <div className="bg-primary/10 mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full">
                <HugeiconsIcon icon={Tick01Icon} size={12} className="text-primary" />
              </div>
              <span className="text-muted-foreground text-sm font-bold">{edu}</span>
            </li>
          ))}
        </ul>
      </Card>

      {/* Skills */}
      <Card className="border-border bg-card p-6">
        <h2 className="text-foreground mb-4 flex items-center gap-2 text-sm font-black uppercase tracking-tight">
          <HugeiconsIcon icon={Briefcase01Icon} className="text-primary h-5 w-5" />
          Core Skills
        </h2>
        <div className="flex flex-wrap gap-2">
          {nurse.skills.map((skill, i) => (
            <Badge
              key={i}
              variant="outline"
              className="border-primary/20 bg-primary/5 text-primary rounded-full px-3 py-1 text-xs font-black"
            >
              {skill}
            </Badge>
          ))}
        </div>
      </Card>

      {/* Location Details */}
      {nurse.location.map((loc) => (
        <Card key={loc.id} className="border-border bg-card p-6">
          <h2 className="text-foreground mb-4 text-sm font-black uppercase tracking-tight">
            Work Location
          </h2>
          <div className="space-y-3">
            <div>
              <p className="text-foreground text-sm font-black">{loc.name}</p>
              <p className="text-muted-foreground mt-1 text-xs font-bold italic">
                {loc.address}
              </p>
            </div>
            <div>
              <p className="text-foreground mb-2 text-xs font-black uppercase tracking-tight">
                Availability
              </p>
              <div className="space-y-1">
                {loc.availability.map((av, i) => (
                  <p key={i} className="text-muted-foreground text-xs font-bold">
                    {av}
                  </p>
                ))}
              </div>
            </div>
            <div>
              <p className="text-foreground mb-2 text-xs font-black uppercase tracking-tight">
                Visit Type
              </p>
              <div className="flex flex-wrap gap-2">
                {loc.visitType.map((vt, i) => (
                  <Badge
                    key={i}
                    variant="outline"
                    className="border-border text-muted-foreground text-xs font-bold"
                  >
                    {vt}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
