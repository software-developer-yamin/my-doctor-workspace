"use client";

import { Button } from "@/components/ui/button";
import { TCTAData } from "@/data/cta.data";
import Image from "next/image";
import Link from "next/link";

interface CTASectionProps {
  data: TCTAData;
  className?: string; // To allow custom spacing/overrides
}

export const CTASection = ({ data, className = "" }: CTASectionProps) => {
  return (
    <section
      className={`bg-muted/75 border-border/50 border-y py-12 lg:py-20 ${className}`}
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col items-center gap-8 lg:flex-row lg:gap-16">
          {/* Image Part */}
          <div className="relative aspect-16/10 w-full overflow-hidden rounded-xl shadow-md transition-transform duration-500 sm:max-w-md lg:max-w-lg">
            <Link href={data.href} className="block h-full w-full">
              <Image
                src={data.image}
                alt={data.title}
                fill
                className="object-cover"
              />
            </Link>
          </div>

          {/* Content Part */}
          <div className="flex-1 space-y-6 text-center lg:text-left">
            <h2 className="text-foreground text-3xl leading-tight font-bold tracking-tight lg:text-4xl">
              {data.title}
            </h2>
            <p className="text-muted-foreground max-w-3xl text-base leading-relaxed font-medium sm:text-lg">
              {data.description}
            </p>
            <div className="pt-2">
              <Button
                asChild
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl px-10 py-6 text-base font-bold shadow-md transition-all active:scale-95"
              >
                <Link href={data.href}>{data.buttonText}</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
