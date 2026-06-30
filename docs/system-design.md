# My Doctor — System Design

> Container-level system designs for both the pre-migration and post-migration architectures.
> Generated from live codebase inventory (2026-06-30). Diagrams are Mermaid — render in GitHub, VS Code, or any Mermaid viewer.

---

## Old System Design (Pre-Migration)

Two independent directory trees with no workspace linking. Admin panel source code co-located inside the backend directory. Redis initialized but never actually connected. Environment loading scattered and order-dependent.

### Architecture Diagram

```mermaid
C4Container
  title Old System — My Doctor (Pre-Migration)

  Person(patient, "Patient", "Uses mobile/web to book doctors, hospitals, ambulances")
  Person(doctor, "Doctor", "Manages schedule, views appointments, writes prescriptions")
  Person(admin_user, "Admin", "Manages platform data via admin panel")

  System_Boundary(backend_dir, "my_doctor_backend/ (single directory)") {
    Container(express_api, "Express 4 API", "Node.js, TypeScript (partial ESM)", "REST API — auth, doctors, hospitals, bookings, AI features")
    Container(admin_spa, "Admin Panel", "React 18 + Vite (built to public/dist/)", "Admin SPA — served statically by Express")
    ContainerDb(uploads, "File Uploads", "Disk (public/uploads/)", "Doctor photos, documents")
  }

  System_Boundary(frontend_dir, "my_doctor_frontend/ (separate directory)") {
    Container(nextjs, "Next.js 15 Frontend", "React 18, App Router", "Patient-facing web app")
  }

  System_Boundary(infra, "Infrastructure") {
    ContainerDb(mongodb, "MongoDB Atlas", "Mongoose ODM", "Primary datastore — all domain data + sessions")
    ContainerDb(redis_broken, "Redis (node-redis v5)", "BROKEN — never .connect() called", "Intended cache layer — silently no-ops every request")
  }

  System_Ext(gemini, "Google Gemini API", "LLM for AI features")
  System_Ext(brave, "Brave Search API", "Web search for health info")
  System_Ext(sms_gw, "Green Web SMS", "OTP delivery (Bangladesh)")
  System_Ext(clerk_ext, "Clerk", "Not integrated in old system")

  Rel(patient, nextjs, "HTTPS", "browsers/mobile")
  Rel(doctor, nextjs, "HTTPS", "browser")
  Rel(admin_user, admin_spa, "HTTPS", "browser — served by Express on same port")

  Rel(nextjs, express_api, "HTTP/HTTPS", "REST — /api/v1/*")
  Rel(admin_spa, express_api, "HTTP", "REST — /api/v1/*  (same origin)")

  Rel(express_api, mongodb, "TCP", "Mongoose queries + Atlas Vector Search")
  Rel(express_api, redis_broken, "TCP", "Attempted — connection never established")
  Rel(express_api, uploads, "Disk I/O", "multer write, static serve")
  Rel(express_api, gemini, "HTTPS", "LangChain calls")
  Rel(express_api, brave, "HTTPS", "Brave Search API calls")
  Rel(express_api, sms_gw, "HTTPS", "OTP SMS delivery")
```

### Deployment Topology

```
Single server (or VM):
  └── Node.js process (pm2)
        ├── Serves REST API on :5000
        ├── Serves admin SPA from public/dist/ (static)
        └── Serves uploads from public/uploads/ (static)

  Separate server (or Vercel):
  └── Next.js process
        └── Serves patient frontend on :3000

  MongoDB Atlas (cloud)
  Redis (local — never actually connected)
```

### Known Structural Defects

| Defect | Impact |
|--------|--------|
| `redis` package used with v2/v3-style config wrapped in `as any` | Cache layer silently no-ops — every request hits MongoDB. `setEx` (camelCase, node-redis v4 API) called on a client that never connected |
| `dotenv.config()` called in `app.ts`, `logger.ts`, and `init_redis.ts` independently | ESM depth-first import evaluation → `process.env` can be empty when modules initialize. Intermittent startup failures |
| Admin source lives in `my_doctor_backend/public/src/` | Redeploying admin UI requires rebuilding and restarting the backend process |
| No workspace linking between frontend and backend | Types copy-pasted or inferred as `any` across apps. No shared contracts |
| `__dirname` used in ESM context | `undefined` in ESM → wrong file resolution paths for uploads and admin dist |
| Zombie packages installed | `langchain` (meta-package), `@langchain/community` (deprecated), `cheerio`, `express-winston` — all installed, none imported |
| No env validation | Missing required vars produce silent `undefined` at runtime, not a startup error |

### Old Middleware Stack (`app.ts`)

```
express.json()
express.urlencoded()
cors()
helmet()
morgan()
express.static('/uploads')
express.static('public/dist')     ← admin SPA
cookie-parser
compression
express-session  (connect-mongo)
app.use("/api", routes)           ← no rate limiting
SPA fallback
Global error handler
```

**Missing from old stack:** `hpp` (HTTP parameter pollution), `express-rate-limit` on the API prefix, env validation before any of this runs.

---

## New System Design (Post-Migration)

Turborepo monorepo with three independent apps and six shared workspace packages. Redis replaced with ioredis (working). Environment validated with Zod at process entry. Admin extracted to own app with independent build pipeline. Security middleware hardened with `hpp`.

### Architecture Diagram

```mermaid
C4Container
  title New System — My Doctor (Post-Migration, Turborepo Monorepo)

  Person(patient, "Patient", "Books doctors, hospitals, ambulances, diagnostics")
  Person(doctor, "Doctor", "Manages schedule, appointments, prescriptions")
  Person(admin_user, "Admin", "Manages platform data")

  System_Boundary(monorepo, "my-doctor-workspace/ (Turborepo pnpm workspace)") {

    System_Boundary(apps_web, "apps/web/") {
      Container(nextjs, "Next.js 16 Frontend", "React 19, Turbopack, App Router, SSR", "Patient-facing web — 56 pages, 10 features enabled, 7 gated")
    }

    System_Boundary(apps_server, "apps/server/") {
      Container(express_api, "Express 5 API", "Node.js 20+, TypeScript ESM, tsx watch (dev) / pm2 cluster (prod)", "REST API — 27 route prefixes, 65+ endpoints across all domains")
      Container(ai_layer, "AI Pipelines (src/base/)", "LangChain + LangGraph + Gemini", "4 pipelines: doctor-recommendation, symptom-triage, conversational-ai, web-search")
      ContainerDb(uploads_disk, "File Uploads", "Disk (public/uploads/)", "multer — doctor photos, documents")
    }

    System_Boundary(apps_admin, "apps/admin/") {
      Container(admin_spa, "Admin SPA", "Vite 8, React 19, TanStack Router, Zustand", "20 authenticated feature sections, Clerk for /clerk/ user management only")
    }

    System_Boundary(packages, "packages/ (shared workspace)") {
      Container(pkg_types, "@my-doctor/types", "TypeScript", "Shared type contracts [stub — Phase 5]")
      Container(pkg_api, "@my-doctor/api-client", "Axios", "Shared API client [stub — Phase 5]")
      Container(pkg_val, "@my-doctor/validation", "Zod 4", "Shared validation schemas [stub — Phase 5]")
      Container(pkg_config, "@my-doctor/config", "—", "Shared constants [stub — Phase 5]")
      Container(pkg_ui, "@my-doctor/ui", "React", "Shared UI components [stub — Phase 5]")
      Container(pkg_utils, "@my-doctor/utils", "—", "Shared utilities [stub — Phase 5]")
    }
  }

  System_Boundary(infra, "Infrastructure") {
    ContainerDb(mongodb, "MongoDB Atlas", "Mongoose 9 + Atlas Vector Search", "Primary datastore — all domain data, sessions (connect-mongo), vector embeddings")
    ContainerDb(redis, "Redis", "ioredis 5 — retryStrategy, event handlers", "Cache layer (working), session-adjacent data")
  }

  System_Ext(gemini, "Google Gemini API", "gemini-2.0-flash + text-embedding-004")
  System_Ext(brave, "Brave Search API", "Real-time health web search")
  System_Ext(sms_gw, "Green Web SMS Gateway", "OTP delivery")
  System_Ext(clerk_ext, "Clerk", "Admin user management (/clerk/ routes only)")
  System_Ext(openai, "OpenAI API", "Optional LLM fallback")

  Rel(patient, nextjs, "HTTPS", "browser / mobile")
  Rel(doctor, nextjs, "HTTPS", "browser")
  Rel(admin_user, admin_spa, "HTTPS", "browser")

  Rel(nextjs, express_api, "HTTPS", "REST — /api/* (Axios, 30s timeout, JWT Bearer)")
  Rel(admin_spa, express_api, "HTTPS", "REST — /api/* (custom JWT in cookie or Clerk token)")

  Rel(express_api, ai_layer, "in-process", "function calls")
  Rel(ai_layer, gemini, "HTTPS", "LangChain + embeddings")
  Rel(ai_layer, brave, "HTTPS", "health web search")
  Rel(ai_layer, mongodb, "TCP", "Atlas Vector Search (doctor-recommendation)")

  Rel(express_api, mongodb, "TCP", "Mongoose CRUD + aggregation pipelines")
  Rel(express_api, redis, "TCP", "ioredis — cache get/setex, retryStrategy")
  Rel(express_api, uploads_disk, "Disk I/O", "multer write, static serve /uploads")
  Rel(express_api, sms_gw, "HTTPS", "OTP SMS")
  Rel(admin_spa, clerk_ext, "HTTPS", "Clerk SDK — /clerk/ user management")

  Rel(nextjs, pkg_types, "import", "compile-time types [Phase 5]")
  Rel(admin_spa, pkg_types, "import", "compile-time types [Phase 5]")
  Rel(nextjs, pkg_api, "import", "shared Axios client [Phase 5]")
  Rel(admin_spa, pkg_api, "import", "shared Axios client [Phase 5]")
```

### Deployment Topology

```
Turborepo build (pnpm run build from workspace root):
  1. packages/* — built first (dependency order enforced by turbo.json)
  2. apps/admin — tsc -b && vite build → dist/ (575ms, cached by Turborepo)
  3. apps/server — tsc → dist/         (parallel with admin)
  4. apps/web   — next build            (parallel, depends on packages)

Production:
  ┌─────────────────────────────────────────┐
  │  Server (VPS / container)               │
  │  ├── pm2 cluster: node dist/app.js      │
  │  │     ├── REST API on :6089            │
  │  │     ├── Static: /uploads             │
  │  │     └── Static: apps/admin/dist/     │← admin SPA served by Express
  │  └── (optional) Nginx reverse proxy     │
  └─────────────────────────────────────────┘

  ┌─────────────────────────────────────────┐
  │  Separate server or Vercel Edge         │
  │  └── Next.js standalone: apps/web       │
  └─────────────────────────────────────────┘

  MongoDB Atlas (cloud, M0/M10+)
  Redis (local or managed — ioredis connects, retries on failure)
```

### New Middleware Stack (`app.ts`) — Exact Order

```
1.  express-status-monitor   — /status dashboard
2.  express.json()
3.  express.urlencoded({ extended: true })
4.  hpp()                    — HTTP parameter pollution prevention (after body parsing)
5.  cors()                   — allowlist: FRONTEND_URL + ADMIN_URL, credentials: true
6.  helmet()                 — crossOriginResourcePolicy/CSP/COEP disabled for upload serving
7.  morgan('dev')
8.  express.static('/uploads') — public/uploads/
9.  express.static(admin_dist) — apps/admin/dist/
10. cookie-parser
11. compression
12. express-session           — connect-mongo store, 24h, httpOnly, sameSite lax
13. app.use("/api", apiLimiter, routes)  — rate-limiter guards all API routes
14. SPA fallback GET /.*/    — serves admin index.html, skips /api paths
15. Global error handler     — ErrorRequestHandler using errorResponse()
```

### Backend Domain Map — 27 Modules

```
Auth & Users        /auth, /customers (OTP login), /users (admin)
Doctors             /doctors, /doctor-schedules, /doctor-home-schedules,
                    /doctor-live-queues, /doctor-reviews
Hospitals           /hospitals
Ambulances          /ambulances, /ambulance-bookings
Diagnostics         /diagnostic-tests, /labs, /diagnostic-bookings
Bookings            /appointments, /guide-bookings, /home-doctor-bookings
Content             /guides, /specialities, /concentrations, /bd-locations
Comms               /contact-messages, /callback-requests, /sms-logs
Medical             /prescriptions
AI                  /ai  (routes to src/base/ pipelines)
Ops                 /health, /analytics

Dead module:        cities/ (directory exists, no route registered)
```

### AI Layer — `src/base/` Pipelines

```mermaid
flowchart LR
  AI_Routes["/api/ai/*\nAI.routes.ts"] --> AI_Ctrl["AI.controller.ts"]
  AI_Ctrl --> DR["doctor-recommendation.ts\nVector Search + Gemini\nMongoDB Atlas embeddings"]
  AI_Ctrl --> ST["symptom-triage.ts\nLangGraph stateful agent\nGemini decision tree"]
  AI_Ctrl --> CA["conversational-ai.ts\nLangChain chain\nInMemoryChatMessageHistory"]
  AI_Ctrl --> WS["web-search.ts\nBrave Search API\n→ Gemini summarization"]

  DR --> VectorDB[(MongoDB Atlas\nVector Search)]
  ST --> Gemini[Google Gemini API]
  CA --> Gemini
  WS --> BraveAPI[Brave Search API]
  WS --> Gemini
```

### Auth Flow — Two Mechanisms

```mermaid
sequenceDiagram
  participant P as Patient/Doctor (web)
  participant A as Admin (SPA)
  participant API as Express 5 API
  participant DB as MongoDB

  Note over P,API: Patient auth — OTP flow
  P->>API: POST /api/customers/login/request-otp
  API->>P: SMS OTP via Green Web
  P->>API: POST /api/customers/login/verify-otp {otp}
  API->>P: accessToken + refreshToken (JWT, cookie)
  P->>API: GET /api/* (Authorization: Bearer {token})
  API->>API: verifyAccessToken → protect(['customer'])

  Note over A,API: Admin auth — session flow
  A->>API: POST /api/auth/login {email, password}
  API->>DB: Verify credentials
  API->>A: Set session cookie (connect-mongo)
  A->>API: Subsequent requests (cookie auto-sent)

  Note over A,API: Clerk — /clerk/ routes only
  A->>API: GET /api/clerk/* (Clerk JWT)
  API->>API: Clerk middleware validates token
```

### Frontend — Feature Gate

All primary routes are registered in `apps/web/src/config/features.ts`. Middleware (`middleware.ts`) checks `PAGE_FEATURES[path].enabled` before rendering.

```
Enabled  (10): /  /doctors  /hospitals  /ambulances  /telemedicine
               /specializations  /search  /diagnostics  /diagnostic-labs  /guides

Disabled  (7): /nurses  /diagnostic-home-services  /health-checkup-services
               /domiciliary-services  /pharmacy  /offers  /nursing-home-service
               → Middleware intercepts → renders coming-soon page automatically
```

---

## Design Comparison

| Dimension | Old System | New System |
|-----------|-----------|-----------|
| **Repo structure** | 2 separate dirs, no linking | Turborepo monorepo, pnpm workspace |
| **Admin coupling** | Source inside `my_doctor_backend/public/` | Independent `apps/admin/` with own build |
| **Cache layer** | node-redis — never connected, silently no-ops | ioredis — working, retryStrategy, event handlers |
| **Env loading** | `dotenv.config()` scattered, order-dependent | `import "./config/env.js"` first line — Zod validates, exits on error |
| **HTTP status** | Magic numbers (400, 401, 404, 500) | `StatusCodes.*` named constants |
| **Security middleware** | `helmet + cors` | `hpp + helmet + cors + rate-limit` |
| **Dev server** | `nodemon + ts-node` — slow restarts | `tsx watch` — fast, correct ESM |
| **Build pipeline** | Manual per-directory | Turborepo — parallel, cached, dependency-ordered |
| **Shared packages** | None — types duplicated or `any` | 6 workspace packages (stub, Phase 5 to populate) |
| **AI packages** | `langchain` (deprecated meta) + `@langchain/community` (deprecated) | Individual `@langchain/*` packages only |
| **Auth — patients** | JWT (same) | JWT (same) |
| **Auth — admin** | express-session | express-session + Clerk for `/clerk/` only |
| **`__dirname`** | `fileURLToPath(import.meta.url)` or undefined | `import.meta.dirname` (Node.js 20.11+) |
| **Node built-ins** | `import path from 'path'` | `import path from 'node:path'` |
| **Type safety** | Partial — `any` in service layer | Partial — `any` remains in service layer (Phase 6) |
| **Dead code** | Multiple zombie packages | `cities` module (no route); 7 disabled page features |
| **Build output** | Not coordinated | All 3 apps pass `pnpm run build` clean |

---

## What Isn't Done Yet

| Phase | Work |
|-------|------|
| Phase 5 | Populate `packages/*` — extract shared types, API client, Zod schemas from web + admin |
| Phase 6 | Replace `any` in service layer, Knip dead code audit, `cities` module decision, Biome strict rules |
| Phase 7 | ARCHITECTURE.md, DEPLOYMENT.md, API.md, GitNexus re-index post Phase 5 |
| CI/CD | `.github/workflows/` is empty — no automated build/typecheck on PR |
| Indexes | MongoDB Atlas Vector Search indexes created manually, not in code |
