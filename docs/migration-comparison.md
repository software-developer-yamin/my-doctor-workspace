# My Doctor — Old vs New Codebase Comparison

> Migration from isolated multi-repo setup to Turborepo monorepo with modernized stack, typed dependencies, and production-grade tooling.

---

## 1. Overview

This document compares the previous My Doctor codebase structure with the new architecture being implemented. The migration addresses four primary problems with the old setup: fragmented codebases with no shared infrastructure, broken dependency configurations that silently failed at runtime, scattered environment loading with no validation, and a deployment model that couldn't scale horizontally without duplicating configuration.

The new design unifies all three apps (patient frontend, REST API, admin panel) into a single Turborepo monorepo with shared packages, validated environment loading, proper Redis integration, and a security-hardened Express configuration.

---

## 2. Previous Codebase

### Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js 18 (implicit) |
| Backend | Express 4, TypeScript (CommonJS → half-migrated ESM) |
| Frontend | Next.js 15, React 18 |
| Admin | React 18 + Vite (inside `my_doctor_backend/public/`) |
| Database | MongoDB + Mongoose |
| Cache | `redis` npm v5 (node-redis) — **broken config** |
| Dev server | `nodemon` + `ts-node` |
| Package manager | `pnpm` (per-directory, no workspace) |
| Linting | None (no ESLint/Biome config) |
| AI | LangChain, `langchain` (meta-package), `@langchain/community` (deprecated) |

### Folder Structure

```
my-doctor-workspace/
  my_doctor_backend/         ← Express API + admin source
    src/
      app.ts                 ← dotenv.config() called here
      database/
        init_redis.ts        ← redis v5 with v2/v3-style config (as any)
        init_mongodb.ts
      modules/               ← domain modules
      utils/
        logger.ts            ← dotenv.config() called again (redundant)
        sendResponse.ts      ← statusCode = 200 magic number
        errorResponse.ts     ← status: 400, 401... magic numbers
      helpers/
        upload.helper.ts     ← import path from 'path' (no node: prefix)
      middlewares/
        shared/
          cache_middleware.ts ← setEx() (camelCase, node-redis v4 API)
      base/                  ← LangChain AI pipelines
    public/
      src/                   ← Admin panel source (Vite) — co-located with backend
      dist/                  ← Admin built output — served statically
      uploads/               ← User-uploaded files
  my_doctor_frontend/        ← Next.js patient frontend
    src/
      app/                   ← Pages
      components/
      services/
      adapters/
      types/
```

### Architectural Pattern

**Monolithic, loosely separated.** Backend and admin panel lived in the same directory tree. No shared type contracts between apps. Frontend and admin duplicated service/adapter patterns independently. No workspace linking — any shared logic had to be copy-pasted across repos.

Environment loading was call-order dependent and duplicated:
- `app.ts` called `dotenv.config()`
- `logger.ts` called `dotenv.config()` independently
- `init_redis.ts` attempted to read `process.env` before dotenv had loaded in some import orders

### Error Handling

```typescript
// Magic HTTP status numbers throughout
export const ErrorTypes = {
  BAD_REQUEST:  { status: 400, message: "Bad request" },
  UNAUTHORIZED: { status: 401, message: "Unauthorized" },
  NOT_FOUND:    { status: 404, message: "Not found" },
  // ...
};

// Default status in sendResponse
export const sendResponse = <T>(res, data, message?, statusCode = 200, meta?) => { ... }
```

No centralized environment validation — missing required variables silently produced `undefined` at runtime.

### Redis Configuration (Broken)

```typescript
// init_redis.ts — used redis v5 package with v2/v3 createClient() style
import { createClient } from "redis";

const client = createClient({
  socket: { host: "127.0.0.1", port: 6379 },
} as any); // forced as any to suppress TS errors — config was invalid
```

The `ioredis` package was installed but never used. The `redis` package required async `.connect()` that was never called.

### Deployment Strategy

No Docker configuration. No CI/CD pipeline. Manual `pm2 start` on the backend. Admin built separately and placed in `public/dist/` before backend restart. Frontend deployed independently. No coordinated build pipeline.

### Dependency Hygiene

- `langchain` (deprecated meta-package) — installed, unused imports
- `@langchain/community` (deprecated) — installed, 0 imports found in source
- `cheerio` — installed, 0 usages
- `express-winston` — installed, 0 usages
- `nodemon` + `ts-node` — dev dependencies used as build tools
- `@types/helmet` — installed despite helmet v8 shipping its own types
- `moment` — installed, unused

---

## 3. New Codebase

### Tech Stack

| Layer | Technology | Change |
|-------|-----------|--------|
| Runtime | Node.js 20+ | Explicit requirement |
| Backend | Express 4, TypeScript ESM (`NodeNext`) | CommonJS → ESM |
| Frontend | Next.js 16.2 (Turbopack), React 19 | Next.js 15, React 18 |
| Admin | Vite 8, React 19, TanStack Router | Vite (same), extracted to own app |
| Database | MongoDB + Mongoose | Same |
| Cache | `ioredis` v5 | Replaced broken `redis` package |
| Dev server | `tsx watch` | Replaced `nodemon` + `ts-node` |
| Package manager | `pnpm` workspaces (monorepo) | Per-directory → unified workspace |
| Build orchestration | Turborepo 2 | New |
| Linting | Biome 2 (workspace-wide) | New |
| Env validation | Zod 4 with `dotenv` | New |
| Security | `helmet` + `cors` + `hpp` + `express-rate-limit` | `hpp` added |
| HTTP status | `http-status-codes` named constants | Replaced magic numbers |
| AI | `@langchain/core`, `@langchain/google-genai`, `@langchain/langgraph`, `@langchain/mongodb`, `@langchain/openai` | Removed zombie packages |

### Folder Structure

```
my-doctor-workspace/                    ← Turborepo workspace root
  apps/
    web/                                ← Next.js 16 patient frontend
      app/                              ← App Router pages
      src/
        components/
        services/                       ← Axios service classes
        adapters/                       ← _id → id, shape transforms
        types/                          ← TypeScript types
        config/
          api.ts                        ← All API endpoint constants
          features.ts                   ← PAGE_FEATURES gate (middleware-enforced)
        lib/
          api.ts                        ← Axios instance with auth interceptors
        redux/                          ← Auth state only
    server/                             ← Express 4 REST API
      src/
        app.ts                          ← env.js imported FIRST
        config/
          env.ts                        ← Zod schema, dotenv load, process.exit on invalid
        database/
          init_redis.ts                 ← ioredis { Redis } named import, retryStrategy
          init_mongodb.ts
        modules/{domain}/               ← 4-file MVC per domain (25+ modules)
          {Domain}.model.ts
          {Domain}.service.ts
          {Domain}.controller.ts
          {Domain}.routes.ts
        utils/
          sendResponse.ts               ← statusCode = StatusCodes.OK
          errorResponse.ts              ← StatusCodes.BAD_REQUEST etc.
          logger.ts                     ← Clean, no dotenv
        helpers/
          upload.helper.ts              ← import path from 'node:path'
        middlewares/shared/
          cache_middleware.ts           ← setex() (ioredis lowercase API)
        base/                           ← LangChain AI pipelines only
          doctor-recommendation.ts      ← Vector Search + Gemini
          symptom-triage.ts             ← LangGraph agent
          conversational-ai.ts          ← Chat + InMemoryChatMessageHistory
          web-search.ts                 ← Brave Search + Gemini
        validators/                     ← Joi schemas (applied after multer)
        routes/
          routes.ts                     ← Single router registry
    admin/                              ← Vite 8 admin SPA (own app)
      src/
        features/{domain}/              ← Feature-based structure
          components/
          hooks/
          api/
          types/
        routes/                         ← TanStack Router (file-based)
        stores/                         ← Zustand auth + UI state
  packages/
    types/                              ← @my-doctor/types (shared)
    api-client/                         ← @my-doctor/api-client (shared)
    validation/                         ← @my-doctor/validation (shared Zod)
    config/                             ← @my-doctor/config (shared constants)
    ui/                                 ← @my-doctor/ui (shared components)
    utils/                              ← @my-doctor/utils (shared utilities)
  turbo.json                            ← Build pipeline DAG
  pnpm-workspace.yaml                   ← Workspace root
  biome.json                            ← Unified linting config
```

### Architectural Pattern

**Modular monorepo with strict domain boundaries.** Three apps share infrastructure via workspace packages. Each backend domain follows a rigid 4-file pattern enforced by team convention. Admin is completely decoupled — built independently, served statically by Express in production.

Environment loading is deterministic:

```typescript
// apps/server/src/app.ts — FIRST import, before anything else
import "./config/env.js";  // loads dotenv, validates schema, exits on failure

// apps/server/src/config/env.ts
import { config } from "dotenv";
config();

import { z } from "zod";
const schema = z.object({
  MONGODB_URI: z.string().min(1, "MONGODB_URI is required"),
  PORT: z.coerce.number().default(6089),
  // ...
});

const result = schema.safeParse(process.env);
if (!result.success) {
  for (const issue of result.error.issues) {
    console.error(`  ${issue.path.join(".")}: ${issue.message}`);
  }
  process.exit(1);  // hard fail — no silent undefined
}
export const env = result.data;
```

### Error Handling

```typescript
// Named HTTP status constants — no magic numbers
import { StatusCodes } from "http-status-codes";

export const ErrorTypes = {
  BAD_REQUEST:      { status: StatusCodes.BAD_REQUEST,            code: "BAD_REQUEST" },
  UNAUTHORIZED:     { status: StatusCodes.UNAUTHORIZED,           code: "UNAUTHORIZED" },
  NOT_FOUND:        { status: StatusCodes.NOT_FOUND,              code: "NOT_FOUND" },
  INTERNAL_SERVER:  { status: StatusCodes.INTERNAL_SERVER_ERROR,  code: "INTERNAL_SERVER_ERROR" },
  // ...
};

// Typed success responses
export const sendResponse = <T>(
  res: Response, data: T, message?: string,
  statusCode = StatusCodes.OK, meta?: ApiMeta
): Response => { ... }
```

Unhandled errors propagate through Express error middleware via `next(e)`. `http-errors` creates typed HTTP exceptions in service layer (`createError.NotFound()`).

### Redis Configuration (Fixed)

```typescript
// init_redis.ts — ioredis named import, no `as any`
import { Redis } from "ioredis";

const client = new Redis({
  host: process.env.REDIS_HOST ?? "127.0.0.1",
  port: Number(process.env.REDIS_PORT ?? 6379),
  maxRetriesPerRequest: null,
  retryStrategy(times: number) {
    if (times > 10) return null;          // give up after 10 retries
    return Math.min(times * 100, 3000);   // exponential backoff, max 3s
  },
});

// cache_middleware.ts — ioredis uses lowercase setex
client.setex(cacheKey, CACHE_TTL, JSON.stringify(body));
```

### Deployment Strategy

```yaml
# docker-compose.dev.yml — local development
services:
  server:   # Express API
  web:      # Next.js frontend
  admin:    # Vite admin (build → served by Express in prod)
  mongo:    # MongoDB
  redis:    # Redis

# docker-compose.prod.yml — production
services:
  server:
    command: pm2 start ecosystem.config.cjs --env production
```

Turborepo build pipeline:

```json
// turbo.json
{
  "tasks": {
    "build": { "dependsOn": ["^build"], "outputs": ["dist/**", ".next/**"] },
    "dev":   { "persistent": true, "cache": false },
    "typecheck": { "dependsOn": ["^typecheck"] }
  }
}
```

`pnpm run build` from workspace root builds all three apps in correct dependency order, with Turborepo caching unchanged outputs.

### Security Middleware Stack

```typescript
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(hpp());          // HTTP parameter pollution prevention
app.use(cors({ ... }));
app.use(helmet({ ... }));
app.use(compression());
app.use(apiLimiter);     // express-rate-limit
```

### Dependency Management

```
pnpm-workspace.yaml → apps/*, packages/*
pnpm-lock.yaml      → single lockfile for entire workspace
turbo.json          → build pipeline (caching, parallelism, dependency order)
```

Removed: `redis`, `cheerio`, `express-winston`, `winston-dashboard`, `nodemon`, `ts-node`, `@langchain/community`, `langchain`, `@types/helmet`, `moment`

Added: `ioredis`, `tsx`, `http-status-codes`, `hpp`, `@types/hpp`, `zod`

---

## 4. System Design Comparison

### Old System Design

```
┌─────────────────────────────────────┐
│         my_doctor_backend/          │
│  ┌──────────────────────────────┐   │
│  │      Express API             │   │
│  │   (app.ts, modules/, base/)  │   │
│  └──────────────┬───────────────┘   │
│                 │ static serve      │
│  ┌──────────────▼───────────────┐   │
│  │  Admin Panel (public/dist/)  │   │
│  └──────────────────────────────┘   │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│        my_doctor_frontend/          │
│         Next.js (standalone)        │
└─────────────────────────────────────┘
```

- **Tight coupling:** Admin source code and backend share a filesystem path
- **No shared contracts:** Frontend and admin define their own type shapes independently
- **Sequential dependency:** Admin must be rebuilt before backend can serve updated UI
- **Single process:** All backend concerns in one Node.js process with no separation

### New System Design

```
┌──────────────────────────────────────────────────────────────┐
│                   Turborepo Workspace                         │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │  apps/web    │  │ apps/server  │  │   apps/admin     │  │
│  │ (Next.js 16) │  │ (Express 4)  │  │   (Vite 8)       │  │
│  └──────┬───────┘  └──────┬───────┘  └────────┬─────────┘  │
│         │                 │                    │             │
│         └────────────────▼────────────────────┘             │
│                  packages/ (shared)                          │
│         @my-doctor/types  @my-doctor/api-client              │
│         @my-doctor/validation  @my-doctor/config             │
└──────────────────────────────────────────────────────────────┘

Production:
  apps/admin → pnpm build → dist/ → Express static serve
  apps/web   → pnpm build → .next/ → standalone Node.js
  apps/server → tsc → dist/ → pm2 cluster
```

### Scalability & Performance Differences

| Dimension | Old | New |
|-----------|-----|-----|
| Build caching | None — full rebuild every time | Turborepo cache — only changed apps rebuild |
| Dev startup | `nodemon` restarts entire process on any `.ts` change | `tsx watch` reloads only changed module |
| Redis | Broken — cache never actually worked | ioredis with retryStrategy and event handlers |
| Next.js | Webpack bundler | Turbopack (10-100x faster HMR) |
| Admin build | Manual, no cache | Turborepo-cached Vite 8 build (575ms) |
| HTTP security | `helmet` + `cors` | Added `hpp` (parameter pollution prevention) |
| Env startup | Could start with missing required vars | Hard fail at startup with clear error message |

### Maintainability & Extensibility

| Dimension | Old | New |
|-----------|-----|-----|
| Adding a backend feature | Find correct folder, guess conventions | `new-domain-module` skill enforces exact pattern |
| Shared types | Copy-paste between apps | `packages/types/` — single source of truth |
| Adding a page | No gate, any page works | Must register in `PAGE_FEATURES` or middleware blocks it |
| Linting | No consistent config | Biome 2 at workspace root covers all apps |
| Import correctness | Silently wrong `__dirname` in ESM | `import.meta.dirname` — correct native ESM |

### Data Flow & Communication

```
Old:
  Frontend ──HTTP──► Backend (Express) ──► MongoDB
                          │
                     Redis (broken)
                          │
                      Admin (static)

New:
  Web (Next.js)  ──HTTP──► Server (Express 4)  ──► MongoDB Atlas
  Admin (Vite)   ──HTTP──►       │               ──► Redis (ioredis)
                                 │
                            src/base/  ──► Google Gemini API
                                       ──► Brave Search API
                                       ──► MongoDB Atlas Vector Search
```

---

## 5. Key Differences

| Category | Change | Impact |
|----------|--------|--------|
| **Monorepo** | 2 separate directories → Turborepo workspace | Single `pnpm install`, unified CI pipeline, shared packages |
| **Redis** | `redis` (broken) → `ioredis` (working) | Cache middleware now actually caches |
| **Dev server** | `nodemon + ts-node` → `tsx watch` | Faster restarts, correct ESM behavior |
| **Env validation** | None → Zod + `process.exit(1)` | No silent `undefined` leaking into production |
| **Admin isolation** | Co-located in `my_doctor_backend/public/` → `apps/admin/` | Independent versioning, own CI step, cleaner build |
| **HTTP status** | Magic numbers (400, 404, 500) → `StatusCodes.*` | Refactor-safe, readable, searchable |
| **Security** | `helmet + cors` → added `hpp` | HTTP parameter pollution now blocked |
| **AI packages** | `langchain` (meta) + `@langchain/community` (deprecated) → individual packages | Smaller bundle, active maintenance |
| **TypeScript paths** | `__dirname` (undefined in ESM) → `import.meta.dirname` | Correct file resolution at runtime |
| **Node built-ins** | `import path from 'path'` → `import path from 'node:path'` | Explicit, future-proof, unambiguous |

---

## 6. Benefits of the New Approach

### Scalability
- Turborepo parallelizes builds across apps and caches outputs — CI time drops significantly as the codebase grows
- `pm2 cluster` mode unchanged, but Docker Compose now coordinates all services with health checks
- Redis works correctly for the first time — cache layer is actually effective

### Modularity & Separation of Concerns
- Admin is a completely independent app — can be deployed to a CDN independently of the backend
- `packages/` workspace packages prevent type and logic duplication between web and admin
- Each backend domain is a self-contained 4-file unit — adding/removing a module doesn't touch other domains

### Developer Onboarding
- `pnpm install` + `pnpm dev` from workspace root starts all three apps
- Zod env validation prints exactly which variables are missing on startup
- `new-domain-module`, `new-langchain-pipeline`, `new-frontend-page` skills encode all conventions
- GitNexus indexes 8,897 symbols — new developers can run `context("symbolName")` instead of grepping

### Fault Tolerance
- Redis `retryStrategy` with exponential backoff — cache failures don't crash the server
- Env validation exits early with a clear error — misconfigured deployments fail fast rather than silently
- Express error middleware catches all unhandled errors from `next(e)` — no unhandled promise rejections in production

### Future-Proofing
- Workspace `packages/` are ready to populate: `@my-doctor/types`, `@my-doctor/api-client`, `@my-doctor/validation`
- Node.js `import.meta.dirname` — native ESM, no polyfills needed
- Biome 2 replaces ESLint + Prettier in one tool — significantly faster, single config

---

## 7. Lessons Learned

### What Worked Well

**ESM-first from the start.** The `NodeNext` TypeScript module resolution + `.js` extension on all imports is strict but correct. Every broken import caught at compile time rather than runtime.

**Zod at the entry point.** Making `import "./config/env.js"` the literal first line of `app.ts` is the only reliable way to ensure dotenv runs before any other module reads `process.env` in ESM. Middleware and redundant `dotenv.config()` calls in individual files were the root cause of env-ordering bugs in the old code.

**ioredis over node-redis.** ioredis has a synchronous constructor, connection lifecycle events, and a simpler API (lowercase `setex` vs camelCase `setEx`). The `redis` v5 package requires explicit async `.connect()` calls which are easy to forget and were never called.

**Removing zombie packages aggressively.** `@langchain/community` and `langchain` had 0 actual imports in source. Removing them eliminated ~78 transitive dependencies and significantly reduced `pnpm install` time.

### Challenges During Migration

**Embedded git repositories.** `apps/server/` and `apps/web/` retained `.git/` directories from when they were standalone repos. Git treated them as submodules. Fix: `git rm --cached -f apps/server apps/web`, delete `.git` dirs, re-add as regular directories.

**`__dirname` undefined in ESM.** Several files used `path.resolve(__dirname)` which evaluates to `undefined` in ESM context — producing wrong paths at runtime with no error. Replaced with `import.meta.dirname` (Node.js 20.11+).

**Turbopack workspace root.** Next.js Turbopack's `turbopack.root` must point to the workspace root (`../..` from `apps/web/`), not `apps/web/`. pnpm symlinks in `node_modules/.pnpm/` resolve outside app boundaries — Turbopack needs visibility into the full workspace to find them.

**ioredis API differences.** The Redis cache middleware used `setEx` (camelCase — node-redis v4 API). ioredis uses lowercase `setex`. TypeScript didn't catch this because `as any` was masking the type mismatch.

### Recommendations for Future Iterations

1. **Populate `packages/` workspace packages.** Types and API client code currently duplicated between `apps/web/` and `apps/admin/` should be extracted to `@my-doctor/types` and `@my-doctor/api-client`.

2. **Enable Biome strict rules.** Current Biome config is permissive. Enabling `nursery/noExplicitAny` and `correctness/noUnusedVariables` would catch the remaining `any` types in service methods.

3. **Run Knip.** Dead code audit with Knip across all three apps would surface unused exports — the `doctor-reviews` module has no routes and may be a dead feature.

4. **Add MongoDB Atlas Vector Search indexes via IaC.** Currently created manually in Atlas UI. Should be declared in a migration script or Terraform.

5. **CI/CD pipeline.** `.github/workflows/` is empty. A GitHub Actions workflow running `pnpm build` + `pnpm typecheck` on every PR would catch regressions before merge.

---

## 8. Conclusion

The migration from two isolated directories to a unified Turborepo monorepo resolves all four root problems: the admin panel is now an independent app with its own build pipeline; Redis actually works with a correct ioredis configuration; environment variables are validated at startup and fail loudly on misconfiguration; and shared types and API clients can be extracted to workspace packages rather than copy-pasted.

The immediate next steps are:

1. **Phase 5:** Populate `packages/` — extract types, API client, and Zod schemas from web and admin
2. **Phase 6:** Dead code audit (Knip), replace remaining `any` types, database index review
3. **Phase 7:** Root ARCHITECTURE.md, DEPLOYMENT.md, API.md, re-index GitNexus after Phase 5 changes
4. **CI/CD:** Wire GitHub Actions to run `pnpm build && pnpm typecheck` on PRs

The build currently passes clean across all three apps: backend (`tsc`), admin (`tsc -b && vite build`, 575ms), and frontend (Next.js 16 Turbopack, 56 pages generated).
