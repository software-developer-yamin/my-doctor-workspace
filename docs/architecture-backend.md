# Architecture — API Backend

**Part:** `my_doctor_backend/`  
**Type:** Backend API (Node.js/Express)  
**Generated:** 2026-06-25

---

## Executive Summary

The My Doctor backend is a TypeScript Express.js REST API using ESM modules. It provides all data services for the patient frontend, admin panel, and potential mobile clients. It integrates MongoDB (via Mongoose) for persistence, Redis for caching and sessions, LangChain for AI features, and a Green Web SMS gateway for notifications. PM2 manages production process lifecycle.

---

## Technology Stack

| Category | Technology | Notes |
|----------|-----------|-------|
| Runtime | Node.js (ESM) | TypeScript compiled to ESM |
| Framework | Express.js | REST API |
| Language | TypeScript | Strict ESM modules |
| Database | MongoDB + Mongoose | Primary data store |
| Cache/Sessions | Redis (ioredis) + connect-mongo | Session persistence, caching |
| Auth | JWT (access + refresh) + express-session + bcrypt | Dual-mode auth |
| AI/LLM | LangChain + LangGraph + Google Gemini + OpenAI | AI agent pipelines |
| SMS | Green Web SMS API | Patient/doctor notifications |
| PDF | pdfkit + bwip-js | Prescription PDF + barcode |
| Security | Helmet, CORS, rate limiting | Express security middleware |
| Testing | Jest + ts-jest | Unit + integration tests |
| Process | PM2 | Production process manager |
| Package Manager | pnpm | |

---

## Architecture Pattern

**MVC-ish modular monolith** with consistent per-module structure:

```
modules/{domain}/
├── {Domain}.model.ts       ← Mongoose schema + model
├── {Domain}.service.ts     ← Business logic
├── {Domain}.controller.ts  ← Request/response handlers
└── {Domain}.routes.ts      ← Express Router
```

All modules are wired to master router → `src/routes/routes.ts` → mounted at `/api/v1/`.

---

## API Structure

Base path: `/api/v1/`

| Route Group | Module | Description |
|-------------|--------|-------------|
| `/auth` | `users/` | Register, login, logout, refresh token, profile |
| `/analytics` | `users/Analytics` | Admin dashboard statistics |
| `/doctors` | `doctors/` | Doctor CRUD, search, filters |
| `/doctor-schedules` | `doctor-schedules/` | Weekly schedule management |
| `/doctor-home-schedules` | `doctor-home-schedules/` | Home visit schedule |
| `/doctor-live-queues` | `doctor-live-queues/` | Live serial queue management |
| `/hospitals` | `hospitals/` | Hospital listing and detail |
| `/appointments` | `appointments/` | Book, confirm, complete appointments |
| `/customers` | `customers/` | Patient profile management |
| `/ambulances` | `ambulances/` | Ambulance fleet |
| `/ambulance-bookings` | `ambulance-bookings/` | Dispatch requests |
| `/diagnostic-tests` | `diagnostic-tests/` | Test catalog |
| `/labs` | `labs/` | Lab management |
| `/diagnostic-bookings` | `diagnostic-bookings/` | Lab test bookings |
| `/guides` | `guides/` | Medical guide content |
| `/guide-bookings` | `guide-bookings/` | Guide session bookings |
| `/home-doctor-bookings` | `home-doctor-bookings/` | Home visit bookings |
| `/prescriptions` | `prescriptions/` | Create/view/PDF prescriptions |
| `/specialities` | `specialities/` | Medical specialization catalog |
| `/concentrations` | `concentrations/` | Sub-specialization catalog |
| `/bd-locations` | `bd-locations/` | Bangladesh division/district/upazila |
| `/sms-logs` | `sms-logs/` | SMS history + send app link |
| `/contact-messages` | `contact-messages/` | Contact form submissions |
| `/callback-requests` | `callback-requests/` | Call-me-back requests |

---

## Database Architecture

**MongoDB** with Mongoose ODM. Key collections:

| Collection | Model | Key Fields |
|------------|-------|-----------|
| `users` | Users | email, password (bcrypt), role, tokens |
| `doctors` | Doctors | name, speciality, hospital, schedules, fee, rating |
| `customers` | Customers | userId, name, phone, medicalHistory |
| `appointments` | Appointments | doctorId, customerId, date, serial, status |
| `doctor_live_queues` | DoctorLiveQueues | doctorId, date, currentSerial, totalSerials |
| `hospitals` | Hospitals | name, location, doctors, facilities |
| `ambulances` | Ambulances | type, availability, location, operator |
| `ambulance_bookings` | AmbulanceBookings | ambulanceId, patientId, destination, status |
| `prescriptions` | Prescriptions | doctorId, patientId, medicines, tests, date |
| `diagnostic_tests` | DiagnosticTests | name, category, price, duration |
| `labs` | Labs | name, location, tests, availability |
| `diagnostic_bookings` | DiagnosticBookings | labId, customerId, tests, appointmentDate |
| `guides` | Guides | name, speciality, bio, availability |
| `specialities` | Specialities | name, icon, doctorCount |
| `bd_locations` | BdLocations | division, district, upazila |

---

## Authentication & Authorization

Two auth mechanisms coexist:

1. **JWT Auth** — Stateless. Access token (short-lived) + Refresh token (long-lived) stored as HTTP-only cookies. Used for patient/doctor API calls.
2. **Session Auth** — express-session stored in MongoDB via connect-mongo. Used for admin panel.

Auth middleware in `src/middlewares/` guards protected routes.

---

## AI / LangChain Integration

LangChain pipelines in backend (likely under a dedicated module or `base/`):

| Feature | Stack |
|---------|-------|
| Doctor recommendation | LangChain + Google Gemini + MongoDB Atlas Vector Search |
| AI triage / symptom checker | LangGraph stateful agent + Gemini |
| Conversational AI (chats) | LangChain chains + chat memory |
| Web search in AI flows | Brave Search API |

---

## Environment Variables

| Variable | Purpose |
|----------|---------|
| `MONGODB_URI` | MongoDB connection string |
| `DB_NAME` | Database name |
| `SESSION_SECRET` | express-session signing secret |
| `ACCESS_TOKEN_SECRET` | JWT access token secret |
| `REFRESH_TOKEN_SECRET` | JWT refresh token secret |
| `PORT` | HTTP server port |
| `GREEN_WEB_KEY` | Green Web SMS gateway API key |

Additional AI keys expected (Gemini API key, OpenAI API key) — not found in `.env` during quick scan but implied by LangChain deps.

---

## Development Workflow

```bash
cd my_doctor_backend
pnpm install
pnpm dev           # ts-node with nodemon watch
pnpm build         # tsc compile to dist/
pnpm start         # Run compiled dist/bootstrap.js
pnpm test          # Jest test suite
pnpm coverage      # Jest with coverage report
pnpm seed          # Seed database with initial data
```

Seed scripts: `seed.ts`, `seed-hospital-data.ts`, `seed-ambulance-data.ts`, `seed-bdlocations.ts`, `seed-reviews.ts`

**PM2:** `ecosystem.config.cjs` for production cluster mode.

---

## Testing

| Config | Detail |
|--------|--------|
| Framework | Jest + ts-jest (ESM mode) |
| Test location | `src/tests/*.test.ts` |
| Environment | Node |
| Coverage | `pnpm coverage` |

One test file found: `src/tests/user.test.ts` (auth/user endpoint tests).
