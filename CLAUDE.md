# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

<!-- gitnexus:start -->
# GitNexus — Code Intelligence

This project is indexed by GitNexus as **my-doctor-workspace** (8882 symbols, 21068 relationships, 300 execution flows). Use the GitNexus MCP tools to understand code, assess impact, and navigate safely.

> Index stale? Run `node .gitnexus/run.cjs analyze` from the project root — it auto-selects an available runner. No `.gitnexus/run.cjs` yet? `npx gitnexus analyze` (npm 11 crash → `npm i -g gitnexus`; #1939).

## Always Do

- **MUST run impact analysis before editing any symbol.** Before modifying a function, class, or method, run `impact({target: "symbolName", direction: "upstream"})` and report the blast radius (direct callers, affected processes, risk level) to the user.
- **MUST run `detect_changes()` before committing** to verify your changes only affect expected symbols and execution flows. For regression review, compare against the default branch: `detect_changes({scope: "compare", base_ref: "main"})`.
- **MUST warn the user** if impact analysis returns HIGH or CRITICAL risk before proceeding with edits.
- When exploring unfamiliar code, use `query({search_query: "concept"})` to find execution flows instead of grepping. It returns process-grouped results ranked by relevance.
- When you need full context on a specific symbol — callers, callees, which execution flows it participates in — use `context({name: "symbolName"})`.
- For security review, `explain({target: "fileOrSymbol"})` lists taint findings (source→sink flows; needs `analyze --pdg`).

## Never Do

- NEVER edit a function, class, or method without first running `impact` on it.
- NEVER ignore HIGH or CRITICAL risk warnings from impact analysis.
- NEVER rename symbols with find-and-replace — use `rename` which understands the call graph.
- NEVER commit changes without running `detect_changes()` to check affected scope.

## Resources

| Resource | Use for |
|----------|---------|
| `gitnexus://repo/my-doctor-workspace/context` | Codebase overview, check index freshness |
| `gitnexus://repo/my-doctor-workspace/clusters` | All functional areas |
| `gitnexus://repo/my-doctor-workspace/processes` | All execution flows |
| `gitnexus://repo/my-doctor-workspace/process/{name}` | Step-by-step execution trace |

## CLI

| Task | Read this skill file |
|------|---------------------|
| Understand architecture / "How does X work?" | `.claude/skills/gitnexus/gitnexus-exploring/SKILL.md` |
| Blast radius / "What breaks if I change X?" | `.claude/skills/gitnexus/gitnexus-impact-analysis/SKILL.md` |
| Trace bugs / "Why is X failing?" | `.claude/skills/gitnexus/gitnexus-debugging/SKILL.md` |
| Rename / extract / split / refactor | `.claude/skills/gitnexus/gitnexus-refactoring/SKILL.md` |
| Tools, resources, schema reference | `.claude/skills/gitnexus/gitnexus-guide/SKILL.md` |
| Index, status, clean, wiki CLI commands | `.claude/skills/gitnexus/gitnexus-cli/SKILL.md` |

<!-- gitnexus:end -->

---

## Project Overview

**My Doctor** — Bangladeshi healthcare platform. Three separate apps sharing one backend:

| Part | Path | Stack |
|------|------|-------|
| Patient Frontend | `my_doctor_frontend/` | Next.js 15 App Router, React 19, TypeScript |
| REST API Backend | `my_doctor_backend/` | Express 5, TypeScript (ESM), MongoDB, Redis |
| Admin Panel | `my_doctor_backend/public/` | React 18 + Vite, TanStack Router/Query, Zustand |

---

## Commands

All three parts use `pnpm`. Run from within each subdirectory.

### Backend (`my_doctor_backend/`)
```bash
pnpm dev        # nodemon watches src/, runs tsc build then node dist/app.js on each change
pnpm build      # tsc → dist/
pnpm start      # PM2 cluster (production)
pnpm test       # Jest (ESM mode via --experimental-vm-modules)
pnpm coverage   # Jest with coverage
pnpm seed       # build + run dist/seed.js (initial data)
```

Single test file: `NODE_ENV=test node --experimental-vm-modules node_modules/jest/bin/jest.js --testPathPattern=user`

Only one test file exists: `src/tests/user.test.ts`.

### Patient Frontend (`my_doctor_frontend/`)
```bash
pnpm dev     # Next.js dev server → localhost:3000
pnpm build   # Production build
pnpm lint    # ESLint
```

### Admin Panel (`my_doctor_backend/public/`)
```bash
pnpm dev     # Vite dev server (no proxy — backend must run separately)
pnpm build   # Outputs to dist/ — must be done before backend serves admin
```

Admin is **not a standalone server**. Its built `dist/` is served statically by Express (`app.use(express.static('public/dist'))`). After building admin, restart the backend to pick up changes.

---

## Architecture

### Backend — MVC-ish Modular Monolith

Every domain module follows this exact structure:
```
src/modules/{domain}/
├── {Domain}.model.ts       ← Mongoose schema
├── {Domain}.service.ts     ← Business logic
├── {Domain}.controller.ts  ← req/res handlers
└── {Domain}.routes.ts      ← Express Router
```

All routers are wired in `src/routes/routes.ts` → mounted at `/api/v1/` in `app.ts`.

**ESM import rule:** TypeScript module resolution is `NodeNext`. All internal imports must use `.js` extension even when importing `.ts` files:
```ts
import { sendResponse } from './utils/sendResponse.js'  // correct
import { sendResponse } from './utils/sendResponse'      // breaks at runtime
```

**Shared utilities:**
- `src/utils/sendResponse.ts` — `sendResponse()`, `buildMeta()`, `parsePagination()` for all success responses
- `src/utils/errorResponse.ts` — `ErrorUtils.*` and `ErrorTypes.*` for all error responses
- `src/helpers/upload.helper.ts` — multer config; uploads land at `public/uploads/`
- `src/helpers/sms.helper.ts` — `sendSMS()` via Green Web gateway, auto-logs to `sms-logs` module
- `src/base/urls.ts` — `urls.frontendURL`, `urls.mainURL`, `urls.apiURL` (from env or localhost defaults)

**API response contract:**
```ts
// Success: sendResponse(res, data, message?, statusCode?, meta?)
{ success: true, data: T, message?: string, meta?: { total, page, limit, totalPages } }

// Error: ErrorUtils.notFound(res) / ErrorUtils.badRequest(res, msg) / etc.
{ success: false, error: { status: number, message: string, code: string, details?: unknown } }
```

**Role-based auth:** `protect(['admin'])` or `protect(['doctor', 'admin'])` middleware applied per route. Roles come from the JWT payload.

AI/LangChain code lives in `src/base/`. External URL constants are in `src/base/urls.ts`.

Auth middleware lives in `src/middlewares/shared/`: `protect.ts` (role guard), `jwt_helper.ts` (token sign/verify), `cache_middleware.ts`, `rate_limiter.ts`.

### Patient Frontend — Layered Architecture

```
Pages (app/)
  → Components (components/)
    → Services (src/services/*.service.ts)   ← Axios calls to /api/v1/
      → Adapters (src/adapters/*.adapter.ts) ← Transform API response → UI types
        → Types (src/types/)
```

**State split:** Redux Toolkit (`src/redux/`) for auth state only; TanStack React Query for all server data.

**API client** (`src/lib/api.ts`): reads JWT from cookie `md_auth_token` (via `cookies-next` client-side or `next/headers` server-side), then sends it as `Authorization: Bearer {token}` header. Handles token refresh on 401 via response interceptor. All API endpoints are centralized in `src/config/api.ts` → `API.ENDPOINTS.*`.

**Adapters are mandatory** — never pass raw API responses directly to components. They decouple frontend from backend schema shape.

### Admin Panel — Feature-based SPA

```
src/features/{domain}/
├── components/   ← UI for this feature
├── hooks/        ← useQuery / useMutation wrappers
├── api/          ← Axios calls
└── types/        ← TypeScript types
```

Routes are file-based via TanStack Router (`src/routes/`); `routeTree.gen.ts` is auto-generated — don't edit it manually. Auth guard uses TanStack Router `beforeLoad` checking Zustand auth store (`src/stores/`). Dead code tracked with Knip (`knip.config.ts`).

---

## Authentication

Two auth mechanisms coexist in the backend:

| Mechanism | Used by | How it works |
|-----------|---------|--------------|
| JWT (access + refresh tokens) | Patient + Doctor | Token stored in JS-readable cookie; sent as `Authorization: Bearer` header |
| express-session | Admin panel | Session cookie; MongoDB store via connect-mongo |

**Patient auth flow:** OTP via phone (Green Web SMS) → `/customers/register/request-otp` → `/customers/register/verify-otp` → JWT issued. Login: `/customers/login/request-otp` → `/customers/login/verify-otp`.

**Doctor auth:** `/auth/login` (email/password) → JWT issued.

**Admin auth:** session cookie set on POST to admin login endpoint.

Frontend `AuthProvider` (`src/providers/`) hydrates Redux auth state from cookies on mount to handle SSR/CSR mismatch. The backend `verifyAccessToken` middleware reads from the `Authorization` header (not cookies).

---

## AI Integration (Backend)

LangChain pipelines in `src/base/`:

| Feature | Stack |
|---------|-------|
| Doctor recommendation | LangChain + Gemini + MongoDB Atlas Vector Search |
| Symptom triage | LangGraph stateful agent + Gemini |
| Conversational AI | LangChain chains + chat memory |
| Web search in AI flows | Brave Search API |

Required env vars beyond the core set: `GOOGLE_API_KEY`, `OPENAI_API_KEY`, `BRAVE_SEARCH_API_KEY`.

---

## Key Environment Variables

### Backend (`.env`)
| Variable | Purpose |
|----------|---------|
| `MONGODB_URI` | MongoDB connection string |
| `DB_NAME` | Database name |
| `SESSION_SECRET` | express-session signing key |
| `ACCESS_TOKEN_SECRET` | JWT access token secret |
| `REFRESH_TOKEN_SECRET` | JWT refresh token secret |
| `PORT` | HTTP server port (default: 5000) |
| `GREEN_WEB_KEY` | SMS gateway API key |
| `FRONTEND_URL` | Patient frontend origin (default: `http://localhost:3000`) |
| `MAIN_URL` | Backend base URL (default: `http://localhost:5000`) |
| `API_URL` | API base URL (default: `http://localhost:5000/api`) |

### Frontend (`.env`)
| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL |
| `NEXT_PUBLIC_ASSETS_URL` | Media/uploads CDN URL |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase (Google OAuth) |

---

## Seed & Migration Scripts

Seed scripts in `my_doctor_backend/src/`:
- `seed.ts` — base data
- `seed-hospital-data.ts`, `seed-ambulance-data.ts`, `seed-bdlocations.ts`, `seed-reviews.ts`

Run with `pnpm seed` (builds first). One-off migration scripts (`backfill-*.ts`, `migrate-schedules.ts`, `remove-consultation-services.ts`) are not part of the normal dev flow.
