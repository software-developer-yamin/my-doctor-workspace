# 📋 Changelog — My Doctor

> All notable changes to the **My Doctor** healthcare platform are documented in this file.
> Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and [Semantic Versioning](https://semver.org/).
>
> **Project Timeline:** April 6, 2026 → Present | **Active Development Days:** 16

---

## [2.3.0] — 2026-04-23

### Phase 8: Layout Stabilization & Overflow Resolution

Comprehensive UI/UX refinement pass — fixing layout overflows, standardizing interactive elements, and resolving responsive breakpoint issues across all booking flows and detail pages.

#### 🎨 UI Standardization

- **Unified Close Buttons:** Standardized all modal, drawer, sheet, and dialog close buttons with absolute positioning, `bg-primary/10` background, `Cancel01Icon` icon, hover scale (`hover:scale-110`), and active press animation (`active:scale-95`) for a cohesive premium feel across the entire application.
- **Booking Actions Dropdown:** Fixed `BookingActions` dropdown z-index and positioning across Ambulance, Diagnostic, Appointment, and Hospital Guide booking lists to prevent overlapping and clipping on mobile viewports.
- **Doctor Profile Overflow Fix:** Resolved content overflow in the "Expertise & Specializations" section of the doctor details page — items now wrap responsively within safe screen boundaries on all devices.
- **Drawer Layout Stability:** Eliminated background scaling jitters and phantom right-side gaps caused by drawer open states. Applied `body[data-scroll-locked] { overflow: unset !important; }` to prevent viewport shifts.
- **Booking Card Typography:** Standardized label colors, font sizes, and action button alignment across all patient booking pages (Ambulance, Diagnostic, Appointments, Guide).

#### 📱 Responsive Fixes

- **Booking List Grids:** Standardized responsive grid layouts across all booking lists — preventing text truncation and content clipping on small screens.
- **Hero Banner Height:** Increased mobile hero banner height to `aspect-[3/1]` on mobile for better visual prominence while maintaining `aspect-[3018/766]` on desktop.
- **Diagnostic Booking Form:** Fixed date/time column alignment in the "Book Test" form with responsive input sizing.
- **Tag Wrapping:** Enabled text wrapping for doctor tags and profile badges to prevent horizontal overflow.
- **Tab Margins:** Adjusted `TabsList` margins and reformatted `Badge` component spacing.

---

## [2.2.0] — 2026-04-22

### Phase 7: Modal & Navigation Overhaul

Complete redesign of modal interaction patterns and mobile navigation architecture for a unified, accessible experience.

#### 🔘 Modal Close Button Standardization

- Replaced inconsistent close button implementations across **all** modals and drawers:
  - `RescheduleDialog`, `AppointmentRescheduleDialog`, `DiagnosticProviderModal`
  - `BookingDrawer` (49KB+ complex booking flow)
  - `AmbulanceRequestForm`, `GuideBookingForm`, `DiagnosticBookingForm`
- Every close button now uses: absolute positioning at container root, `bg-primary/10` background, `Cancel01Icon` with consistent stroke width, and smooth hover/press animations.
- Updated branding colors to primary theme and refined booking drawer layout.

#### 📲 Mobile Bottom Navigation Redesign

- Redesigned mobile bottom nav from flat links to a **drawer-based architecture**:
  - Primary tabs: Home, Doctor, Hospital (always visible).
  - "More" drawer: Guide, Ambulance, Diagnostic, Profile/Login (overflow items).
  - Active state indicators with `bg-primary/10` pill backgrounds and `rounded-[14px]` containers.
  - Safe area inset support for notched devices: `pb-[env(safe-area-inset-bottom,0px)]`.
- Consolidated and reordered navigation items for logical grouping.
- Optimized re-render performance with `useMemo` for dynamic menu items.

#### 📞 Phone Input Standardization

- Created reusable `PhoneInput` UI component wrapping `react-phone-number-input`.
- Replaced all manual country code selection inputs across auth and contact forms.
- Default country set to `BD` (Bangladesh) with emoji-based country flags instead of image assets.

#### 🔧 Misc Fixes

- Reduced z-index of dialog overlay and content to `50` to prevent layer conflicts.
- Reformatted ambulance request form field layout.
- Refined hero section carousel dot sizing and spacing for improved responsiveness.
- Standardized form input heights, borders, and button styling in guide-booking-form.

---

## [2.1.0] — 2026-04-20

### Phase 6: Pagination, Search Polish & Content Pages

Server-side pagination, global search refinements, and the completion of all static content pages.

#### 📄 Server-Side Pagination

- Implemented **consistent server-side pagination** across all primary listing pages:
  - `/doctors`, `/hospitals`, `/ambulances`, `/diagnostics`, `/diagnostic-labs`, `/guides`, `/specializations`
- Custom `Pagination` component with simplified controls, responsive button labels, and reduced element sizes.
- Integrated search query parameters (`?q=`, `?page=`, `?type=`) with URL state sync.

#### 🏠 Home Page Enhancements

- **Service Carousel for Mobile:** Replaced static grid with swipeable carousel (`basis-1/2`) on small screens.
- **Section Visibility:** Conditionally hide specific home sections on mobile for cleaner scrolling experience.
- **Section Header Layout:** Updated section headers and shortened "View All" text.
- **Service Cards:** Updated titles, reordered hospital guide entry, and updated category image assets.
- **Search Cleanup:** Removed unused header search icons and search button; added bottom margin to search filter section.

#### 🔍 Search Refinements

- Fixed cascading renders warning in search filters.
- Updated specialization links to deep-link to `/doctors?q=` for instant filtered results.
- Reduced search filter popover height and removed redundant bottom padding.

#### 📞 Contact & Content Pages

- **About Us:** Modular page with refined company content and reusable `PageHeader` component.
- **Contact:** Unified contact page reusing home contact section with backend form integration.
- **Privacy Policy & Terms:** Replaced hardcoded contact info with centralized `SITE` config values.
- **Coming Soon:** Fixed `await searchParams` for Next.js 15 compatibility.

#### ⚙️ Configuration Updates

- **SITE Config Centralization:** Added `domain`, `website` fields; centralized all contact info via `SITE` config object.
- Updated site configuration information and footer content.
- Fixed logo and app section alignment; updated contact section.
- Updated images, changed favicon, and removed extra images from public folder.

#### 💊 Booking Enhancements

- **30-Minute Booking Slots:** Updated slot ranges and adjusted grid layout responsiveness.
- **Dynamic Fee Calculation:** Implemented consultation and follow-up fee calculation in the booking flow.
- **Ambulance Form:** Added form validation, responsive layout updates, label placeholder, and refactored round-trip checkbox layout.
- Reduced placeholder text opacity in input and select components.
- Increased dialog z-index and refactored diagnostic booking form for scrollable content with fixed-footer actions.
- Made diagnostic booking description responsive by hiding text on small screens.

---

## [2.0.0] — 2026-04-17

### Phase 5: Card Redesigns, Typography & Theme Standardization

Major visual overhaul with premium card redesigns, typography standardization across the entire application, and theme refinements.

#### 🎴 Premium Card Redesigns

- **Doctor Card:** Complete premium redesign with consistent styling and fixed impure function error.
- **Hospital Card:** Redesigned with premium UI consistency and dynamic data fixes.
- **Ambulance Card:** Standardized UI and unified usage across all pages.
- Standardized typography across all card components with utility script for bulk fixes.

#### ✍️ Typography Standardization

- Replaced `font-black` weights with `font-medium` and removed uppercase text transforms across doctor details components.
- Standardized font weights and sizes across booking drawer components.
- Standardized indentation and formatting across doctor details page components.
- Updated typography and font weights across hospital details page components for improved visual hierarchy.
- Auth pages UI refinement and noise cleaning.

#### 🎨 Theme & Color Overhaul

- Updated global CSS color palette to use pure black and white base values.
- Simplified color palette with neutral natural tones in `globals.css`.
- Applied secondary color to section backgrounds and footer with design system theme variations.
- Removed hardcoded layout colors for dynamic theme compatibility.

#### 🏗 Architecture Milestones

- **Diagnostics Module Modernization:** Refactored lab details and migrated middleware to proxy.
- Removed legacy agent skill definitions, workflow documentation files, and obsolete configuration files.
- Added Postman collection for My Doctor API endpoints.
- Removed unused stepper component from UI library.
- Refined ambulance request form UI and standardized input heights.
- Added branded default icon for specializations.

---

## [1.2.0] — 2026-04-16

### Phase 4: Discovery Engine & Premium Listings

Complete redesign of all listing and detail pages into premium responsive layouts with the doctor booking drawer.

#### 🏥 Premium Listing Redesigns

- **Grid Layouts:** Redesigned hospital, doctor, and ambulance listings into premium responsive grid layouts.
- **Grid Symmetry:** Standardized mapping limit to 12 items for grid symmetry.
- **Hospital Nurse List:** Redesigned with enhanced UI and search functionality.
- **Diagnostics Page:** Standardized layout with search filters and pagination.
- Cleanup of diagnostics and specialty handling.
- Added diagnostics to header navigation and search dropdown.

#### 👨‍⚕️ Doctor Profile Overhaul

- **DoctorHero Component:** New banner with credentials, ratings, and quick actions.
- **Multi-Step Booking Drawer:** Full appointment booking flow with clinic and home visit support.
- **Booking Success Screen:** Confirmation screen with metadata for doctor specializations.
- **Booking Drawer Utilities:** Refactored FAQ accordion to use UI component; implemented booking drawer utilities.
- Removed decorative container borders and separators from doctor profile sections.
- **Stepper Component:** New multi-step stepper with associated hooks and utilities.

#### 🏥 Hospital Profile Redesign

- Redesigned hospital profile tabs with enhanced UI components, icons, and layout animations.
- Renamed "Services" tab to "Specialities" and updated heading colors.
- Imported `Calendar01Icon` for hospital-doctor-card component.

#### 🏠 Home Page Standardization

- **Complete Home Page UI Overhaul:** Added carousels, new sections (Stats, Contact), refined footer, replaced placeholder images.
- **Active Doctors Section:** New section showcasing currently active doctors.
- **Hero Section:** Updated vertical spacing, bottom padding, and carousel styling.
- Reduced home sections gap and updated section backgrounds.
- Unified section headers, fixed footer/app text contrast, added WhatsApp support to contact section.

#### 🔍 Search Overhaul

- Debounced search, premium popover UI, and unified styling.
- Calendar icon import and whitespace cleanup in hospital-doctor-card.

---

## [1.1.0] — 2026-04-14

### Phase 3B: Backend Integration & API Architecture

Integration of backend services across all modules, URL query param syncing, and real-time data features.

#### 🔌 Backend Integration

- **Phase 4 Modules:** Complete end-to-end integration of Ambulance, Labs, and Diagnostics modules.
- **URL Query Param Syncing:** Implemented for all search and service pages with Suspense and performance optimizations.
- **Centralized Image Utility:** `getImageUrl` utility integrated with all major cards and detail pages.
- **Hospital Details Enhancement:** Added cover photo, social links, assigned doctors, and password visibility toggles.
- Removed accordion for mission/vision in hospital info tab.
- Updated doctor details endpoint to use public route.
- Commented out search maps from hospitals, doctors, nurses, and ambulances pages.

#### 🏥 Doctor Details Improvements

- **Clinic Booking Sidebar:** Multi-format time parsing and visual date availability indicators.
- **Real Hospital Chambers:** Injected from schedules into doctor details page; cleaned up `DoctorInfoCard` and adapter.
- **Locations Tab:** Dedicated tab with hospital cards and weekly schedules.
- Standardized headings to foreground and improved typography in doctor details tabs.
- **Appointment Booking Overhaul:** Complete redesign of the booking flow.

#### ⚙️ Infrastructure

- Completed ambulance and specialization integration with custom local assets.
- **Hero Carousel:** Replaced hero search with carousel; implemented auth state management with logout functionality.
- Fixed Hospitals page `Select` crash and configured backend image hostname.
- **Feature Guard System:** Implemented feature guard and coming-soon pages for upcoming services.
- Enhanced hospital search UX with improved filtering, loading states, and scroll-to-result navigation.
- Updated specialization card image handling.
- **Specialty Image Support:** Added image field to `BackendSpecialty` type and updated adapter for image mapping.

---

## [1.0.0] — 2026-04-12

### Phase 3: Core Backend Wiring & Authentication

The foundation for all backend-connected features — layered API architecture, authentication flow, and live data systems.

#### 🔐 Authentication System

- **Multi-Step OTP Auth:** Phone-first sign-in and sign-up with SMS-based OTP verification (Shothik AI).
- **Cookie Migration:** Migrated storage from `localStorage` to `cookies-next` with silent refresh token rotation.
- **JWT Persistence:** Token-based authentication with automatic refresh.

#### 🏗 4-Layer Architecture

- **Layered API Architecture:** Established `Types → Adapters → Services → Query Hooks` pattern starting with Hospital module.
- **Middleware Proxy System:** Migrated API communication to a centralized Next.js proxy for enhanced security and CORS resolution.
- **Zod-Backed Adapters:** Implementation of strict schema validation for all backend payloads to ensure frontend stability.
- **Doctor Module:** Full adapter, service, and query hook implementation with backend integration.
- **Appointment Core:** User identity and appointment transaction system.
- Updated development guidelines and structure documentation.

#### 📡 Live Data Systems

- **Doctor Live Queue Tracking:** Real-time wait-time calculation and current-serial status monitoring.
- **Specialized Care Workflows:** Hospital concierge service integration and home doctor visit flows.
- **Schedule Engine:** Real-time doctor schedule fetching from backend slot-management systems.

---

## [0.3.0] — 2026-04-09

### Phase 2: Patient Dashboard & Secondary Pages

Complete patient portal implementation, all secondary/legal pages, and the nurse module.

#### 🧑‍💼 Patient Dashboard

- **Dashboard Layout:** Premium patient dashboard with shadcn `Sidebar` component.
- **Sidebar Integration:** Responsive sidebar trigger with optimized provider structure.
- **Sidebar Header:** User info display with premium styling.
- **Profile Settings:** Complete profile settings with refined UI and icon fixes.
- **Feeling Journal:** Mental health tracking with modular architecture — `FeelingLogForm` and `FeelingHistoryTable`.
- **All Dashboard Pages:** Complete implementation of appointments, bookings, medical records, requests, referrals, carts — all with modular structure and premium UI.
- Refined typography to `font-bold` and resolved missing HugeIcons export errors.

#### 👩‍⚕️ Nurse Module

- **Nurse Listing:** Nurses page with cards and detail views.
- **Nurse Details:** Booking sidebar with home visit and hospital booking flows.
- **Nurse Search:** Added nurse type to search page results.
- **Hospital Integration:** Doctor and nurse lists in hospital details page.
- Reordered main nav links and added "Find Nurse" to header and footer.
- Reused search filter section in doctors, nurses, and hospitals pages without type dropdown.

#### 📑 Standard Pages

- **Theme Toggle:** Dark/Light/System toggle in header.
- **FAQ Page:** Accordion-based frequently asked questions.
- **Privacy Policy & Terms:** Complete legal pages.
- **Loading Page:** Updated loading skeleton.
- Footer typography standardization.

#### 🔧 Bug Fixes

- Fixed invalid HugeIcons in nurse-profile-tabs.
- Fixed theme: used `theme` instead of `resolvedTheme` for icon selection.
- Fixed theme: prevented synchronous state update in effect to resolve hydration mismatch error.
- Added navigation links to doctor and hospital cards.
- Enhanced hospital details page and refactored tab components.
- Simplified hospital info card and moved map to bottom.
- Refactored ambulance page layout and added ambulance-specific search filters.

---

## [0.2.0] — 2026-04-08

### Phase 1B: All Primary Pages & Components

Construction of every primary page and component — doctors, hospitals, ambulances, diagnostics, telemedicine, and the complete home page.

#### 🔍 Search & Discovery Pages

- **Advanced Search Page:** Filter section with exact category data, doctor card UI from HTML structure, robust search results.
- **Interactive Map:** React-Leaflet integration with OpenStreetMap tiles and Dhaka hospital markers.
- **Mobile Filter Toggles:** Responsive interactive map layout with mobile filter action toggles.
- **Hospital Search:** Extraction, hospital card UI, and mixed search result routing.
- Professional filter section alignment and theme-consistent colors.
- Fixed white borders, white input backgrounds, and consistent heights.

#### 🏥 Detail Pages

- **Doctor Details:** Complete UI components and layout.
- **Hospital Details:** Full UI with HugeIcons integration.
- **Diagnostic Tests:** Full page UI and components.
- **Telemedicine Details:** Page implementation with unified doctor data types.

#### 📄 Service Pages

- **Health Checkup & Insurance:** Sidebar filters and responsive card grid.
- **Diagnostic Home Services:** Test cards and floating cart.
- **Ambulance Page:** Types, cards, and responsive request form with country code dropdown.
- **Specializations Page:** Search, fixed ambulance card href, sliced home page sections.
- **Telemedicine Page:** Implementation with external image loading fixes and reference card designs.
- **Doctors & Hospitals Pages:** Split layout with image loading fixes.

#### 🦶 Footer

- Implemented main application footer component and layout integration.

#### 🏠 Home Page Sections (Complete)

- **Specialization Section:** Implemented with HugeIcons migration and image rendering fixes.
- **Primary Care CTA:** Home-centric call-to-action section.
- **Emergency Ambulance:** Services section with infographics.
- **Diagnostic Care:** 6 diagnostic categories section.
- **Dual CTA:** Reusable CTA components.
- **Testimonials:** Embla-based carousel with custom dots.
- **News & Events:** Tabbed interface section.
- **Partners:** Responsive grid with hover effects.
- **Expert Advice:** Callback section with restored imports.
- **FAQ:** shadcn accordion with 2-column redesign and premium support illustration.
- **Inbound Services:** Bottom section.
- **App Download:** Section with remote image fixes.

#### 🐛 Bug Fixes

- Fixed remote image hostname errors and app download UI alignment.
- Restored home page section order.
- Fixed hospital card mobile responsive layout (flex-row parity with doctor card).
- Removed hardcoded layout colors for dynamic theme compatibility.
- Replaced inline mock map SVG with standard HugeIcons location placeholder.
- Rewrote `DoctorCard` and `HospitalCard` to match reference HTML structure precisely.
- Removed duplicate "View More" button on hospital cards.
- Refactored header and filter section imports and class formatting.
- Fixed invalid HugeIcons in ambulance page.
- Resolved build error with `AMBULANCE_TYPES` import.
- Disabled unescaped entities lint rule and warned on unused vars.
- Closed JSX bracket in header search panel.
- Fixed spinner type error for production build.
- Awaited Next 15+ dynamic route params.
- Fixed top header nav link.

#### ⚙️ Premium Standard Pages

- **Loading Page:** Branded skeleton loading state.
- **404 Page:** Custom not-found page with branded styling.
- **Error Page:** Error boundary with retry functionality.
- **Maintenance Page:** Service maintenance notification page.

---

## [0.1.0] — 2026-04-06

### Phase 1A: Project Genesis & Design System

From `create-next-app` to a fully functional design system with header, hero section, and foundational architecture.

#### 🏗 Project Initialization

- **Next.js App:** Created from `create-next-app` with App Router.
- **shadcn/ui Setup:** Installed with Tailwind CSS v4 and Prettier configuration.
- **shadcn Components:** Bulk installation of UI component library.
- **State Management:** Set up Redux Toolkit and TanStack React Query with project naming standards.

#### 🎨 Design System — OKLCH

- **OKLCH Color Palette:** Established design system with OKLCH color tokens for perceptually uniform colors.
- **Dark/Light Mode:** Semantic color variables for both themes.
- **Glassmorphism System:** Implemented backdrop-blur overlays for global search, dropdowns, and sticky headers.
- **Dynamic Header Blur:** Implemented scroll-triggered backdrop filtering for the primary navigation bar.
- **Gradient Utilities:** `bg-primary-linear`, `bg-secondary-linear`, `bg-tertiary-linear`, `bg-accent-linear`.
- **Shadow System:** Color-mixed branded shadows using `color-mix(in oklch, ...)`.
- **Custom CSS Utilities:** `@utility` directives for theme scoping: `primary`, `secondary`, `tertiary`, `accent`.
- **Custom Animations:** Staggered `fade-in-up`, `slide-in-up`, `zoom-in`, and `pulse-subtle` micro-interactions.
- **Standardized Design System Documentation:** Theme standards and UI development workflow.

#### 🧭 Header & Navigation

- **Responsive Header:** Integrated search bar based on reference patterns.
- **Premium Header:** Post-login state, user dropdown, and refined UI.
- **Header Optimization:** Dark/light mode with semantic colors and glassmorphism.

#### 🏠 Hero Section

- **Hero Section:** Dynamic service cards following OKLCH design system.
- **Home Page Sections:** Reorganized following Page-Specific Component pattern.

#### 🖼 Branding

- **Brand Logo:** Designed and implemented new "My Doctor" brand logo.
- **HugeIcons Migration:** Complete migration from Lucide to HugeIcons icon library.

#### 📐 Architecture Decisions

- Established pure data management laws and refined header login logic.
- Documented UI development workflow based on reference patterns.

---

## ⏳ Roadmap — Coming Soon

| Feature | Description | Target |
|---------|-------------|--------|
| 🤖 **AI Triage** | Symptom checking via LLM to suggest appropriate specialists | `Planned` |
| 📄 **Medical Report AI** | Automated PDF report parsing to extract health metrics | `Planned` |
| 💊 **Online Pharmacy** | Prescription-based medicine ordering and fulfillment | `In Design` |
| 👩‍⚕️ **Nursing Services** | Certified nursing services with updated medical database | `May 2026` |
| 🏠 **Home Diagnostics** | Mobile phlebotomist network for doorstep lab services | `Planned` |
| 🩺 **Health Checkup Packages** | Curated family health packages with partner hospitals | `Planned` |
| 🏥 **Domiciliary Care** | Professional residential healthcare services | `In QA` |
| 🎁 **Healthcare Offers** | Seasonal promotions and healthcare bundles | `Planned` |

---

## 📊 Platform Statistics

| Metric | Count |
|--------|-------|
| Total Commits | 200+ commits |
| Pull Requests | 48 merged PRs |
| Development Days | 16 active days |
| App Routes | 42 pages |
| React Components | 164 components |
| UI Components (shadcn) | 57 components |
| Service Modules | 14 API services |
| Data Adapters | 8 adapters |
| Type Definitions | 16 type files |
| Query Hooks | 14 hooks |
| Static Data Files | 37 data files |
| Card Components | 20 card variants |
| Home Sections | 12 sections |
| Feature Flags | 17 features (10 active) |

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16.2.2 (App Router) |
| UI Library | React 19.2.4 |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 + OKLCH Design Tokens |
| Components | shadcn/ui 4.1.2 + Radix UI 1.4.3 |
| State (Client) | Redux Toolkit + React Redux |
| State (Server) | TanStack React Query v5 |
| HTTP Client | Axios + Middleware Proxy |
| Validation | Zod |
| Forms | React Hook Form |
| Maps | React Leaflet + Leaflet |
| Carousel | Embla Carousel + Autoplay |
| Icons | HugeIcons |
| Charts | Recharts 3.8.0 |
| Auth | OTP (Shothik AI) + JWT + cookies-next |
| Theme | next-themes (Dark/Light/System) |
| Notifications | Sonner |
| Package Manager | pnpm |
| Deployment | PM2 (ecosystem.config.cjs) |
| Code Quality | ESLint 9 + Prettier |

---

*Maintained by the My Doctor Development Team — SmartEchEdge*
*Last updated: April 23, 2026*
