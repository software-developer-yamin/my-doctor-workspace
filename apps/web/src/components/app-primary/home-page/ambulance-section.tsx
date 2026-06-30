import Image from "next/image";
import Link from "next/link";
import { Call02Icon, Calendar01Icon, CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { cn } from "@/lib/utils";

const STATS = [
  { value: "10-15 Min", label: "Response Time" },
  { value: "All Over Dhaka", label: "Service Area" },
  { value: "24/7", label: "Available" },
];

const FEATURES = [
  "24/7 Emergency Support",
  "Trained Paramedics",
  "Advanced Life Support",
  "Quick Response",
];

export const AmbulanceSection = ({ className }: { className?: string }) => {
  return (
    <section className={cn("bg-gradient-to-r from-[#FFF1F1] to-[#F9FFFB] py-8 md:py-12", className)}>
      <div className="container">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:gap-8">
          {/* Left: Content */}
          <div className="flex-1">
            <p className="text-rose-600 mb-2 text-xs font-bold tracking-widest uppercase">
              24/7 Emergency Care
            </p>
            <h2 className="text-foreground mb-3 text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
              Emergency Ambulance
              <br className="hidden sm:block" /> Just One Call Away!
            </h2>
            <p className="text-muted-foreground mb-5 text-sm sm:text-base">
              Get immediate medical assistance with our rapid response ambulance service. Professional paramedics ready to help you anytime.
            </p>

            {/* Checklist */}
            <ul className="mb-6 grid grid-cols-2 gap-2">
              {FEATURES.map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <HugeiconsIcon
                    icon={CheckmarkCircle02Icon}
                    size={18}
                    className="text-primary shrink-0"
                    strokeWidth={1.5}
                  />
                  <span className="text-foreground text-sm font-medium">{f}</span>
                </li>
              ))}
            </ul>

            {/* Buttons */}
            <div className="flex flex-wrap gap-3">
              <Link
                href="tel:999"
                className="bg-rose-600 hover:bg-rose-700 flex items-center gap-2 rounded-md px-6 py-2.5 text-sm font-bold text-white transition-colors"
              >
                <HugeiconsIcon icon={Call02Icon} size={16} strokeWidth={1.5} />
                Call Emergency
              </Link>
              <Link
                href="/ambulances"
                className="bg-primary hover:bg-primary/90 flex items-center gap-2 rounded-md px-6 py-2.5 text-sm font-bold text-white transition-colors"
              >
                <HugeiconsIcon icon={Calendar01Icon} size={16} strokeWidth={1.5} />
                Book Now
              </Link>
            </div>
          </div>

          {/* Center: Ambulance Image */}
          <div className="flex justify-center lg:flex-1">
            <div className="bg-white relative w-full max-w-sm overflow-hidden rounded-md p-4 shadow-md sm:max-w-md lg:max-w-none">
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src="/images/services/ambulance.png"
                  alt="Emergency Ambulance"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </div>

          {/* Right: Stats */}
          <div className="flex flex-row justify-center gap-3 lg:flex-col lg:gap-4">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="bg-white flex flex-1 flex-col items-center gap-1 rounded-md p-3 text-center shadow-sm lg:w-40 lg:flex-none lg:items-start lg:p-4 lg:text-left"
              >
                <p className="text-foreground text-sm font-bold leading-tight lg:text-base">
                  {stat.value}
                </p>
                <p className="text-muted-foreground text-xs leading-tight">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
