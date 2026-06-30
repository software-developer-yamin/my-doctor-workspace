# My Doctor — Phase 1 Analysis & Migration Plan
**Date:** 2026-06-30  
**Scope:** Better-T-Stack Monorepo Migration  
**Status:** Phase 1 Complete ✓ | Phases 2–4 Complete ✓ | Phases 5–7 Pending

---

## Codebase Inventory

| App | Files | Notes |
|-----|-------|-------|
| Backend (`apps/server/`) | 145+ | Express 5, ESM, TypeScript 6 |
| Frontend (`apps/web/`) | 419+ | Next.js 16.2.2, React 19, TS 5 strict |
| Admin Panel (`apps/admin/`) | 267+ | Vite 8, React 19, TanStack Router |
| **Total** | **831+** | |

---

## Backend Modules (26 total)

### Standard Pattern (4 files: controller/model/routes/service)
ambulance-bookings, ambulances, appointments, bd-locations, callback-requests, cities, concentrations, contact-messages, diagnostic-bookings, diagnostic-tests, doctor-home-schedules, doctor-live-queues, doctor-schedules, doctors, guide-bookings, guides, home-doctor-bookings, prescriptions, sms-logs, specialities, **ai** (new)

### Deviations
| Module | Files | Notes |
|--------|-------|-------|
| customers | 5 | + `Otps.model.ts` (OTP entity for auth) |
| doctor-reviews | **3** | **MISSING `DoctorReviews.routes.ts` — not exposed as API endpoint** |
| hospitals | 5 | + `HospitalReview.model.ts` |
| labs | 5 | + `LabTests.model.ts` |
| users | 9 | + Analytics controller/routes/service + interface + validation |

> ⚠️ **ACTION REQUIRED:** `doctor-reviews` module has no routes. Feature is dead in production. Decision needed: wire it, archive it, or delete it.

---

## Security Issues (Fix in Phase 2 — now RESOLVED)

| Issue | Severity | Status |
|-------|----------|--------|
| Rate limiter exported but NOT applied via `app.use()` | HIGH | ✓ Fixed |
| CORS `origins: true` — accepts any origin | HIGH | ✓ Fixed (FRONTEND_URL env) |
| Session cookie missing `httpOnly: true` + `secure: true` | HIGH | ✓ Fixed |
| Helmet CSP disabled | MEDIUM | ✓ Addressed |
| Helmet CORB disabled | MEDIUM | ✓ Addressed |
| No HSTS header | LOW | ✓ Added via next.config.ts headers |

---

## Technical Debt

| Category | Count | Priority |
|----------|-------|----------|
| Backend `: any` usages | ~145 | Phase 6 |
| Frontend `: any` usages | ~108 | Phase 6 |
| Admin `: any` usages | ~109 | Phase 6 |
| Backend `console.log` in prod services | ~8 | Phase 6 |
| Admin `console.log` | 6 | Phase 6 |
| Test coverage | 1 file / 831+ src | Ongoing |

---

## Code Duplication (Target Phase 5)

| Pattern | Frontend | Admin | Action |
|---------|----------|-------|--------|
| Axios API client + interceptors | `src/lib/api.ts` | `lib/api.ts` | → `packages/api-client` |
| TypeScript type definitions | 19 type files | Sparse/any | → `packages/types` |
| Zod validation schemas | Form-only | 3 feature schemas | → `packages/validation` |
| Constants | `src/config/constant.ts` | Inlined | → `packages/config` |

---

## Docker Status

✓ `docker-compose.dev.yml` and `docker-compose.prod.yml` created at workspace root.

---

## Test Coverage Baseline

| App | Test Files | Framework |
|-----|-----------|-----------|
| Backend | 1 (`src/tests/user.test.ts`) | Jest 30 + supertest |
| Frontend | 0 | None configured |
| Admin | 0 | None configured |

---

## Decided Scope Changes (from party consensus)

| Original Brief | Decision | Reason |
|----------------|----------|--------|
| `pnpm create better-t-stack@latest my-doctor-workspace` | **In-place migration** | Directory already exists |
| TanStack Start for Admin Panel | **Keep Vite + React** | v1.x framework risk unacceptable for healthcare production |
| "Shared auth utilities" | **Clerk stays in /clerk/ section, JWT stays in patient/doctor** | Auth redesign is out of migration scope |
| Biome strict linting Phase 2 | **Biome format-only; lint rules Phase 7** | Prevents build-breaking on day one |

---

## Current Monorepo Structure (Achieved)

```
my-doctor-workspace/               ← monorepo root ✓
├── apps/
│   ├── web/                       ← Next.js 16.2.2 frontend ✓
│   ├── server/                    ← Express 5 backend ✓
│   └── admin/                     ← Vite + React 19 admin ✓
├── packages/
│   ├── types/                     ← @my-doctor/types (stub) ✓
│   ├── ui/                        ← @my-doctor/ui (stub) ✓
│   ├── utils/                     ← @my-doctor/utils (stub) ✓
│   ├── config/                    ← @my-doctor/config (stub) ✓
│   ├── api-client/                ← @my-doctor/api-client (stub) ✓
│   └── validation/                ← @my-doctor/validation (stub) ✓
├── turbo.json                     ← Turborepo 2.10.1 ✓
├── pnpm-workspace.yaml            ✓
├── biome.json                     ← Biome 2.5.1 + ultracite ✓
├── .lefthook.yml                  ✓
├── .mcp.json                      ← context7 + filesystem MCP ✓
├── docker-compose.dev.yml         ✓
├── docker-compose.prod.yml        ✓
└── package.json                   ✓
```

---

## Phase Execution Plan

### Phase 2 — Scaffold + Security Baseline ✅ COMPLETE
- [x] Create `pnpm-workspace.yaml`
- [x] Create root `package.json` with workspace config
- [x] Create `turbo.json` with build/dev/test pipelines
- [x] Create `packages/` directory structure with stub `package.json` per package
- [x] Fix rate limiter — registered to `app.use()`
- [x] Fix CORS — restrict to `FRONTEND_URL` env var
- [x] Fix session cookies — `httpOnly: true`, `secure: NODE_ENV === 'production'`
- [x] Create `biome.json` (Biome 2.5.1 + ultracite, format-only)
- [x] Create `.lefthook.yml` (pre-commit: biome format check)
- [x] Create Dockerfiles + docker-compose.dev.yml + docker-compose.prod.yml
- [x] Verify: `pnpm install` + `pnpm build` pass

### Phase 3 — Move Apps into `apps/` ✅ COMPLETE
- [x] `mv my_doctor_frontend apps/web`
- [x] Extract `my_doctor_backend/public/` → `apps/admin/`
- [x] `mv my_doctor_backend apps/server`
- [x] Update Express static serving path for admin `dist/`
- [x] Update all `pnpm dev` workspace scripts
- [x] Update Turbo pipeline env passthrough
- [x] Verify: all three apps build + dev servers start

### Phase 4 — Backend Architecture Improvements ✅ COMPLETE
- [x] Add `validators/` layer — `src/validators/` with `validate.middleware.ts`, `doctor.validator.ts`, `appointment.validator.ts`
- [x] Wire validators into Doctors routes + controller refactor
- [ ] Add `repositories/` layer — DEFERRED to Phase 5/6 (lower priority than shared packages)
- [x] All config files migrated to TypeScript (no `.js`/`.mjs` except `ecosystem.config.cjs`)
- [x] MCP servers added (`.mcp.json`: context7 + filesystem)
- [x] Ultracite integrated (Biome 2.5.1 + `ultracite/biome/core`)
- [x] AI features added:
  - [x] `src/base/doctor-recommendation.ts` — Vector search + Gemini
  - [x] `src/base/symptom-triage.ts` — LangGraph stateful agent
  - [x] `src/base/conversational-ai.ts` — InMemoryChatMessageHistory chain
  - [x] `src/base/web-search.ts` — Brave Search + Gemini
  - [x] `src/modules/ai/AI.controller.ts` + `AI.routes.ts`
  - [x] Registered at `/api/v1/ai/`
- [x] Next.js Turbopack workspace root fixed (`turbopack.root` → workspace root)
- [x] `import.meta.dirname` used throughout (Node 21.2+ ESM, no legacy `fileURLToPath`)
- [x] Verify: `pnpm run build` → 3 successful, 3 total ✓

### Phase 5 — Extract Shared Packages ⬜ PENDING
- [ ] `packages/types` — move canonical types from `apps/web/src/types/`
- [ ] `packages/api-client` — consolidate axios clients from web + admin
- [ ] `packages/validation` — consolidate Zod schemas
- [ ] `packages/config` — move constants, env schemas
- [ ] Update import paths in both `apps/web` and `apps/admin`
- [ ] Verify: no duplicate type definitions remain

### Phase 6 — Optimize ⬜ PENDING
- [ ] Run Knip across all apps (already configured in admin)
- [ ] Remove unused imports + dead code
- [ ] Replace `: any` in critical paths (appointments, customers, hospitals services)
- [ ] Replace `moment` with `date-fns` in backend
- [ ] Add database indexes audit
- [ ] Enable Biome linter rules (currently `linter.enabled: false`)

### Phase 7 — Documentation ⬜ PENDING
- [x] `apps/server/README.md` — Backend API docs ✓
- [x] `apps/web/README.md` — Frontend dev guide ✓
- [x] `apps/admin/README.md` — Admin panel guide ✓
- [ ] Root README (monorepo overview, quickstart)
- [ ] `docs/ARCHITECTURE.md` (system diagram, auth flows)
- [ ] `docs/DEPLOYMENT.md` (Docker, PM2, environment setup)
- [ ] `docs/API.md` (endpoint reference — 26 modules × routes)
- [ ] GitNexus re-index (stale — points to old `my_doctor_backend/` path; run from `apps/server/`)

---

## Known Risks

| Risk | Status | Mitigation |
|------|--------|-----------|
| Admin `dist/` path breaks when extracted from backend | ✓ Resolved | Express static path updated |
| Turborepo pipeline cache misses | ✓ Resolved | `outputs` configured per app |
| `doctor-reviews` routes missing | ⬜ Open | Decision required from Yamin |
| LangChain AI pipelines in `src/base/` — heavy deps | ✓ Managed | Stays in `apps/server/`, not extracted |
| Rate limiter fix may change behavior | ✓ Resolved | Verified per-route behavior |
| Puppeteer in backend (PDF generation) — large binary | ✓ Managed | Stays in `apps/server/` |
| MongoDB type version mismatch (@langchain/mongodb uses mongodb@6, Mongoose 9 uses mongodb@7) | ✓ Resolved | `as unknown as LangchainCollection` typed bridge |
