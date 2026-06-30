"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import {
  AmbulanceIcon,
  ArrowRight01Icon,
  Book02Icon,
} from "@hugeicons/core-free-icons";
import Image from "next/image";
import Link from "next/link";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";

const LEGALS_AND_SUPPORT = [
  { label: "Ambulance", href: "/ambulances", icon: AmbulanceIcon },
  { label: "Hospital Guide", href: "/guides", icon: Book02Icon },
];

export default function MorePage() {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );

  return (
    <div className="flex min-h-full flex-col bg-background">
      {/* Login CTA — unauthenticated only */}
      {!isAuthenticated && (
        <div className="container py-5">
          <div className="bg-primary/5 flex items-center gap-4 overflow-hidden rounded-2xl p-4">
            {/* Text side */}
            <div className="min-w-0 flex-1 space-y-2">
              <h2 className="text-foreground text-xl font-extrabold leading-tight">
                You are missing out
              </h2>
              <p className="text-muted-foreground text-sm leading-snug">
                Log in and enjoy exciting offers, plans and other benefits
              </p>
              <p className="text-muted-foreground text-sm">
                No registration process required
              </p>
              <Link
                href="/sign-in"
                className="bg-primary text-primary-foreground mt-3 inline-flex items-center rounded-xl px-6 py-2.5 text-sm font-bold transition-opacity hover:opacity-90"
              >
                Login Now
              </Link>
            </div>
            {/* Image side */}
            <div className="relative h-32 w-36 shrink-0">
              <Image
                src="/images/hero/01.svg"
                alt="My Doctor team"
                fill
                className="rounded-xl object-cover"
              />
            </div>
          </div>
        </div>
      )}

      {/* Legals & Support */}
      <div className="container py-4">
        <h3 className="text-foreground mb-3 text-base font-bold">
          Legals &amp; Support
        </h3>
        <ul className="divide-border divide-y overflow-hidden rounded-xl border border-border/50">
          {LEGALS_AND_SUPPORT.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-muted/30"
              >
                <HugeiconsIcon
                  icon={item.icon}
                  size={20}
                  className="text-muted-foreground shrink-0"
                />
                <span className="text-foreground flex-1 text-sm font-medium">
                  {item.label}
                </span>
                <HugeiconsIcon
                  icon={ArrowRight01Icon}
                  size={16}
                  className="text-muted-foreground/50 shrink-0"
                />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
