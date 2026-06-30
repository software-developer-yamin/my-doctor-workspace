"use client";

import { LogoIcon } from "@/components/icons/logo-icon";
import { SITE } from "@/config/site";
import { cn } from "@/lib/utils";
import {
  Call02Icon,
  Facebook01Icon,
  InstagramIcon,
  Linkedin01Icon,
  Location01Icon,
  Mail01Icon,
  NewTwitterIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";

const QUICK_LINKS = [
  { label: "Find Doctors", href: "/doctors" },
  { label: "Book Appointment", href: "/doctors" },
  { label: "Online Consultation", href: "/doctors" },
  { label: "Emergency Services", href: "/ambulances" },
  { label: "Medical Records", href: "/patient/appointments" },
];

const COMPANY_LINKS = [
  { label: "About Us", href: "/about" },
  { label: "Careers", href: "/careers" },
  { label: "Blog", href: "/blogs" },
  { label: "Press", href: "/press" },
  { label: "Contact Us", href: "/contact" },
  { label: "Partners", href: "/partners" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms of Service", href: "/terms-and-conditions" },
];

const ALL_SOCIAL_LINKS = [
  {
    platform: "facebook",
    href: SITE.links.facebook,
    icon: Facebook01Icon,
    label: "Facebook",
  },
  {
    platform: "twitter",
    href: SITE.links.twitter,
    icon: NewTwitterIcon,
    label: "Twitter",
  },
  {
    platform: "instagram",
    href: SITE.links.instagram,
    icon: InstagramIcon,
    label: "Instagram",
  },
  {
    platform: "linkedin",
    href: SITE.links.linkedin,
    icon: Linkedin01Icon,
    label: "LinkedIn",
  },
  {
    platform: "youtube",
    href: SITE.links.youtube,
    icon: null,
    svgIcon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    ),
    label: "YouTube",
  },
];

// Only show links with real URLs
const SOCIAL_LINKS = ALL_SOCIAL_LINKS.filter((s) => s.href && s.href !== "#");

export const Footer = ({ className }: { className?: string }) => {
  return (
    <footer
      className={cn(
        "bg-white border-t border-gray-200 pt-14 pb-6",
        className,
      )}
    >
      <div className="container">
        {/* Main grid */}
        <div className="grid grid-cols-1 gap-10 border-b border-gray-100 pb-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {/* Column 1: Brand */}
          <div className="flex flex-col gap-5">
            <Link href="/" className="flex w-max items-center">
              <LogoIcon className="h-9 w-auto" />
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-gray-500">
              Your trusted healthcare partner in Bangladesh. Quality medical care, anytime, anywhere.
            </p>
            <div className="flex items-center gap-2">
              {SOCIAL_LINKS.map((social) => (
                <Link
                  key={social.platform}
                  href={social.href}
                  aria-label={social.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white transition-all hover:bg-primary/90"
                >
                  {social.svgIcon ?? <HugeiconsIcon icon={social.icon} size={16} />}
                </Link>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="flex flex-col gap-5">
            <h4 className="text-base font-bold text-gray-900">Quick Links</h4>
            <ul className="flex flex-col gap-3">
              {QUICK_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm font-medium text-gray-500 transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Company */}
          <div className="flex flex-col gap-5">
            <h4 className="text-base font-bold text-gray-900">Company</h4>
            <ul className="flex flex-col gap-3">
              {COMPANY_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm font-medium text-gray-500 transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact Us */}
          <div className="flex flex-col gap-5">
            <h4 className="text-base font-bold text-gray-900">Contact Us</h4>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <HugeiconsIcon
                  icon={Call02Icon}
                  size={17}
                  className="text-primary shrink-0"
                />
                <a
                  href={`tel:${SITE.contact.phones[0]}`}
                  className="text-sm font-medium text-gray-500 transition-colors hover:text-primary"
                >
                  {SITE.contact.phones[0]}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <HugeiconsIcon
                  icon={Mail01Icon}
                  size={17}
                  className="text-primary shrink-0"
                />
                <a
                  href={`mailto:${SITE.contact.email}`}
                  className="text-sm font-medium text-gray-500 transition-colors hover:text-primary break-all"
                  aria-label={`Send email to ${SITE.contact.email}`}
                >
                  Email Us
                </a>
              </div>
              <div className="flex items-start gap-3">
                <HugeiconsIcon
                  icon={Location01Icon}
                  size={17}
                  className="text-primary mt-0.5 shrink-0"
                />
                <p className="text-sm font-medium leading-snug text-gray-500">
                  {SITE.contact.address}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-4 pt-6 sm:flex-row">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} My Doctor BD. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link
              href="/privacy-policy"
              className="text-sm text-gray-500 transition-colors hover:text-primary"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms-and-conditions"
              className="text-sm text-gray-500 transition-colors hover:text-primary"
            >
              Terms of Service
            </Link>
            <Link
              href="/cookie-policy"
              className="text-sm text-gray-500 transition-colors hover:text-primary"
            >
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
