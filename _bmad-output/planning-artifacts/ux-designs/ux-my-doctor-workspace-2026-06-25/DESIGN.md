---
title: My Doctor – Design System
project: my-doctor-workspace
date: 2026-06-25
status: final
updated: 2026-06-25
version: 1.0.0

colors:
  # Brand Primary — green (#178554 approx.)
  primary: "oklch(0.546 0.121 158)"
  primary-foreground: "oklch(0.985 0 0)"
  primary-dark: "oklch(0.35 0.09 158)"
  primary-light: "oklch(0.95 0.02 158)"
  primary-from: "oklch(0.546 0.121 158)"
  primary-to: "oklch(0.45 0.098 155)"

  # Secondary — teal
  secondary: "oklch(0.518 0.108 191)"
  secondary-foreground: "oklch(0.985 0 0)"
  secondary-dark: "oklch(0.3 0.06 191)"
  secondary-light: "oklch(0.95 0.02 191)"
  secondary-from: "oklch(0.518 0.108 191)"
  secondary-to: "oklch(0.339 0.049 159.2)"

  # Tertiary — lime accent
  tertiary: "oklch(0.865 0.201 158)"
  tertiary-foreground: "oklch(0.205 0 0)"
  tertiary-from: "oklch(0.865 0.201 158)"
  tertiary-to: "oklch(0.72 0.12 165)"

  # Neutral surfaces
  background: "oklch(1 0 0)"
  foreground: "oklch(0.16 0.008 158)"
  surface: "oklch(0.988 0 0)"
  card: "oklch(1 0 0)"
  card-foreground: "oklch(0.16 0.008 158)"
  muted: "oklch(0.965 0.005 158)"
  muted-foreground: "oklch(0.5 0.012 158)"
  accent: "oklch(0.965 0.005 158)"
  accent-foreground: "oklch(0.16 0.008 158)"
  border: "oklch(0.91 0.007 158)"
  input: "oklch(0.91 0.007 158)"
  ring: "oklch(0.546 0.121 158)"

  # Semantic
  success: "oklch(0.593 0.148 143.9)"
  info: "oklch(0.578 0.164 251.2)"
  warning: "oklch(0.817 0.174 79.5)"
  error: "oklch(0.548 0.222 26.2)"
  destructive: "oklch(0.548 0.222 26.2)"

  # Dark mode surfaces
  dark-background: "oklch(0.13 0.008 158)"
  dark-foreground: "oklch(0.95 0.004 158)"
  dark-surface: "oklch(0.19 0.008 158)"
  dark-card: "oklch(0.17 0.008 158)"
  dark-popover: "oklch(0.21 0.008 158)"
  dark-accent: "oklch(0.23 0.01 158)"

  # Sidebar
  sidebar: "oklch(0.985 0.003 158)"
  sidebar-foreground: "oklch(0.16 0.008 158)"
  sidebar-primary: "oklch(0.546 0.121 158)"
  sidebar-primary-foreground: "oklch(0.985 0 0)"
  sidebar-accent: "oklch(0.95 0.007 158)"
  sidebar-border: "oklch(0.91 0.007 158)"

  # Charts
  chart-1: "oklch(0.546 0.121 158)"
  chart-2: "oklch(0.518 0.108 191)"
  chart-3: "oklch(0.865 0.201 158)"
  chart-4: "oklch(0.593 0.148 143.9)"
  chart-5: "oklch(0.817 0.174 79.5)"

typography:
  font-sans: "Geist Sans"
  font-mono: "Geist Mono"
  font-bengali: "Hind Siliguri"
  # Scale (base 16px)
  scale:
    3xs: "0.5625rem"   # 9px  – micro stat labels
    micro: "0.625rem"  # 10px – fine print, price labels
    2xs: "0.6875rem"   # 11px – badges, chip labels
    xs: "0.75rem"      # 12px – captions
    body-sm: "0.8125rem" # 13px – secondary body
    sm: "0.875rem"     # 14px – form labels
    body: "0.9375rem"  # 15px – primary card body
    base: "1rem"       # 16px – standard body
    lg: "1.125rem"     # 18px – subheadings
    xl: "1.25rem"      # 20px – section titles
    2xl: "1.5rem"      # 24px – card headings
    3xl: "1.875rem"    # 30px – page headings
  weights:
    normal: 400
    medium: 500
    semibold: 600
    bold: 700

rounded:
  sm: "calc(var(--radius) * 0.6)"   # ~6px
  md: "calc(var(--radius) * 0.8)"   # ~8px
  lg: "var(--radius)"               # 10px base
  xl: "calc(var(--radius) * 1.4)"   # ~14px
  2xl: "calc(var(--radius) * 1.8)"  # ~18px
  3xl: "calc(var(--radius) * 2.2)"  # ~22px
  4xl: "calc(var(--radius) * 2.6)"  # ~26px
  full: "9999px"

spacing:
  base-unit: "4px"
  container-max: "1280px"
  section-y-mobile: "2.5rem"   # 40px
  section-y-tablet: "4rem"     # 64px
  section-y-desktop: "5rem"    # 80px
  card-padding: "1.25rem"      # 20px
  card-padding-lg: "1.5rem"    # 24px
  sidebar-width: "260px"
  sidebar-collapsed: "64px"

components:
  button:
    height-sm: "32px"
    height-md: "40px"
    height-lg: "48px"
    padding-x-sm: "12px"
    padding-x-md: "16px"
    padding-x-lg: "24px"
    radius: "{rounded.lg}"
    font-weight: 500
    variants: [default, destructive, outline, secondary, ghost, link]
  card:
    radius: "{rounded.xl}"
    shadow: "0 1px 3px oklch(0 0 0 / 8%), 0 1px 2px oklch(0 0 0 / 6%)"
    shadow-hover: "0 4px 6px oklch(0 0 0 / 10%), 0 2px 4px oklch(0 0 0 / 6%)"
    border: "1px solid {colors.border}"
  input:
    height: "40px"
    radius: "{rounded.lg}"
    border: "1px solid {colors.input}"
    focus-ring: "2px {colors.ring}"
  badge:
    radius: "{rounded.full}"
    font-size: "{typography.scale.2xs}"
    font-weight: 500
  avatar:
    sizes: [24px, 32px, 40px, 48px, 64px, 80px]
    radius: "{rounded.full}"
  skeleton:
    radius: "{rounded.md}"
    animation: "pulse-subtle 2s infinite ease-in-out"
  dialog:
    radius: "{rounded.2xl}"
    overlay: "oklch(0 0 0 / 50%)"
    max-width-sm: "425px"
    max-width-md: "600px"
    max-width-lg: "800px"
---

## Brand & Style

**My Doctor** is Bangladesh's trusted healthcare platform connecting patients with doctors, hospitals, diagnostics, ambulances, nurses, and telemedicine — all in one place. The brand is calm, trustworthy, and accessible.

**Voice:** Confident, warm, no jargon. In Bengali contexts use Hind Siliguri typeface. Empathy-first in error states; never clinical in patient-facing copy.

**Tone:** Professional without being cold. Direct. Reassuring under anxiety (appointment waiting, emergency services).

**Anti-patterns:**
- No aggressive red CTA buttons (reserved for destructive/emergency only)
- No cluttered information density without breathing room
- No dark patterns in booking flows

---

## Colors

### Light Mode
Primary brand color is **green** (`oklch(0.546 0.121 158)` ≈ `#178554`) — used for primary CTAs, active nav states, progress indicators, and trust signals.

Secondary is **teal** (`oklch(0.518 0.108 191)`) — used for informational elements, secondary actions, and gradient endpoints.

Tertiary is **lime** (`oklch(0.865 0.201 158)`) — used sparingly for highlights, accents, and chart fills.

**Gradients:**
- Primary: `primary-from → primary-to` (green to deep green)
- Secondary: `secondary-from → secondary-to` (teal to slate green)
- Hero / promotional: linear gradient primary→secondary

### Dark Mode
Background is a green-hued near-black (`oklch(0.13 0.008 158)`). Layered elevation: bg → surface → card → popover. Primary brand color unchanged across modes.

### Semantic
- Success: green (`oklch(0.593 0.148 143.9)`)
- Info: blue (`oklch(0.578 0.164 251.2)`)
- Warning: yellow (`oklch(0.817 0.174 79.5)`)
- Error/Destructive: red (`oklch(0.548 0.222 26.2)`)

---

## Typography

**Primary font:** Geist Sans — clean, modern, excellent screen readability.  
**Bengali support:** Hind Siliguri — used for Bengali-language content blocks, address strings, patient names in Bengali.  
**Monospace:** Geist Mono — appointment IDs, serial numbers, tracking codes.

### Hierarchy
| Role | Size | Weight |
|------|------|--------|
| Page heading | 3xl (30px) | 700 |
| Section title | 2xl (24px) | 700 |
| Card heading | xl (20px) | 600 |
| Subheading | lg (18px) | 600 |
| Body | base (16px) | 400 |
| Card body | body (15px) | 400 |
| Secondary body | body-sm (13px) | 400 |
| Label / caption | sm (14px) | 500 |
| Badge / chip | 2xs (11px) | 500 |
| Fine print | micro (10px) | 400 |

---

## Layout & Spacing

**Grid:** 12-column. Mobile: 4-col / 1-col stacked. Tablet: 8-col. Desktop: 12-col.  
**Container:** max-width 1280px, centered, px-4 (mobile) → px-6 (tablet) → px-8 (desktop).  
**Section vertical rhythm:** 40px (mobile) → 64px (tablet) → 80px (desktop).  
**Card padding:** 20px (sm) → 24px (lg).  
**Sidebar:** 260px expanded, 64px collapsed (icon-only).

**Responsive breakpoints (Tailwind defaults):**
- `sm`: 640px
- `md`: 768px  
- `lg`: 1024px
- `xl`: 1280px

---

## Elevation & Depth

Three elevation levels:
1. **Flat** — surface/card background, no shadow. Used for list rows, table rows.
2. **Raised** — `0 1px 3px oklch(0 0 0 / 8%)`. Used for cards at rest.
3. **Floating** — `0 4px 6px oklch(0 0 0 / 10%)`. Used for hover cards, dropdowns, modals backdrop.

Brand-tinted shadows available: `shadow-primary`, `shadow-secondary`, `shadow-accent` — used for highlighted CTAs and feature cards.

---

## Shapes

Base radius: `10px` (0.625rem). All derived radii are multiples.

- Interactive chips, badges: full pill (`9999px`)
- Form inputs, buttons: `lg` (~10px)
- Cards: `xl` (~14px)
- Modals, drawers: `2xl` (~18px)
- Large promotional cards / hero containers: `3xl–4xl` (22–26px)
- Avatars: full circle

---

## Components

### Buttons
Three sizes: sm (h-8), default (h-10), lg (h-12). Primary variant uses brand green fill. Outline variant uses brand green border + transparent fill. Ghost for navigation actions. Destructive for irreversible actions (always red).

### Cards
Cards are the primary content container. Always `rounded-xl`, subtle border, optional shadow. Hover state lifts shadow. Doctor cards and Hospital cards use image headers with gradient overlays.

### Doctor Card
- Avatar (64px circle) or photo header
- Name (card heading), specialty (body-sm, muted), rating stars
- Location + consultation fee
- Book Now CTA (primary button)
- Available badge (success) or Unavailable (muted)

### Hospital Card
- Cover image with gradient overlay
- Name, type (government/private), location
- Specialties chips, rating, beds count
- View Hospital CTA

### Appointment Card
- Serial number (monospace), patient/doctor name
- Status badge (pending/confirmed/completed/cancelled)
- Time slot, chamber location
- Actions (View, Cancel, Reschedule)

### Skeleton / Loading State
Uses Phantom UI (`<phantom-ui>` web component). Skeleton shapes mirror real content layout. Pulse-subtle animation (scale 1→0.98, opacity 1→0.8).

### Navigation
**Public header:** Logo left, nav links center, auth CTAs right. Mobile: hamburger → sheet drawer.  
**Dashboard sidebar:** Collapsible. Icon + label rows. Active state: primary fill background + white text. Nested routes indented.

### Live Serial Banner
Ambient appointment queue display. Green primary pill showing current serving serial. Patient's serial number highlighted. Estimated wait time shown.

### Service Cards (Home page)
Icon + label grid. 2×4 mobile, 4×2 tablet, 8×1 desktop. Each card links to service page.

---

## Mockups

> Spines win on conflict with any mockup. These are illustrative only.

| Surface | File | Illustrates |
|---------|------|-------------|
| Home Hero | [mockups/key-home-hero.html](mockups/key-home-hero.html) | Brand & Style, Colors, Search Bar, Stats Bar, Specializations grid |
| Doctor Listing | [mockups/key-doctor-listing.html](mockups/key-doctor-listing.html) | Doctor Card component, Badge variants, Filter sidebar, Active filter chips, Skeleton loading state |
| Booking Flow | [mockups/key-booking-flow.html](mockups/key-booking-flow.html) | Dialog component, Step flow, Input, Button variants, Confirmation state |
| Patient Dashboard | [mockups/key-patient-dashboard.html](mockups/key-patient-dashboard.html) | Sidebar, Appointment Card, Badge status variants, Live Serial Banner, Monospace serials |

---

## Do's and Don'ts

**Do:**
- Use primary green for the single most important action per screen
- Use skeleton loading for every data-fetched list or card
- Show appointment serial numbers in monospace
- Use Bengali Hind Siliguri for any user-entered Bengali text
- Apply brand-tinted shadows on featured/promotional cards
- Use semantic colors (success/warning/error) consistently across all status badges

**Don't:**
- Don't use red for non-destructive/non-emergency elements
- Don't nest more than 2 levels of cards
- Don't use more than 3 font weights on a single screen
- Don't display raw MongoDB `_id` strings in UI
- Don't use full-chroma tertiary lime as background fill — accent only
- Don't show empty states without an action CTA
