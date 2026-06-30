import { DiagnosticTest } from "@/types/diagnostic.type";
import { Button } from "@/components/ui/button";
import { PlusSignIcon, DeliveryTruck01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

export const DiagnosticServiceCard = ({ service }: { service: DiagnosticTest }) => {
  return (
    <div className="bg-card border-border flex flex-col justify-between rounded-xl border p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className="relative">
        {/* Home Collection Badge */}
        {service.isHomeSampleCollectionAvailable && (
          <div
            className="bg-primary/10 absolute -top-[17px] -right-4 inline-flex items-center justify-center rounded-bl-xl p-2 text-primary"
            title="Home sample collection available"
          >
            <HugeiconsIcon icon={DeliveryTruck01Icon} className="h-5 w-5" />
          </div>
        )}

        {/* Title */}
        <h6 className="text-foreground pr-10 mb-2 text-sm font-black md:text-base tracking-tight leading-snug">
          {service.name}
        </h6>

        {/* Description */}
        <p className="text-muted-foreground mb-4 text-xs font-bold leading-relaxed md:text-sm text-justify hyphens-auto italic">
          <span className="line-clamp-3">
            {service.description}{" "}
            {service.description.length > 50 && (
              <span className="text-primary cursor-pointer font-black hover:underline">
                ...read more
              </span>
            )}
          </span>
        </p>
      </div>

      {/* Footer: Price & Add Button */}
      <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/50">
        <div>
          <h6 className="text-muted-foreground text-micro font-black uppercase tracking-tighter block leading-3">
            From
          </h6>
          <h6 className="text-foreground text-xs font-black md:text-sm block">
            BDT {service.priceStartFrom.toLocaleString()}
          </h6>
        </div>
        <div className="text-right">
          <Button
            variant="outline"
            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground group flex items-center gap-1.5 rounded-md px-4 transition-colors font-black h-[38px] text-xs"
          >
            Add
            <HugeiconsIcon
              icon={PlusSignIcon}
              className="text-primary group-hover:text-primary-foreground h-4 w-4 transition-colors"
            />
          </Button>
        </div>
      </div>
    </div>
  );
};
