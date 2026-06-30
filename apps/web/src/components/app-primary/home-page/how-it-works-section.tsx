import { HugeiconsIcon } from "@hugeicons/react";
import {
  Calendar03Icon,
  Medicine01Icon,
  Search01Icon,
} from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";

const STEPS = [
  {
    step: 1,
    icon: Search01Icon,
    title: "Search Doctor",
    description:
      "Browse our list of BMDC-verified doctors by specialty, location, or availability",
  },
  {
    step: 2,
    icon: Calendar03Icon,
    title: "Book Appointment",
    description:
      "Choose a convenient time slot and confirm your booking instantly online",
  },
  {
    step: 3,
    icon: Medicine01Icon,
    title: "Get Treatment",
    description:
      "Visit your doctor at the scheduled time and receive expert medical care",
  },
];

export const HowItWorksSection = ({ className }: { className?: string }) => {
  return (
    <section className={cn("bg-background py-8 md:py-12", className)}>
      <div className="container">
        {/* Header */}
        <div className="mb-8 md:mb-10">
          <p className="border-primary text-primary mb-1 border-l-2 pl-2 text-xs font-bold tracking-wider uppercase">
            Simple Process
          </p>
          <h2 className="text-foreground text-xl font-bold tracking-tight sm:text-2xl lg:text-3xl">
            How It Works
          </h2>
          <p className="text-muted-foreground mt-1 hidden text-sm sm:block">
            Get quality healthcare in just 3 simple steps
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">
          {STEPS.map((step) => (
            <div
              key={step.step}
              className="border-border/50 flex gap-4 rounded-2xl border p-5"
            >
              <div className="bg-primary/10 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl">
                <HugeiconsIcon
                  icon={step.icon}
                  size={22}
                  className="text-primary"
                />
              </div>
              <div className="min-w-0">
                <h3 className="text-foreground mb-1.5 text-base font-bold">
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
