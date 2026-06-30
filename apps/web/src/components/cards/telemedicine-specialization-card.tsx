"use client";

import type { TTelemedicineSpecialization } from "@/data/telemedicine.data";
import Link from "next/link";
import React from "react";

export const TelemedicineSpecializationCard = ({
  specialization,
}: {
  specialization: TTelemedicineSpecialization;
}) => {
  const href = `/search?type=doctor&q=${encodeURIComponent(specialization.name)}`;

  return (
    <Link
      href={href}
      className="group flex flex-row items-start rounded border border-border bg-card p-5 shadow-sm transition-all hover:border-primary/40 hover:shadow-md"
    >
      {/* 56x56 Image matching reference exactly */}
      <div className="mt-1.5 h-14 w-14 shrink-0 overflow-hidden rounded">
        <img
          src={specialization.image}
          alt={specialization.name}
          className="h-14 w-14 object-cover rounded"
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Content Area */}
      <div className="pl-4 flex-1 min-w-0">
        <h4 className="font-bold text-foreground transition-colors group-hover:text-primary leading-tight">
          {specialization.name}
        </h4>
        <p className="mt-1.5 text-sm text-muted-foreground line-clamp-3 leading-relaxed">
          {specialization.description}
        </p>
      </div>
    </Link>
  );
};
