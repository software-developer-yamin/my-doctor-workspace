"use client";

import { ReactNode } from "react";

export function FilterSidebar({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <aside className="hidden w-56 shrink-0 lg:block xl:w-60">
      <div className="sticky top-36 max-h-[calc(100vh-9rem)] overflow-y-auto px-4 pb-5">
        <h2 className="text-foreground mb-4 text-xl font-bold">{title}</h2>
        {children}
      </div>
    </aside>
  );
}
