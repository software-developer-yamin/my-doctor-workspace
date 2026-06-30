import { SITE } from "@/config/site";

export type TFooterLink = {
  label: string;
  href: string;
};

export type TFooterSection = {
  title: string;
  links: TFooterLink[];
};

export type TContactInfo = {
  address: string;
  phone: string;
  email: string;
};

export const FOOTER_QUICK_LINKS: TFooterSection = {
  title: "Quick Links",
  links: [
    { label: "FAQ", href: "/faq" },
    { label: "About Us", href: "/about" },
    { label: "Contact Us", href: "/contact" },
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms & Conditions", href: "/terms-and-conditions" },
  ],
};

export const FOOTER_SERVICES: TFooterSection = {
  title: "Our Services",
  links: [
    { label: "Hospitals", href: "/hospitals" },
    { label: "Doctors", href: "/doctors" },
    { label: "Diagnostics", href: "/diagnostics" },
    { label: "Ambulances", href: "/ambulances" },
    { label: "Hospital Guide", href: "/guides" },
  ],
};

export const FOOTER_CONTACT: TContactInfo = {
  address: SITE.contact.address,
  phone: SITE.contact.phones?.[0],
  email: SITE.contact.email,
};

export const SOCIAL_LINKS = [
  { platform: "facebook", href: SITE.links.facebook },
  { platform: "instagram", href: SITE.links.instagram },
  { platform: "youtube", href: SITE.links.youtube },
];
