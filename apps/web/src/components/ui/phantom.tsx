"use client";

import "@aejkatappaja/phantom-ui";
import type { ReactNode } from "react";

type PhantomAnimation = "shimmer" | "pulse" | "breathe" | "solid";

interface PhantomProps {
  loading: boolean;
  children: ReactNode;
  animation?: PhantomAnimation;
  /** Fade-out duration in seconds when loading ends. Defaults to 0.3. Pass 0 for instant. */
  reveal?: number;
  className?: string;
}

export function Phantom({
  loading,
  children,
  animation = "shimmer",
  reveal = 0.3,
  className,
}: PhantomProps) {
  return (
    <phantom-ui
      loading={loading}
      animation={animation}
      reveal={reveal}
      class={className}
    >
      {children}
    </phantom-ui>
  );
}
