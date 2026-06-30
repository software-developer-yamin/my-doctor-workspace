"use client";

import { Button } from "@/components/ui/button";
import { TDomiciliaryService } from "@/data/domiciliary-services.data";
import { PlusSignIcon, Home01Icon, Tick01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Image from "next/image";
import Link from "next/link";

interface DomiciliaryServiceCardProps {
  service: TDomiciliaryService;
}

export function DomiciliaryServiceCard({ service }: DomiciliaryServiceCardProps) {
  return (
    <div className="bg-card border-border flex flex-col justify-between rounded-xl border p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div>
        {/* Top Header: Image & Category Icon */}
        <div className="relative mb-4">
          <div className="border-border bg-muted relative h-[160px] w-full overflow-hidden rounded-lg border">
            <Image
              src={service.image}
              alt={service.title}
              fill
              className="object-cover transition-transform duration-300"
              sizes="(min-width: 1024px) 300px, (min-width: 640px) 37vw, 250px"
              unoptimized
            />
            <div className="bg-primary/90 absolute top-3 left-3 flex h-8 w-8 items-center justify-center rounded-lg text-white backdrop-blur-sm">
              <HugeiconsIcon icon={Home01Icon} size={18} />
            </div>
          </div>
        </div>

        {/* Content */}
        <Link href={`/domiciliary-services/${service.slug}`}>
          <h4 className="text-foreground hover:text-primary mb-2 text-base leading-snug font-black transition-colors">
            {service.title}
          </h4>
        </Link>
        <p className="text-muted-foreground mb-4 text-xs leading-relaxed font-bold italic">
          {service.description}
        </p>

        {/* Features List */}
        <div className="mb-4 space-y-2">
          {service.features.map((feature, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <div className="bg-primary/10 flex h-4 w-4 items-center justify-center rounded-full text-primary">
                <HugeiconsIcon icon={Tick01Icon} size={12} />
              </div>
              <span className="text-muted-foreground text-micro font-bold">{feature}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer: Price & Add Button */}
      <div className="mt-auto flex items-center justify-between border-t border-border/50 pt-4">
        <div>
          <p className="text-muted-foreground text-micro font-black uppercase tracking-tighter">Per Visit From</p>
          <p className="text-foreground text-sm font-black">
            {service.currency} {service.price.toLocaleString()}
          </p>
        </div>
        <Button
          variant="outline"
          className="border-primary text-primary hover:bg-primary hover:text-primary-foreground h-[38px] rounded-md px-5 text-xs font-black transition-colors"
        >
          Add
          <HugeiconsIcon
            icon={PlusSignIcon}
            className="text-primary group-hover:text-primary-foreground h-4 w-4 transition-colors ml-1.5"
          />
        </Button>
      </div>
    </div>
  );
}
