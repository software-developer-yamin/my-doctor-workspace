"use client";

import { useRef } from "react";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

type TReview = {
    id: string;
    name: string;
    timeAgo: string;
    text: string;
};

type TProps = {
    reviews?: TReview[];
};

export const HospitalPatientReviews = ({ reviews = [] }: TProps) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    if (reviews.length === 0) return null;

    const scrollNext = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: 320, behavior: "smooth" });
        }
    };

    return (
        <div className="flex flex-col gap-5">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-foreground sm:text-2xl">
                    What Patients Say
                </h2>
                <button className="hidden flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
                    View All Reviews
                    <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
                </button>
            </div>

            {/* Carousel */}
            <div className="relative">
                <div
                    ref={scrollRef}
                    className="flex gap-4 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                >
                    {reviews.map((review) => (
                        <div
                            key={review.id}
                            className="flex h-36 w-[80vw] shrink-0 flex-col gap-3 rounded-xl border border-border bg-card p-4 sm:h-40 sm:w-72 md:w-80 lg:w-72 xl:w-80"
                        >
                            {/* Author */}
                            <div className="flex items-center gap-3">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10">
                                    <span className="text-base font-bold text-primary">
                                        {review.name.charAt(0)}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-foreground">
                                        {review.name}
                                    </p>
                                    <p className="text-xs text-muted-foreground">{review.timeAgo}</p>
                                </div>
                            </div>
                            {/* Text */}
                            <p className="text-sm leading-relaxed text-muted-foreground line-clamp-3">
                                {review.text}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Next arrow */}
                <button
                    onClick={scrollNext}
                    className="absolute -right-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card shadow-sm hover:bg-muted transition-colors"
                    aria-label="Next reviews"
                >
                    <HugeiconsIcon icon={ArrowRight01Icon} size={16} className="text-foreground" />
                </button>
            </div>
        </div>
    );
};
