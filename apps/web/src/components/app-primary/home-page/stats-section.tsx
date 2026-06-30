import { HugeiconsIcon } from "@hugeicons/react";
import {
  Clock01Icon,
  Download04Icon,
  Hospital01Icon,
  StarIcon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons";
import Image from "next/image";

import { cn } from "@/lib/utils";

const STATS_DATA = [
  {
    id: 1,
    type: "image" as const,
    image: "/images/services/doctor-icon.png",
    value: "50K+",
    label: "Happy Patients",
    color: "text-primary",
  },
  {
    id: 2,
    type: "icon" as const,
    icon: Clock01Icon,
    value: "10 Minutes",
    label: "Average waiting time",
    color: "text-purple-500",
  },
  {
    id: 3,
    type: "icon" as const,
    icon: UserGroupIcon,
    value: "700k+",
    label: "People trusted us",
    color: "text-teal-500",
  },
  {
    id: 4,
    type: "icon" as const,
    icon: StarIcon,
    value: "95%",
    label: "Users gave 5 start rating",
    color: "text-amber-500",
  },
  {
    id: 5,
    type: "icon" as const,
    icon: Download04Icon,
    value: "1+ Million",
    label: "App downloads",
    color: "text-blue-500",
  },
  {
    id: 6,
    type: "icon" as const,
    icon: Hospital01Icon,
    value: "250+",
    label: "Partner Hospitals",
    color: "text-rose-500",
  },
];

export const StatsSection = ({ className }: { className?: string }) => {
  return (
    <section className={cn("bg-background py-8 md:py-12", className)}>
      <div className="container">
        <div className="grid grid-cols-3 gap-6 md:gap-8 lg:grid-cols-6">
          {STATS_DATA.map((stat) => (
            <div
              key={stat.id}
              className="flex flex-col items-center gap-3 text-center"
            >
              {/* Icon */}
              <div className="flex h-12 w-12 items-center justify-center lg:h-14 lg:w-14">
                {stat.type === "image" ? (
                  <Image
                    src={stat.image}
                    alt={stat.label}
                    width={44}
                    height={44}
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <HugeiconsIcon
                    icon={stat.icon}
                    size={40}
                    className={cn(stat.color)}
                    strokeWidth={1.5}
                  />
                )}
              </div>

              {/* Text */}
              <div className="space-y-0.5">
                <p className="text-foreground text-lg font-bold sm:text-xl lg:text-2xl">
                  {stat.value}
                </p>
                <p className="text-muted-foreground text-xs leading-snug">
                  {stat.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
