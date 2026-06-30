---
title: My Doctor – Experience Design
project: my-doctor-workspace
date: 2026-06-25
status: final
updated: 2026-06-25
version: 1.0.0
design-ref: ./DESIGN.md
---

## Foundation

**Platform:** Web (Next.js App Router, SSR). Mobile-first responsive. Native mobile app exists (separate repo) — this document covers the web frontend only.

**UI System:** shadcn/ui (Radix UI primitives) + Tailwind CSS 4.x. Visual identity delegated to [DESIGN.md](./DESIGN.md). This document specifies behavioral delta only.

**User types:**
1. **Patient** — authenticated via OTP + JWT. Accesses public site + patient dashboard.
2. **Doctor** — authenticated via JWT (email/password). Accesses doctor dashboard.
3. **Admin** — authenticated via Clerk. Accesses admin panel (separate SPA).
4. **Guest** — unauthenticated. Full public site access, no dashboard.

**Auth boundaries:**
- Patient token cookie key: `CONSTANT.LOCAL_STORAGE_KEYS.AUTH_TOKEN`
- Doctor token: same key, different role claim
- Admin: Clerk session (admin SPA, `my_doctor_backend/public/`)
- Never mix token systems

---

## Information Architecture

### Public Site (`/`)

```
Home
├── Hero (search bar — doctors/specializations/hospitals/location)
├── Stats bar (hidden mobile)
├── Specializations grid
├── Active Doctors carousel
├── Ambulance CTA section
├── Diagnostics section
├── How It Works
├── Testimonials
├── Trust signals
├── App download CTA
├── Contact section
├── News / Blog preview
└── FAQs accordion

Doctors (/doctors)
└── Doctor Profile (/doctors/[slug])

Hospitals (/hospitals)
└── Hospital Details (/hospitals/[slug])

Diagnostics (/diagnostics)

Specializations (/specializations)

Ambulances (/ambulances)

Telemedicine (/telemedicine)
└── Session (/telemedicine/[slug])

Nurses (/nurses)
└── Nurse Profile (/nurses/[slug])

Guides (/guides)

Health Checkup Services (/health-checkup-services)

Domiciliary Services (/domiciliary-services)

Pharmacy (/pharmacy)

Offers (/offers)

Blogs (/blogs)
└── Blog Post (/blogs/[slug])

Search (/search)

About (/about)
Careers (/careers)
Partners (/partners)
Press (/press)
Contact (/contact)
FAQ (/faq)

Appointment Tracker (/tracker/[appointmentId])  — public live status
```

### Auth (`/(auth)`)
```
Sign In (/sign-in)               — Patient OTP login
Doctor Sign In (/doctor-sign-in) — Doctor email/password login
Sign Up (/sign-up)               — Patient registration
Forgot Password (/forgot-password)
Onboarding (/onboarding)         — Post-registration profile setup
```

### Patient Dashboard (`/patient/*`)
```
Dashboard home (redirects to appointments)
Appointments (/patient/appointments)
Diagnostic Bookings (/patient/diagnostic-bookings)
Ambulance Bookings (/patient/ambulance-bookings)
Guide Bookings (/patient/guide-bookings)
Medical Records (/patient/medical-records)
Feeling Journal (/patient/feeling-journal)
My Requests (/patient/my-requests)
My Service Cart (/patient/my-service-cart)
My Shopping Cart (/patient/my-shopping-cart)
Refer a Friend (/patient/refer-a-friend)
Profile Settings (/patient/profile-settings)
```

### Doctor Dashboard (`/doctor/*`)
```
Dashboard Home (/doctor)
Appointments (/doctor/appointments)
Bookings (/doctor/bookings)
Profile (/doctor/profile)
```

### Admin Panel (`/` on admin SPA)
Separate Vite SPA. Out of scope for this document.

---

## Voice and Tone

*Brand voice lives in [DESIGN.md § Brand & Style](./DESIGN.md).*

**Microcopy principles:**
- CTAs: verb-first, outcome-specific. "Book Appointment" not "Submit". "Find Doctors" not "Search".
- Error messages: cause + fix. "OTP expired. Request a new one." not "Invalid OTP."
- Empty states: acknowledge + suggest action. "No appointments yet. Book your first one."
- Loading: never show raw "Loading…" — show skeleton or contextual spinner with label ("Finding doctors…").
- Booking confirmation: immediate, celebratory but calm. "Appointment confirmed for [date] at [time]."
- Wait time in queue: show estimated minutes, not just serial position.
- Bengali toggle: all user-visible strings support Bengali via next-intl [ASSUMPTION — i18n not confirmed in codebase].

---

## Component Patterns

*Visual specifications (sizes, colors, radius) live in [DESIGN.md § Components](./DESIGN.md).*

### Search Bar
- Prominent on Hero and /search pages
- Four search dimensions: doctor name, specialty, hospital, location (BD districts)
- Auto-suggest dropdown as user types (≥2 chars)
- Filters collapse into sheet on mobile
- URL-reflected state via `nuqs` — shareable filtered URLs

### Doctor Listing
- Grid: 1-col (mobile) → 2-col (tablet) → 3-col (desktop)
- Filter sidebar: specialty, location, availability, consultation fee range, gender
- Mobile: filters in bottom sheet triggered by Filter button
- Skeleton: 6 cards on initial load
- Pagination: load-more or cursor-based (not page numbers) [ASSUMPTION]
- Sort: By Relevance (default), By Fee, By Rating, By Availability

### Doctor Profile Page (`/doctors/[slug]`)
Tabs: Overview · Chambers & Schedule · Reviews · [ASSUMPTION: similar to hospital detail tabs observed in codebase]

- **Overview:** Bio, specializations, qualifications, experience, languages
- **Chambers & Schedule:** Location cards with map, weekly schedule per chamber, Book button per time slot
- **Reviews:** Patient reviews with star rating aggregate

### Hospital Details Page (`/hospitals/[slug]`)
- Cover image + info header
- Tabs: About · Doctors · Services · Location
- Active doctors in horizontal scroll carousel
- Map integration (Leaflet)

### Booking Flow (Appointment)
1. Select Chamber (if doctor has multiple)
2. Select Date from weekly schedule
3. Select Time Slot
4. Confirm patient details
5. Payment (if applicable)
6. Confirmation screen with serial number + tracker link

Steps presented in a stepped modal or dedicated page [ASSUMPTION: modal on desktop, page on mobile].

### Live Queue Tracker (`/tracker/[appointmentId]`)
- Public (no auth required) — shareable link
- Shows current serving serial, patient's serial, estimated wait
- Auto-refreshes every 30s [ASSUMPTION: WebSocket or polling]
- `LiveSerialBanner` component with primary green pill

### Patient Dashboard Layout
- Left sidebar (desktop) / bottom nav (mobile)
- Sidebar items: Appointments, Diagnostics, Ambulance, Guides, Medical Records, Feeling Journal, Requests, Service Cart, Shopping Cart, Refer a Friend, Profile Settings
- Dashboard root redirects to `/patient/appointments`

### Doctor Dashboard Layout
- Simplified sidebar: Home, Appointments, Bookings, Profile
- Stats cards on home: today's appointments, pending, completed
- Appointment queue management with serial assignment

### Medical Records
- List view with filter by date/type
- Each record: action dropdown (View, Download)
- PDF viewer in modal or new tab
- Upload action for patient-submitted records

### Feeling Journal
- Daily mood log — emoji scale + optional note
- Calendar heatmap view
- Trends chart (Recharts) [ASSUMPTION: line chart over time]

### AI Triage (observed in components/app-patient/ai-triage)
- Symptom checker flow
- Step-by-step questions
- Recommendation: See a doctor / Home care / Emergency
- Does NOT replace doctor advice — disclaimer always shown

### Ambulance Service
- Request form: pickup location (map pin), type (emergency/non-emergency), contact
- Live tracking of ambulance [ASSUMPTION]
- Booking history in patient dashboard

---

## State Patterns

### Loading
- **Skeleton-first:** Every list, card grid, and detail page renders Phantom UI skeletons before data arrives. Never show blank white space.
- **Inline spinner:** Form submissions, button actions (append spinner to button, disable button).
- **Page-level:** `loading.tsx` in Next.js App Router provides route-level skeleton.

### Empty States
Every empty state has: icon + heading + body text + primary CTA.

| Context | CTA |
|---------|-----|
| No appointments | "Book Appointment" |
| No medical records | "Upload Record" |
| No doctors in search | "Clear Filters" |
| No results | "Try a different search" |

### Error States
- API errors: toast notification (top-right, auto-dismiss 5s) + inline error message near relevant component
- Form validation: inline below field, on blur + on submit
- 404 page: custom `not-found.tsx`
- Unhandled errors: `error.tsx` with "Try again" button

### Authentication States
- Guest attempting protected route → redirect to `/sign-in` with `?redirect=` param
- Token expired mid-session → silent refresh via `src/lib/api.ts` interceptor → retry original request
- Refresh fails → clear auth state → redirect to sign-in with message "Session expired"
- Doctor accessing patient route → redirect to `/doctor` dashboard (and vice versa)

### Success States
- Booking confirmed: success dialog with appointment details + share/add-to-calendar actions
- Profile updated: inline toast
- OTP verified: animate transition to next step

---

## Interaction Primitives

### Navigation
- **Header (public):** Sticky on scroll (adds shadow). Mobile: hamburger → Sheet from left. Auth state shown in header (avatar + dropdown or Sign In / Sign Up buttons).
- **Dashboard sidebar:** Collapsible on desktop (icon-only mode). Non-collapsible drawer on mobile (triggered by hamburger).
- **Active state:** Primary green fill on active nav item.
- **Breadcrumbs:** On detail pages (Doctor Profile, Hospital Details). Not on dashboard.

### Carousels
Embla Carousel + autoplay. Touch-draggable on mobile. Arrow nav on desktop. Dot indicators for promotional sections; none for doctor/hospital carousels (scroll affordance only).

### Modals & Drawers
- Desktop: Dialog (centered modal). Mobile: Drawer (bottom sheet, `slide-in-up` animation).
- Dismiss: Escape key, backdrop click, explicit close button.
- Booking flow modal: prevents backdrop dismiss to avoid accidental loss.

### Forms
- React Hook Form + Zod validation
- Validation triggers: on blur (field-level) + on submit (full)
- OTP input: 6-cell auto-advance input
- Phone number: country code prefix (+880 default for BD)
- Date picker: calendar popover, disables past dates for bookings
- File upload: drag-and-drop zone + click-to-browse. Shows preview for images, filename for docs.

### Filters
- Desktop: sidebar with instant-apply checkboxes + sliders
- Mobile: bottom sheet with Apply / Reset buttons
- Active filter count shown on Filter button badge
- URL-synced via `nuqs`

### Infinite / Paginated Lists
- Doctor and hospital listings: load more button (not infinite scroll auto-trigger — prevents accidental navigation loss)
- Patient dashboard lists: paginated table with page controls

### Maps
- Leaflet + react-leaflet
- Hospital/doctor location pins
- Ambulance pickup: interactive pin placement
- Cluster markers when many pins overlap

### Tooltips & Popovers
- Rating breakdown on hover of star rating
- Fee breakdown on hover of consultation fee
- Availability calendar popover on weekly schedule

---

## Accessibility Floor

*Visual contrast specifications live in [DESIGN.md](./DESIGN.md).*

- All interactive elements reachable by keyboard (Tab order matches visual order)
- Focus ring: `{colors.ring}` 2px outline, always visible (no `outline: none` without replacement)
- Skip-to-content link as first focusable element on all pages
- All form inputs have associated `<label>` (not just placeholder)
- Images: meaningful `alt` text; decorative images `alt=""`
- Modals/Dialogs: focus trapped inside; restore focus on close; `aria-modal="true"` + `role="dialog"`
- Status badges: don't rely on color alone — include text label ("Confirmed" not just green dot)
- Doctor availability: "Available" / "Unavailable" text alongside color indicator
- Error messages linked to inputs via `aria-describedby`
- Skeleton loaders: `aria-busy="true"` on container; `aria-label="Loading [content type]"`
- Touch targets: minimum 44×44px on mobile

---

## Mockups

> Spines win on conflict. Mockups illustrate; spine tables are the contract.

| Surface | File | Spine sections |
|---------|------|----------------|
| Home Hero + Search | [mockups/key-home-hero.html](mockups/key-home-hero.html) | IA § Home, Component Patterns § Search Bar, Key Flow 1 steps 1–2, Responsive § Desktop |
| Doctor Listing | [mockups/key-doctor-listing.html](mockups/key-doctor-listing.html) | Component Patterns § Doctor Listing + Filters, State Patterns § Loading (skeleton row), Key Flow 1 steps 3–5 |
| Booking Flow | [mockups/key-booking-flow.html](mockups/key-booking-flow.html) | Component Patterns § Booking Flow steps 2–3–5, State Patterns § Success, Interaction § Modals, Key Flow 1 steps 6–10 |
| Patient Dashboard | [mockups/key-patient-dashboard.html](mockups/key-patient-dashboard.html) | IA § Patient Dashboard, Component Patterns § Appointment Card + Live Serial Banner, Interaction § Navigation § sidebar, Key Flows 1 step 10 + Flow 4 |

---

## Key Flows

### Flow 1: Rahima Books a Doctor Appointment

**Protagonist:** Rahima, 34, mother of two in Narsingdi. Kids have a fever. Using My Doctor on mobile Chrome.

1. Opens mydoctor.com.bd on phone → Hero section loads with search bar
2. Types "pediatrician" in search bar → auto-suggest shows specialization + top doctors
3. Taps "Pediatrician" specialization → filtered doctor list loads (skeleton → cards)
4. Applies "Narsingdi" location filter via bottom sheet → list narrows to 3 doctors
5. Taps Dr. Karim's card → Doctor Profile opens
6. Taps "Chambers & Schedule" tab → sees chamber in Narsingdi, tomorrow's slots shown
7. Taps 10:30 AM slot → booking flow opens as bottom drawer
8. Reviews patient details (pre-filled from auth state) → Confirms
9. OTP sent to phone → enters 6-digit code → **Appointment confirmed**
10. Sees serial #12, estimated wait ~45 min — tracker link shown
11. *(Climax beat)* On appointment day, Rahima opens tracker link — sees serial #8 being called. She's next. She walks in without waiting in line.

---

### Flow 2: Dr. Ahmed Manages His Day

**Protagonist:** Dr. Ahmed, cardiologist, joins from doctor sign-in on desktop.

1. Signs in at /doctor-sign-in → redirected to /doctor dashboard
2. Sees today's stats: 14 appointments, 3 pending, 8 completed
3. Opens /doctor/appointments → queue list sorted by serial
4. Marks patient #9 as "Seen" → serial advances → patient's tracker updates in real-time
5. Opens appointment #11 → writes prescription via Prescription Writer
6. Prescription saved → PDF generated (Puppeteer backend) → patient can download from Medical Records
7. *(Climax beat)* End of day: Dr. Ahmed sees 0 pending appointments. Queue closed. Stats show 14/14 completed.

---

### Flow 3: Farhan Requests an Ambulance

**Protagonist:** Farhan, 28, in Dhaka. Father collapsed. Panicked. On mobile.

1. Opens My Doctor → sees Ambulance section prominently on homepage
2. Taps "Book Ambulance" → form opens (emergency type pre-selected)
3. Taps "Use my location" → GPS pin placed on map
4. Enters contact number → Submit
5. *(Climax beat)* Confirmation screen: "Ambulance dispatched. ETA ~12 min." Driver contact shown. Live tracking link shared to WhatsApp.

---

### Flow 4: Shirin Reviews Her Medical History

**Protagonist:** Shirin, 52, diabetes patient. Monthly lab reports.

1. Signs in as patient → navigates to Medical Records in sidebar
2. Sees chronological list of records — skeletons → then table
3. Finds March 2026 HbA1c report → taps action dropdown → "View"
4. PDF opens in modal viewer
5. Taps "Download" → file saves to phone
6. *(Climax beat)* Shirin shares the PDF link with her new doctor during telemedicine call without leaving the platform.

---

## Responsive & Platform

### Mobile (< 640px)
- Single-column layouts throughout
- Bottom nav for dashboard (5 primary icons, "More" sheet for secondary)
- Filters in bottom sheet, not sidebar
- Carousels replace grids for doctor/hospital listings
- Hero search bar full-width, stacked inputs
- Modals become bottom drawers (slide-in-up)
- Tables become card stacks (no horizontal scroll tables on mobile)

### Tablet (640px – 1024px)
- 2-column grids for cards
- Sidebar collapses to icon-only or hidden
- Filter sidebar still usable at 768px+
- Horizontal scroll carousels for long lists

### Desktop (≥ 1024px)
- Full 3-column grids
- Expanded sidebar (260px)
- Sticky filter sidebar on listing pages
- Dialog modals (not drawers)
- Hover states on all interactive elements

### Print
- Appointment confirmation: print-friendly layout (no nav, no sidebar, clean typography)
- Prescription PDF: generated server-side by Puppeteer — not CSS print styles

### Accessibility on Touch
- Touch targets minimum 44×44px
- Swipe gestures on carousels (Embla)
- Pinch-zoom not suppressed on any page
