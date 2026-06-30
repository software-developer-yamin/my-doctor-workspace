import { Button } from "@/components/ui/button";
import { THealthCheckupPackage } from "@/data/health-checkup.data";
import Image from "next/image";
import Link from "next/link";

type THealthCheckupServiceCardProps = {
  package: THealthCheckupPackage;
};

export const HealthCheckupServiceCard = ({
  package: pkg,
}: THealthCheckupServiceCardProps) => {
  return (
    <div className="bg-card border-border flex flex-col justify-between rounded-xl border p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      {/* Top: Image + Title + Description */}
      <div>
        <Link href={`/health-checkup/${pkg.slug}`}>
          <div className="border-border bg-muted relative h-[160px] w-full overflow-hidden rounded-lg border">
            <Image
              src={pkg.image}
              alt={pkg.title}
              fill
              unoptimized
              className="object-cover transition-transform duration-300"
              sizes="(min-width: 1024px) 300px, (min-width: 640px) 37vw, 250px"
            />
          </div>
          <h4 className="text-foreground hover:text-primary mt-4 mb-2 text-base leading-snug font-black transition-colors">
            {pkg.title}
          </h4>
        </Link>
        <p className="text-muted-foreground text-sm leading-relaxed font-bold italic">
          {pkg.description}
        </p>
      </div>

      {/* Bottom: Price + CTA */}
      <div className="mt-5 flex items-center justify-between">
        <div>
          <p className="text-muted-foreground text-micro font-black uppercase tracking-tighter">From</p>
          <p className="text-foreground text-sm font-black">
            {pkg.currency} {pkg.price.toLocaleString()}
          </p>
        </div>
        <Button
          asChild
          variant="outline"
          className="border-primary text-primary hover:bg-primary hover:text-primary-foreground h-[38px] rounded-md px-5 text-sm font-black transition-colors"
        >
          <Link href={`/health-checkup/${pkg.slug}`}>View Details</Link>
        </Button>
      </div>
    </div>
  );
};
