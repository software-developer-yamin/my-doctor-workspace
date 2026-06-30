import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { SITE } from "@/config/site";

export const metadata: Metadata = {
  title: "Under Maintenance",
  description: "My Doctor is currently undergoing scheduled maintenance. We will be back shortly.",
  robots: { index: false, follow: false },
};
import {
  Call02Icon,
  Mail01Icon,
  Wrench01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";

export default function MaintenancePage() {
  return (
    <div className="bg-background flex min-h-[70vh] flex-col items-center justify-center px-4 py-12 text-center md:py-20">
      <div className="bg-primary/5 mb-6 flex h-24 w-24 items-center justify-center rounded-3xl shadow-sm">
        <HugeiconsIcon
          icon={Wrench01Icon}
          size={48}
          className="text-primary animate-pulse-subtle"
        />
      </div>

      <h1 className="text-foreground mb-3 text-3xl font-bold tracking-tight sm:text-5xl">
        Under Maintenance
      </h1>
      <p className="text-muted-foreground mx-auto mb-8 max-w-md text-sm leading-relaxed font-medium sm:text-base">
        We&apos;re currently enhancing our systems to serve you better.
        We&apos;ll be back online soon. Thank you for your patience!
      </p>

      <div className="mb-10 flex flex-wrap justify-center gap-6">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-full">
            <HugeiconsIcon
              icon={Mail01Icon}
              size={16}
              className="text-primary"
            />
          </div>
          <p className="text-foreground text-xs font-semibold">
            {SITE.contact.email}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-full">
            <HugeiconsIcon
              icon={Call02Icon}
              size={16}
              className="text-primary"
            />
          </div>
          <p className="text-foreground text-xs font-semibold">
            {SITE.contact.phones[0]}
          </p>
        </div>
      </div>

      <Button
        asChild
        size="lg"
        className="h-10 rounded-xl px-10 text-xs font-bold shadow-md transition-all active:scale-95"
      >
        <Link href="/">Check Again</Link>
      </Button>

      <p className="text-muted-foreground mt-8 text-micro font-bold tracking-widest uppercase">
        &copy; {new Date().getFullYear()} My Doctor Ltd.
      </p>
    </div>
  );
}
