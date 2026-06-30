import { Button } from "@/components/ui/button";
import {
  ArrowRight01Icon,
  Doctor02Icon,
  HealthIcon,
  Home01Icon,
  HospitalIcon,
  Search01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";

const POPULAR_PAGES = [
  { label: "Find a Doctor", href: "/doctors" },
  { label: "Book Appointment", href: "/doctors" },
  { label: "Find Hospitals", href: "/hospitals" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact Us", href: "/contact" },
  { label: "About My Doctor", href: "/about" },
];

export default function NotFound() {
  return (
    <div className="bg-background flex min-h-[80vh] flex-col items-center justify-center px-4 py-12 text-center md:py-20">
      <div className="relative mb-6">
        <div className="bg-primary/10 absolute inset-0 rounded-full blur-3xl" />
        <div className="text-primary relative text-8xl font-extrabold tracking-tighter sm:text-9xl">
          404
        </div>
      </div>

      <h1 className="text-foreground mb-3 text-2xl font-bold tracking-tight sm:text-3xl">
        Page Not Found
      </h1>
      <p className="text-muted-foreground mx-auto mb-8 max-w-md text-sm font-medium leading-relaxed">
        The page you are looking for has been moved or doesn&apos;t exist.
        Our healthcare services are still fully available below.
      </p>

      <div className="mb-10 flex w-full max-w-xs flex-col gap-3 sm:max-w-none sm:flex-row sm:flex-wrap sm:justify-center">
        <Button
          asChild
          size="lg"
          className="h-10 gap-2 rounded-xl px-6 text-xs font-bold shadow-md transition-all active:scale-95"
        >
          <Link href="/">
            <HugeiconsIcon icon={Home01Icon} size={16} />
            Return Home
          </Link>
        </Button>
        <Button
          asChild
          variant="outline"
          size="lg"
          className="h-10 gap-2 rounded-xl px-6 text-xs font-bold transition-all active:scale-95"
        >
          <Link href="/doctors">
            <HugeiconsIcon icon={Doctor02Icon} size={16} />
            Browse Doctors
          </Link>
        </Button>
        <Button
          asChild
          variant="outline"
          size="lg"
          className="h-10 gap-2 rounded-xl px-6 text-xs font-bold transition-all active:scale-95"
        >
          <Link href="/hospitals">
            <HugeiconsIcon icon={HospitalIcon} size={16} />
            Browse Hospitals
          </Link>
        </Button>
      </div>

      <div className="w-full max-w-sm">
        <p className="text-muted-foreground mb-4 text-xs font-semibold uppercase tracking-wider">
          Popular Pages
        </p>
        <div className="divide-y divide-border rounded-2xl border border-border overflow-hidden">
          {POPULAR_PAGES.map((page) => (
            <Link
              key={page.label}
              href={page.href}
              className="flex items-center justify-between bg-background px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted/50"
            >
              {page.label}
              <HugeiconsIcon
                icon={ArrowRight01Icon}
                size={14}
                className="text-muted-foreground shrink-0"
              />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
