# My Doctor — Project Overview

**Generated:** 2026-06-30  
**Repository Type:** Turborepo Monorepo

---

## Executive Summary

My Doctor is a Bangladeshi healthcare platform connecting patients with doctors, hospitals, diagnostic labs, ambulances, guides, and home medical services. It provides appointment booking, live doctor queues, telemedicine, AI-powered features (LangChain/Gemini), and prescription management. Three separate applications share a single MongoDB/Redis backend.

---

## Project Apps

| App | Path | Type | Primary Tech |
|-----|------|------|--------------|
| **Patient Frontend** | `apps/web/` | Next.js 16 Web App | Next.js, React 19, Redux, shadcn/ui |
| **REST API Backend** | `apps/server/` | Node.js API | Express 5, MongoDB, Redis, LangChain |
| **Admin Panel** | `apps/admin/` | React SPA | React 19 + Vite 8, TanStack Router, Zustand |

## Shared Packages (stubs — populated in Phase 5)

| Package | Path | Purpose |
|---------|------|---------|
| `@my-doctor/types` | `packages/types/` | Shared TypeScript types |
| `@my-doctor/api-client` | `packages/api-client/` | Shared Axios instance |
| `@my-doctor/validation` | `packages/validation/` | Shared Zod schemas |
| `@my-doctor/config` | `packages/config/` | Shared constants + env schemas |
| `@my-doctor/ui` | `packages/ui/` | Shared UI components |
| `@my-doctor/utils` | `packages/utils/` | Shared utilities |

---

## Technology Stack Summary

### Patient Frontend (`apps/web/`)
| Category | Technology |
|----------|-----------|
| Framework | Next.js 16.2.2 (App Router, Turbopack) |
| Language | TypeScript 5 (strict) |
| UI Library | shadcn/ui + custom Phantom UI |
| State Management | Redux Toolkit + TanStack React Query 5 |
| HTTP Client | Axios 1.14 |
| Auth | OTP (patients) / JWT (doctors) via custom session |
| Forms | React Hook Form 7 + Zod 4 |
| Package Manager | pnpm |
| Build Tool | Next.js (Turbopack) |
| Icons | HugeIcons + lucide-react |

### API Backend (`apps/server/`)
| Category | Technology |
|----------|-----------|
| Framework | Express 5.2.1 |
| Language | TypeScript 6 (ESM) |
| Database | MongoDB + Mongoose 9 |
| Cache/Sessions | Redis (ioredis 5) + connect-mongo |
| Auth | JWT access/refresh + express-session (admin) + bcrypt |
| AI/LLM | LangChain, LangGraph, Google Gemini, MongoDB Atlas Vector Search |
| SMS | Green Web SMS API |
| Process Manager | PM2 |
| Testing | Jest 30 + ts-jest + supertest |
| PDF/Barcode | bwip-js, pdfkit |
| Validation | Joi (validators layer) |

### Admin Panel (`apps/admin/`)
| Category | Technology |
|----------|-----------|
| Build | Vite 8 |
| Language | TypeScript + React 19.2 |
| Routing | TanStack Router 1.168 (file-based) |
| Data Fetching | TanStack Query 5 |
| State | Zustand 5 |
| UI | shadcn/ui + Radix UI |
| Tables | TanStack Table 8 |
| Auth | Custom JWT (cookie) + Clerk (user management section) |
| Package Manager | pnpm |

### Workspace Tooling
| Tool | Version | Purpose |
|------|---------|---------|
| Turborepo | 2.10.1 | Monorepo build orchestration |
| pnpm | 10.9.0 | Package manager |
| Biome | 2.5.1 | Formatter (ultracite preset) |
| Lefthook | 1.7.0 | Git hooks (pre-commit format check) |

---

## Architecture Overview

- **Pattern:** Three-tier (Client → REST API → MongoDB/Redis)
- **Frontend ↔ Backend:** Axios HTTP calls to Express REST API (`/api/v1/...`)
- **Admin ↔ Backend:** Same REST API, separate session cookie auth
- **AI Integration:** LangChain pipelines in backend for doctor recommendations, symptom triage, chat, and web search
- **Realtime:** Doctor live queues via polling/SSE Express endpoints
- **Session:** express-session stored in MongoDB via connect-mongo; JWT for stateless API auth (patient/doctor)

---

## Domain Modules

The platform covers 26 backend modules:

| Domain | Frontend Pages | Backend Module |
|--------|---------------|----------------|
| Doctors | `/doctors`, `/search` | `doctors/`, `doctor-schedules/`, `doctor-live-queues/` |
| Hospitals | `/hospitals` | `hospitals/` |
| Appointments | `/patient/appointments`, `/doctor/appointments` | `appointments/` |
| Diagnostics | `/diagnostics` | `diagnostic-tests/`, `labs/`, `diagnostic-bookings/` |
| Ambulance | `/ambulances` | `ambulances/`, `ambulance-bookings/` |
| Home Doctor | `/domiciliary-services` | `home-doctor-bookings/`, `doctor-home-schedules/` |
| Guides | `/guides` | `guides/`, `guide-bookings/` |
| Prescriptions | `/doctor/prescriptions` | `prescriptions/` |
| Patients/Customers | `/patient/*` | `customers/` |
| Auth | `/(auth)/sign-in`, `sign-up` | `users/` (auth routes) |
| AI Features | — | `ai/` (LangChain) |
| Admin | Admin Panel (SPA) | All modules + `analytics/` |

---

## Getting Started

```bash
# From workspace root
pnpm install
pnpm run build   # builds all 3 apps via Turborepo

# Individual dev servers
cd apps/server && pnpm dev   # → localhost:6089
cd apps/web && pnpm dev      # → localhost:3000
cd apps/admin && pnpm dev    # → localhost:5173
```

See individual app READMEs (`apps/*/README.md`) for env var setup.
