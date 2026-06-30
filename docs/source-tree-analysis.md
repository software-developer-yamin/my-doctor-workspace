# Source Tree Analysis

**Generated:** 2026-06-25

---

## Repository Structure

```
my-doctor-workspace/
├── my_doctor_frontend/          # Patient-facing Next.js web app
├── my_doctor_backend/           # Express REST API + Admin SPA (nested)
│   └── public/                  # Admin Panel (React + Vite SPA)
├── docs/                        # Project documentation (this folder)
├── design-artifacts/            # UI/UX design files
├── _bmad/                       # BMAD workflow tooling
└── _bmad-output/                # Generated planning artifacts
```

---

## Part 1: Patient Frontend (`my_doctor_frontend/`)

```
my_doctor_frontend/
├── src/
│   ├── app/                     # Next.js App Router — pages and layouts
│   │   ├── (auth)/              # Auth route group (sign-in, sign-up, doctor-sign-in, onboarding, forgot-password)
│   │   ├── (primary)/           # Public-facing pages (no auth required)
│   │   │   ├── (home)/          # Homepage
│   │   │   ├── doctors/         # Doctor listing + profile pages
│   │   │   ├── hospitals/       # Hospital listing + detail pages
│   │   │   ├── diagnostics/     # Diagnostic lab listing
│   │   │   ├── ambulances/      # Ambulance services
│   │   │   ├── guides/          # Medical guides
│   │   │   ├── search/          # Global search
│   │   │   ├── specializations/ # Doctor specializations
│   │   │   ├── book/            # Booking flows
│   │   │   ├── medical-records/ # Patient medical records (public entry)
│   │   │   ├── telemedicine/    # Telemedicine pages
│   │   │   ├── triage/          # AI triage tool
│   │   │   ├── tracker/         # Health tracker
│   │   │   ├── domiciliary-services/ # Home doctor services
│   │   │   └── ...              # blogs, about, careers, contact, etc.
│   │   ├── (secondary)/         # Secondary public pages
│   │   └── (dashboard)/         # Authenticated dashboard
│   │       ├── doctor/          # Doctor dashboard (appointments, bookings, prescriptions, profile)
│   │       └── patient/         # Patient dashboard (appointments, medical records, bookings, etc.)
│   │
│   ├── components/              # Reusable UI components
│   │   ├── ui/                  # shadcn/ui primitives (Button, Card, Dialog, etc.)
│   │   ├── common/              # Shared layout components (Navbar, Footer, etc.)
│   │   ├── cards/               # Card components (DoctorCard, HospitalCard, etc.)
│   │   ├── sections/            # Page section components
│   │   ├── auth/                # Auth-specific components
│   │   ├── app-primary/         # Components for (primary) pages
│   │   ├── app-patient/         # Components for patient dashboard
│   │   └── app-dashboard/       # Components for doctor dashboard
│   │
│   ├── adapters/                # API response → frontend type adapters
│   │   ├── doctor.adapter.ts    # Transforms doctor API data
│   │   ├── hospital.adapter.ts
│   │   ├── ambulance.adapter.ts
│   │   ├── appointment.adapter.ts
│   │   ├── diagnostic.adapter.ts
│   │   ├── queue.adapter.ts     # Live queue data adapter
│   │   ├── prescription.adapter.ts
│   │   └── ...
│   │
│   ├── services/                # API call layer (Axios)
│   │   ├── doctor.service.ts
│   │   ├── hospital.service.ts
│   │   ├── appointment.service.ts
│   │   ├── auth.service.ts
│   │   ├── queue.service.ts     # Live queue API calls
│   │   ├── medical-records.service.ts
│   │   └── ...
│   │
│   ├── redux/                   # Redux Toolkit state
│   │   ├── store.ts             # Redux store config
│   │   └── slices/
│   │       ├── auth-slice.ts    # Auth state (user, token)
│   │       └── app-slice.ts     # Global app state
│   │
│   ├── hooks/                   # Custom React hooks
│   ├── types/                   # TypeScript interfaces/types
│   ├── lib/                     # Utility libraries (cn, axios config, etc.)
│   ├── config/                  # App-level config constants
│   ├── context/                 # React Context providers
│   ├── providers/               # App-level providers (Redux, Query, Theme)
│   └── data/                    # Static/mock data
│
├── public/                      # Static assets (images, icons, fonts)
├── package.json                 # Dependencies (Next.js, Redux, React Query, shadcn, etc.)
├── next.config.ts               # Next.js configuration
├── tsconfig.json                # TypeScript config
└── .env                         # Environment variables (Firebase, API URL, etc.)
```

**Entry point:** `src/app/layout.tsx` → `src/app/(primary)/(home)/page.tsx`

---

## Part 2: API Backend (`my_doctor_backend/`)

```
my_doctor_backend/
├── src/
│   ├── app.ts                   # Express app setup (CORS, sessions, middleware)
│   ├── bootstrap.ts             # Server startup
│   ├── routes/
│   │   └── routes.ts            # Master API router (all module routes)
│   │
│   ├── modules/                 # Feature modules (controller → service → model pattern)
│   │   ├── users/               # User auth (login, register, JWT, refresh)
│   │   ├── doctors/             # Doctor CRUD + profile management
│   │   ├── doctor-schedules/    # Weekly schedule management
│   │   ├── doctor-home-schedules/  # Home visit schedules
│   │   ├── doctor-live-queues/  # Real-time queue serial tracking
│   │   ├── doctor-reviews/      # Review & rating system
│   │   ├── hospitals/           # Hospital CRUD + filters
│   │   ├── appointments/        # Appointment booking + completion
│   │   ├── customers/           # Patient profile management
│   │   ├── ambulances/          # Ambulance fleet management
│   │   ├── ambulance-bookings/  # Ambulance dispatch requests
│   │   ├── diagnostic-tests/    # Diagnostic test catalog
│   │   ├── labs/                # Diagnostic lab management
│   │   ├── diagnostic-bookings/ # Lab test booking
│   │   ├── guides/              # Medical guide management
│   │   ├── guide-bookings/      # Guide booking
│   │   ├── home-doctor-bookings/ # Home visit booking
│   │   ├── prescriptions/       # Prescription writing + PDF generation
│   │   ├── specialities/        # Medical specialization catalog
│   │   ├── concentrations/      # Sub-specialization catalog
│   │   ├── bd-locations/        # Bangladesh location data (division/district/upazila)
│   │   ├── sms-logs/            # SMS notification history
│   │   ├── contact-messages/    # Contact form submissions
│   │   ├── callback-requests/   # Call-me-back requests
│   │   └── cities/              # City data
│   │
│   ├── database/
│   │   ├── init_mongodb.ts      # MongoDB connection init
│   │   └── init_redis.ts        # Redis connection init
│   │
│   ├── middlewares/             # Express middleware (auth guard, error handler)
│   ├── helpers/                 # Shared helper functions
│   ├── utils/                   # Utilities (logger, error response, etc.)
│   ├── types/                   # Shared TypeScript types
│   ├── base/                    # Base classes (BaseController, BaseService, etc.)
│   ├── config/                  # App config (JWT secrets, CORS origins, etc.)
│   └── tests/                   # Jest test suite
│
├── public/                      # Admin Panel SPA (separate sub-project, see Part 3)
├── documents/                   # Uploaded patient/doctor documents
├── package.json
├── ecosystem.config.cjs         # PM2 process config
├── jest.config.js               # Test config
├── tsconfig.json
└── .env                         # MongoDB URI, JWT secrets, SMS API key, port
```

**Entry point:** `src/bootstrap.ts` → starts HTTP server on configured PORT  
**API prefix:** `/api/v1/` (all routes)

---

## Part 3: Admin Panel (`my_doctor_backend/public/`)

```
my_doctor_backend/public/
├── src/
│   ├── main.tsx                 # React entry point
│   ├── routes/                  # TanStack Router file-based routes
│   │   ├── __root.tsx           # Root layout
│   │   ├── (auth)/              # Login/auth pages
│   │   ├── _authenticated/      # Auth-guarded admin routes
│   │   └── (errors)/            # Error pages
│   │
│   ├── features/                # Feature modules (co-located with UI)
│   │   ├── dashboard/           # Admin dashboard stats
│   │   ├── doctors/             # Doctor management
│   │   ├── hospitals/           # Hospital management
│   │   ├── appointments/        # Appointment management
│   │   ├── customers/           # Patient management
│   │   ├── ambulances/          # Ambulance management
│   │   ├── ambulance-bookings/  # Ambulance booking management
│   │   ├── diagnostic-tests/    # Diagnostic catalog management
│   │   ├── diagnostic-bookings/ # Diagnostic booking management
│   │   ├── labs/                # Lab management
│   │   ├── specialities/        # Specialization management
│   │   ├── concentrations/      # Concentration management
│   │   ├── bd-locations/        # Location data management
│   │   ├── doctor-live-queues/  # Live queue admin view
│   │   ├── doctor-home-schedules/ # Home schedule admin
│   │   ├── home-doctor-bookings/ # Home visit booking admin
│   │   ├── guide-bookings/      # Guide booking admin
│   │   ├── guides/              # Guide management
│   │   ├── users/               # User management
│   │   ├── sms-logs/            # SMS log viewer
│   │   ├── contact-messages/    # Contact form management
│   │   ├── callback-requests/   # Callback request management
│   │   ├── chats/               # Chat/AI conversation management
│   │   ├── tasks/               # Admin task management
│   │   ├── apps/                # App settings
│   │   └── settings/            # System settings
│   │
│   ├── components/              # Shared UI components
│   ├── stores/                  # Zustand state stores
│   ├── hooks/                   # Custom hooks
│   ├── lib/                     # Utilities (axios, query client, etc.)
│   ├── config/                  # Config constants
│   ├── context/                 # React Context
│   └── styles/                  # Global styles
│
├── dist/                        # Built admin SPA (served by Express static)
├── package.json                 # Vite, React, TanStack deps
├── vite.config.ts               # Vite build config
└── tsconfig.json
```

**Entry point:** `src/main.tsx`  
**Served by:** Express static middleware from `my_doctor_backend` serving `public/dist/`
