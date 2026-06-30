"use client";

import { PAGE_FEATURES, isPageEnabled } from "@/config/features";
import { ServiceDeactivated } from "./service-deactivated";
import React from "react";
import { usePathname } from "next/navigation";

interface FeatureGuardProps {
  children: React.ReactNode;
  serviceName?: string;
  fallback?: React.ReactNode;
}

/**
 * FeatureGuard Component
 * Wraps a page and only renders the children if the page path is enabled in PAGE_FEATURES config.
 * It automatically detects the current path using usePathname.
 */
export const FeatureGuard = ({
  children,
  serviceName,
  fallback,
}: FeatureGuardProps) => {
  const pathname = usePathname();
  const isEnabled = isPageEnabled(pathname);

  if (!isEnabled) {
    if (fallback) return <>{fallback}</>;

    // Try to generate a nice name from the path if serviceName isn't provided
    const pathName = serviceName || 
      pathname.split('/')[1]?.charAt(0).toUpperCase() + 
      pathname.split('/')[1]?.slice(1).toLowerCase().replace(/-/g, ' ');

    return (
      <ServiceDeactivated serviceName={pathName} />
    );
  }

  return <>{children}</>;
};
