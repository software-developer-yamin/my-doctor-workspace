# My Doctor — Documentation Index

**Generated:** 2026-06-30  
**Repository Type:** Turborepo Monorepo (3 apps + 6 packages)

> This is the primary entry point for AI-assisted development on this project.

---

## Project Overview

**My Doctor** is a Bangladeshi healthcare platform connecting patients with doctors, hospitals, diagnostic labs, ambulance services, home doctor visits, and medical guides. It features live doctor queue tracking, AI-powered triage and recommendations, prescription management, and a full admin panel.

- **Type:** Turborepo monorepo
- **Primary Language:** TypeScript
- **Architecture:** Three-tier (Patient Frontend + Admin SPA → REST API → MongoDB/Redis)

---

## Quick Reference by App

### Patient Frontend (`apps/web/`)
- **Type:** Next.js 16.2.2 Web App (App Router, Turbopack)
- **Tech:** Next.js, React 19, Redux Toolkit, TanStack Query, shadcn/ui
- **Dev:** `pnpm dev` (from `apps/web/`) → http://localhost:3000

### API Backend (`apps/server/`)
- **Type:** Node.js REST API
- **Tech:** Express 5, MongoDB/Mongoose, Redis, LangChain + Gemini, JWT auth
- **Dev:** `pnpm dev` (from `apps/server/`) → http://localhost:6089

### Admin Panel (`apps/admin/`)
- **Type:** React SPA (served statically by Express backend)
- **Tech:** React 19 + Vite 8, TanStack Router, TanStack Query, Zustand, shadcn/ui
- **Dev:** `pnpm dev` (from `apps/admin/`) → http://localhost:5173 (standalone dev)

---

## Generated Documentation

### Cross-App
- [Project Overview](./project-overview.md) — Executive summary, tech stack tables, domain modules
- [Source Tree Analysis](./source-tree-analysis.md) — Annotated directory trees for all 3 apps
- [Integration Architecture](./integration-architecture.md) — How apps communicate, auth flows, live queue flow

### Architecture
- [Architecture — Patient Frontend](./architecture-frontend.md) — Next.js App Router, component layers, routing, auth
- [Architecture — API Backend](./architecture-backend.md) — Express modules, MongoDB, Redis, LangChain AI, JWT
- [Architecture — Admin Panel](./architecture-admin.md) — React SPA, TanStack Router, feature modules, deployment

### API & Data
- [API Contracts — Backend](./api-contracts-backend.md) — All REST endpoints (route-level, quick scan)
- [Data Models — Backend](./data-models-backend.md) — MongoDB collections, relationships, inferred schemas

### Development Guides
- [Development Guide — Backend](./development-guide-backend.md) — Setup, env vars, commands, seeding, testing, PM2
- [Development Guide — Patient Frontend](./development-guide-frontend.md) — Setup, env vars, commands, key patterns
- [Development Guide — Admin Panel](./development-guide-admin.md) — Setup, build flow, commands, routing

---

## Getting Started

### Full Monorepo Build (from workspace root)
```bash
cd my-doctor-workspace
pnpm install
pnpm run build    # Turborepo builds all 3 apps
```

### Individual App Dev Servers
```bash
# Backend first
cd apps/server
pnpm dev          # → localhost:6089

# Patient Frontend
cd apps/web
pnpm dev          # → localhost:3000

# Admin Panel (standalone dev)
cd apps/admin
pnpm dev          # → localhost:5173

# Admin Panel (production — build then backend serves it)
cd apps/admin && pnpm build
```

---

## Healthcare Domain Reference

| Domain | Frontend Route | Backend Module | Admin Feature |
|--------|---------------|----------------|---------------|
| Doctors | `/doctors` | `doctors/`, `doctor-schedules/` | `features/doctors/` |
| Hospitals | `/hospitals` | `hospitals/` | `features/hospitals/` |
| Live Queues | (queue banner) | `doctor-live-queues/` | `features/doctor-live-queues/` |
| Appointments | `/patient/appointments` | `appointments/` | `features/appointments/` |
| Diagnostics | `/diagnostics` | `diagnostic-tests/`, `labs/` | `features/labs/`, `features/diagnostic-tests/` |
| Ambulance | `/ambulances` | `ambulances/`, `ambulance-bookings/` | `features/ambulances/` |
| Home Doctor | `/domiciliary-services` | `home-doctor-bookings/` | `features/home-doctor-bookings/` |
| Guides | `/guides` | `guides/`, `guide-bookings/` | `features/guides/` |
| Prescriptions | `/doctor/prescriptions` | `prescriptions/` | (via appointments) |
| AI Features | — | `ai/` (LangChain) | — |
| Medical Records | `/patient/medical-records` | `customers/` | `features/customers/` |

---

## AI Features (Backend)

| Feature | Endpoint | Stack |
|---------|----------|-------|
| Doctor recommendation | `POST /api/v1/ai/recommend-doctors` | MongoDB Atlas Vector Search + Gemini |
| Recommendation explanation | `POST /api/v1/ai/recommend-doctors/explain` | Gemini |
| Symptom triage | `POST /api/v1/ai/triage` | LangGraph stateful agent + Gemini |
| Conversational chat | `POST /api/v1/ai/chat` | LangChain chain + InMemoryChatMessageHistory |
| Health web search | `POST /api/v1/ai/search` | Brave Search API + Gemini |

---

## For AI-Assisted Development

When working on a feature:

1. **Full-stack feature:** Reference [Integration Architecture](./integration-architecture.md) + both architecture docs
2. **Frontend-only:** Reference [Architecture — Patient Frontend](./architecture-frontend.md) + [Source Tree](./source-tree-analysis.md)
3. **Backend-only:** Reference [Architecture — API Backend](./architecture-backend.md) + [API Contracts](./api-contracts-backend.md) + [Data Models](./data-models-backend.md)
4. **Admin feature:** Reference [Architecture — Admin Panel](./architecture-admin.md)

**For deeper analysis** (actual schemas, component props, full API request/response bodies): run `/bmad-document-project` and select **Deep Scan** or **Deep Dive** on the specific area.

> **Note:** Most docs in this folder reflect the pre-migration state (old paths `my_doctor_frontend/`, `my_doctor_backend/`). The monorepo migration is complete — apps now live at `apps/web/`, `apps/server/`, `apps/admin/`. See `_bmad-output/migration/PHASE-1-ANALYSIS.md` for migration status.
