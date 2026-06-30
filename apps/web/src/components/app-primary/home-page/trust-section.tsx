import { HugeiconsIcon } from "@hugeicons/react";
import {
  Clock01Icon,
  CreditCardIcon,
  CustomerSupportIcon,
  Medal01Icon,
  UserCheck01Icon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";

const TRUST_FEATURES = [
  {
    icon: UserCheck01Icon,
    title: "Verified Doctors",
    description:
      "All our doctors are BMDC verified with proven expertise and experience",
  },
  {
    icon: Clock01Icon,
    title: "Quick Appointments",
    description:
      "Book appointments instantly with average waiting time under 10 minutes",
  },
  {
    icon: Medal01Icon,
    title: "Best Quality Care",
    description:
      "We uphold the highest standard of medical care for every patient",
  },
  {
    icon: CustomerSupportIcon,
    title: "24/7 Support",
    description:
      "Round-the-clock medical support and online consultation available anytime",
  },
  {
    icon: CreditCardIcon,
    title: "Secure Payments",
    description:
      "All transactions secured with industry-standard encryption technology",
  },
  {
    icon: UserGroupIcon,
    title: "Trusted Community",
    description:
      "Trusted by over 700,000 patients across Bangladesh for quality healthcare",
  },
];

export const TrustSection = ({ className }: { className?: string }) => {
  return (
    <section className={cn("bg-background py-8 md:py-12", className)}>
      <div className="container">
        {/* Header */}
        <div className="mb-8 md:mb-10">
          <p className="border-primary text-primary mb-1 border-l-2 pl-2 text-xs font-bold tracking-wider uppercase">
            Why Choose Us
          </p>
          <h2 className="text-foreground text-xl font-bold tracking-tight sm:text-2xl lg:text-3xl">
            Healthcare You Can Trust
          </h2>
          <p className="text-muted-foreground mt-1 hidden text-sm sm:block">
            We&apos;re committed to providing the best healthcare experience
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {TRUST_FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="border-border/50 flex gap-4 rounded-2xl border p-5 transition-shadow hover:shadow-sm"
            >
              <div className="bg-primary/10 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl">
                <HugeiconsIcon
                  icon={feature.icon}
                  size={24}
                  className="text-primary"
                />
              </div>
              <div className="min-w-0">
                <h3 className="text-foreground mb-1 text-base font-bold">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
