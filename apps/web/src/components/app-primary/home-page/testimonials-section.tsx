"use client";

import { TestimonialCard } from "@/components/cards/testimonial-card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  useCarousel,
} from "@/components/ui/carousel";
import { TESTIMONIALS } from "@/data/testimonials.data";
import { cn } from "@/lib/utils";
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Autoplay from "embla-carousel-autoplay";
import { useRef } from "react";

function TestimonialsNav() {
  const { scrollPrev, scrollNext } = useCarousel();
  return (
    <div className="flex shrink-0 gap-2">
      <button
        onClick={scrollPrev}
        className="border-border text-primary flex h-9 w-9 items-center justify-center rounded-full border bg-white"
        aria-label="Previous testimonial"
      >
        <HugeiconsIcon icon={ArrowLeft01Icon} size={16} strokeWidth={2} />
      </button>
      <button
        onClick={scrollNext}
        className="border-border text-primary flex h-9 w-9 items-center justify-center rounded-full border bg-white"
        aria-label="Next testimonial"
      >
        <HugeiconsIcon icon={ArrowRight01Icon} size={16} strokeWidth={2} />
      </button>
    </div>
  );
}

export const TestimonialsSection = ({ className }: { className?: string }) => {
  const plugin = useRef(Autoplay({ delay: 3500, stopOnInteraction: true }));
  return (
    <section className={cn("bg-surface py-8 md:py-12", className)}>
      <div className="container">
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          plugins={[plugin.current]}
          className="w-full"
        >
          {/* Section Header */}
          <div className="mb-5 flex items-start justify-between md:mb-7">
            <div>
              <p className="border-primary text-primary mb-1 border-l-2 pl-2 text-xs font-bold tracking-wider uppercase">
                Testimonials
              </p>
              <h2 className="text-foreground text-xl font-bold tracking-tight sm:text-2xl lg:text-3xl">
                What Our Patients Say
              </h2>
              <p className="text-muted-foreground mt-1 hidden text-sm sm:block">
                Read stories from our satisfied patients across Bangladesh
              </p>
            </div>
            <TestimonialsNav />
          </div>

          <CarouselContent className="-ml-4">
            {TESTIMONIALS.map((testimonial) => (
              <CarouselItem
                key={testimonial.id}
                className="basis-[85%] pl-4 sm:basis-1/2 lg:basis-1/3"
              >
                <TestimonialCard testimonial={testimonial} />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
};
