"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

export function ScrollRestoration() {
  const pathname = usePathname();
  const isBackNavigation = useRef(false);

  useEffect(() => {
    const handlePopState = () => {
      isBackNavigation.current = true;
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    if (isBackNavigation.current) {
      isBackNavigation.current = false;
      return;
    }
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  return null;
}
