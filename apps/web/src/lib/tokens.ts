/**
 * Design token constants derived from the My Doctor visual design.
 * Source of truth: globals.css CSS variables (OKLCH color space).
 * Primary: #178554 = oklch(0.546 0.121 158)
 * All neutrals use hue 158 (aligned with primary) for brand coherence.
 */

// ── Color CSS variable references ──────────────────────────────────────────
export const colorVars = {
  // Brand
  primary: "var(--color-primary)",
  primaryDark: "var(--color-primary-dark)",
  primaryLight: "var(--color-primary-light)",
  secondary: "var(--color-secondary)",
  secondaryDark: "var(--color-secondary-dark)",
  secondaryLight: "var(--color-secondary-light)",
  tertiary: "var(--color-tertiary)",

  // Semantic
  success: "var(--color-success)",
  warning: "var(--color-warning)",
  error: "var(--color-error)",
  info: "var(--color-info)",

  // Surface
  background: "var(--color-background)",
  foreground: "var(--color-foreground)",
  card: "var(--color-card)",
  cardForeground: "var(--color-card-foreground)",
  muted: "var(--color-muted)",
  mutedForeground: "var(--color-muted-foreground)",
  border: "var(--color-border)",
  ring: "var(--color-ring)",
} as const;

// ── Tailwind class aliases ──────────────────────────────────────────────────
// These map design decisions to Tailwind class strings for consistent reuse.

export const radius = {
  card: "rounded-3xl",           // Doctor / Hospital cards
  cardSm: "rounded-2xl",         // Ambulance / image thumbnails
  image: "rounded-xl",           // Inner image frames
  button: "rounded-xl",          // Primary / outline buttons
  buttonSm: "rounded-lg",        // Small buttons
  chip: "rounded-full",          // Filter pills, status badges
  modal: "rounded-[1.5em]",      // Dialogs, bottom sheets
  tag: "rounded-[0.25em_1em_0.25em_1em]", // Specialty asymmetric tag
} as const;

export const shadow = {
  card: "shadow-sm hover:shadow-lg transition-shadow duration-300",
  cardSm: "shadow-sm hover:shadow-md transition-shadow duration-200",
  primary: "shadow-primary",
  secondary: "shadow-secondary",
} as const;

export const typography = {
  // Labels / micro text
  micro: "text-[9px] font-medium",
  label: "text-micro font-medium",
  labelBold: "text-micro font-bold",
  caption: "text-xs font-medium",
  captionBold: "text-xs font-bold",

  // Body
  bodySm: "text-sm font-medium",
  bodySmBold: "text-sm font-bold",
  body: "text-base font-medium",

  // Card / section headings
  cardTitle: "text-lg font-bold leading-normal",
  cardTitleSm: "text-base font-bold",
  sectionTitle: "text-2xl font-bold",
  pageTitle: "text-3xl font-bold",
  heroTitle: "text-4xl font-bold",
} as const;

export const spacing = {
  // Card internal padding
  cardPad: "p-5",
  cardPadSm: "p-4",
  cardPadXs: "p-3",

  // Grid gaps
  gridGap: "gap-4",
  gridGapSm: "gap-3",
  sectionGap: "gap-6",
  sectionGapLg: "gap-8",

  // Section vertical rhythm
  sectionPy: "py-12",
  sectionPyLg: "py-16",
} as const;

// ── Status colors ───────────────────────────────────────────────────────────
export const statusColors = {
  available: {
    bg: "bg-emerald-500",
    bgLight: "bg-emerald-50",
    text: "text-emerald-600",
    dot: "bg-primary",
  },
  unavailable: {
    bg: "bg-red-500",
    bgLight: "bg-red-50",
    text: "text-red-500",
    dot: "bg-slate-300",
  },
  emergency: {
    bg: "bg-red-600",
    bgLight: "bg-red-50",
    text: "text-red-600",
  },
  online: {
    bg: "bg-blue-600",
    bgLight: "bg-blue-50",
    text: "text-blue-600",
  },
  verified: {
    bg: "bg-emerald-50",
    text: "text-emerald-600",
  },
  pending: {
    bg: "bg-amber-50",
    text: "text-amber-600",
  },
} as const;

// ── Grid layouts ────────────────────────────────────────────────────────────
export const gridLayouts = {
  // Listing pages (Doctor, Hospital, Ambulance, Diagnostics)
  cards2: "grid grid-cols-1 gap-4 sm:grid-cols-2",
  cards3: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3",
  cards4: "grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5",

  // Feature stat row (24/7, Quick Response, Trained Staff, Safe & Reliable)
  features4: "grid grid-cols-2 gap-6 sm:grid-cols-4",

  // Profile stats bar
  statsBar: "flex flex-wrap items-center gap-4 sm:gap-8",
} as const;

// ── Appointment status colors ───────────────────────────────────────────────
export const appointmentStatus: Record<
  "Pending" | "Confirmed" | "In Progress" | "Completed" | "Cancelled",
  { badge: string; button?: string }
> = {
  Pending:         { badge: "bg-warning/15 text-warning border-warning/20",   button: "border-primary/30 text-primary hover:bg-primary/10" },
  Confirmed:       { badge: "bg-info/15 text-info border-info/20" },
  "In Progress":   { badge: "bg-primary/10 text-primary border-primary/20",   button: "border-primary/30 text-primary hover:bg-primary/10" },
  Completed:       { badge: "bg-success/15 text-success border-success/20",   button: "border-success/30 text-success hover:bg-success/10" },
  Cancelled:       { badge: "bg-error/15 text-error border-error/20" },
} as const;

// ── Animation classes ───────────────────────────────────────────────────────
export const animations = {
  fadeIn: "animate-fade-in",
  fadeInUp: "animate-fade-in-up",
  slideInUp: "animate-slide-in-up",
  zoomIn: "animate-zoom-in",
  pulseSlow: "animate-pulse-subtle",
  spinSlow: "animate-spin-slow",
} as const;
