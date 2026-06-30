"use client";

import { ServiceCard } from "@/components/cards/service-card";
import { SectionHeader } from "@/components/common/section-header";
import {
  Carousel,
  CarouselContent,
  CarouselDots,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { HOME_SERVICES } from "@/data/services.data";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";

const HERO_SLIDES = [
  {
    image: "/images/hero/01.svg",
    alt: "Quality healthcare services at MyDoctor",
  },
  {
    image: "/images/hero/03.svg",
    alt: "Professional medical team ready to help",
  },
];

import { cn } from "@/lib/utils";

export const HeroSection = ({ className }: { className?: string }) => {
  return (
    <section className={cn("bg-background", className)}>
      {/* Hero Banner Slider */}
      <div className="container pb-6 pt-4 sm:pb-8 sm:pt-6 md:pb-10">
        <Carousel
          opts={{ loop: true }}
          plugins={[Autoplay({ delay: 5000, stopOnInteraction: false })]}
          className="group w-full"
        >
          <CarouselContent className="ml-0">
            {HERO_SLIDES.map((slide, index) => (
              <CarouselItem key={index} className="relative pl-0">
                <div className="relative aspect-[16/5] w-full overflow-hidden rounded-2xl sm:aspect-[16/4]">
                  <Image
                    src={slide.image}
                    alt={slide.alt}
                    fill
                    priority={index === 0}
                    fetchPriority={index === 0 ? "high" : "auto"}
                    sizes="100vw"
                    className="object-cover object-center transition-opacity duration-700 ease-in-out"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Navigation Arrows */}
          <div className="hidden 2xl:block">
            <CarouselPrevious className="border-border/50 text-muted-foreground hover:text-primary hover:bg-background -left-6 h-12 w-12" />
            <CarouselNext className="border-border/50 text-muted-foreground hover:text-primary hover:bg-background -right-6 h-12 w-12" />
          </div>

          {/* Slide dots */}
          <CarouselDots className="bg-black/10 absolute bottom-[8%] left-1/2 z-10 -translate-x-1/2 rounded-full px-1.5 py-0.5 backdrop-blur-sm transition-all duration-300 sm:px-3 sm:py-1" />
        </Carousel>
      </div>

      {/* Service Section */}
      <div className="bg-surface py-6 sm:py-8 md:py-12">
        <div className="container">
          <SectionHeader
            label="Our Services"
            title="Complete Healthcare Solutions"
            description="Everything you need for your health and wellness in one platform, delivered by trusted experts."
            titleAs="h1"
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
            {HOME_SERVICES.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
