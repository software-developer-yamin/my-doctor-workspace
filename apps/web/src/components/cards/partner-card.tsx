import { TPartner } from "@/data/partners.data";
import { cn } from "@/lib/utils";
import Image from "next/image";

type PartnerCardProps = {
  partner: TPartner;
  className?: string;
};

export const PartnerCard = ({ partner, className }: PartnerCardProps) => {
  return (
    <div
      className={cn(
        "border-border bg-muted/5 relative flex h-full items-center justify-center rounded-[0.75em] border px-[1em] py-[1em] transition-all duration-300 sm:py-[1.5em] md:py-[2em] lg:py-[2.5em]",
        className,
      )}
    >
      <Image
        src={partner.image}
        alt={partner.name}
        width={168}
        height={112}
        className="h-auto max-w-full rounded-[0.25em] object-contain"
      />
    </div>
  );
};
