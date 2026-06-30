# Architecture — Patient Frontend

**Part:** `my_doctor_frontend/`  
**Type:** Web Application (Next.js)  
**Generated:** 2026-06-25

---

## Executive Summary

The patient frontend is a Next.js 15 App Router application. It serves as the public-facing healthcare portal where patients discover doctors, hospitals, labs, and ambulances; book appointments; track live queues; and manage their medical records. It communicates exclusively with the Express REST API via Axios.

---

## Technology Stack

| Category | Technology | Notes |
|----------|-----------|-------|
| Framework | Next.js 15 (App Router) | SSR + CSR hybrid |
| Language | TypeScript | Strict mode |
| UI | shadcn/ui + Phantom UI | Tailwind-based component library |
| State | Redux Toolkit | Auth + global app state |
| Data Fetching | TanStack React Query v5 | Server state, caching, mutations |
| HTTP | Axios | Centralized client in `lib/` |
| Auth | Firebase (Google OAuth) + custom JWT | Session via cookies |
| Forms | React Hook Form + Zod | Typed form validation |
| Package Manager | pnpm | Workspace: `pnpm-workspace.yaml` |
| Icons | HugeIcons | `@hugeicons/react` |
| Animation | Embla Carousel | Carousels and sliders |

---

## Architecture Pattern

**Layered Component Architecture** with clear separation:

```
Pages (app/)
  └── Components (components/)
        └── Services (services/)        ← API calls
              └── Adapters (adapters/)  ← Transform API → UI types
                    └── Types (types/)  ← Shared interfaces
```

State is split:
- **Redux Toolkit:** Auth state (user, token), global UI state
- **React Query:** All server-fetched data (doctors, appointments, queues, etc.)

---

## Routing Structure

Next.js App Router with route groups:

| Group | Path | Access | Purpose |
|-------|------|--------|---------|
| `(auth)` | `/sign-in`, `/sign-up`, `/doctor-sign-in`, `/onboarding`, `/forgot-password` | Public | Authentication flows |
| `(primary)` | `/`, `/doctors`, `/hospitals`, `/search`, etc. | Public | Main patient portal pages |
| `(secondary)` | Various | Public | Secondary informational pages |
| `(dashboard)/patient` | `/dashboard/patient/*` | Auth (Patient) | Patient dashboard |
| `(dashboard)/doctor` | `/dashboard/doctor/*` | Auth (Doctor) | Doctor dashboard |

---

## Data Flow

```
User Action
  → React Component
  → React Query hook / Redux dispatch
  → Axios service call (services/*.service.ts)
  → Express API /api/v1/...
  → Response → Adapter (adapters/*.adapter.ts) → typed UI data
  → Component re-renders
```

**Adapters** (`src/adapters/`) are a key pattern: they transform raw API response shapes into strongly-typed frontend objects, decoupling UI from backend schema changes.

---

## Authentication

- **Patient auth:** Firebase Google OAuth → backend validates → sets JWT cookie + session
- **Doctor auth:** Custom email/password → JWT access token + refresh token (cookies)
- **Auth state:** Stored in Redux `auth-slice.ts`
- **Route protection:** Next.js middleware or layout-level auth checks
- **Dashboard routing:** `(dashboard)/auth.config.ts` defines auth rules per route group

---

## Component Organization

```
components/
├── ui/              # Primitive shadcn/ui: Button, Card, Input, Dialog, Sheet, etc.
├── common/          # Shared layout: Navbar, Footer, Breadcrumb, LoadingSpinner
├── cards/           # Domain cards: DoctorCard, HospitalCard, DiagnosticCard, etc.
├── sections/        # Page sections: HeroSection, FeaturesSection, etc.
├── auth/            # Auth forms and flows
├── app-primary/     # Components used in (primary) route group pages
├── app-patient/     # Patient dashboard-specific components
└── app-dashboard/   # Doctor dashboard-specific components
```

---

## Key Features

| Feature | Implementation |
|---------|---------------|
| Doctor discovery | `/doctors` page + `/search` with filters (specialty, location, fee) |
| Live queue tracking | `queue.service.ts` + `queue.adapter.ts` → real-time serial banner |
| Appointment booking | Multi-step booking flow under `/book/` |
| Prescription viewer | Patient dashboard → medical records |
| Triage tool | `/triage` — AI-powered symptom checker (calls backend LangChain) |
| Home doctor booking | `/domiciliary-services` → booking flow |
| Ambulance request | `/ambulances` → form-based request |
| Medical records | Patient dashboard → document upload/download |

---

## Environment Variables

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_APP_URL` | Application base URL |
| `NEXT_PUBLIC_API_URL` | Backend REST API base URL |
| `NEXT_PUBLIC_ASSETS_URL` | Media/document CDN URL |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase project key |
| `NEXT_PUBLIC_ENABLE_ANALYTICS` | Feature toggle |
| `NEXT_PUBLIC_ENABLE_MAINTENANCE_MODE` | Feature toggle |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Support WhatsApp contact |
| `NEXT_PUBLIC_CONTACT_PHONE` | Support phone number |

---

## Development Workflow

```bash
cd my_doctor_frontend
pnpm install
pnpm dev          # Dev server on http://localhost:3000
pnpm build        # Production build
pnpm start        # Start production server
pnpm lint         # ESLint check
```

**PM2 deployment:** `ecosystem.config.cjs` configures PM2 for production.

---

## Testing

No frontend test suite detected (quick scan). Testing likely relies on manual QA and E2E.
