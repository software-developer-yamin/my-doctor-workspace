---
title: My Doctor Admin Panel – Design System
project: my-doctor-workspace / admin-panel
source-app: my_doctor_backend/public
date: 2026-06-25
status: final
updated: 2026-06-25
version: 1.0.0

colors:
  # Primary — dark navy/slate (shadcn default dark)
  primary: "oklch(0.208 0.042 265.755)"
  primary-foreground: "oklch(0.984 0.003 247.858)"

  # Secondary — near-white blue-tint
  secondary: "oklch(0.968 0.007 247.896)"
  secondary-foreground: "oklch(0.208 0.042 265.755)"

  # Surfaces
  background: "oklch(1 0 0)"
  foreground: "oklch(0.129 0.042 264.695)"
  card: "oklch(1 0 0)"
  card-foreground: "oklch(0.129 0.042 264.695)"
  popover: "oklch(1 0 0)"
  popover-foreground: "oklch(0.129 0.042 264.695)"

  # Neutral
  muted: "oklch(0.968 0.007 247.896)"
  muted-foreground: "oklch(0.554 0.046 257.417)"
  accent: "oklch(0.968 0.007 247.896)"
  accent-foreground: "oklch(0.208 0.042 265.755)"

  # States
  destructive: "oklch(0.577 0.245 27.325)"
  border: "oklch(0.929 0.013 255.508)"
  input: "oklch(0.929 0.013 255.508)"
  ring: "oklch(0.704 0.04 256.788)"

  # Charts
  chart-1: "oklch(0.646 0.222 41.116)"   # orange
  chart-2: "oklch(0.6 0.118 184.704)"    # teal
  chart-3: "oklch(0.398 0.07 227.392)"   # slate blue
  chart-4: "oklch(0.828 0.189 84.429)"   # yellow
  chart-5: "oklch(0.769 0.188 70.08)"    # amber

  # Dark mode surfaces
  dark-background: "oklch(0.129 0.042 264.695)"
  dark-foreground: "oklch(0.984 0.003 247.858)"
  dark-card: "oklch(0.14 0.04 259.21)"
  dark-popover: "oklch(0.208 0.042 265.755)"
  dark-muted: "oklch(0.279 0.041 260.031)"
  dark-muted-foreground: "oklch(0.704 0.04 256.788)"
  dark-primary: "oklch(0.929 0.013 255.508)"
  dark-primary-foreground: "oklch(0.208 0.042 265.755)"
  dark-secondary: "oklch(0.279 0.041 260.031)"
  dark-border: "oklch(1 0 0 / 10%)"
  dark-input: "oklch(1 0 0 / 15%)"
  dark-ring: "oklch(0.551 0.027 264.364)"
  dark-destructive: "oklch(0.704 0.191 22.216)"

  # Sidebar (inherits background in light mode)
  sidebar: "var(--background)"
  sidebar-foreground: "var(--foreground)"
  sidebar-primary: "var(--primary)"
  sidebar-primary-foreground: "var(--primary-foreground)"
  sidebar-accent: "var(--accent)"
  sidebar-border: "var(--border)"
  sidebar-ring: "var(--ring)"

typography:
  font-primary: "Inter"
  font-display: "Manrope"
  # Inter: body text, tables, labels, form fields
  # Manrope: headings, page titles, stat numbers, dashboard KPIs
  scale:
    xs: "0.75rem"       # 12px — table cell secondary, badges
    sm: "0.875rem"      # 14px — table cells, form labels
    base: "1rem"        # 16px — body, nav items
    lg: "1.125rem"      # 18px — section titles
    xl: "1.25rem"       # 20px — page titles
    2xl: "1.5rem"       # 24px — KPI numbers
    3xl: "1.875rem"     # 30px — dashboard headline stats
  weights:
    normal: 400
    medium: 500
    semibold: 600
    bold: 700
    extrabold: 800

rounded:
  sm: "calc(0.625rem - 4px)"   # ~6px
  md: "calc(0.625rem - 2px)"   # ~8px
  lg: "0.625rem"               # 10px base
  xl: "calc(0.625rem + 4px)"   # ~14px
  full: "9999px"

spacing:
  base-unit: "4px"
  sidebar-width: "240px"
  sidebar-collapsed: "48px"
  topbar-height: "56px"
  table-row-height: "52px"
  card-padding: "20px"
  section-gap: "24px"
  container-max: "1400px"

components:
  button:
    heights: { sm: "32px", md: "36px", lg: "40px" }
    radius: "{rounded.lg}"
    font-weight: 500
    font-family: "Inter"
    variants: [default, destructive, outline, secondary, ghost, link]
  table:
    row-height: "52px"
    header-bg: "var(--muted)"
    header-font-weight: 600
    header-font-size: "0.75rem"
    header-text-transform: "uppercase"
    header-letter-spacing: "0.05em"
    striped: false
    hover-bg: "var(--accent)"
    border-style: "horizontal-rules-only"
    row-actions: "visible-on-hover"
  badge:
    radius: "{rounded.full}"
    font-size: "0.6875rem"   # 11px
    font-weight: 600
    variants:
      default: "bg-{colors.primary}, text-{colors.primary-foreground}"
      secondary: "bg-{colors.secondary}, text-{colors.secondary-foreground}"
      destructive: "bg-{colors.destructive}, text-white"
      outline: "border-{colors.border}"
      success: "bg-green-100, text-green-800"
      warning: "bg-amber-100, text-amber-800"
      info: "bg-blue-100, text-blue-800"
  input:
    height: "36px"
    radius: "{rounded.lg}"
    font-family: "Inter"
    placeholder-color: "{colors.muted-foreground}"
  dialog:
    radius: "{rounded.xl}"
    max-width: { sm: "425px", md: "600px", lg: "900px" }
  stat-card:
    radius: "{rounded.xl}"
    border: "1px solid {colors.border}"
    bg: "{colors.card}"
    kpi-font: "Manrope"
    kpi-weight: 800
    delta-positive: "oklch(0.593 0.148 143.9)"  # green
    delta-negative: "oklch(0.577 0.245 27.325)"  # red
  data-table:
    search-input-width: "280px"
    column-selector: true
    bulk-actions: true
    row-selection: "checkbox"
    pagination: "bottom-right"
  chart:
    height-default: "300px"
    height-mini: "80px"
    tooltip-bg: "{colors.card}"
    grid-color: "{colors.border}"
---

## Brand & Style

**My Doctor Admin Panel** is an internal operations dashboard for platform administrators. Audience: ops staff, medical coordinators, system admins. Tone is neutral, data-dense, and efficient — no marketing language.

**Design character:** Clean data tool. High information density without clutter. Tables, charts, and action lists are the primary surface. Minimal decoration. Trust signals not needed — admin users are internal.

**Voice (admin microcopy):** Imperative and clear. "Update Doctor" not "Save changes to doctor profile". "Delete" not "Remove permanently". Error states quote the constraint: "Duplicate email — another doctor uses this address."

**Distinction from frontend:** Admin panel is dark-navy primary (internal tool aesthetic) vs. frontend green brand. Admin panel uses Inter + Manrope (data-optimized typefaces) vs. frontend's Geist Sans.

---

## Colors

Admin panel uses shadcn's default slate/blue palette. Primary `oklch(0.208 0.042 265.755)` is a deep navy — used for primary CTAs, active sidebar items, data table headers, and selected row highlights.

Charts use a 5-color sequential palette (chart-1 through chart-5) for multi-series data visualizations:
- chart-1 (orange): booking volumes, appointment counts
- chart-2 (teal): diagnostic / lab metrics
- chart-3 (slate blue): user/doctor registrations
- chart-4 (yellow): revenue / financial KPIs
- chart-5 (amber): ambulance, emergency metrics

Status colors for data table badges (outside shadcn defaults):
- Success/Active/Confirmed: green-100 bg, green-800 text
- Warning/Pending: amber-100, amber-800
- Destructive/Cancelled: destructive token
- Info/Processing: blue-100, blue-800

---

## Typography

**Inter** — all body content: table cells, form labels, nav items, body copy. Optimized for tabular data legibility.

**Manrope** — headings, page titles, KPI numbers on stat cards. Heavy weight (700–800) for dashboard prominence.

| Role | Font | Size | Weight |
|------|------|------|--------|
| Page title | Manrope | xl (20px) | 700 |
| Section title | Manrope | lg (18px) | 700 |
| KPI number | Manrope | 3xl (30px) | 800 |
| KPI label | Inter | sm (14px) | 500 |
| Table header | Inter | xs (12px) | 600, uppercase |
| Table cell | Inter | sm (14px) | 400 |
| Form label | Inter | sm (14px) | 500 |
| Badge | Inter | xs–11px | 600 |
| Nav item | Inter | sm (14px) | 500 |
| Button | Inter | sm (14px) | 500 |

---

## Layout & Spacing

**Shell:** Topbar (56px fixed) + collapsible sidebar (240px expanded, 48px icon-only) + main content area.

**Content container:** max-width 1400px. No outer padding on tables — tables span full content width.

**Card grid:** 12-column. Stat cards: 4-col each (3 across desktop). Charts: 8+4 or 6+6. Tables: full-width.

**Spacing scale (8pt grid base):**
- `xs`: 4px — chip gaps
- `sm`: 8px — input internals
- `md`: 12px — form field gaps
- `lg`: 16px — card internal padding top/bottom
- `xl`: 20px — card padding, section gaps
- `2xl`: 24px — section gaps
- `3xl`: 32px — major section breaks

---

## Elevation & Depth

Two levels:
1. **Flat** — tables, content areas. No shadow.
2. **Raised** — stat cards, filter panels. `0 1px 3px oklch(0 0 0 / 8%)`.

Dropdowns and command palettes: `0 8px 30px oklch(0 0 0 / 12%)`. Dialogs: `0 20px 60px oklch(0 0 0 / 20%)`.

---

## Shapes

Radius base: 10px. Admin uses only 4 levels (simpler than frontend):
- `sm`: ~6px — table row chips, small badges
- `md`: ~8px — inputs
- `lg`: 10px — buttons, cards, dialogs
- `xl`: ~14px — stat cards, large panels
- `full`: 9999px — status pills, avatar

---

## Components

### Data Table (primary UI pattern)
Every admin section leads with a Data Table. Anatomy:
- **Toolbar row:** search input (280px) left + column visibility selector + bulk actions right
- **Column headers:** uppercase 12px Inter 600, sort arrow on hover
- **Rows:** 52px height, horizontal rule only between rows, no vertical lines
- **Row actions:** visible on hover — Edit (pencil), View (eye), Delete (trash) as icon buttons
- **Bulk selection:** checkbox column far-left, bulk action bar appears at top when rows selected
- **Pagination:** bottom-right — rows-per-page select + prev/next + page indicator
- **Empty state:** centered icon + message + primary CTA

### Stat Cards (Dashboard)
4 across the top of Dashboard. Each:
- Manrope KPI number (30px/800w)
- Inter label (14px/500w, muted)
- Delta badge: +X% (green) or -X% (red) vs last period
- Sparkline chart (Recharts) — 80px tall, no axes, no tooltip, brand-appropriate chart color

### Sidebar
- Full-width items with icon + label
- Active item: primary bg + primary-foreground text
- Hover: accent bg
- Section groups with uppercase 10px labels
- Collapse toggle at bottom
- Clerk UserButton at bottom for profile/sign-out

### Command Palette
Triggered by `⌘K` / `Ctrl+K`. Global search across all entities (doctors, hospitals, patients, appointments). Results grouped by entity type. Keyboard navigable.

### Forms (Create / Edit flows)
- Appear in Dialogs (desktop) for quick edits
- Full-page route for complex forms (e.g., Create Doctor with 20+ fields)
- Two-column layout for large forms
- Zod validation inline on blur + submit
- Cancel always visible; destructive confirm dialog before delete

### Chats Panel
- Split: conversation list left (320px) + message thread right
- Messages: chronological, sender avatar, timestamp, status ticks
- Input: textarea + send button + file attach

---

## Do's and Don'ts

**Do:**
- Show row counts in table toolbars: "24 doctors"
- Use monospace for IDs, phone numbers, serial numbers
- Confirm destructive operations with a named-entity dialog: "Delete Dr. Karim? This cannot be undone."
- Collapse rarely-used sidebar sections by default
- Show last-updated timestamp on all data tables

**Don't:**
- Don't show brand marketing colors in admin — strictly internal palette
- Don't use card-heavy layouts for list data — tables always win
- Don't paginate to more than 50 rows per page
- Don't show success toast for navigation — only for mutations
- Don't put destructive actions in primary button style
