"use client";

import { cn } from "@/lib/utils";
import {
  DoctorIcon,
  Home01Icon,
  Hospital02Icon,
  TestTube01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { label: "Home", icon: Home01Icon, href: "/" },
  { label: "Hospital", icon: Hospital02Icon, href: "/hospitals" },
  { label: "Doctor", icon: DoctorIcon, href: "/doctors" },
  { label: "Diagnostics", icon: TestTube01Icon, href: "/diagnostics" },
] as const;

// Grid icon for "More" button
const MoreGridIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="4" y="4" width="6" height="6" rx="1.5" />
    <rect x="14" y="4" width="6" height="6" rx="1.5" />
    <rect x="4" y="14" width="6" height="6" rx="1.5" />
    <path d="M14 17h6M17 14v6" />
  </svg>
);

export const MobileBottomNav = () => {
  const pathname = usePathname();
  const isMoreActive = pathname.startsWith("/more");

  return (
    <nav
      aria-label="Main navigation"
      className="fixed bottom-0 left-0 z-50 w-full border-t border-gray-200 bg-white pb-[env(safe-area-inset-bottom,0px)] lg:hidden"
    >
      <ul className="flex h-16 items-stretch">
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <li key={item.href} className="flex flex-1">
              <Link
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className="flex flex-1 flex-col items-center justify-center gap-1"
              >
                <span
                  className={cn(
                    "flex items-center justify-center rounded-xl p-2 transition-colors duration-200",
                    isActive ? "bg-primary/10" : "",
                  )}
                >
                  <HugeiconsIcon
                    icon={item.icon}
                    size={22}
                    className={cn(
                      "transition-colors duration-200",
                      isActive ? "text-primary" : "text-gray-600",
                    )}
                  />
                </span>
                <span
                  className={cn(
                    "text-micro font-medium leading-none",
                    isActive ? "text-primary font-semibold" : "text-gray-600",
                  )}
                >
                  {item.label}
                </span>
              </Link>
            </li>
          );
        })}

        {/* More — navigates to /more page */}
        <li className="flex flex-1">
          <Link
            href="/more"
            aria-current={isMoreActive ? "page" : undefined}
            className="flex flex-1 flex-col items-center justify-center gap-1 rounded-none transition-colors"
          >
            <span
              className={cn(
                "flex items-center justify-center rounded-xl p-2 transition-colors duration-200",
                isMoreActive ? "bg-primary/10" : "",
              )}
            >
              <span
                className={cn(
                  "transition-colors duration-200",
                  isMoreActive ? "text-primary" : "text-gray-600",
                )}
              >
                <MoreGridIcon />
              </span>
            </span>
            <span
              className={cn(
                "text-micro font-medium leading-none",
                isMoreActive ? "text-primary font-semibold" : "text-gray-600",
              )}
            >
              More
            </span>
          </Link>
        </li>
      </ul>
    </nav>
  );
};
