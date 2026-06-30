# My Doctor — Software Requirements Specification & Product Requirements Document

**Version:** 1.0  
**Date:** 2026-06-20  
**Source:** Screenshot analysis of 25 pages (desktop + mobile)  
**Platform:** Bangladesh healthcare discovery & booking platform

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Identified Features](#2-identified-features)
3. [Screen-by-Screen Analysis](#3-screen-by-screen-analysis)
4. [User Flows](#4-user-flows)
5. [Business Rules](#5-business-rules)
6. [Database Requirements](#6-database-requirements)
7. [API Requirements](#7-api-requirements)
8. [Roles & Permissions](#8-roles--permissions)
9. [Non-Functional Requirements](#9-non-functional-requirements)
10. [UX Analysis](#10-ux-analysis)
11. [Missing Screens](#11-missing-screens)
12. [Assumptions](#12-assumptions)

---

## 1. Project Overview

**My Doctor** (আপনার বিশ্বস্ত সহায়তী — "Your Trusted Assistant") is a Bangladesh-focused digital healthcare platform that connects patients with doctors, hospitals, ambulance services, and diagnostic labs. The platform supports discovery, appointment booking, online consultation, ambulance dispatch, diagnostic test booking, and personal health record management.

**Core Value Proposition:** "Your trusted healthcare partner in Bangladesh. Quality medical care, anytime, anywhere."

**Target Geography:** Bangladesh (initially Narsingdi, Dhaka district)

**Languages:** Bilingual — Bangla (বাংলা) and English

**Platforms:** Responsive web (desktop + mobile) with a mobile-first design

---

## 2. Identified Features

### Feature Status Legend
- **[C]** Confirmed — directly visible in screenshots
- **[I]** Inferred — high confidence from UI patterns
- **[A]** Assumed — requires validation

---

### Feature 1: Global Search [C]

**Description:** Universal search bar appearing on all listing pages allowing users to search for hospitals, clinics, doctors, and services.

**Business Purpose:** Primary discovery mechanism; reduces bounce rate by surfacing relevant results immediately.

**User Goal:** Find any healthcare resource by name, type, or keyword.

**User Flow:**
1. User lands on any page (Hospitals, Doctors, Diagnostics, Ambulance)
2. Types query in search bar placeholder "Search hospitals, clinics, services..." or "Search ambulances by name, service or area..."
3. Results filter in real time or on submit
4. User selects result

**Inputs:** Free-text string

**Outputs:** Filtered listing matching query

**Validation Rules:** Minimum 2 characters before triggering search [I]

**Edge Cases:**
- No results → "No results found" empty state [A]
- Special characters in input → sanitize [I]

**Success Criteria:** Results appear within 300ms of keystroke for cached queries; 1s for new queries.

---

### Feature 2: Location-Based Filtering [C]

**Description:** Location selector showing current city/district (e.g., "Narsingdi, Dhaka") that scopes all listing results to the selected area.

**Business Purpose:** Ensures results are geographically relevant; reduces irrelevant listings.

**User Goal:** Find healthcare resources near their location.

**User Flow:**
1. Platform detects or defaults to a city (Narsingdi, Dhaka shown)
2. Location displayed as pill/tag on listing pages
3. User can tap/click to change location [I]
4. All results refresh based on new location

**Inputs:** City/District selection (dropdown or map picker) [I]

**Outputs:** Location-scoped search results

**Validation Rules:** Must be a valid BD administrative unit

**Edge Cases:**
- No GPS permission → default to last known city or prompt manual entry
- Unknown city → show closest match

**Success Criteria:** Location change refreshes results in < 500ms.

---

### Feature 3: Doctor Discovery & Listing [C]

**Description:** Paginated, filterable, sortable grid of doctors with key info cards.

**Business Purpose:** Core acquisition feature; drives appointment bookings.

**User Goal:** Find and compare doctors by specialty, availability, fee, and visit type.

**User Flow:**
1. User navigates to Doctors section (top nav or bottom nav mobile)
2. Views paginated grid (2-column desktop, 1-column mobile)
3. Applies filters via left sidebar (desktop) or filter sheet (mobile)
4. Reviews doctor cards
5. Clicks "View Profile" or "Book Appointment"

**Inputs:**
- Specialty filter (dropdown)
- Gender filter (All / Male / Female)
- Visit Type (All / In-person / Video Consultation)
- Visiting Hours (checkboxes: morning / afternoon / evening)
- Quick filter chips: All, 24/7 Open, Emergency, ICU Available, Online Booking

**Outputs:** Filtered doctor list with pagination

**Doctor Card Data:**
- Profile photo
- Academic title (e.g., Assistant Professor)
- Full name
- Specialty
- Location + rating/review count
- Consultation type badges (Video Consultation, Chamber Visit)
- Hospital affiliations with fees (e.g., ৳700, ৳100)
- Active/Available status badge
- View Profile CTA (secondary)
- Book Appointment CTA (primary)

**Validation Rules:** Fees must be numeric + BDT currency [I]

**Edge Cases:**
- No doctors match filter → empty state with "clear filters" option [A]
- Doctor has no photo → avatar placeholder

**Success Criteria:** Filters apply within 500ms; pagination loads next page < 1s.

**User Stories:**

> As a patient, I want to filter doctors by specialty so that I only see relevant specialists.
> Acceptance Criteria: Specialty dropdown shows all available specialties; selecting one refreshes results immediately.

> As a patient, I want to see whether a doctor offers video consultation so that I can book without traveling.
> Acceptance Criteria: "Video Consultation" badge visible on card; filter by visit type works correctly.

> As a patient, I want to see doctor fees on the listing so that I can compare cost before clicking through.
> Acceptance Criteria: Fee displayed per hospital affiliation on the card; shows "৳[amount]" format.

---

### Feature 4: Doctor Profile — Overview [C]

**Description:** Full doctor detail page with biography, stats, specializations, education, real-time serial status, appointment booking, and patient reviews.

**Business Purpose:** Conversion page; turns browser into appointment booking.

**User Goal:** Evaluate a doctor fully and book an appointment or call.

**User Flow:**
1. From listing → click View Profile
2. View doctor header: photo, name, credentials, BMDC verification, department
3. View stats: rating, patients treated, experience years, positive reviews %
4. Switch tabs: Overview | Chamber Info
5. Read About section, Expertise tags, Education
6. Check Today's Serial Status (available slots, wait time)
7. View Appointment Info panel (fee, type, slots, duration)
8. View Chamber Schedule grid (weekly, slot availability by day/time)
9. Read Patient Reviews
10. Click Book Appointment

**Data Displayed:**
- Doctor photo
- Full name (Bengali + English)
- Credentials string (degree list)
- BMDC Verified badge
- Department / Specialty (e.g., Gynecology & Obstetrics)
- BMDC Reg. No. (e.g., D-821158)
- Patient Rating (e.g., 4.8/5.0)
- Patients Treated (e.g., 3000+)
- Experience (e.g., 12+ Years)
- Positive Reviews % (e.g., 98%)
- About text (Bengali)
- Expertise & Specializations (tag pills)
- Education & Training (bullet list)
- Today's Serial Status: next session, visiting type, estimated wait, emergency priority flag
- Appointment Info: consultation fee (৳800), type selector (Chamber/Online), slots available today, serial duration, average waiting time
- Chamber Schedule: weekly grid with day columns, time slots, status (Available/Booked/Unavailable)
- Patient Reviews (cards with name, date, text, star rating, "Connect" link)

**Validation Rules:**
- BMDC Reg. No must be verified against BMDC database [I]
- Consultation fee must be > 0

**Edge Cases:**
- No slots today → "No slots available today" with next available date
- No reviews yet → placeholder text

**Success Criteria:** Profile loads < 2s; booking CTA always visible (sticky on mobile).

**User Stories:**

> As a patient, I want to see a doctor's BMDC registration so that I can confirm they are licensed.
> Acceptance Criteria: BMDC Verified badge shown; clicking it reveals registration number.

> As a patient, I want to see today's serial status so that I know current wait time before going.
> Acceptance Criteria: "Today's Serial Status" section shows: next available session time, type, estimated wait in minutes.

> As a patient, I want to view the weekly chamber schedule so that I can pick the best day to visit.
> Acceptance Criteria: Grid shows Mon–Fri (or Sat–Thu) with time slots color-coded Available/Booked/Unavailable.

---

### Feature 5: Doctor Profile — Chamber Info Tab [C]

**Description:** Lists all chambers/hospitals where the doctor practices with location, contact, availability, and booking per chamber.

**Business Purpose:** Enables patient to choose most convenient physical location for visit.

**User Goal:** Find which chamber to visit based on location, timing, and availability.

**User Flow:**
1. On Doctor Profile → click "Chamber Info" tab
2. View summary stats: Total Chambers, Nearest Chamber, Nearest Available time, Status
3. Scroll through chamber cards
4. Each card shows: hospital name, location, address, phone, email
5. Each card shows: today's availability, weekly schedule grid (color dots per day)
6. Click "Book Appointment" or "Call Chamber" per card

**Data Displayed per Chamber Card:**
- Hospital logo/icon
- Hospital name (e.g., Green Life Medical College & Hospital)
- District/upazila
- Full address
- Phone number
- Email address
- Available Today badge with time range (e.g., 3:00 PM – 7:00 PM)
- Weekly schedule: Mon–Sun columns with colored dots (red = unavailable, green = available)
- Book Appointment button
- Call Chamber button

**Edge Cases:**
- Chamber temporarily closed → show "Temporarily Unavailable" state
- No contact info → hide phone/email rows

---

### Feature 6: Hospital Discovery & Listing [C]

**Description:** Paginated, filterable, sortable grid of hospitals/clinics/diagnostic centers.

**Business Purpose:** Drives hospital discovery and referrals for admissions and emergency visits.

**User Goal:** Find appropriate hospital by type, services, and availability.

**User Flow:**
1. Navigate to Hospitals (top nav or mobile bottom nav)
2. View hospital grid with quick filter chips
3. Apply sidebar/sheet filters
4. Sort by Relevance
5. Click "View Details"

**Inputs:**
- Search bar
- Location selector (Narsingdi, Dhaka)
- Sort: Relevance [C]
- Quick filter chips: All, 24/7 Open, Emergency, ICU Available, Online Booking
- Left sidebar / Mobile filter sheet:
  - Hospital Type: All Types, Hospitals, Clinics, Diagnostic Centers, Specialized Centers
  - Services: ICU, Emergency, Surgery, Pathology, Digital X-Ray, Ambulance
  - Availability: All, Open Now, 24/7 Open

**Hospital Card Data:**
- Hospital logo
- Name
- Location (city, country)
- Verified badge
- Service tags (ICU, Emergency, Pathology, etc.)
- Stats: Doctors count, ICU Available status
- Average wait time ("15 min avg wait")
- View Details CTA (primary button)

**Validation Rules:** Hospital Type filter is mutually exclusive (radio); Services are multi-select [I]

**Edge Cases:**
- 0 results for filter combination → "No hospitals match" + Reset All link
- Unverified hospital → show without "Verified" badge

**User Stories:**

> As a patient, I want to filter hospitals by type (Clinic vs Hospital vs Diagnostic Center) so that I find the right facility for my need.
> Acceptance Criteria: Selecting a type shows only that type; count updates; "Apply Filters" refreshes results.

> As a patient, I want to filter by ICU availability so that I can find a hospital for emergency admission.
> Acceptance Criteria: "ICU Available" chip and Services > ICU checkbox both filter to hospitals with ICU.

---

### Feature 7: Hospital Filters — Mobile Bottom Sheet [C]

**Description:** Full-screen bottom sheet filter UI for mobile hospital listing, showing Hospital Type, Services, and Availability groups.

**Business Purpose:** Mobile-optimized filter UX that doesn't obscure content.

**User Goal:** Apply multiple filters without leaving the listing context.

**UI Components:**
- Bottom sheet with drag handle
- Hospital Type: icon grid (All Types, Hospitals, Clinics, Diagnostic Centers, Specialized Centers)
- Services: icon grid (ICU, Emergency, Surgery, Pathology, Digital X-Ray, Ambulance)
- Availability: pill buttons (All, Open Now, 24/7 Open)
- Apply Filters button (full-width green)
- Reset All text link

**Note:** Two filter sheet variants observed — one with Services section, one without (Hospital Type + Availability only). The full version (with Services) is the authoritative design.

---

### Feature 8: Hospital Details — Overview Tab [C]

**Description:** Full hospital detail page with about section, stats, emergency support, patient reviews, working hours, contact, and map.

**Business Purpose:** Complete hospital evaluation page; supports both planned visits and emergency decisions.

**User Goal:** Evaluate hospital quality, services, hours, and contact before visiting.

**Data Displayed:**
- Header photo (hospital building exterior)
- Hospital name (Bengali + English)
- Verified badge
- Phone number
- Rating + review count
- Address
- Tab navigation: Overview | Doctors | Specialties | Facilities | Reviews | Contact
- About section (Bengali text)
- Key stats: Year Established, Type (Private/Public), Care Level, Accreditation status
- Emergency Support 24/7 banner:
  - "Call Emergency Now" CTA button
  - Emergency phone number
- Quick Information sidebar:
  - Total Doctors (32+)
  - Total Beds (100+)
  - ICU Beds (20)
  - Ambulance (Available)
  - Cab Facility (Yes)
  - Visiting Hours (08:00 AM – 10:00 PM)
- "What Patients Say" section: 4 review cards + "View All Reviews" link
- Contact Information: address, phone, email, website URL
- Working Hours table (by day)
- Google Maps embed
- "Get Directions" button

**User Stories:**

> As a patient, I want to see the hospital's working hours so that I know when to visit.
> Acceptance Criteria: Working hours table shows each day with open/closed status; Friday shown as "Closed".

> As a patient in an emergency, I want to call the hospital directly from the page.
> Acceptance Criteria: "Call Emergency Now" button triggers phone call; emergency number visible.

---

### Feature 9: Hospital Details — Doctors Tab [C]

**Description:** Lists all doctors affiliated with a specific hospital, with live active-now queue and full doctor list with filters.

**Business Purpose:** Drives appointment bookings through hospital context; shows live queue status to attract walk-in patients.

**User Goal:** Find and book doctors currently active at this hospital.

**Data Displayed:**
- Summary stats row: Total Doctors (32), Available Now (24), Chambers (18), Rating (4.8)
- Sub-filters: Specialty, Availability, Gender, Consultation Type dropdowns
- Sort: Most Relevant
- "Available Doctors" section (live queue — 2-3 cards highlighted):
  - Doctor photo, name, title
  - Consultation type badges
  - Book Appointment button
- "All Doctors (123)" list:
  - Doctor row: photo, name, specialty, status, fee (৳800)
  - Book Appointment button per row
- Pagination

**Business Logic:** "Available Doctors" section shows doctors currently in session (live queue); others shown in "All Doctors" full list.

---

### Feature 10: Hospital Guide / Personal Assistant [C]

**Description:** A human-assisted hospital navigation service where patients submit a request and trained staff guides them through hospital processes.

**Business Purpose:** Differentiator service; premium support layer for elderly, rural, or first-time hospital users.

**User Goal:** Get human assistance for hospital appointments, diagnostics, registrations, and ward navigation.

**Services Offered:**
1. Elderly Patient Support — mobility and special care for senior citizens
2. Registration Assistance — help with hospital registration, token, documentation
3. Diagnostic Navigation — guidance for tests, reports, departments
4. Cabin & Ward Support — first cabin, ward, ICU, facility assistance

**Request Form Fields:**
- Patient Name (text)
- Phone Number (text)
- Patient Age (number)
- Select City (dropdown)
- Select Hospital (dropdown)
- Describe Your Need (textarea)
- Confirm Request (submit button)
- Privacy notice

**Emergency Section:** "Emergency Priority Support" banner with "Call Now" CTA at bottom.

**Trust Signals:**
- Verified & Trained Support Staff
- 10-15 Min Average Response
- Safe, Reliable & Confidential Service

**Validation Rules:**
- Phone number required; BD format [I]
- Patient Name required
- City + Hospital required
- Need description minimum 20 characters [A]

**User Stories:**

> As an elderly patient or caregiver, I want to request a hospital guide so that someone helps me navigate the hospital process.
> Acceptance Criteria: Form submits; user gets confirmation with expected response time (10-15 min).

---

### Feature 11: Ambulance Services [C]

**Description:** Listing page for ambulance services near user's location with search, filter, and booking.

**Business Purpose:** Emergency monetization feature; critical-need service with high intent.

**User Goal:** Find and book or call a nearby ambulance quickly.

**User Flow:**
1. Navigate to Ambulance (top nav)
2. View hero section with "Request Ambulance Now" CTA
3. See "All Ambulance Service" grid (12 services in Narsingdi & Nearby)
4. Each card: service name, star rating, ambulance image, stats (AC/Non-AC, 24/7, distance/type), Call Now + Book Now buttons
5. Bottom trust signals: 24/7 Availability, Quick Response, Trained Staff, Safe & Reliable

**Inputs:**
- Search: "Search ambulances by name, service or area..."
- Location: Narsingdi & Nearby
- Filter button [I — filter options not visible in screenshot]

**Ambulance Card Data:**
- Service badge
- Star rating
- Ambulance image
- Stats row (AC status, 24/7, type indicators)
- Call Now button (secondary)
- Book Now button (primary)

**Edge Cases:**
- No ambulance available nearby → show emergency phone number [A]
- High demand → show estimated response time [A]

**User Stories:**

> As a patient needing emergency transport, I want to see ambulances near me so that I can call or book the fastest one.
> Acceptance Criteria: List shows closest services first; "Call Now" triggers immediate phone call; "Book Now" opens booking flow.

---

### Feature 12: Diagnostic Tests Booking [C]

**Description:** Listing and booking page for diagnostic tests (blood tests, X-rays, scans, etc.) available at nearby labs.

**Business Purpose:** High-frequency recurring revenue; patients need tests regularly.

**User Goal:** Find and book a specific diagnostic test at an affordable price nearby.

**Data Displayed:**
- Grid of test cards (5 per row desktop, 1 per row mobile)
- Test image (procedure photo)
- Test name (e.g., CBC Test)
- Full name (e.g., Complete Blood Count)
- Price (e.g., ৳300)
- Book Test button (green)

**Inputs:**
- Search bar
- Location: Narsingdi & Nearby
- Filter button [I]

**Note:** "CBC Test / Complete Blood Count / ৳300" appears as placeholder data across all cards — production version would have varied real tests.

**Trust Signals:** 24/7 Availability, Quick Response, Trained Staff, Safe & Reliable (same as Ambulance page).

**User Stories:**

> As a patient, I want to see test prices upfront so that I can compare before booking.
> Acceptance Criteria: Price shown in BDT (৳) on every card; price is accurate at time of booking.

> As a patient, I want to book a diagnostic test online so that I avoid queuing at the lab.
> Acceptance Criteria: "Book Test" opens booking flow with available time slots; confirmation sent via SMS/email.

---

### Feature 13: My Health Records (Medical Records) [C]

**Description:** Personal health dashboard showing all of a patient's medical documents (prescriptions, X-rays, lab reports, certificates) with timeline, storage, and follow-up reminders.

**Business Purpose:** Retention feature; makes the app indispensable by storing patient health history.

**User Goal:** Access, organize, search, and download all personal medical records in one place.

**User Flow:**
1. Navigate to My Prescriptions (nav link — authenticated only)
2. View summary stats (All Records, Prescriptions, X-Ray, Certificates, Last Visit)
3. Filter by tab: All Records / Prescriptions / X-Ray / Lab Reports / Medical Certificates
4. Apply sub-filters: Date, Hospital, Doctor, Type dropdowns
5. Sort: Most Recent
6. View record list with type icon, hospital, date, item count, diagnosis
7. Click "View PDF" or "Download"
8. View Medical Health Timeline sidebar
9. Check Storage Usage
10. View Follow-up Reminder

**Stats Cards:**
- 24 All Records
- 8 Prescriptions (Rx icon)
- 12 X-Ray (x-ray icon)
- 5 Certificates (certificate icon)
- Last Visit: 20 May 2026

**Record Row Data:**
- Type icon (color-coded: green=prescription, purple=x-ray/lab, orange=certificate)
- Hospital name (e.g., Sibpur Ibn Sina Hospital)
- Diagnostic center (e.g., Popular Diagnostic Center)
- Date (e.g., 01 May 2026)
- Medicine count (e.g., 6 Medicines) or type indicator
- Record type (Diagnosis / Findings / Purpose / Blood Test / Certificate / X-Ray)
- Description (Fever, Throat Infection / No fracture or dislocation / Official documentation)
- View PDF link
- Download button

**Right Sidebar:**
- Medical Health Timeline:
  - Vertical timeline with type icons and dates
  - Items: Prescription, X-Ray Report, Lab Report, Prescription, X-Ray Report, Certificate
  - "View All Timeline" link
- Storage Usage: progress bar (100% shown), "Manage Storage" link
- Follow-up Reminder: next appointment date (17 May 2026), "View Appointments" link

**Validation Rules:**
- Only authenticated users can access [C]
- PDF must be downloadable in browser [I]
- Storage limit enforced (visible at 100%) [C]

**Edge Cases:**
- Storage full → warning banner; option to delete old records or upgrade [A]
- No records yet → empty state with "Your health records will appear here" [A]
- PDF unavailable → disabled link with tooltip [A]

**User Stories:**

> As a patient, I want to see all my medical records in one place so that I don't lose important documents.
> Acceptance Criteria: All record types visible under "All Records" tab; each shows hospital, date, type, description.

> As a patient, I want to download my prescription as PDF so that I can share it with a pharmacy.
> Acceptance Criteria: "Download" button fetches PDF; browser download dialog appears; file named with date and doctor name.

> As a patient, I want a follow-up reminder so that I don't miss my next appointment.
> Acceptance Criteria: Follow-up Reminder widget shows next appointment date; "View Appointments" links to appointment list.

> As a patient, I want to filter records by hospital so that I can find records from a specific visit.
> Acceptance Criteria: "All Hospitals" dropdown shows all hospitals with records; selecting one filters list.

---

### Feature 14: Authentication / Login [C]

**Description:** User authentication system with login prompt shown on the "More" tab when unauthenticated.

**Business Purpose:** Enables personalized features (health records, appointments, reviews).

**User Goal:** Log in to access protected features without a registration barrier.

**Key Message:** "You are missing out — Log in and enjoy exciting offers, plans and other benefits. No registration process required."

**Note:** "No registration process required" — suggests social login or phone OTP (no form-based registration). [I]

**CTA:** "Login Now" button

**Inferred Login Methods:**
- Phone number + OTP (common in BD healthcare apps)
- Social login (Google, Facebook) [A]

**User Stories:**

> As an unauthenticated user, I want to log in without a registration form so that I can access my records quickly.
> Acceptance Criteria: Login modal or page shows; user authenticates via phone OTP or social; redirected to previous page after login.

---

### Feature 15: Navigation System [C]

**Desktop Navigation:**
- Top nav bar: My Doctor logo | Hospital | Doctor | Ambulance | Diagnostics | Hospital Guide
- Active item highlighted
- User avatar icon (top right) — authenticated state
- Green "U" avatar shown when logged in [I]

**Mobile Navigation:**
- Bottom tab bar: Home | Hospital | Doctor | Diagnostics | More
- Icons + labels
- Active tab highlighted (green)
- "More" tab shows: authentication prompt + Legals & Support (Ambulance, Hospital Guide links)

**Note:** Ambulance appears in mobile "More" > Legals & Support but in desktop top nav. Diagnostics has both desktop nav and mobile bottom nav. Inconsistency noted.

---

### Feature 16: Footer [C]

**Consistent footer across all pages:**
- My Doctor logo + tagline
- Social links: Facebook, YouTube, Instagram, LinkedIn
- Quick Links: Find Doctors, Book Appointment, Online Consultation, Emergency Services, Medical Records
- Company: About Us, Careers, Blog, Press, Partners
- Contact Us:
  - Phone: +8801974-200905
  - Email: mydoctorinfo247@gmail.com
  - Address: Ground Floor, Khandakar General Hospital, Molla Tower, Bazirb Moor (Golap Chattan), Narsingdi

---

### Feature 17: Doctor Active Status / Live Queue [C]

**Description:** Real-time badge on doctor cards showing if a doctor is currently active/available.

**Business Purpose:** Drive immediate walk-in traffic and same-day bookings.

**Visible Elements:**
- "Active" green badge on doctor cards in listing
- "Available At" section per hospital affiliation
- "Available Doctors" section on Hospital Details > Doctors tab
- Today's Serial Status on doctor profile (next session, type, waiting time)

**Business Logic:**
- A doctor is "Active" when they have an ongoing or imminent session at a chamber
- Serial queue number increments as patients book

---

### Feature 18: Patient Reviews System [C]

**Description:** Reviews shown on doctor profiles and hospital pages with patient name, date, text, and rating.

**Business Purpose:** Social proof; increases booking conversion.

**Visible on:**
- Doctor Profile Overview (4 reviews + "View All Reviews")
- Hospital Details Overview (4 reviews + "View All Reviews")

**Review Card Data:**
- Patient avatar (initial letter)
- Patient name
- Date (relative: "2 days ago")
- Review text (Bengali)
- "Connect" link [I — assumes patient-to-patient connection feature or link to booking]

**User Stories:**

> As a patient, I want to read reviews before booking a doctor so that I can trust the decision.
> Acceptance Criteria: Reviews show patient name, date, text; sorted by most recent by default; "View All Reviews" loads paginated full list.

---

### Feature 19: Appointment Booking [C — CTA visible, booking flow not shown]

**Description:** Book appointment flow accessible from doctor cards, doctor profiles, and hospital doctor listings.

**CTAs visible:** "Book Appointment" (primary green button), "Book Now"

**Inferred Flow:**
1. Click "Book Appointment"
2. Select Chamber (if multiple chambers)
3. Select Date from calendar
4. Select available time slot
5. Enter patient details (name, phone, age)
6. Confirm booking
7. Receive confirmation (SMS/email)

**Note:** Booking flow screens not provided in screenshots. This is inferred from CTAs.

---

### Feature 20: Online Consultation [C — badge visible, flow not shown]

**Description:** Video-based consultation with doctors tagged as offering "Video Consultation."

**Visible evidence:** "Video Consultation" badge on doctor cards; "Online Consultation" in Quick Links footer; Consultation Type selector (Chamber | Online) on doctor profile.

**Inferred Flow:** Patient selects "Online" tab on doctor profile → books video slot → joins video call at appointment time.

---

## 3. Screen-by-Screen Analysis

### Screen 1: Home Page (Desktop)

**Purpose:** Primary landing page and navigation hub  
**Status:** Screenshot too large to load (>2000px); inferred from mobile and nav structure  
**Components:** Hero section, quick service links, top navigation  
**Navigation Paths:** → Doctors, Hospitals, Ambulance, Diagnostics, Hospital Guide

---

### Screen 2: Home Page (Mobile)

**Purpose:** Mobile entry point with service shortcuts  
**Components:**
- My Doctor logo + Bangla tagline header
- Search bar
- Quick service icon grid (scrollable)
- Specialties section
- Featured Hospitals section
- "Top Specialisations" section
- "View All" links
- Bottom navigation bar (Home, Hospital, Doctor, Diagnostics, More)

**Actions:** Tap service icon → navigate to listing; tap search → open search

**Navigation Paths:** Bottom nav → Hospital / Doctor / Diagnostics / More

---

### Screen 3: More Page (Mobile — Unauthenticated)

**Purpose:** Secondary navigation hub for authenticated features; login prompt  
**Components:**
- My Doctor header logo + profile icon (unauthenticated)
- "You are missing out" login prompt card
  - Marketing copy
  - Hero image (healthcare team with elderly patient)
  - "Login Now" button
- "Legals & Support" section
  - Ambulance link
  - Hospital Guide link
- Bottom nav (More tab active)

**Business Logic:** Unauthenticated users see login upsell; authenticated users see full menu [A]

---

### Screen 4: Doctors Listing (Desktop)

**Purpose:** Browse and filter all doctors  
**Components:** Top nav, search bar, location selector, quick filter chips, left sidebar filters (Specialty, Gender, Visit Type, Visiting Hours, Apply Filters), results count, 2-column doctor card grid, pagination  
**Data Displayed:** 99 doctors found near Narsingdi; showing page 1 of 4  
**Actions:** Filter, search, paginate, view profile, book appointment

---

### Screen 5: Doctors Listing (Mobile)

**Purpose:** Mobile doctor browsing  
**Components:** Search bar, location chip, filter chips (All, 24/7 Open, Emergency, ICU Available), Filter icon, Sort dropdown, result count, stacked doctor cards, pagination  
**Actions:** Apply chip filter, open filter sheet, sort, scroll, tap card

---

### Screen 6: Doctor Profile — Overview (Desktop)

**Purpose:** Full doctor evaluation and appointment booking  
**Components:** Back button, doctor header card, stats row, tab nav (Overview/Chamber Info), About section, BMDC reg no, Expertise tags, Education list, Today's Serial Status, Appointment Info panel (sticky right), Chamber Schedule grid, Patient Reviews  
**Actions:** Switch tab, book appointment, view reviews

---

### Screen 7: Doctor Profile — Overview (Mobile)

**Purpose:** Same as desktop but mobile layout  
**Components:** Same content; Appointment Info, Today's Serial Status, Chamber Schedule in collapsible accordion sections; Patient Reviews in horizontal scroll  
**Actions:** Expand sections, scroll, Book Appointment (sticky bottom button) [A]

---

### Screen 8: Doctor Profile — Chamber Info (Desktop)

**Purpose:** View all hospital chambers where doctor practices  
**Components:** Summary stats (Total Chambers, Nearest, Next Available, Status), chamber card list (6+ cards), each with hospital info, weekly availability grid, Book Appointment + Call Chamber buttons  
**Actions:** Book per chamber, call chamber, view schedule

---

### Screen 9: Doctor Profile — Chamber Info (Mobile)

**Purpose:** Mobile chamber listing  
**Components:** Same content in stacked layout; chamber cards full width  
**Actions:** Same as desktop

---

### Screen 10: Hospital Listing (Desktop)

**Purpose:** Browse and filter all hospitals  
**Components:** Search, location, sort (Relevance), quick chips, left sidebar filters (Hospital Type, Services, Availability, Apply Filters), 3-column hospital card grid, pagination  
**Data:** 48 hospitals found  
**Actions:** Filter, sort, search, view details

---

### Screen 11: Hospital Listing (Mobile)

**Purpose:** Mobile hospital browsing  
**Components:** Search, location, chip filters (All, 24/7 Open, Emergency, ICU Available), Filters button, Sort button, result count, stacked cards  
**Actions:** Chip filter, open filter sheet, sort, view details

---

### Screen 12: Hospital Filters — Mobile Bottom Sheet (Full)

**Purpose:** Comprehensive hospital filter panel  
**Components:** Hospital Type grid (5 options with icons), Services grid (6 options: ICU, Emergency, Surgery, Pathology, Digital X-Ray, Ambulance), Availability pills (3 options), Apply Filters button, Reset All  
**Actions:** Multi-select services, single-select type and availability, apply, reset

---

### Screen 13: Hospital Filters — Mobile Bottom Sheet (Compact)

**Purpose:** Simplified filter panel (possibly for a different entry point or older version)  
**Components:** Hospital Type (4 options), Availability (3 options) — no Services section  
**Actions:** Same as above

---

### Screen 14: Hospital Details — Overview (Desktop)

**Purpose:** Evaluate hospital fully  
**Components:** Header photo, hospital name/verification, tabs (Overview/Doctors/Specialties/Facilities/Reviews/Contact), About text, key stats, 24/7 Emergency banner, Quick Info sidebar, Patient Reviews, Contact Info, Working Hours, Google Maps embed  
**Actions:** Call emergency, get directions, view reviews, switch tab

---

### Screen 15: Hospital Details — Overview (Mobile)

**Purpose:** Same as desktop, mobile layout  
**Components:** Same content stacked; horizontal tab scroll  
**Actions:** Same

---

### Screen 16: Hospital Details — Doctors Tab (Desktop)

**Purpose:** Find and book doctors at this specific hospital  
**Components:** Summary stats (32 total, 24 available, 18 chambers, 4.8 rating), filter dropdowns (Specialty, Availability, Gender, Consultation Type), Sort, "Available Doctors" live cards (2-3), "All Doctors (123)" list with pagination  
**Actions:** Filter, sort, book appointment per doctor

---

### Screen 17: Hospital Details — Doctors Tab (Mobile)

**Purpose:** Mobile doctor listing within hospital  
**Components:** Same content; active doctors as horizontal cards; all doctors stacked list  
**Actions:** Same

---

### Screen 18: Hospital Guide (Desktop)

**Purpose:** Premium patient assistance service landing + request form  
**Components:** Hero with benefits (Verified Staff, 10-15 min response, Safe & Confidential), 4 service blocks (Elderly Support, Registration, Diagnostic Navigation, Cabin & Ward), Request Assistant form, Emergency Priority Support banner  
**Actions:** Submit request form, call emergency

---

### Screen 19: Hospital Guide (Mobile)

**Purpose:** Same as desktop mobile layout  
**Components:** Same content stacked; form full width  
**Actions:** Same

---

### Screen 20: Ambulance Services (Desktop)

**Purpose:** Find and book ambulances  
**Components:** Hero section with CTA, search bar, location, filter, "All Ambulance Service" 3-column grid (12 services), trust signals row  
**Actions:** Search, filter, call now, book now, request ambulance

---

### Screen 21: Ambulance Services (Mobile)

**Purpose:** Mobile ambulance listing  
**Components:** Hero text, location, filter button, stacked ambulance cards, trust signals  
**Actions:** Same

---

### Screen 22: Diagnostics (Desktop)

**Purpose:** Browse and book diagnostic tests  
**Components:** Search, location, filter, 5-column test card grid, trust signals  
**Data:** CBC Test / ৳300 (placeholder data)  
**Actions:** Search, filter, book test

---

### Screen 23: Diagnostics (Mobile)

**Purpose:** Mobile diagnostics listing  
**Components:** Search, location, filter, stacked test cards  
**Actions:** Same

---

### Screen 24: My Health Records (Desktop)

**Purpose:** Patient's personal medical record vault  
**Components:** Page title, search bar, Filters + Download All buttons, 5 summary stat cards, tab filters (All Records/Prescriptions/X-Ray/Lab Reports/Medical Certificates), sub-filter dropdowns (Date, Hospital, Doctor, Type), Sort, record list, right sidebar (Timeline, Storage, Follow-up Reminder), pagination  
**Actions:** Filter records, download PDF, view timeline, manage storage, view appointment

---

### Screen 25: My Health Records (Mobile)

**Purpose:** Mobile health records  
**Components:** Summary stat row (horizontal scroll), tab filters (horizontal scroll), Sort, record cards with overflow menu (⋮)  
**Actions:** Filter, scroll, tap record, access overflow menu

---

## 4. User Flows

### Flow 1: Find and Book a Doctor

```
Home → Doctors nav → 
  Apply specialty/gender/visit type filter →
    Browse doctor cards →
      View Profile →
        Check Today's Serial Status + Chamber Schedule →
          Select Chamber tab (if multiple chambers) →
            Book Appointment [CTA] →
              Select date/slot [inferred] →
                Enter patient details [inferred] →
                  Confirm booking → 
                    SMS/Email confirmation [inferred]
```

### Flow 2: Emergency Hospital Visit

```
Any page → Hospital nav → 
  Apply "Emergency" chip filter →
    View hospital cards with ICU available →
      View Details →
        Hospital Overview → Emergency 24/7 banner →
          Call Emergency Now [phone call]
```

### Flow 3: Book Ambulance

```
Desktop: Ambulance nav | Mobile: More → Ambulance →
  View "Ambulance Services Near You" →
    Browse ambulance cards →
      Call Now [phone] OR Book Now [booking flow] OR
  Request Ambulance Now [hero CTA] → [booking flow]
```

### Flow 4: Book a Diagnostic Test

```
Diagnostics nav →
  Search test name OR browse grid →
    View test card (name, type, price) →
      Book Test → [booking flow - date/time/lab selection]
```

### Flow 5: Access Health Records (Authenticated)

```
Login → My Prescriptions nav →
  View summary stats →
    Tab filter (Prescriptions / X-Ray / etc.) →
      Sub-filter by Date/Hospital/Doctor/Type →
        Click record → View PDF / Download
```

### Flow 6: Request Hospital Guide Assistant

```
Hospital Guide nav →
  Read service description →
    Fill Request Assistant form (Name, Phone, Age, City, Hospital, Need) →
      Confirm Request →
        Receive callback from trained staff within 10-15 min [inferred]
```

### Flow 7: Browse Hospital and Find Doctors There

```
Hospital listing → View Details →
  Hospital Overview (assess quality, hours, facilities) →
    Doctors tab →
      View Active Doctors (live queue) →
        Book Appointment
```

---

## 5. Business Rules

### BR-01: Location Scoping
All listings (Doctors, Hospitals, Ambulance, Diagnostics) are scoped to the selected location. Default location: Narsingdi, Dhaka.

### BR-02: BMDC Verification
Doctors display "BMDC Verified" badge only when their BMDC registration number is confirmed against the BMDC database.

### BR-03: Hospital Verification
Hospitals display "Verified" badge based on admin-side manual verification or third-party registry check.

### BR-04: Serial / Queue System
Doctor serial is a per-chamber, per-session queue. Slot count = Serial Duration (e.g., 40 patients/day). Booked slots decrement available count.

### BR-05: Chamber Availability
A chamber shows "Available" when the doctor has a scheduled session today that has not ended. "Unavailable" when no session today or session ended.

### BR-06: Consultation Type
"Chamber" = in-person visit. "Online" = video call. Fees may differ per type. Doctor may offer one or both.

### BR-07: Record Ownership
Health records are tied to authenticated user account. Cross-user access is prohibited.

### BR-08: Storage Limit
Each user has a storage quota for health records. At 100%, no new records can be uploaded until old ones are deleted or storage is upgraded.

### BR-09: Emergency Priority
Doctors with emergency cases may have their schedule disrupted; a notice is shown on the profile about potential delays.

### BR-10: Working Hours
Friday = Closed for most hospitals shown. Saturday–Thursday = operating days (common in Bangladesh calendar).

### BR-11: Currency
All prices in BDT (Bangladeshi Taka, symbol: ৳).

### BR-12: Language
UI displays bilingual content. Doctor/hospital names in Bengali for local entities; English for formal credentials.

### BR-13: Authentication Gate
My Health Records, booking confirmation details, and personalized features require authentication. Browsing/discovery is public.

---

## 6. Database Requirements

### Entities & Tables

#### users
| Field | Type | Notes |
|-------|------|-------|
| id | UUID | PK |
| phone | VARCHAR(15) | unique, BD format |
| name | VARCHAR(100) | |
| email | VARCHAR(255) | optional |
| age | INT | optional |
| city | VARCHAR(100) | |
| avatar_url | TEXT | |
| storage_used_bytes | BIGINT | |
| storage_limit_bytes | BIGINT | default 1GB [A] |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |

#### doctors
| Field | Type | Notes |
|-------|------|-------|
| id | ObjectId/UUID | PK |
| slug | VARCHAR(100) | unique URL identifier |
| name_en | VARCHAR(100) | |
| name_bn | VARCHAR(100) | Bengali name |
| title | VARCHAR(100) | e.g., "Assistant Professor" |
| credentials | TEXT | degree string |
| bmdc_reg_no | VARCHAR(20) | unique |
| bmdc_verified | BOOLEAN | |
| specialty | VARCHAR(100) | |
| department | VARCHAR(100) | |
| gender | ENUM('male','female','other') | |
| experience_years | INT | |
| photo_url | TEXT | |
| about_bn | TEXT | Bengali bio |
| rating | DECIMAL(3,2) | 0-5 |
| patients_treated | INT | |
| positive_review_pct | INT | 0-100 |
| consultation_fee | INT | BDT |
| offers_video | BOOLEAN | |
| offers_chamber | BOOLEAN | |
| is_active | BOOLEAN | |
| created_at | TIMESTAMP | |

#### doctor_specializations
| Field | Type | Notes |
|-------|------|-------|
| id | UUID | PK |
| doctor_id | FK → doctors | |
| specialization | VARCHAR(100) | |

#### doctor_education
| Field | Type | Notes |
|-------|------|-------|
| id | UUID | PK |
| doctor_id | FK → doctors | |
| degree | VARCHAR(100) | |
| institution | VARCHAR(200) | |
| year | INT | optional |

#### chambers
| Field | Type | Notes |
|-------|------|-------|
| id | UUID | PK |
| doctor_id | FK → doctors | |
| hospital_id | FK → hospitals | |
| address | TEXT | |
| phone | VARCHAR(20) | |
| email | VARCHAR(255) | |
| consultation_fee | INT | may differ from doctor default |
| is_active | BOOLEAN | |

#### chamber_schedules
| Field | Type | Notes |
|-------|------|-------|
| id | UUID | PK |
| chamber_id | FK → chambers | |
| day_of_week | ENUM(0-6) | 0=Sun, 6=Sat |
| start_time | TIME | |
| end_time | TIME | |
| max_patients | INT | |
| status | ENUM('available','unavailable') | |

#### hospitals
| Field | Type | Notes |
|-------|------|-------|
| id | ObjectId/UUID | PK |
| slug | VARCHAR(100) | unique |
| name_en | VARCHAR(200) | |
| name_bn | VARCHAR(200) | |
| type | ENUM('hospital','clinic','diagnostic_center','specialized_center') | |
| verified | BOOLEAN | |
| phone | VARCHAR(20) | |
| email | VARCHAR(255) | |
| website | TEXT | |
| address | TEXT | |
| district | VARCHAR(100) | |
| upazila | VARCHAR(100) | |
| coordinates | GeoJSON Point | |
| photo_url | TEXT | |
| logo_url | TEXT | |
| year_established | INT | |
| hospital_type_ownership | ENUM('private','public','ngo') | |
| care_level | VARCHAR(50) | |
| accreditation | VARCHAR(100) | |
| total_doctors | INT | |
| total_beds | INT | |
| icu_beds | INT | |
| has_ambulance | BOOLEAN | |
| has_cab | BOOLEAN | |
| visiting_hours_start | TIME | |
| visiting_hours_end | TIME | |
| emergency_phone | VARCHAR(20) | |
| about_bn | TEXT | |
| rating | DECIMAL(3,2) | |
| is_24_7 | BOOLEAN | |
| has_icu | BOOLEAN | |
| has_emergency | BOOLEAN | |
| avg_wait_minutes | INT | |
| created_at | TIMESTAMP | |

#### hospital_services
| Field | Type | Notes |
|-------|------|-------|
| id | UUID | PK |
| hospital_id | FK → hospitals | |
| service | ENUM('icu','emergency','surgery','pathology','digital_xray','ambulance') | |

#### hospital_working_hours
| Field | Type | Notes |
|-------|------|-------|
| id | UUID | PK |
| hospital_id | FK → hospitals | |
| day_of_week | ENUM(0-6) | |
| open_time | TIME | null = closed |
| close_time | TIME | null = closed |
| is_closed | BOOLEAN | |

#### ambulances
| Field | Type | Notes |
|-------|------|-------|
| id | UUID | PK |
| service_name | VARCHAR(200) | |
| rating | DECIMAL(3,2) | |
| photo_url | TEXT | |
| is_ac | BOOLEAN | |
| is_24_7 | BOOLEAN | |
| phone | VARCHAR(20) | |
| district | VARCHAR(100) | |
| coordinates | GeoJSON Point | |
| is_available | BOOLEAN | |

#### diagnostic_tests
| Field | Type | Notes |
|-------|------|-------|
| id | UUID | PK |
| name | VARCHAR(200) | |
| full_name | VARCHAR(300) | |
| category | VARCHAR(100) | |
| photo_url | TEXT | |
| price | INT | BDT |
| lab_id | FK → diagnostic_labs | |
| is_available | BOOLEAN | |

#### diagnostic_labs
| Field | Type | Notes |
|-------|------|-------|
| id | UUID | PK |
| name | VARCHAR(200) | |
| address | TEXT | |
| district | VARCHAR(100) | |
| coordinates | GeoJSON Point | |
| phone | VARCHAR(20) | |
| is_24_7 | BOOLEAN | |

#### appointments
| Field | Type | Notes |
|-------|------|-------|
| id | UUID | PK |
| patient_id | FK → users | |
| doctor_id | FK → doctors | |
| chamber_id | FK → chambers | |
| appointment_date | DATE | |
| appointment_time | TIME | |
| serial_number | INT | |
| type | ENUM('chamber','online') | |
| status | ENUM('pending','confirmed','completed','cancelled') | |
| fee | INT | BDT |
| created_at | TIMESTAMP | |

#### reviews
| Field | Type | Notes |
|-------|------|-------|
| id | UUID | PK |
| reviewer_id | FK → users | |
| entity_type | ENUM('doctor','hospital') | |
| entity_id | UUID | polymorphic FK |
| rating | INT | 1-5 |
| text | TEXT | |
| created_at | TIMESTAMP | |

#### health_records
| Field | Type | Notes |
|-------|------|-------|
| id | UUID | PK |
| user_id | FK → users | |
| doctor_id | FK → doctors | nullable |
| hospital_id | FK → hospitals | nullable |
| type | ENUM('prescription','xray','lab_report','certificate') | |
| date | DATE | |
| description | TEXT | |
| diagnosis | TEXT | |
| file_url | TEXT | PDF URL |
| file_size_bytes | BIGINT | |
| created_at | TIMESTAMP | |

#### hospital_guide_requests
| Field | Type | Notes |
|-------|------|-------|
| id | UUID | PK |
| patient_name | VARCHAR(100) | |
| phone | VARCHAR(20) | |
| patient_age | INT | |
| city | VARCHAR(100) | |
| hospital_id | FK → hospitals | |
| description | TEXT | |
| status | ENUM('pending','assigned','completed') | |
| created_at | TIMESTAMP | |

#### bd_locations
| Field | Type | Notes |
|-------|------|-------|
| id | UUID | PK |
| division | VARCHAR(100) | |
| district | VARCHAR(100) | |
| upazila | VARCHAR(100) | |

---

## 7. API Requirements

### Authentication

#### POST /api/auth/send-otp
Request: `{ phone: string }`  
Response: `{ success: bool, expires_in: number }`  
Permission: Public

#### POST /api/auth/verify-otp
Request: `{ phone: string, otp: string }`  
Response: `{ token: string, user: UserObject }`  
Permission: Public

---

### Doctors

#### GET /api/doctors
Query params: `specialty, gender, visit_type, visiting_hours[], quick_filter, location_district, page, limit, sort`  
Response: `{ data: Doctor[], total: number, page: number, pages: number }`  
Permission: Public

#### GET /api/doctors/:id
Response: `{ doctor: DoctorDetail }`  
Permission: Public

#### GET /api/doctors/:id/chambers
Response: `{ chambers: Chamber[], summary: { total, nearest, next_available, status } }`  
Permission: Public

#### GET /api/doctors/:id/reviews
Query: `page, limit`  
Response: `{ reviews: Review[], total: number }`  
Permission: Public

#### GET /api/doctors/:id/serial-status
Response: `{ next_session: string, type: string, est_wait_minutes: number, emergency_priority: bool }`  
Permission: Public

---

### Hospitals

#### GET /api/hospitals
Query: `type, services[], availability, location_district, q, sort, page, limit`  
Response: `{ data: Hospital[], total: number, page: number, pages: number }`  
Permission: Public

#### GET /api/hospitals/:id
Response: `{ hospital: HospitalDetail }`  
Permission: Public

#### GET /api/hospitals/:id/doctors
Query: `specialty, availability, gender, consultation_type, sort, page, limit`  
Response: `{ active_doctors: Doctor[], all_doctors: Doctor[], total: number, stats: { total_doctors, available_now, chambers, rating } }`  
Permission: Public

#### GET /api/hospitals/:id/reviews
Query: `page, limit`  
Response: `{ reviews: Review[], total: number }`  
Permission: Public

---

### Ambulances

#### GET /api/ambulances
Query: `location_district, q, page, limit`  
Response: `{ data: Ambulance[], total: number }`  
Permission: Public

---

### Diagnostics

#### GET /api/diagnostics
Query: `location_district, q, category, page, limit`  
Response: `{ data: DiagnosticTest[], total: number }`  
Permission: Public

---

### Appointments

#### POST /api/appointments
Request: `{ doctor_id, chamber_id, date, type, patient_name, patient_phone, patient_age }`  
Response: `{ appointment: Appointment, serial_number: number }`  
Permission: Authenticated [I]

#### GET /api/appointments
Response: `{ appointments: Appointment[] }`  
Permission: Authenticated — own records only

---

### Health Records

#### GET /api/health-records
Query: `type, hospital_id, doctor_id, date_from, date_to, sort, page, limit`  
Response: `{ records: HealthRecord[], stats: { total, prescriptions, xray, lab_reports, certificates, last_visit }, storage: { used, limit } }`  
Permission: Authenticated — own records only

#### GET /api/health-records/:id/download
Response: PDF file stream  
Permission: Authenticated — record owner only

---

### Hospital Guide

#### POST /api/hospital-guide/request
Request: `{ patient_name, phone, patient_age, city, hospital_id, description }`  
Response: `{ request_id, est_response_minutes: 15 }`  
Permission: Public

---

### Locations

#### GET /api/locations
Query: `division?, district?`  
Response: `{ divisions: string[], districts: string[], upazilas: string[] }`  
Permission: Public

---

## 8. Roles & Permissions

### Role: Guest (Unauthenticated)
- Browse doctors listing
- Browse hospital listing
- Browse ambulance listing
- Browse diagnostics listing
- View doctor profiles (overview + chamber info)
- View hospital details
- Request hospital guide assistance
- View patient reviews

### Role: Patient (Authenticated)
All Guest permissions plus:
- View My Health Records
- Download medical record PDFs
- Book appointments
- Submit reviews
- View appointment history
- Manage follow-up reminders

### Role: Doctor [A — admin panel not shown]
- Manage chamber schedules
- View own appointment list
- Set availability

### Role: Hospital Admin [A]
- Manage hospital profile
- Add/remove affiliated doctors
- Update working hours
- View hospital analytics

### Role: Platform Admin [A]
- Verify doctors (BMDC check)
- Verify hospitals
- Manage all entities
- View platform analytics
- Manage hospital guide requests

---

## 9. Non-Functional Requirements

### Performance
- Page initial load: < 3 seconds on 4G connection
- Filter application: < 500ms
- Search results: < 1 second
- PDF download initiation: < 2 seconds
- Doctor profile page: < 2 seconds
- API responses: < 500ms for listing, < 1s for detail pages

### Security
- All API endpoints over HTTPS
- JWT or session-based auth with short expiry
- Phone OTP expiry: 5 minutes
- Health records accessed only by owner
- No PII exposed in public API responses
- BMDC number not shown in full publicly [A]
- PDF download links signed/tokenized (short-lived URLs)

### Accessibility
- Bilingual content (Bengali + English)
- Sufficient color contrast (WCAG AA minimum)
- Touch targets minimum 44x44px on mobile
- Screen reader support for key CTAs

### Responsiveness
- Mobile-first design (320px – 428px phones)
- Tablet support: 768px – 1024px [A]
- Desktop: 1280px+
- Bottom navigation on mobile; top navigation on desktop
- Filter sidebar on desktop; bottom sheet on mobile

### Scalability
- Pagination for all list views (default 12-18 items per page)
- Hospital Guide request queue must handle concurrent submissions
- Ambulance listing sorted by proximity/availability in real time

### Reliability
- Emergency phone call feature must not depend on app connectivity (direct tel: links)
- Health records stored in cloud storage with backup
- 99.9% uptime SLA for listing pages

---

## 10. UX Analysis

### Navigation Structure

```
My Doctor
├── Home
├── Hospital
│   ├── Listing (filters, sort)
│   └── Hospital Detail
│       ├── Overview
│       ├── Doctors
│       ├── Specialties [tab visible, not screenshotted]
│       ├── Facilities [tab visible, not screenshotted]
│       ├── Reviews [tab visible, not screenshotted]
│       └── Contact [tab visible, not screenshotted]
├── Doctor
│   ├── Listing (filters, sort)
│   └── Doctor Profile
│       ├── Overview
│       └── Chamber Info
├── Ambulance
│   └── Listing
├── Diagnostics
│   └── Listing
├── Hospital Guide
│   └── Landing + Request Form
└── My Prescriptions (auth only)
    └── My Health Records
```

**Mobile navigation adds:**
```
More
├── Login prompt (unauthenticated)
├── Ambulance (link)
└── Hospital Guide (link)
```

### Information Architecture

**Hierarchy:**
- Platform → Category (Doctor/Hospital/Ambulance/Diagnostics) → Entity → Details

**Content Strategy:**
- Bengali for patient-facing content and local entity names
- English for credentials, technical terms, UI labels
- Numbers always visible: fee, rating, experience, beds, wait time

### UX Patterns

| Pattern | Usage |
|---------|-------|
| Bottom tab navigation | Mobile main nav |
| Left sidebar filters | Desktop listing pages |
| Bottom sheet filters | Mobile listing pages |
| Chip filters | Quick horizontal filter bar |
| Card grid | All listing pages |
| Tab navigation | Doctor profile, Hospital detail |
| Accordion / collapsible | Mobile profile sections |
| Sticky CTA | Doctor profile "Book Appointment" button |
| Pagination | All listing pages |
| Live badge | "Active" doctor status |
| Timeline | Health records sidebar |
| Color-coded status | Chamber schedule (green/red) |
| Trust signals row | Ambulance, Diagnostics, Hospital Guide pages |
| Hero + form layout | Hospital Guide page |
| Map embed | Hospital detail overview |

### Design System Observations

**Color Palette:**
- Primary: Forest Green (#1a7c3e approximately)
- Secondary: Light Green (for active states, chips)
- Accent: Orange/Amber (for Certificates stat card, warnings)
- Accent: Purple/Violet (for X-Ray stat card)
- Accent: Teal/Cyan (for last visit stat card)
- Neutral: White background, light gray cards
- Text: Dark gray / near-black

**Typography:**
- Primary font: Sans-serif (likely Inter or similar)
- Bengali text rendered with appropriate Bengali font
- Healthcare-compliant sizing (globals.css references in project context)

**Components observed:**
- Button variants: Primary (green filled), Secondary (outlined), Ghost/Link
- Badge/Pill: Service tags, Verified, Active, BMDC Verified
- Card: Doctor, Hospital, Ambulance, Diagnostic Test, Review, Health Record
- Filter chips: horizontal scrollable
- Select/Dropdown: Specialty, Sort, Date, etc.
- Bottom sheet: Mobile filter panel
- Star rating: ambulances
- Progress bar: Storage usage
- Timeline: Health records
- Map: Google Maps embed
- Avatar: User initials circle
- Status dots: Chamber schedule (green/red)

---

## 11. Missing Screens

The following screens/flows are logically expected but not provided in screenshots:

1. **Login / OTP Screen** — No registration form; OTP-based login implied but not shown
2. **Appointment Booking Flow** — Date picker, slot selection, patient details form, confirmation screen
3. **Online Consultation Flow** — Video call setup, join call screen
4. **Payment Flow** — If fees are paid online vs. at-counter; no payment screen shown
5. **Hospital Specialties Tab** — Tab visible on hospital detail but not screenshotted
6. **Hospital Facilities Tab** — Tab visible, not shown
7. **Hospital Reviews Tab** — Tab visible, not shown
8. **Hospital Contact Tab** — Tab visible, not shown
9. **View All Reviews Page** — Link visible ("View All Reviews") but no full page
10. **Appointment History / Upcoming Appointments** — Referenced via "View Appointments" in health records
11. **Medical Health Timeline Full View** — "View All Timeline" link not followed
12. **Manage Storage Screen** — "Manage Storage" link visible but screen not provided
13. **Notification Center** — No notification screen or indicator shown
14. **User Profile / Settings** — Profile icon shown in header but settings screen not shown
15. **Search Results Page** — Global search shown but results page/modal not shown
16. **Hospital Admin Panel** — Backend interface not included
17. **Doctor Detail — Video Consultation Flow** — Online consultation badge visible, flow not shown
18. **Ambulance Booking Flow** — "Book Now" CTA shown, booking form not shown
19. **Diagnostic Test Booking Flow** — "Book Test" CTA shown, booking form not shown
20. **Emergency Support Detail** — "Call Now" triggers phone; no web-based emergency form shown

---

## 12. Assumptions

### A01 — Authentication Method
Assumed phone number + OTP based on BD market norms and "No registration process required" copy. Social login may be secondary option.

### A02 — Appointment Booking Flow
Full booking flow (date picker → slot → details → payment → confirm) inferred from "Book Appointment" CTAs. Screens not provided.

### A03 — Real-Time Queue
"Active" doctor status and "Today's Serial Status" assumed to be server-sent events (SSE) or polling-based live updates, not just static data.

### A04 — Storage Upgrade
"Manage Storage" at 100% suggests a freemium storage model with upgradeable limits. Not confirmed by screenshots.

### A05 — Maps Provider
Google Maps embed visible on hospital detail. Assumed Google Maps JavaScript API or iframe embed.

### A06 — Payment
No payment UI visible. Could be: (a) offline payment at counter, (b) integrated payment gateway for online booking. Status: Unknown — requires clarification.

### A07 — Diagnostic Test Availability
"CBC Test / ৳300" appears uniformly across all cards — placeholder data in screenshots. Real data will have varied tests, prices, and lab associations.

### A08 — Ambulance Stats
Stats on ambulance cards (AC/Non-AC, 24/7 indicator, distance) confirmed partially; exact data model needs clarification.

### A09 — Review Connect
"Connect" link on patient reviews may link to the reviewer's profile or initiate a community Q&A. Purpose unclear from screenshots.

### A10 — Mobile Filter Variants
Two different mobile hospital filter sheets observed (one with Services, one without). The version with Services (ICU, Emergency, Surgery, Pathology, Digital X-Ray, Ambulance) is treated as the current/authoritative design.

### A11 — "No Registration Process Required"
This copy on the More page may mean social/phone login doesn't require a lengthy form — not that the app is fully anonymous. Authenticated features (health records) clearly require a user account.

### A12 — Hospital Doctor Count Discrepancy
Hospital Details header shows "32+ Total Doctors" but Doctors tab shows "All Doctors (123)". The "32+" may refer to active/verified doctors and "123" to all ever affiliated. Needs clarification.

### A13 — Bengali Content
Patient-facing content (doctor bios, hospital descriptions, reviews) is primarily in Bengali. System will need proper Bengali Unicode support and font rendering throughout.

---

*Document generated from screenshot analysis of 25 screens (13 desktop, 12 mobile) of the My Doctor platform.*  
*For questions or corrections: tools@smartechedge.com*
