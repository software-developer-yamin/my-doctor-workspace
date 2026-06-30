# Architecture — Admin Panel

**Part:** `my_doctor_backend/public/`  
**Type:** Web SPA (React + Vite)  
**Generated:** 2026-06-25

---

## Executive Summary

The admin panel is a React SPA bundled with Vite and served as static files from `my_doctor_backend/public/dist/`. It provides a full management interface for all platform entities — doctors, hospitals, appointments, patients, labs, diagnostic bookings, ambulances, and more. It uses TanStack Router for file-based routing and Zustand for local state.

---

## Technology Stack

| Category | Technology | Notes |
|----------|-----------|-------|
| Framework | React 18 | SPA |
| Build Tool | Vite | Fast dev + optimized prod builds |
| Language | TypeScript | Strict |
| Routing | TanStack Router v1 | File-based, type-safe routes |
| Data Fetching | TanStack Query v5 | Server state + cache |
| State | Zustand | Client-side state stores |
| UI | shadcn/ui | Tailwind component primitives |
| Tables | TanStack Table v8 | Data table with sorting/filtering |
| HTTP | Axios (likely) | API calls to same Express backend |
| Package Manager | pnpm | |
| Linting | ESLint + Knip (dead code) | |

---

## Architecture Pattern

**Feature-based modular SPA:**

```
features/{domain}/
├── components/     ← UI components for this feature
├── hooks/          ← React Query hooks (useQuery, useMutation)
├── api/            ← Axios calls to backend
└── types/          ← TypeScript types for this feature
```

Routes are defined via TanStack Router file system (`src/routes/`) and auto-generated to `routeTree.gen.ts`.

---

## Routing Structure

```
routes/
├── __root.tsx              ← Root layout (global nav, error boundary)
├── (auth)/                 ← Login page (unauthenticated)
├── _authenticated/         ← Auth-guarded layout wrapper
│   └── ... (all admin routes)
└── (errors)/               ← 404, error pages
```

**Auth guard:** TanStack Router `beforeLoad` hook checks auth state (Zustand) before rendering authenticated routes.

---

## Feature Modules

All major platform entities have corresponding admin features:

| Feature | Admin Capability |
|---------|-----------------|
| `dashboard/` | Stats overview, key metrics |
| `doctors/` | List, create, edit, activate/deactivate doctors |
| `hospitals/` | Hospital CRUD + doctor assignments |
| `appointments/` | View/manage all appointments |
| `customers/` | Patient list + profile view |
| `ambulances/` | Fleet management |
| `ambulance-bookings/` | Booking dispatch + status management |
| `diagnostic-tests/` | Test catalog CRUD |
| `diagnostic-bookings/` | Booking management |
| `labs/` | Lab CRUD + test assignments |
| `specialities/` | Specialization catalog management |
| `concentrations/` | Sub-specialization management |
| `bd-locations/` | Location data management |
| `doctor-live-queues/` | Real-time queue admin view |
| `doctor-home-schedules/` | Home visit schedule admin |
| `home-doctor-bookings/` | Home doctor booking management |
| `guides/` | Medical guide CRUD |
| `guide-bookings/` | Guide session management |
| `users/` | User account management |
| `sms-logs/` | SMS history viewer |
| `contact-messages/` | Contact form inbox |
| `callback-requests/` | Callback request management |
| `chats/` | AI conversation viewer |
| `tasks/` | Admin task management |
| `settings/` | System configuration |
| `apps/` | App settings management |

---

## Data Flow

```
Admin user action
  → TanStack Router navigation
  → Feature component
  → TanStack Query (useQuery / useMutation)
  → Axios → Backend API /api/v1/...
  → Response → TanStack Query cache
  → Component re-renders
```

---

## Deployment

The admin panel is **not a standalone server**. Build output (`dist/`) is committed to `my_doctor_backend/public/dist/` and served by Express:

```typescript
// In app.ts — Express serves admin static files
app.use(express.static(path.join(__dirname, '../public/dist')));
```

**Build:**
```bash
cd my_doctor_backend/public
pnpm install
pnpm build    # outputs to dist/
```

**Development:**
```bash
pnpm dev      # Vite dev server (separate port, proxies API)
```
