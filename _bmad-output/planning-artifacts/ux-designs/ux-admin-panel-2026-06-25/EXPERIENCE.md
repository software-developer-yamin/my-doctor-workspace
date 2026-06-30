---
title: My Doctor Admin Panel – Experience Design
project: my-doctor-workspace / admin-panel
date: 2026-06-26
status: final
updated: 2026-06-26
version: 1.0.0
design-ref: ./DESIGN.md
---

## Foundation

**Platform:** Web SPA (Vite + React 19). Desktop-first. Minimum supported viewport: 1024px. Tablet at 768px is supported in a degraded single-column mode; no mobile support — admin panel is an internal ops tool used at desks.

**UI System:** shadcn/ui (Radix UI primitives) + Tailwind CSS 4.x. Visual identity delegated to [DESIGN.md](./DESIGN.md). This document specifies behavioral delta only.

**Auth system:** Clerk (`@clerk/clerk-react`). Authentication state: `useAuth()` / `useUser()`. No custom JWT — never mix with customer/doctor JWT token systems.

**Routing:** TanStack Router (file-based, `src/routes/`). `routeTree.gen.ts` is auto-generated — never edit manually. Route files stay thin; feature UIs live in `src/features/<domain>/`.

**State management:** Zustand (not Redux). TanStack Query for all server data. TanStack Table for all tabular displays. React Hook Form + Zod for all forms.

**Package manager:** pnpm.

**User types:** Platform administrators and operations staff only. No patient/doctor logins — those use the frontend and doctor dashboard respectively.

---

## Information Architecture

```
(auth)/
├── sign-in              — Clerk-hosted sign-in
├── sign-up              — Clerk-hosted sign-up
├── forgot-password      — Clerk password reset
└── otp                  — Clerk OTP challenge

_authenticated/          — Clerk-protected shell (route.tsx)
├── / (Dashboard)        — KPI stat cards + charts + activity feed
│
├── Appointments         — /appointments
├── Ambulances           — /ambulances
├── Ambulance Bookings   — /ambulance-bookings
│
├── Customers            — /customers
│   └── (detail view via row action)
│
├── Doctors              — /doctors
│   ├── List             — /doctors/
│   └── Detail           — /doctors/$id
│
├── Hospitals            — /hospitals
│   ├── List             — /hospitals/
│   ├── Detail           — /hospitals/$id/
│   └── Hospital Team    — /hospitals/$id/team
│
├── Labs                 — /labs
├── Diagnostic Tests     — /diagnostic-tests
├── Diagnostic Bookings  — /diagnostic-bookings
│
├── Guides               — not yet surfaced in routes (domain present)
├── Guide Bookings       — /guide-bookings
│
├── Home Doctor Bookings — /home-doctor-bookings
├── Doctor Home Schedules— /doctor-home-schedules
├── Doctor Live Queues   — /doctor-live-queues
│
├── Specialities         — /specialities
├── Concentrations       — /concentrations
├── BD Locations         — /bd-locations
│
├── Contact Messages     — /contact-messages
├── Callback Requests    — /callback-requests
├── SMS Logs             — /sms-logs
│
├── Chats                — /chats   (split-panel chat)
├── Tasks                — /tasks
├── Users                — /users   (internal admin users)
│
├── Apps                 — /apps
├── Help Center          — /help-center
│
├── Settings
│   ├── Account          — /settings/account
│   ├── Appearance       — /settings/appearance
│   ├── Display          — /settings/display
│   ├── Notifications    — /settings/notifications
│   └── Index            — /settings/  (redirects to account)
│
└── Errors
    ├── 401, 403, 404, 500, 503 — /errors/$error
```

**Navigation groups (sidebar):**

| Group label | Items |
|-------------|-------|
| Overview | Dashboard |
| Bookings | Appointments, Ambulance Bookings, Diagnostic Bookings, Guide Bookings, Home Doctor Bookings |
| Fleet | Ambulances |
| People | Customers, Doctors, Users |
| Places | Hospitals, Labs |
| Content | Specialities, Concentrations, BD Locations, Diagnostic Tests |
| Operations | Doctor Home Schedules, Doctor Live Queues, SMS Logs, Contact Messages, Callback Requests |
| Communication | Chats, Tasks |
| System | Apps, Help Center, Settings |

---

## Voice and Tone

*Brand voice lives in [DESIGN.md § Brand & Style](./DESIGN.md).*

**Microcopy principles:**
- Action labels: imperative verb-first. "Add Doctor" not "New Doctor". "Update Hospital" not "Save". "Delete Appointment" not "Remove".
- Destructive confirms: name the entity. "Delete Dr. Rahman? This cannot be undone." Never generic "Are you sure?"
- Error messages: state the constraint explicitly. "Duplicate email — another doctor uses this address." Never "An error occurred."
- Table toolbars: show count. "24 doctors" not just "Records".
- Empty states: acknowledge + primary action. "No appointments yet. Create the first one."
- Success toasts: appear only on mutations (POST/PUT/DELETE). Never on navigation or page loads.
- Status labels: spell out — "Confirmed", "Pending", "Cancelled". Never rely on color alone.

---

## Component Patterns

*Visual specifications (sizes, colors, radius) live in [DESIGN.md § Components](./DESIGN.md).*

### App Shell
Full-height flex layout: fixed topbar (56px) + sidebar + main scroll area.

**Topbar:** Logo left. Global search trigger (`⌘K`) center or right. Clerk `<UserButton>` far right (avatar + dropdown: profile, sign out).

**Sidebar:** 240px expanded / 48px icon-only. Collapse toggle at bottom. Active item: `{colors.primary}` background + `{colors.primary-foreground}` text. Hover: `{colors.accent}` background. Section group labels: uppercase 10px `{colors.muted-foreground}`.

**Main content:** Full-height scroll container. Max-width 1400px, centered. Section padding: 24px.

### Data Table (primary pattern — every entity section)

Anatomy:
1. **Page header row:** Title (Manrope 20px/700) + primary CTA ("Add Doctor") right-aligned
2. **Toolbar row:** Search input (280px) left · column visibility selector · optional date-range picker · bulk action bar (appears when rows selected)
3. **Table head:** uppercase 12px Inter 600 · sort arrow on hover · column resize handle
4. **Table rows:** 52px height · horizontal rules only · row actions (Edit pencil / View eye / Delete trash) visible on hover
5. **Row selection:** checkbox far-left column; bulk action bar replaces toolbar on selection
6. **Pagination:** bottom-right — rows-per-page `<Select>` + prev/next `<Button>` + "Page X of Y" label
7. **Empty state:** centered icon + heading + body + primary CTA button

### Stat Cards (Dashboard)
4 cards spanning full width (25% each). Each card: KPI number (Manrope 30px/800) + muted label + delta badge + sparkline (Recharts, 80px, no axes). Cards are not clickable — they're ambient indicators.

### Forms — Quick Edit (Dialog)
- Triggered from row action "Edit"
- `<Dialog>` component (max-width 600px desktop, full-width on smaller viewports)
- Two-column grid for ≤8 fields; single column for ≤4
- Zod validation: on blur per field + on submit full
- Footer: "Cancel" outline button left, primary "Update [Entity]" button right
- Destructive delete available as secondary action in dialog header (right-aligned trash icon)
- Save triggers TanStack Query mutation → invalidates relevant query key → table refreshes

### Forms — Full Page (Complex Create/Edit)
- Used for entities with 10+ fields (e.g., Create Doctor, Hospital with team)
- Dedicated route (not dialog)
- Two-column form grid
- Sticky save/cancel footer
- Section dividers with labels for grouping (Basic Info · Location · Schedule · etc.)

### Chats Panel (`/chats`)
- Split layout: conversation list (320px left) + message thread (flex-1 right)
- Conversation list: avatar + name + last message preview + unread count badge
- Thread: chronological messages, sender avatar + timestamp
- Input: textarea auto-resize + send button + file attach icon
- No collapse — chats always full-panel

### Doctor Detail (`/doctors/$id`)
- Header: avatar + name + specialty + status badge + action buttons (Edit, Verify, Suspend)
- Tabs: Profile · Schedule · Appointments · Reviews
- Profile tab: bio, specializations, qualifications, chambers
- Schedule tab: weekly schedule per chamber (read-only view, edit via Edit action)
- Reviews tab: patient review list with star aggregate

### Hospital Detail (`/hospitals/$id/`)
- Header: cover image + name + type badge + status + actions
- Tabs: Overview · Team
- Team tab: doctors affiliated to this hospital, add/remove action

### Live Queue (`/doctor-live-queues`)
- Table of all active queues per doctor per day
- Queue row: doctor name + chamber + current serving serial + total serials + date
- Manual serial advance action (inline button: "Advance")
- Auto-refresh every 30s (TanStack Query `refetchInterval`)

---

## State Patterns

### Loading
- **Table skeleton:** TanStack Table renders 10 skeleton rows (animated pulse via `{components.skeleton}` visual spec from DESIGN.md) while query is pending.
- **Dialog form:** Submit button shows spinner + disabled state. Form fields remain editable during submission.
- **Page-level:** TanStack Router `pendingComponent` displays a topbar loading bar (thin primary-color progress bar).

### Empty States
All tables: centered icon (Lucide) + heading ("No [entities] found") + body text + primary CTA. When filters are active and result is empty: "No results match your filters" + "Clear Filters" button (secondary).

### Error States
- **API error on table load:** Inline error panel inside table area — icon + message + "Retry" button (triggers query refetch).
- **Mutation error:** Toast notification (top-right, `{colors.destructive}`, auto-dismiss 5s) + inline error below the relevant form field if field-specific.
- **Auth error (401):** Clerk intercepts — redirect to sign-in.
- **Permission error (403):** `/errors/403` page — "You don't have permission to view this. Contact your administrator."
- **Not found (404):** `/errors/404` page — "Page not found."
- **Server error (5xx):** `/errors/500` or `/errors/503` — with contact admin CTA.

### Success States
- Mutation success: toast top-right (`{colors.success}` variant), auto-dismiss 3s. Label: "[Entity] updated successfully."
- Bulk delete success: "X [entities] deleted."
- Create success: toast + optional redirect to new entity detail page.

### Destructive Confirm
All destructive operations use a named-entity confirm dialog before executing:
```
Title: "Delete Dr. Karim?"
Body: "This action cannot be undone. All associated data will be permanently removed."
Actions: [Cancel] [Delete] (destructive button)
```
Never auto-delete on first click.

---

## Interaction Primitives

### Navigation
- **Sidebar active state:** updates on route change. Deep routes highlight the parent item.
- **Breadcrumbs:** present on detail pages only (e.g., "Doctors / Dr. Rahman"). Clickable parent links.
- **Topbar:** fixed; main content scrolls beneath it.

### Command Palette (`⌘K` / `Ctrl+K`)
- Global search across all entities: doctors, hospitals, customers, appointments.
- Results grouped by entity type, keyboard navigable (arrow keys + Enter).
- Triggered from topbar search icon or keyboard shortcut.
- Implemented via shadcn `<Command>` component.

### Data Table Interactions
- **Sort:** click column header toggles asc → desc → unsorted. Sort state reflected in URL via TanStack Router search params.
- **Filter:** toolbar inputs filter client-side for small tables; query params for server-side filtered large tables.
- **Column visibility:** column selector dropdown (TanStack Table `columnVisibility`). Preference persisted in Zustand.
- **Row selection:** checkbox column. Shift-click for range selection. Bulk action bar appears.
- **Row click:** opens detail page (doctor, hospital) or detail drawer/dialog for read-only entities.
- **Row actions (hover):** three icon buttons — Edit (pencil), View (eye), Delete (trash). Icons use `{colors.muted-foreground}` at rest, `{colors.foreground}` on hover; destructive (trash) uses `{colors.destructive}` on hover.

### Forms
- All via React Hook Form + Zod
- Field-level validation triggers on blur; full form validates on submit
- `<Select>` for enum fields, `<Combobox>` for searchable FK lookups (doctors, hospitals, specialities)
- Date fields: calendar popover (`<Calendar>` from shadcn)
- Phone fields: BD country code (+880) prefix non-editable
- File upload: drag-and-drop zone (Multer backend) — shows filename + remove button post-upload

### Keyboard Shortcuts
| Shortcut | Action |
|----------|--------|
| `⌘K` / `Ctrl+K` | Open command palette |
| `Escape` | Close dialog / command palette |
| `↑↓` | Navigate command palette results |
| `Enter` | Select command palette result |
| `⌘Enter` / `Ctrl+Enter` | Submit form (in dialog) |

### Toasts
- Position: top-right, stacked (newest on top)
- Auto-dismiss: 3s (success), 5s (error)
- Max 3 simultaneous toasts visible
- Click-to-dismiss always available

---

## Accessibility Floor

*Visual contrast specifications live in [DESIGN.md](./DESIGN.md).*

- All interactive elements reachable by keyboard (Tab order matches visual reading order)
- Focus ring: `{colors.ring}` 2px outline, always visible on keyboard navigation
- All form inputs have associated `<label>` (not just placeholder text)
- Data tables: `<th scope="col">` on all headers; `aria-sort` on sorted columns
- Dialogs: focus trapped inside; restored on close; `aria-modal="true"` + `role="dialog"`; `aria-labelledby` pointing to dialog title
- Command palette: `role="combobox"` + `aria-expanded` + `aria-activedescendant` on search input
- Status badges: include text label alongside color — never color alone
- Destructive confirm dialogs: `aria-describedby` pointing to the consequence sentence
- Skip-to-main-content link as first focusable element on page
- Error messages linked via `aria-describedby` to their fields
- Sidebar collapse: `aria-expanded` on toggle button; `aria-label="Sidebar navigation"`

---

## Key Flows

### Flow 1: Nurul Verifies a New Doctor Registration

**Protagonist:** Nurul, platform ops coordinator. Desktop, Chrome. Monday morning triage.

1. Signs in via Clerk at `/clerk/(auth)/sign-in` → redirected to Dashboard
2. Dashboard stat card shows "12 Pending Verifications"
3. Navigates to /doctors via sidebar
4. Applies filter "Status: Pending" in toolbar → table shows 12 rows
5. Clicks Dr. Fahmida's row → opens `/doctors/$id` detail page
6. Reviews profile tab: qualifications, BMDC registration number, uploaded certificate
7. Clicks "Verify" button (primary) in page header
8. Named confirm dialog: "Verify Dr. Fahmida? She will be visible to patients immediately."
9. Confirms → API mutation → status badge flips to "Verified" → success toast
10. *(Climax beat)* Back button → doctor list → pending count now 11. Nurul opens Dr. Fahmida's record one more time and sees "Verified" in green — doctor is now live.

---

### Flow 2: Rahim Resolves a Stuck Ambulance Booking

**Protagonist:** Rahim, operations manager. Tablet landscape (1024px). Afternoon shift.

1. Navigates to /ambulance-bookings
2. Filters by "Status: Pending" + date range "Today"
3. Sees booking #AB-2041 stuck in Pending for 3 hours
4. Clicks Edit on that row → dialog opens
5. Changes status to "Cancelled" + adds internal note in "Admin Remarks" field
6. Submits → success toast "Booking AB-2041 updated"
7. *(Climax beat)* Rahim navigates to /chats, opens the patient's chat thread, sends a message: "Your ambulance request could not be fulfilled. We've refunded your amount."

---

### Flow 3: Shoma Manages the Live Doctor Queue

**Protagonist:** Shoma, clinic coordinator at a partnered hospital. She manages serial assignments live during the doctor's chamber.

1. Opens /doctor-live-queues
2. Sees Dr. Rahman's queue: Serial 14 serving, 6 remaining
3. Patient #14 wraps up — Shoma clicks "Advance" on the queue row
4. Serial updates to 15 → patients with the tracker link see the update within 30s (auto-refresh)
5. At day end, all serials served — Shoma marks queue "Closed"
6. *(Climax beat)* Queue closed. Dashboard stat "Active Queues: 3" drops to 2. Zero pending serials.

---

### Flow 4: Admin Kashem Adds a New Hospital

**Protagonist:** Kashem, platform admin. Desktop.

1. Navigates to /hospitals → table shows 47 hospitals
2. Clicks "Add Hospital" button (top-right)
3. Full-page form at /hospitals/new loads: Basic Info · Location · Services · Metadata
4. Fills name, type (government/private), address using BD Locations combobox, uploads cover image
5. Adds 3 affiliated specialities via multi-select combobox
6. Clicks "Create Hospital" in sticky footer
7. Success toast → redirect to `/hospitals/$newId/` detail page
8. *(Climax beat)* Kashem navigates to the Team tab → adds the first doctor to the hospital. Hospital is now discoverable on the patient-facing frontend.

---

## Responsive & Platform

### Desktop (≥ 1024px) — Primary
- Full sidebar (240px) + main content
- Data tables full-width within content area
- Dialogs centered (max-width 600px)
- All row actions visible on hover
- Command palette `⌘K`

### Tablet (768px–1023px) — Degraded Support
- Sidebar collapses to icon-only (48px) by default
- Tables still usable; some columns hidden via `columnVisibility` defaults
- Dialogs: 90vw
- Row hover actions replaced by always-visible icon buttons on touch

### Mobile (< 768px) — Not Supported
Admin panel is an internal ops tool. Mobile access is not designed for. If accessed, show a "Best viewed on desktop" banner. Core functionality remains technically accessible but layout is not optimized.

### Print
Not a target surface. No print stylesheets. Export actions (CSV download, PDF report) handle data extraction needs.
