# Integration Architecture

**Generated:** 2026-06-25

---

## Overview

Three parts communicate through the shared Express REST API. No message queues or inter-service buses detected (quick scan). All integration is HTTP-based.

```
┌─────────────────────┐         ┌─────────────────────┐
│  Patient Frontend   │         │    Admin Panel      │
│  (Next.js :3000)    │         │    (React SPA)      │
└──────────┬──────────┘         └──────────┬──────────┘
           │ HTTP/Axios                    │ HTTP/Axios
           │ /api/v1/*                     │ /api/v1/*
           ▼                               ▼
┌─────────────────────────────────────────────────────┐
│               Express REST API Backend              │
│                  my_doctor_backend                  │
│                                                     │
│   ┌──────────┐   ┌──────────┐   ┌──────────────┐   │
│   │ MongoDB  │   │  Redis   │   │  LangChain   │   │
│   │(Mongoose)│   │(sessions)│   │  AI Agents   │   │
│   └──────────┘   └──────────┘   └──────────────┘   │
│                                                     │
│   ┌──────────┐   ┌──────────────────────────────┐  │
│   │ Green    │   │  External AI APIs            │  │
│   │ Web SMS  │   │  (Google Gemini, OpenAI,     │  │
│   └──────────┘   │   Brave Search)              │  │
│                  └──────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

---

## Integration Points

### 1. Patient Frontend → Backend API

| Direction | From | To | Type | Details |
|-----------|------|----|------|---------|
| Data fetch | Patient Frontend | Backend API | REST/HTTP | Axios calls to `/api/v1/*` |
| Auth | Patient Frontend | Backend API | JWT Cookie | Access + refresh tokens in HTTP-only cookies |
| File upload | Patient Frontend | Backend API | multipart/form-data | Medical records, profile photos |
| Media access | Patient Frontend | Backend API | Static HTTP | `NEXT_PUBLIC_ASSETS_URL` for stored documents |

**Key services and their API targets:**

| Frontend Service | Backend Route |
|-----------------|---------------|
| `doctor.service.ts` | `/api/v1/doctors` |
| `hospital.service.ts` | `/api/v1/hospitals` |
| `appointment.service.ts` | `/api/v1/appointments` |
| `queue.service.ts` | `/api/v1/doctor-live-queues` |
| `auth.service.ts` | `/api/v1/auth` |
| `diagnostic.service.ts` | `/api/v1/diagnostic-tests`, `/api/v1/labs` |
| `ambulance.service.ts` | `/api/v1/ambulances`, `/api/v1/ambulance-bookings` |
| `medical-records.service.ts` | `/api/v1/customers` or `/api/v1/prescriptions` |

### 2. Admin Panel → Backend API

| Direction | From | To | Type | Details |
|-----------|------|----|------|---------|
| All CRUD | Admin Panel | Backend API | REST/HTTP | All `/api/v1/*` routes |
| Auth | Admin Panel | Backend API | Session Cookie | Server-side express-session in MongoDB |
| Analytics | Admin Panel | Backend API | REST/HTTP | `/api/v1/analytics` endpoints |

### 3. Backend → External Services

| Integration | Service | Protocol | Purpose |
|-------------|---------|----------|---------|
| AI Agents | Google Gemini API | HTTPS | LLM inference for triage, recommendations |
| AI Agents | OpenAI API | HTTPS | Optional LLM fallback |
| AI Search | Brave Search API | HTTPS | Web search in AI agent flows |
| SMS | Green Web SMS | HTTPS | Patient/doctor notification SMS |

### 4. Admin Panel → Backend (Static Serving)

The Admin Panel SPA is **statically served** by Express from `public/dist/`:
- Build admin SPA → outputs to `public/dist/`
- Express `app.use(express.static('public/dist'))` serves the SPA
- Browser loads SPA → SPA calls backend API via `fetch`/Axios
- No separate server process needed for admin panel

---

## Authentication Flow

### Patient Login
```
Patient Browser
  → POST /api/v1/auth/login (email + password)
  → Backend validates credentials
  → Set HTTP-only cookies: accessToken + refreshToken
  → Frontend stores user info in Redux auth-slice
  → Subsequent requests: cookies sent automatically
```

### Doctor Login
```
Doctor Browser (same frontend, separate route)
  → POST /api/v1/auth/doctor-login
  → Backend issues separate JWT pair
  → Doctor dashboard unlocked
```

### Admin Login
```
Admin Browser (admin SPA)
  → POST /api/v1/auth/admin-login (or similar)
  → Backend creates express-session in MongoDB
  → Session cookie returned
  → Zustand auth store updated in admin SPA
```

---

## Data Adapters (Frontend)

Frontend uses adapter pattern to decouple from backend response shape:

```
API Response (raw MongoDB document)
  → Adapter function (src/adapters/*.adapter.ts)
  → Typed UI object (src/types/*.ts)
  → React component
```

This means backend can evolve its response shape without breaking frontend, as long as adapters are updated.

---

## Live Queue Flow

```
Doctor starts session → POST /api/v1/doctor-live-queues (create queue)
Patient books appointment → assigned serial number
Patient arrives → GET /api/v1/doctor-live-queues/:doctorId (current serial)
Doctor calls next → PATCH /api/v1/doctor-live-queues/:id/next
Frontend polls queue → LiveSerialBanner re-renders with current position
```
