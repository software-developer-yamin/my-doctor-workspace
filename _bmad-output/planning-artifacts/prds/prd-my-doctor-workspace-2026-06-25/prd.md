---
title: "My Doctor — Product Requirements Document"
status: final
created: 2026-06-25
updated: 2026-06-26
project: my-doctor-workspace
projects:
  - my_doctor_frontend
  - my_doctor_backend
  - my_doctor_backend/public (admin panel)
---

# My Doctor — Product Requirements Document

> **Scope:** Three co-deployed applications sharing one MongoDB/Redis backend:
> **Project 1 — Patient Frontend** (`my_doctor_frontend/`) · **Project 2 — API Backend** (`my_doctor_backend/`) · **Project 3 — Admin Panel** (`my_doctor_backend/public/`)

---

## 0. Document Purpose

This PRD serves product, engineering, and downstream workflow owners (UX, architecture, epics) for all three My Doctor applications. It uses Glossary-anchored vocabulary throughout; FRs are globally numbered and project-scoped; assumptions are tagged `[ASSUMPTION]` inline and indexed in §13. Downstream artifacts reference FRs by ID.

---

## 1. Vision

My Doctor is a comprehensive Bangladeshi digital healthcare platform that connects patients with doctors, hospitals, diagnostic labs, ambulances, medical guides, and home-visit services through a unified web experience. It reduces friction in accessing healthcare across Bangladesh by aggregating discovery, booking, live queue tracking, telemedicine, and prescription management into a single platform — backed by AI-powered recommendation and triage.

**North Star:** Any Bangladeshi patient can find the right care, book it in under two minutes, and track their care journey end-to-end from a phone or browser.

---

## 2. Problem Statement

Healthcare access in Bangladesh is fragmented:
- Patients call clinics directly or visit in person to book; no visibility into wait times.
- Diagnostic lab discovery is word-of-mouth; booking is manual.
- Emergency ambulance dispatch has no centralized request channel.
- Home-visit doctor services are informal and hard to verify.
- Doctors have no digital tool to manage queues, schedules, prescriptions, or patient histories.
- Administrators have no real-time visibility across the service network.

### 2.1 Market Context — Bangladesh Digital Healthcare (2025–2026)

| Competitor | Position | Gap My Doctor exploits |
|---|---|---|
| Doctorola | Pioneer in doctor booking; diagnostics + telemedicine added | No live queue visibility |
| Shastho | Membership/benefits model; large partner network; home lab tests | No in-home clinical visits |
| Maya | Strongest AI play; chatbot resolves ~70% queries | No physical appointment booking depth |
| Zaynax Health | "Super app": teleconsult, home lab, ambulance, pharmacy | Ambulance dispatch reliability unverified |
| DocTime | Video consultation focus | No in-clinic queue management |
| Praava | Premium Dhaka clinic + integrated EHR + telemedicine | Dhaka-only; no district/upazila depth |
| Shastho Batayon 16263 | Free 24/7 government telemedicine hotline | No booking, no prescriptions |

**My Doctor differentiation:**
1. BD-native location depth — division/district/upazila filtering vs. Dhaka-centric competitors.
2. Integrated ambulance dispatch — no competitor owns real-time dispatch reliably.
3. Home doctor visits — underserved; home lab common but in-home clinical visits are fragmented.
4. Live queue visibility — no competitor publicly features real-time serial queue for physical clinics.
5. Prescription digitization — end-to-end: write → PDF → patient record.

---

## 3. Glossary

- **Patient** — A registered Customer seeking medical care via the platform.
- **Customer** — Backend domain name for the Patient entity; used in API and database contexts.
- **Doctor** — A licensed physician listed on the platform, offering chamber appointments, home visits, or queue sessions.
- **Admin** — Platform operator with full CRUD authority over all entities via the Admin Panel.
- **Appointment** — A confirmed booking between a Patient and a Doctor for a specific schedule slot, assigned a Serial Number.
- **Serial Number** — A sequential integer assigned to an Appointment within a Queue Session; determines service order.
- **Queue Session** — A Doctor-initiated live session for a specific day; advances serial-by-serial as the Doctor calls patients.
- **Schedule (Chamber)** — A Doctor's weekly recurring availability at a physical location.
- **Home Schedule** — A Doctor's separate availability slots for domiciliary (home-visit) services.
- **Diagnostic Booking** — A Patient's reservation for a diagnostic test at a Lab on a specific date.
- **Lab** — A diagnostic laboratory listed on the platform offering one or more Diagnostic Tests.
- **Diagnostic Test** — A specific medical test offered by Labs, with a name, category, and price.
- **Ambulance Booking** — A dispatch request submitted by a Patient for an Ambulance.
- **Guide Booking** — A reservation for a medical companion or guide service session.
- **Prescription** — A medical document written by a Doctor post-appointment, containing medicines, diagnostic tests, and clinical notes; exported as a PDF with barcode.
- **Triage Agent** — An AI LangGraph stateful agent that guides a Patient through symptom assessment.
- **JWT** — JSON Web Token; the access+refresh token pair used for Patient and Doctor authentication.
- **Clerk** — Third-party SaaS authentication provider used exclusively by Admin Panel.
- **BD Location** — Bangladesh administrative location: Division → District → Upazila hierarchy.
- **BMDC** — Bangladesh Medical and Dental Council; issues registration numbers to licensed doctors.

---

## 4. Target Users

| Role | Description | Primary Interface |
|---|---|---|
| **Patient** | Bangladeshi individuals seeking medical care | Patient Frontend (web) |
| **Doctor** | Licensed physicians managing schedules, queues, prescriptions | Patient Frontend (Doctor Dashboard) |
| **Admin** | Platform operators managing all entities and analytics | Admin Panel (SPA) |

### User Journeys

**UJ-1. Rafiq books a specialist and times his arrival.**
Rafiq, 34, Dhaka urban. Authenticated via Google OAuth on a previous session. Opens My Doctor → searches "Cardiologist, Dhaka" → sees ranked Doctor cards (fee, rating, hospital) → selects Dr. Ahmed → views profile (qualifications, Schedule, BD Location) → picks available slot → confirms Appointment → receives Serial Number → tracks live Queue Session on day of visit → Appointment marked complete.

**UJ-2. Nadia books a diagnostic test.**
Nadia, 28, Chittagong. Searches "CBC test" → sees Labs offering the test with prices → selects Lab → picks date → confirms Diagnostic Booking → visits Lab on day. Edge case: if selected time slot fills during checkout, system shows next available slot before confirming.

**UJ-3. Shaheen's family requests an ambulance.**
Shaheen's parent is ill in Sylhet district. Family opens My Doctor → Ambulances → filters by BD Location and ambulance type → submits Ambulance Booking with destination and condition notes → Admin is notified → dispatch confirmed.

**UJ-4. Patient books a home doctor visit.**
Authenticated Patient selects "Home Doctor" → browses Doctors with Home Schedule availability → picks slot → confirms Home Doctor booking → Doctor visits at home.

**UJ-5. Doctor manages today's queue.**
Doctor logs into dashboard → views today's Queue Session → calls next Serial → marks patient complete → Serial Number advances → Patients see live update.

**UJ-6. Doctor writes a prescription.**
Doctor completes Appointment → opens prescription writer → adds medicines, Diagnostic Tests, notes → saves → Patient can view and download PDF Prescription.

**UJ-7. Admin onboards a new doctor.**
Admin logs into Admin Panel (Clerk auth) → creates Doctor record (name, BMDC number, speciality, fee, hospital) → Doctor can now log in and manage own Schedule.

### 4.1 Business Model

> **[NOTE FOR PM]** No payment gateway is implemented. Revenue model must be confirmed before doctor onboarding pipeline is designed or commission NFRs added.

**[ASSUMPTION A-4: Platform operates on a commission/listing model — confirm with stakeholders before sprint planning.]**

| Revenue stream | Mechanism | Status |
|---|---|---|
| Doctor listing fee | Doctors or clinics pay monthly/annual fee to be listed | Deferred |
| Booking commission | Platform takes % cut when payment integration ships | Deferred |
| Diagnostic lab partnership | Labs pay per confirmed booking | Deferred |
| Ambulance operator subscription | Operators pay to list fleet | Deferred |
| AI premium tier | AI triage / priority queue for paid users | Deferred |

MVP cost exposure to monitor: Gemini API inference, Clerk per-seat, MongoDB Atlas, Green Web SMS, hosting.

---

## 5. Non-Goals (Explicit)

- Mobile native apps (iOS/Android) — REST API supports future mobile clients but app is not in scope.
- Video/audio telemedicine (WebRTC) — AI chat covers async telemedicine needs.
- Payment gateway integration — fee display is informational; actual payment is offline.
- Multi-language (Bangla) UI — English-first.
- Email notifications — SMS only via Green Web.
- Public API / third-party partner integrations.
- Doctor self-registration — Admin creates all Doctors in v1. [NOTE FOR PM: Bottleneck for growth; revisit after 100 Doctors listed.]
- Rating/review write flow — Read side (display) exists; Patient submission flow is deferred.

---

## 6. MVP Scope

### 6.1 In Scope
- Patient authentication (JWT + Google OAuth), profile, dashboard.
- Doctor authentication, profile, Schedule management, Queue Session management, Prescription writing.
- Doctor discovery, search, and AI-powered recommendation.
- Appointment booking and live queue tracking.
- Diagnostic Lab and Test browsing and booking.
- Hospital browsing.
- Ambulance browsing and Ambulance Booking submission.
- Home Doctor (domiciliary) booking.
- Medical Guide browsing and booking.
- Prescription PDF generation (pdfkit + barcode).
- AI triage agent (pending regulatory clearance — see Open Questions).
- SMS notifications (booking confirmations, reminders).
- Admin Panel: full CRUD for all entities, analytics dashboard, booking management.

### 6.2 Out of Scope for MVP
- Payment processing (Bkash/Nagad/SSL Commerz) — deferred to post-MVP.
- WebRTC video consultation — deferred to v2.
- Bangla language UI — deferred; i18n architecture should not block v1.
- Doctor self-onboarding flow — Admin-only creation in v1.
- Mobile native app — web-first; REST API is mobile-ready.
- Rating/review submission — display only.

---

---

# PROJECT 1: PATIENT FRONTEND (`my_doctor_frontend/`)

**Technology:** Next.js 16.2.2 (App Router, Turbopack) · TypeScript strict · React 19 · shadcn/ui + Phantom UI · Redux Toolkit (auth/app state) · TanStack Query v5 (server state) · React Hook Form + Zod · Axios · Firebase (Google OAuth) · pnpm

**Architecture:** Layered — Pages → Components → Services → Adapters → Types. Redux for auth/global UI. TanStack Query for all server data. nuqs for URL-reflected state. Feature flags gate all pages via `src/config/features.ts` + `proxy.ts`.

---

## F1: Authentication & Session (Frontend)

**Description:** Patients and Doctors authenticate via separate flows. Patient auth uses email/password or Google OAuth (Firebase). Doctor auth uses email/password through a dedicated sign-in page. JWT tokens are stored as HTTP-only cookies and auto-refreshed on 401 — transparent to the user. Session state is hydrated from cookies in `AuthProvider` on mount. Auth state is consumed via `useAppSelector(state => state.auth)` — never read directly from cookies in components.

#### FR-1: Patient registration

Patient can register via email/password or Google OAuth (Firebase). Realizes UJ-1.

**Consequences:**
- Form validates email format and minimum password length before submission.
- On success, Patient is redirected to onboarding step if profile is incomplete.
- On duplicate email, backend returns 409; form shows inline error without clearing fields.

#### FR-2: Patient login

Patient can log in via email/password; JWT access + refresh tokens stored as HTTP-only cookies.

**Consequences:**
- Successful login hydrates `auth` Redux slice with user profile and token.
- On wrong credentials, inline error shown; account not locked until N failed attempts `[ASSUMPTION A-6: lockout policy TBD]`.

#### FR-3: Google OAuth login

Patient can authenticate via Google OAuth (Firebase); no separate password required.

**Consequences:**
- Firebase token exchanged for platform JWT on backend; same HTTP-only cookie set.

#### FR-4: Doctor login

Doctor can log in via dedicated `/doctor-sign-in` page with email/password (separate from Patient flow).

**Consequences:**
- `auth` slice stores `role: "doctor"`; Patient routes redirect to Doctor Dashboard.

#### FR-5: Token auto-refresh

On 401 response, Axios interceptor in `src/lib/api.ts` silently requests a new access token and retries the original request.

**Consequences:**
- User never sees a session-expired error for a valid refresh token.
- On refresh failure (expired refresh), user is redirected to sign-in.

#### FR-6: Password reset

Patient can reset password via forgot-password flow (OTP or link).

**Consequences:**
- Reset link/OTP sent via SMS (Green Web) or email (if email configured).
- Password change invalidates all existing tokens.

#### FR-7: Profile update

Patient can update name, phone, and medical history fields.

**Consequences:**
- Updated profile reflected immediately in `auth` Redux slice after success.

---

## F2: Home Page & Navigation

**Description:** The home page serves as the primary entry surface for patient discovery. It presents speciality catalog, featured doctors, platform services, and AI recommendation entry point.

#### FR-8: Speciality browsing from home

Patient can browse speciality categories from the home page; clicking a speciality opens a pre-filtered Doctor search.

#### FR-9: Service entry points

Home page provides distinct entry points for: Doctors, Hospitals, Diagnostics, Ambulances, Home Doctor, Guides.

#### FR-10: Featured/promoted content

Home page displays featured doctors or hospitals (admin-configurable). Realizes UJ-1 (entry).

#### FR-11: AI recommendation entry

Home page provides a symptom/query input field that initiates the AI Doctor Recommendation flow (FR-46).

---

## F3: Doctor Discovery & Search

**Description:** Patients can search and filter doctors by speciality, location (BD Location hierarchy), fee range, and availability. Results are ranked. Patients can also browse speciality-first to narrow results. Doctor cards display summary info for quick comparison.

#### FR-12: Doctor list with filters

Patient can browse Doctors with filters: speciality, BD Location (division/district/upazila), fee range, availability. Realizes UJ-1.

**Consequences:**
- Filter state persisted in URL via nuqs; shareable and browser-back-compatible.
- On filter change, list re-fetches via TanStack Query; previous results replaced (no infinite-scroll append unless specified).

#### FR-13: Doctor cards

Doctor cards display: name, speciality, hospital affiliation, consultation fee, rating. Clicking opens Doctor detail page.

#### FR-14: Doctor detail page

Doctor detail shows: full profile, qualifications, BMDC number (if captured), fee, hospital, Schedule slots, rating, and review list.

**Consequences:**
- Schedule slots show availability state (available / booked / closed).
- Doctor not found returns 404 page.

#### FR-15: Speciality catalog page

Patient can browse all specialities and select one to pre-filter the Doctor list.

---

## F4: Appointment Booking

**Description:** Patients book appointments by selecting a Doctor, an available Schedule slot, and confirming. The system assigns a Serial Number. Appointment history is visible in the Patient Dashboard and the Doctor Dashboard.

#### FR-16: Schedule slot selection

Patient can view a Doctor's weekly Schedule (days, time slots, location) and select an available slot. Realizes UJ-1.

**Consequences:**
- Slots shown as available/unavailable; unavailable slots are non-interactive.
- Slot availability fetched fresh on Doctor detail page load.

#### FR-17: Appointment confirmation

Patient can confirm a booking for a selected slot; system creates the Appointment with status `pending` and assigns a Serial Number.

**Consequences:**
- SMS confirmation sent to Patient (FR-72).
- Appointment appears in Patient Dashboard (FR-30) and Doctor Dashboard (FR-37).
- Duplicate booking (same Patient, same Doctor, same slot) returns a conflict error.

#### FR-18: Appointment status tracking

Appointment status flows: `pending → confirmed → completed / cancelled`.

**Consequences:**
- Patient Dashboard shows current status with label and timestamp.

---

## F5: Live Doctor Queue

**Description:** When a Doctor starts a Queue Session, Patients who have Appointments can see their Serial Number relative to the current serial being served, with an estimated wait time. The queue updates without page refresh (polling or SSE).

#### FR-19: Live queue view (Patient)

Patient can view the live Queue Session for their booked Doctor: current serial being served, their own Serial Number, estimated wait time. Realizes UJ-1.

**Consequences:**
- Queue state refreshes automatically (polling interval ≤ 5s or SSE event).
- If Queue Session not yet started, Patient sees "Queue not started yet" state.

#### FR-20: Wait time display

Wait time shown is per-Doctor configured visit duration × (Patient Serial − Current Serial); not cumulative system time.

---

## F6: Hospitals

**Description:** Patients can discover hospitals, view details and affiliated doctors, and navigate to book appointments with doctors at that hospital.

#### FR-21: Hospital list with filters

Patient can browse Hospitals filtered by BD Location.

#### FR-22: Hospital detail

Hospital detail shows: name, BD Location, contact info, facilities list, and a horizontally-scrollable carousel of available/affiliated Doctors.

**Consequences:**
- Doctor carousel links to Doctor detail page.

---

## F7: Diagnostic Labs & Tests

**Description:** Patients can discover Labs, view available tests and prices, and book Diagnostic Bookings. Discovery is location-filtered.

#### FR-23: Lab browsing

Patient can browse Labs filtered by BD Location. Realizes UJ-2.

#### FR-24: Lab detail

Lab detail shows: name, location, contact, and list of Diagnostic Tests with prices.

#### FR-25: Diagnostic booking

Patient can book a Diagnostic Test at a Lab for a specific date. Realizes UJ-2.

**Consequences:**
- Diagnostic Booking appears in Patient Dashboard (FR-31).
- SMS confirmation sent (FR-72).

---

## F8: Ambulance Services

**Description:** Patients can browse available Ambulances by type and BD Location and submit Ambulance Booking requests with destination and condition notes.

#### FR-26: Ambulance browsing

Patient can browse Ambulances filtered by type and BD Location. Realizes UJ-3.

**Consequences:**
- Ambulance cards show type, availability status, and response time estimate.

#### FR-27: Ambulance booking submission

Patient can submit an Ambulance Booking with: pickup location, destination, patient condition notes. Realizes UJ-3.

**Consequences:**
- Admin notified of new Ambulance Booking (via Admin Panel).
- Booking appears in Patient Dashboard history.

---

## F9: Home Doctor Services (Domiciliary)

**Description:** Patients can book home visits from Doctors who have published a Home Schedule. Home Schedule is separate from the chamber Schedule.

#### FR-28: Home doctor browsing & booking

Patient can browse Doctors offering home visits and book a slot from the Doctor's Home Schedule. Realizes UJ-4.

**Consequences:**
- Booking appears in Patient Dashboard and Doctor Dashboard.
- SMS confirmation sent to Patient.

---

## F10: Medical Guides

**Description:** Patients can browse medical guides (companion/assistant services) and book a Guide Booking.

#### FR-29: Guide browsing & booking

Patient can browse Guides (speciality, bio, availability) and book a Guide Booking.

**Consequences:**
- Guide Booking appears in Patient Dashboard.

---

## F11: Patient Dashboard

**Description:** Authenticated Patient's personal hub: all booking history, prescription history, and profile management.

#### FR-30: Appointment history

Patient can view all Appointments (upcoming and past) with status and Doctor info.

#### FR-31: Diagnostic booking history

Patient can view all Diagnostic Bookings with Lab, test, date, and status.

#### FR-32: Prescription history

Patient can view all Prescriptions written by Doctors after Appointments.

#### FR-33: Other booking history

Patient can view Ambulance Bookings, Home Doctor bookings, and Guide Bookings.

#### FR-34: Profile management

Patient can update profile (name, phone, medical history) and change password from dashboard.

---

## F12: Doctor Dashboard

**Description:** Authenticated Doctor's operational hub: manage Schedule, run Queue Sessions, write Prescriptions, view Patient history.

#### FR-35: Today's queue management (Doctor)

Doctor can view today's Appointment queue (serial list, patient names, times) and advance the queue by calling the next Serial Number. Realizes UJ-5.

**Consequences:**
- Current serial shown to all Patients with live Queue Sessions open (FR-19).

#### FR-36: Schedule management

Doctor can create, update, and delete weekly Schedule entries (day, time slot, location, max patients, fee). Realizes UJ-5.

#### FR-37: Home schedule management

Doctor can create, update, and delete Home Schedule slots separately from chamber Schedule.

#### FR-38: Prescription writer

Doctor can write a Prescription after an Appointment: add medicines, Diagnostic Tests, and clinical notes. Realizes UJ-6.

**Consequences:**
- Prescription saved and linked to Appointment and Patient.
- Patient can view and download PDF immediately after save.

#### FR-39: Patient history view

Doctor can view past Appointments and Prescriptions for a specific Patient.

#### FR-40: Doctor profile update

Doctor can update own profile (bio, fee, qualifications, hospital affiliation, photo) from dashboard.

---

## F13: Prescription PDF

**Description:** Prescriptions are exported as PDFs server-side (pdfkit + bwip-js barcode) and downloadable by both Patient and Doctor.

#### FR-41: Prescription PDF download

Patient can download their Prescription as a PDF. Realizes UJ-6.

**Consequences:**
- PDF includes: Doctor name, BMDC number, platform watermark, medicines list, diagnostic test list, clinical notes, barcode.
- PDF generated server-side; frontend receives download URL.

> **[NOTE FOR PM]** Prescription PDFs with barcodes may be accepted as real prescriptions by pharmacies. Doctor BMDC numbers are admin-entered with no BMDC API verification. Schedule H drug flagging is absent. BD Drug Control Ordinance 1982 compliance must be assessed before public launch. **Phase blocker — resolve before FR-41 goes live publicly.**

---

## F14: AI Features (Frontend)

**Description:** Frontend surfaces for AI Doctor Recommendation (entry: home page search) and AI Triage (symptom assessment flow). All AI inference is backend-only — no LangChain imports in frontend.

#### FR-42: AI doctor recommendation UI

Patient enters symptoms or a natural-language query; frontend calls backend AI endpoint and displays ranked Doctor suggestions. Realizes UJ-1 (alternative discovery entry).

**Consequences:**
- Output framed as "find a doctor" — never as a diagnosis.
- Loading state shown during inference (< 5s p90 target).

#### FR-43: AI triage / symptom checker UI

Patient is guided through a multi-step symptom assessment via conversational UI backed by the Triage Agent (FR-58). Realizes UJ-1 (emergency routing alternative).

**Consequences:**
- Persistent disclaimer displayed: "This is not a substitute for professional medical advice."
- If Triage Agent signals high-risk symptoms: UI immediately surfaces "Call 999" prompt and halts the flow.

#### FR-44: Conversational AI chat

Chat interface backed by LangChain session-memory chains; maintains context across turns in a session.

**Feature-specific NFRs:**
- All AI features are backend-only; no LangChain, LangGraph, or @google/generative-ai imports in frontend.

> **[NOTE FOR PM]** AI triage is a clinical decision-support surface. Bangladesh DGDA/DGHS regulations and BMRC ethics clearance are required. Gemini API ToS may prohibit medical-advice use cases — confirm contractual exception or switch provider. **Phase blocker — must resolve before FR-43 launches publicly.**

---

## F15: Contact & Support (Frontend)

#### FR-45: Contact form

Public contact form captures name, email, and message. Submitted to backend `contact-messages` module.

#### FR-46: Callback request form

Callback request form captures name, phone, and preferred time. Submitted to `callback-requests` module.

---

---

# PROJECT 2: API BACKEND (`my_doctor_backend/`)

**Technology:** Node.js ESM · Express 5.2.1 · TypeScript 6 · MongoDB 7 + Mongoose 9 · Redis (ioredis 5) · JWT (jsonwebtoken 9) + bcrypt 6 · LangChain + LangGraph + Google Gemini + OpenAI · Green Web SMS · pdfkit + bwip-js · Multer 2 · Puppeteer 24 · PM2 · Jest 30 + supertest · pnpm

**Architecture:** MVC modular monolith. Each domain module has exactly 4 files: `*.controller.ts`, `*.model.ts`, `*.routes.ts`, `*.service.ts`. All modules mount under `/api/v1/` via `src/routes/routes.ts`. Responses always via `sendResponse` utility — never `res.json()` directly. Errors always forwarded to `next(error)` — never caught and swallowed.

---

## F16: Authentication API

**Description:** Three isolated auth systems: Patient/Doctor JWT (HTTP-only cookie), Admin Clerk (handled client-side via Clerk SDK, validated server-side via Clerk JWT middleware). JWT tokens are access+refresh pair; refresh stored in Redis for revocation.

#### FR-47: Patient/Customer registration

`POST /api/v1/auth/register` — accepts email, password, name; hashes password in Mongoose pre-save hook; returns JWT pair set as HTTP-only cookies.

**Consequences:**
- Duplicate email returns 409.
- Password min-length enforced at API boundary.
- `[ASSUMPTION A-6: Lockout after N failed attempts — policy TBD]`

#### FR-48: Patient login

`POST /api/v1/auth/login` — validates credentials, issues JWT access + refresh tokens as HTTP-only cookies.

#### FR-49: Doctor login

`POST /api/v1/auth/doctor-login` — separate endpoint; issues JWT with `role: "doctor"`.

#### FR-50: Token refresh

`POST /api/v1/auth/refresh` — validates refresh token from cookie; issues new access token.

**Consequences:**
- Refresh token validated against Redis record (not just signature).
- Expired or revoked refresh token returns 401; client redirects to sign-in.

#### FR-51: Logout

`POST /api/v1/auth/logout` — clears cookies; revokes refresh token in Redis.

#### FR-52: Password reset (Customer)

`POST /api/v1/auth/forgot-password` / `reset-password` — OTP sent via Green Web SMS; OTP validated before password change.

#### FR-53: Google OAuth token exchange

`POST /api/v1/auth/google` — accepts Firebase ID token; validates with Firebase Admin SDK; creates or fetches Customer; issues platform JWT pair.

**Consequences:**
- No separate password stored for Google-auth Customers.

---

## F17: Doctor API

**Description:** Full CRUD for Doctor entities; Admin-created; Doctors can update their own profile fields.

#### FR-54: Doctor CRUD (Admin)

`GET /POST /PATCH /DELETE /api/v1/doctors/:id` — Admin-authenticated; create/read/update/delete Doctor records.

**Consequences:**
- Create requires: name, speciality, BMDC number, fee, hospital reference.
- Delete is soft-delete (status flag); Doctor profile pages return 404 for deactivated Doctors.

#### FR-55: Doctor self-profile update

`PATCH /api/v1/doctors/me` — Doctor-authenticated; can update: bio, fee, qualifications, photo, hospital affiliation.

**Consequences:**
- Doctor cannot change BMDC number, speciality, or activation status (Admin-only fields).

#### FR-56: Doctor search & filter

`GET /api/v1/doctors?speciality=&division=&district=&upazila=&feeMin=&feeMax=&available=` — public; returns paginated Doctor list with Redis cache for high-read queries.

**Consequences:**
- Cache TTL configurable; invalidated on Doctor update.
- Results ranked by: availability → rating → fee ascending.

#### FR-57: Doctor detail

`GET /api/v1/doctors/:id` — public; returns full Doctor profile including Schedule and rating.

---

## F18: Schedule API

#### FR-58: Chamber schedule CRUD

`GET /POST /PATCH /DELETE /api/v1/doctor-schedules` — Doctor-authenticated; manage weekly chamber Schedule (day, time, location, max patients, fee per slot).

#### FR-59: Home schedule CRUD

`GET /POST /PATCH /DELETE /api/v1/doctor-home-schedules` — Doctor-authenticated; manage Home Schedule slots separately.

---

## F19: Live Queue API

**Description:** Doctors start Queue Sessions; Patients poll for current serial state. Session state stored in Redis for low-latency reads.

#### FR-60: Start queue session

`POST /api/v1/doctor-live-queues` — Doctor-authenticated; creates Queue Session for today; initializes current serial to 0 in Redis.

#### FR-61: Advance queue

`PATCH /api/v1/doctor-live-queues/:id/next` — Doctor-authenticated; increments current serial in Redis; records timestamp.

**Consequences:**
- Returns updated serial state; Patient polling endpoint reads same Redis key.

#### FR-62: Get queue state (Patient)

`GET /api/v1/doctor-live-queues/:doctorId/today` — public (authenticated for serial lookup); returns current serial, total serials, estimated wait.

**Consequences:**
- Response cached in Redis; TTL ≤ 3s to ensure freshness.
- If no active Queue Session, returns `{ active: false }`.

#### FR-63: End queue session

`PATCH /api/v1/doctor-live-queues/:id/end` — Doctor-authenticated; marks session complete; removes Redis key.

---

## F20: Appointment API

#### FR-64: Book appointment

`POST /api/v1/appointments` — Customer-authenticated; creates Appointment linked to Doctor Schedule slot; assigns Serial Number.

**Consequences:**
- Serial Number = count of Appointments for that Doctor+date + 1.
- Duplicate booking (same Customer + Doctor + date slot) returns 409.
- Triggers SMS confirmation (FR-78).

#### FR-65: Get appointments (Patient)

`GET /api/v1/appointments?customerId=` — Customer-authenticated; returns paginated Appointment history.

#### FR-66: Get appointments (Doctor)

`GET /api/v1/appointments?doctorId=&date=` — Doctor-authenticated; returns today's/upcoming Appointments.

#### FR-67: Update appointment status

`PATCH /api/v1/appointments/:id/status` — Doctor-authenticated; transitions status: `pending → confirmed → completed / cancelled`.

---

## F21: Diagnostic Labs & Tests API

#### FR-68: Lab CRUD (Admin)

`GET /POST /PATCH /DELETE /api/v1/labs/:id` — Admin-authenticated.

#### FR-69: Lab browsing (public)

`GET /api/v1/labs?division=&district=` — public; returns Lab list with test catalog summary.

#### FR-70: Diagnostic test CRUD (Admin)

`GET /POST /PATCH /DELETE /api/v1/diagnostic-tests/:id` — Admin-authenticated; manages test catalog.

#### FR-71: Diagnostic booking

`POST /api/v1/diagnostic-bookings` — Customer-authenticated; creates Diagnostic Booking linked to Lab and Test.

**Consequences:**
- Booking appears in Customer's dashboard.
- SMS confirmation sent.

---

## F22: Hospital API

#### FR-72: Hospital CRUD (Admin)

`GET /POST /PATCH /DELETE /api/v1/hospitals/:id` — Admin-authenticated.

#### FR-73: Hospital browsing (public)

`GET /api/v1/hospitals?division=&district=` — public; returns Hospital list with affiliated Doctor carousel data.

---

## F23: Ambulance API

#### FR-74: Ambulance CRUD (Admin)

`GET /POST /PATCH /DELETE /api/v1/ambulances/:id` — Admin-authenticated; manages fleet.

#### FR-75: Ambulance browsing (public)

`GET /api/v1/ambulances?type=&division=` — public; returns available Ambulances.

#### FR-76: Ambulance booking

`POST /api/v1/ambulance-bookings` — Customer-authenticated; creates Ambulance Booking with pickup, destination, condition notes. Realizes UJ-3.

**Consequences:**
- Admin Panel shows new booking immediately.
- `[NOTE FOR PM]` No real-time dispatch notification to ambulance operator implemented — Admin must manually contact operator. Phase blocker for safety reliability.

---

## F24: Home Doctor Booking API

#### FR-77: Home doctor booking

`POST /api/v1/home-doctor-bookings` — Customer-authenticated; creates booking against a Doctor's Home Schedule slot.

#### FR-78: Home doctor schedule management (Doctor)

`GET /POST /PATCH /DELETE /api/v1/doctor-home-schedules` — Doctor-authenticated.

---

## F25: Guide & Guide Booking API

#### FR-79: Guide CRUD (Admin)

`GET /POST /PATCH /DELETE /api/v1/guides/:id` — Admin-authenticated.

#### FR-80: Guide booking

`POST /api/v1/guide-bookings` — Customer-authenticated.

---

## F26: Prescription API

#### FR-81: Create prescription

`POST /api/v1/prescriptions` — Doctor-authenticated; creates Prescription linked to Appointment and Customer.

**Consequences:**
- Prescription body: medicines (name, dose, frequency, duration), diagnostic tests, clinical notes.
- Linked Appointment must belong to the authenticated Doctor.

#### FR-82: Get prescriptions (Patient)

`GET /api/v1/prescriptions?customerId=` — Customer-authenticated.

#### FR-83: Get prescriptions (Doctor)

`GET /api/v1/prescriptions?doctorId=` — Doctor-authenticated.

#### FR-84: Prescription PDF download

`GET /api/v1/prescriptions/:id/pdf` — Customer or Doctor authenticated; generates and streams PDF.

**Consequences:**
- PDF generated server-side via pdfkit; barcode via bwip-js.
- PDF includes: Doctor name, BMDC number, platform watermark, medicines, tests, notes, barcode.
- Cached PDF stored in `/uploads/` after first generation; subsequent requests served from cache.

---

## F27: AI Features (Backend)

**Description:** All AI inference is backend-only. LangChain + LangGraph stateful agents run in the backend process. MongoDB Atlas Vector Search powers semantic Doctor matching. Rate limiting per user prevents cost overrun.

#### FR-85: AI doctor recommendation

`POST /api/v1/ai/recommend-doctors` — Customer-authenticated (or public with rate limit); accepts symptoms/query; uses LangChain + Gemini + MongoDB Atlas Vector Search; returns ranked Doctor suggestions.

**Consequences:**
- Response < 5s p90.
- Output framed as "find a doctor" not a diagnosis.
- Rate-limited per user: max N requests/hour (N configurable via env var `AI_RATE_LIMIT_PER_HOUR`).

#### FR-86: AI triage agent

`POST /api/v1/ai/triage` (session-based, LangGraph stateful) — Customer-authenticated; multi-turn symptom assessment; returns care recommendation: self-care / book doctor / go to emergency.

**Consequences:**
- Response always includes disclaimer: "This is not a substitute for professional medical advice."
- If high-risk symptom detected (chest pain, stroke signs, severe trauma): response includes `emergencyAlert: true` and "Call 999" message; flow halted.
- Session state maintained in Redis for multi-turn continuity.
- Rate-limited per user.
- **[ASSUMPTION A-1: BMRC ethics clearance obtained before this endpoint is enabled in production.]**

#### FR-87: Conversational AI

`POST /api/v1/ai/chat` — Customer-authenticated; LangChain chain with session memory; general healthcare Q&A.

**Consequences:**
- Session memory persisted in Redis; TTL 30 minutes.
- No clinical diagnosis output; framed as informational.

**Feature-specific NFRs:**
- All LangChain/LangGraph imports in backend only — never exposed to frontend or admin panel bundles.
- AI inference errors (provider timeout, quota exceeded) return graceful 503 with user-friendly message.

---

## F28: Notification API (SMS)

#### FR-88: SMS booking confirmation

On Appointment, Diagnostic Booking, Ambulance Booking, or Home Doctor Booking creation — backend sends SMS confirmation to Customer phone via Green Web SMS API.

**Consequences:**
- SMS log record created for each outbound message (FR-89).
- SMS failures logged; booking not rolled back on SMS failure.

#### FR-89: SMS log persistence

All outbound SMS attempts (success and failure) logged to `sms-logs` collection with: recipient phone, message body, timestamp, provider response code.

#### FR-90: Send app link SMS

`POST /api/v1/sms-logs/send-app-link` — Admin-authenticated; sends platform URL via SMS to a phone number.

---

## F29: Analytics API

#### FR-91: Platform statistics

`GET /api/v1/analytics` — Admin-authenticated; returns aggregate counts: total Doctors, Patients, Appointments, Diagnostic Bookings, Ambulance Bookings, revenue (placeholder until payment integration).

**Consequences:**
- Response cached in Redis; TTL 60s.
- Cached result invalidated on any CRUD operation to primary entities.

---

## F30: Catalog APIs (Admin-managed, Public-read)

#### FR-92: Speciality CRUD

`GET /POST /PATCH /DELETE /api/v1/specialities` — Admin auth for write; public GET; cached in Redis.

#### FR-93: Concentration CRUD

`GET /POST /PATCH /DELETE /api/v1/concentrations` — Admin auth for write; public GET.

#### FR-94: BD Location CRUD

`GET /POST /PATCH /DELETE /api/v1/bd-locations` — Admin auth for write; public GET (division/district/upazila hierarchy); cached in Redis (high-read, rarely changes).

---

## F31: Contact & Callback API

#### FR-95: Contact message submission

`POST /api/v1/contact-messages` — public; captures name, email, message.

#### FR-96: Callback request submission

`POST /api/v1/callback-requests` — public; captures name, phone, preferred time.

---

## F32: File Upload & Static Assets

#### FR-97: File upload (Multer)

`POST /api/v1/upload` (or per-module endpoints) — authenticated; files stored in `/uploads/`; Multer restricts MIME types and file size.

**Consequences:**
- Upload path never under `src/` — always `/uploads/`.
- Files served at `http://localhost:6089/uploads/`; frontend proxies via Next.js rewrite `/uploads/:path*`.

---

## Backend Non-Functional Requirements

### NFR-B1: Response format

All HTTP responses via `sendResponse(res, { statusCode, message, data, meta })`. Never call `res.json()` directly. All API responses wrapped: `{ success: boolean, message?: string, data: T, meta?: PaginationMeta }`.

### NFR-B2: Error handling

All errors forwarded to `next(error)` for centralized Express error handler. No catch-and-swallow in controllers. Error responses include structured `{ success: false, message, stack? }` (stack omitted in production).

### NFR-B3: Performance
- API response < 500ms p95 for standard list/detail endpoints (non-AI).
- Live queue polling response < 200ms (Redis-backed).
- AI recommendation response < 5s p90.
- Prescription PDF generation < 3s (first request); subsequent requests served from `/uploads/` cache.

### NFR-B4: Security
- JWT tokens in HTTP-only cookies — no localStorage.
- Helmet, CORS, express-rate-limit on all routes.
- Three isolated auth systems: Customer JWT, Doctor JWT, Admin Clerk — tokens never cross roles.
- Auth middleware stack: `verifyAccessToken` (JWT) → `protect(role)` — always both on protected routes.
- Password hashing in Mongoose pre-save hook only — never in service layer.
- File uploads via Multer restricted to `/uploads/`; MIME type whitelist enforced.

### NFR-B5: Availability
- PM2 process restart on crash; target 99.5% monthly uptime for non-emergency paths.
- **[NOTE FOR PM]** Ambulance dispatch is safety-critical. A 30-second outage is a patient safety event. Redis HA and MongoDB replica set failover must be configured before Ambulance Booking goes live. **Phase blocker.**
- Break-glass procedure required if Clerk (Admin auth) is unavailable.

### NFR-B6: Scalability
- Redis caching for high-read endpoints (doctor lists, specialities, BD Locations, queue state).
- MongoDB Atlas managed cluster with replica set. **[ASSUMPTION A-3]**
- PM2 cluster mode for horizontal scaling on single host.
- `.lean()` on Mongoose queries that don't need document methods.

### NFR-B7: Testing
- Test files in `src/tests/`; pattern `*.test.ts`.
- Jest 30 + ts-jest ESM preset; run with `NODE_ENV=test node --experimental-vm-modules node_modules/jest/bin/jest.js`.
- Integration test pattern: describe → setup token → public routes → protected routes with `Authorization: Bearer <token>`.
- Always close Mongoose in `afterAll`.
- Mock external services (Redis, LangChain, Puppeteer, Green Web SMS) — never hit real services in tests.

### NFR-B8: Module conventions
- ESM: all local imports include `.js` extension even for `.ts` source files.
- Each module has exactly 4 files: `*.controller.ts`, `*.model.ts`, `*.routes.ts`, `*.service.ts`.
- All new routes registered in `src/routes/routes.ts`.

---

---

# PROJECT 3: ADMIN PANEL (`my_doctor_backend/public/`)

**Technology:** React 19.2.4 + Vite · TypeScript strict · TanStack Router 1.168 (file-based, auto-generated `routeTree.gen.ts`) · TanStack Query v5 · TanStack Table v8 · Zustand 5 · Clerk (@clerk/clerk-react 5) · shadcn/ui + Tailwind 4 · React Hook Form + Zod · Recharts 3 · pnpm

**Architecture:** Feature-based modular SPA. Routes in `src/routes/` (file-based, never edit `routeTree.gen.ts`). Feature UIs in `src/features/<domain>/`. Zustand for client state (NOT Redux). Auth via Clerk — `useAuth()` / `useUser()` — not custom JWT.

**Deployment:** Built as static files to `my_doctor_backend/public/dist/`; served by the Express backend.

---

## F33: Admin Authentication

**Description:** Admin Panel uses Clerk for authentication — completely isolated from Patient/Doctor JWT. Admin identity is verified server-side by the backend Clerk middleware on protected routes.

#### FR-98: Admin login via Clerk

Admin authenticates via Clerk-hosted UI (email/password or SSO configured in Clerk dashboard). `useAuth()` from `@clerk/clerk-react` provides session token.

**Consequences:**
- Unauthenticated users redirected to Clerk sign-in by TanStack Router `beforeLoad` guard.
- Auth state stored in Zustand (`useAuthStore`) — not Redux.
- Clerk token passed as `Authorization: Bearer <clerk_token>` to all Admin API requests.

#### FR-99: Admin route protection

All routes under `_authenticated/` layout check Clerk auth state in `beforeLoad`; redirect to `(auth)/sign-in` if not authenticated.

**Consequences:**
- TanStack Router's file-based routing enforces this at the layout level — no per-route auth check needed.

---

## F34: Admin Dashboard

**Description:** Landing page after login. Shows aggregate platform statistics (Doctors, Patients, Appointments, bookings) with charts. Quick-access links to all management sections.

#### FR-100: Statistics overview

Admin dashboard displays: total Doctors, total Patients (Customers), total Appointments, total Diagnostic Bookings, total Ambulance Bookings, revenue placeholder.

**Consequences:**
- Data fetched from `GET /api/v1/analytics` with TanStack Query; 60s stale time.
- Charts rendered via Recharts.

#### FR-101: Quick navigation

Dashboard provides direct navigation links to all entity management sections.

---

## F35: Doctor Management (Admin)

**Description:** Full lifecycle management of Doctor entities — create, view, edit, activate/deactivate, and delete. Admin is the only actor who can create Doctors in v1.

#### FR-102: Doctor list table

Admin can view all Doctors in a sortable, filterable TanStack Table: name, speciality, hospital, BMDC number, status (active/inactive), fee.

**Consequences:**
- Pagination, sorting, and filtering handled client-side via TanStack Table; data fetched from `GET /api/v1/doctors`.

#### FR-103: Create doctor

Admin can create a Doctor record via form: name, email, password (temporary), BMDC number, speciality, concentration, fee, hospital affiliation, photo.

**Consequences:**
- `[ASSUMPTION A-2: BMDC number is a validated field at creation — format enforced, not empty-string allowed.]`
- New Doctor receives welcome SMS with temporary credentials.

#### FR-104: Edit doctor

Admin can edit all Doctor fields including BMDC number, speciality, and activation status.

#### FR-105: Activate / deactivate doctor

Admin can toggle Doctor active status; deactivated Doctors disappear from public search results.

**Consequences:**
- Deactivation is soft-delete (status flag); records retained.

---

## F36: Hospital Management (Admin)

#### FR-106: Hospital CRUD

Admin can create, view, edit, and delete Hospital records: name, BD Location, contact, facilities list, affiliated doctors.

---

## F37: Appointment Management (Admin)

#### FR-107: Appointment list

Admin can view all Appointments across all Doctors and Patients: filterable by Doctor, date, and status.

#### FR-108: Appointment status override

Admin can manually update Appointment status (e.g., cancel a booking).

---

## F38: Patient (Customer) Management (Admin)

#### FR-109: Customer list

Admin can view all registered Customers: name, email, phone, registration date.

#### FR-110: Customer profile view

Admin can view a Customer's profile and booking history.

---

## F39: Diagnostic Lab Management (Admin)

#### FR-111: Lab CRUD

Admin can create, edit, and delete Labs: name, BD Location, contact, assigned Diagnostic Tests.

#### FR-112: Diagnostic test CRUD

Admin can create, edit, and delete Diagnostic Tests: name, category, price. Assign tests to Labs.

#### FR-113: Diagnostic booking management

Admin can view all Diagnostic Bookings with Lab, test, Patient, date, and status.

---

## F40: Ambulance Management (Admin)

#### FR-114: Ambulance fleet CRUD

Admin can create, edit, and delete Ambulance records: type, operator contact, BD Location, availability status.

#### FR-115: Ambulance booking management

Admin can view all Ambulance Bookings: Patient, pickup, destination, condition notes, status. Admin manually coordinates dispatch with operator.

**Consequences:**
- Admin can update booking status (pending → dispatched → completed).

---

## F41: Guide Management (Admin)

#### FR-116: Guide CRUD

Admin can create, edit, and delete Guide profiles: name, speciality, bio, availability.

---

## F42: Catalog Management (Admin)

#### FR-117: Speciality CRUD

Admin can create, edit, and delete medical Speciality entries.

#### FR-118: Concentration CRUD

Admin can create, edit, and delete Concentration (sub-speciality) entries.

#### FR-119: BD Location CRUD

Admin can manage BD Location hierarchy: create/edit divisions, districts, and upazilas.

---

## F43: SMS Log Viewer (Admin)

#### FR-120: SMS log table

Admin can view all outbound SMS log records: recipient, message preview, timestamp, delivery status.

#### FR-121: Send app link SMS

Admin can send the platform URL via SMS to a specified phone number.

---

## F44: Contact & Callback Management (Admin)

#### FR-122: Contact message list

Admin can view all contact form submissions: name, email, message, timestamp.

#### FR-123: Callback request list

Admin can view all callback requests: name, phone, preferred time, timestamp. Admin marks requests as handled.

---

## Admin Panel Non-Functional Requirements

### NFR-A1: Routing
- Routes file-based under `src/routes/`; `routeTree.gen.ts` auto-generated by TanStack Router — **never edited manually**.
- Every route file exports `const Route = createFileRoute('...')({...})`.

### NFR-A2: State management
- Zustand for all client state (auth token, UI state).
- TanStack Query for all server data fetching/caching.
- Never use Redux in Admin Panel.

### NFR-A3: Code style
- `singleQuote: true`, `semi: false`, `tabWidth: 2`, `trailingComma: 'es5'`, `endOfLine: 'lf'` (Prettier).
- Import order enforced by `@trivago/prettier-plugin-sort-imports`.
- Tailwind classes sorted via `prettier-plugin-tailwindcss`.
- Package manager: pnpm only.

### NFR-A4: Auth
- Use `useAuth()` / `useUser()` from `@clerk/clerk-react`.
- Auth token cookie key: `thisisjustarandomstring` (Zustand store reads from this cookie).
- Never mix Clerk tokens with Patient/Doctor JWT endpoints.

### NFR-A5: Performance
- Admin data tables use TanStack Table with client-side pagination for ≤ 1,000 rows; server-side pagination required for larger datasets.
- TanStack Query `staleTime: 60000ms` default for list queries.

---

---

## 7. Cross-Cutting Non-Functional Requirements

### NFR-X1: Core Web Vitals (Frontend)
- Patient-facing pages achieve Core Web Vitals "Good" thresholds (LCP < 2.5s, CLS < 0.1, INP < 200ms) on 4G mobile.
- Phantom UI skeletal loading states on all data-fetching pages.

### NFR-X2: Mobile responsiveness
- All Patient Frontend pages fully usable on mobile browser (Tailwind mobile-first; no horizontal scroll at 375px viewport).

### NFR-X3: BD geographic coverage
- BD Location hierarchy (Division → District → Upazila) used as the primary location filter across all discovery surfaces.

### NFR-X4: Observability
- Centralized `sendResponse` utility for all API responses.
- Centralized Express error handler — no silent error swallowing.
- SMS log records for all outbound notifications.

### NFR-X5: Cost controls
- AI inference rate-limited per user (env var `AI_RATE_LIMIT_PER_HOUR`).
- Redis caching for high-read API responses.
- Gemini API + Green Web SMS usage monitored; budget alerts configured before launch.

### NFR-X6: Isolation
- Three auth systems never cross-contaminate: Customer JWT, Doctor JWT, Admin Clerk.
- Frontend ESLint blocks imports matching `*my_doctor_backend*` or `*my-doctor-admin-panel*`.
- Admin Panel never imports from Patient Frontend or Backend source.

---

## 8. Success Metrics

> **[NOTE FOR PM]** Targets assume organic + direct outreach. If acquisition is solely word-of-mouth at MVP, reduce targets 5–10x.

| Metric | Target (6 months post-launch) | Counter-metric |
|---|---|---|
| Registered Patients | 5,000 | Registration-to-first-booking conversion > 30% |
| Appointments booked/month | 1,000 by month 6 | Cancellation rate < 15%; repeat booking rate > 20% |
| Diagnostic Bookings/month | 300 by month 6 | Booking completion rate > 70% |
| Doctor Queue Sessions/day | 50 active Doctors running queues | Queue abandonment < 20% |
| AI recommendation sessions/month | 500 | Recommendation → Appointment conversion > 15% |
| Doctor profile completeness | 95% of Doctors have BMDC number, fee, Schedule | Bounce rate on Doctor detail < 40% |
| SMS delivery rate | > 95% | Opt-out rate < 2% |
| Platform uptime | 99.5% monthly (non-emergency paths) | P1 incident count (Ambulance dispatch failure) = 0 |

---

## 9. Constraints

- **Bangladesh telecom:** Green Web SMS API only; no Twilio or international provider.
- **AI cost:** Gemini API + OpenAI inference costs must be monitored; rate-limited per user.
- **No mobile app:** Frontend is Next.js web-only; PWA not yet implemented.
- **Backend hosting:** Single Node.js host (PM2); no container orchestration in v1.
- **Admin auth:** Clerk SaaS — external dependency and per-seat cost; break-glass procedure needed.
- **No payment processor:** Fee display is informational; actual payment is offline.

---

## 10. Deferred / Open Items

| # | Item | Owner | Revisit trigger |
|---|---|---|---|
| D-1 | Payment integration (Bkash/Nagad/SSL Commerz) | Business | Post-MVP traction |
| D-2 | Video consultation (WebRTC) | Product | User demand signal |
| D-3 | Bangla language UI | Engineering | i18n architecture decision |
| D-4 | Doctor self-registration flow | Product | After 100 Doctors listed |
| D-5 | Rating/review write flow | Product | After review display confirmed working |
| D-6 | Real-time ambulance operator notification | Engineering | Before Ambulance feature public launch |
| D-7 | Revenue model confirmation | Business | Before doctor onboarding pipeline designed |
| D-8 | Queue real-time mechanism (SSE/WebSocket) | Backend lead | At 20 concurrent Queue Sessions |

---

## 11. Open Questions

1. **Queue real-time mechanism:** Current: polling. Is SSE or WebSocket warranted at expected concurrency? Target: decide before scaling to 50+ concurrent Queue Sessions. *Owner: Backend lead.*
2. **AI regulatory clearance:** BMRC ethics clearance + DGDA classification for AI Triage (FR-86). Gemini ToS medical-advice exception or provider switch. **Phase blocker — must resolve before FR-86 launches publicly.**
3. **Prescription regulatory compliance:** BMDC registration verification flow; Schedule H drug control mechanism. **Phase blocker for public Prescription PDF download.**
4. **Ambulance HA:** Redis HA + MongoDB replica failover required before Ambulance Booking goes live. *Owner: Infra.*
5. **Doctor lockout policy:** Failed login attempt lockout threshold and duration. *Owner: Security/PM.*
6. **Data retention:** Appointment and Prescription record retention period. *Owner: Legal/PM.*
7. **Payment provider:** Which BD payment gateway (Bkash, Nagad, SSL Commerz)? Required before any paid consultation feature. *Owner: Business. Q3 2026.*
8. **Doctor BMDC verification:** Should BMDC numbers be verified against a registry API at onboarding? *Owner: Product. Revisit before public launch.*

---

## 12. Technical Architecture Summary

Three-tier architecture; three distinct applications sharing one MongoDB/Redis backend:

| Application | Path | Technology | Auth |
|---|---|---|---|
| Patient Frontend | `my_doctor_frontend/` | Next.js 16 App Router | JWT HTTP-only cookies |
| API Backend | `my_doctor_backend/` | Express 5 + MongoDB + Redis | Issues JWT; validates Clerk admin |
| Admin Panel | `my_doctor_backend/public/` | React + Vite + TanStack Router | Clerk |

**Key integration points:**
- Frontend and Admin Panel both call `http://localhost:6089/api/v1/` (backend port 6089).
- Frontend proxies `/uploads/:path*` to backend via Next.js rewrite.
- Admin Panel built as static files; served from `my_doctor_backend/public/dist/` by Express.
- All API responses: `{ success, message?, data, meta? }` — `ApiResponse<T>` type.
- Frontend adapters in `src/adapters/` map `_id → id` before data reaches components.

---

## 13. Assumptions Index

| ID | Assumption | Location |
|---|---|---|
| A-1 | BMRC ethics clearance obtained before AI Triage (FR-86) is enabled in production | FR-86, Open Q2 |
| A-2 | BMDC number captured as validated field (format-enforced, non-empty) at Doctor creation | FR-103 |
| A-3 | MongoDB Atlas managed cluster with replica set; Redis single-node acceptable for MVP | NFR-B6 |
| A-4 | Platform revenue model is commission/listing-based (unconfirmed) | §4.1 |
| A-5 | Acquisition channel is primarily direct outreach / word-of-mouth at MVP | §8 |
| A-6 | Failed login lockout policy (threshold N and duration) TBD — no lockout enforced in MVP | FR-47, Open Q5 |
