"use client";

import { DoctorReview } from "@/types/doctor.type";
import { HugeiconsIcon } from "@hugeicons/react";
import { StarIcon } from "@hugeicons/core-free-icons";

type DoctorReviewsTabProps = {
    reviews: DoctorReview[];
    averageRating: number;
    totalReviews: number;
};

import { formatDistanceToNow } from "date-fns";

function relativeTime(dateStr: string): string {
    if (!dateStr) return "";
    try { return formatDistanceToNow(new Date(dateStr), { addSuffix: true }); } catch { return ""; }
}

const AVATAR_COLORS = [
    "bg-teal-100 text-teal-700",
    "bg-orange-100 text-orange-700",
    "bg-emerald-100 text-emerald-700",
    "bg-purple-100 text-purple-700",
    "bg-blue-100 text-blue-700",
    "bg-rose-100 text-rose-700",
    "bg-amber-100 text-amber-700",
    "bg-cyan-100 text-cyan-700",
];

function ReviewCard({ review, index }: { review: DoctorReview; index: number }) {
    const colorClass = AVATAR_COLORS[index % AVATAR_COLORS.length];
    const consultationLabel =
      review.consultationType === "online"
        ? "Online Consultation"
        : review.consultationType === "home-visit"
        ? "Home Visit"
        : "Chamber Visit";

    return (
        <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 hover:shadow-sm transition-shadow">
            {/* Avatar + Name + Date */}
            <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${colorClass}`}>
                    {review.patientInitials}
                </div>
                <div>
                    <p className="text-sm font-semibold text-foreground leading-tight">{review.patientName}</p>
                    <p className="text-2xs text-muted-foreground">{relativeTime(review.date)}</p>
                </div>
            </div>

            {/* Stars */}
            <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                    <HugeiconsIcon
                        key={i}
                        icon={StarIcon}
                        size={13}
                        className={i < review.rating ? "text-amber-400 fill-amber-400" : "text-muted-foreground/20"}
                    />
                ))}
            </div>

            {/* Review Text */}
            <p className="text-xs font-medium leading-relaxed text-muted-foreground line-clamp-3">
                {review.text}
            </p>

            {/* Tag */}
            <div className="mt-auto pt-1">
                <span className="inline-block rounded-full border border-primary/20 bg-primary/8 px-3 py-1 text-2xs font-medium text-primary">
                    {consultationLabel}
                </span>
            </div>
        </div>
    );
}

export function DoctorReviewsTab({ reviews, averageRating, totalReviews }: DoctorReviewsTabProps) {
    const displayed = reviews.slice(0, 4);
    const positiveCount = reviews.filter((r) => r.rating >= 4).length;
    const positivePercent = reviews.length > 0 ? Math.round((positiveCount / reviews.length) * 100) : null;

    return (
        <div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {displayed.map((review, idx) => (
                    <ReviewCard key={review.id} review={review} index={idx} />
                ))}
            </div>
        </div>
    );
}
