---
project_name: 'my-doctor-workspace'
user_name: 'Yamin'
date: '2026-06-30'
sections_completed: ['technology_stack', 'language_rules', 'framework_rules', 'testing_rules', 'code_quality', 'critical_rules']
status: 'complete'
optimized_for_llm: true
---

# Project Context for AI Agents

_Critical rules and patterns AI agents must follow when implementing code in this project. Focus on unobvious details agents might otherwise miss._

---

## Monorepo Structure

```
my-doctor-workspace/
├── apps/
│   ├── web/        ← Patient frontend (Next.js 16)
│   ├── server/     ← REST API backend (Express 5)
│   └── admin/      ← Admin panel (Vite + React 19)
├── packages/
│   ├── api-client/ ← @my-doctor/api-client (stub — Phase 5)
│   ├── config/     ← @my-doctor/config (stub — Phase 5)
│   ├── types/      ← @my-doctor/types (stub — Phase 5)
│   ├── ui/         ← @my-doctor/ui (stub — Phase 5)
│   ├── utils/      ← @my-doctor/utils (stub — Phase 5)
│   └── validation/ ← @my-doctor/validation (stub — Phase 5)
├── turbo.json          ← Turborepo pipeline
├── pnpm-workspace.yaml
├── biome.json          ← Biome 2.5.1 formatter (format-only, lint disabled)
├── .lefthook.yml       ← Pre-commit hooks
└── .mcp.json           ← MCP servers (context7, filesystem)
```

**Build from workspace root:** `pnpm run build` (Turborepo orchestrates all 3 apps)

---

## Technology Stack & Versions

### Patient Frontend (`apps/web/`)
- Next.js 16.2.2 (App Router, Turbopack)
- React 19.2.4 + TypeScript 5 (strict mode, `noEmit: true`)
- Tailwind CSS 4.x + tw-animate-css
- Redux Toolkit 2.11.2 + react-redux 9.x (auth/UI slices only)
- TanStack Query 5.96.2 (server state)
- React Hook Form 7.x + Zod 4.x + @hookform/resolvers
- shadcn/ui via radix-ui 1.4.3 meta-package
- nuqs 2.x (URL search params state)
- Embla Carousel 8.x + autoplay plugin
- Recharts 3.8.0
- Leaflet 1.9.4 + react-leaflet 5.x (maps)
- date-fns 4.x
- Phantom UI (@aejkatappaja/phantom-ui 1.3.0) — skeletal loading states
- cookies-next 6.x (cookie access in Next.js SSR/CSR)
- lucide-react 1.7.0 + @hugeicons/react 1.x (two icon libraries in use)
- Axios 1.14.0

### Admin Panel (`apps/admin/`)
- Vite 8 + React 19.2.4 + TypeScript
- TanStack Router 1.168.10 (file-based routing, auto-generated `routeTree.gen.ts`)
- TanStack Query 5.96.2 + TanStack Table 8.21.3
- Zustand 5.0.12 (state — NOT Redux)
- Clerk (@clerk/clerk-react 5.61.3) — user management section only (`/clerk/` routes)
- Custom JWT in cookie `thisisjustarandomstring` via Zustand — main admin auth
- Tailwind CSS 4.2.2 + Radix UI components
- React Hook Form 7.x + Zod 4.x
- Recharts 3.8.1
- Package manager: **pnpm** (not npm/yarn)

### Backend (`apps/server/`)
- Node.js 20+ + Express 5.2.1, ESM modules (`"type": "module"`)
- TypeScript 6.x → compiled to `dist/`, run as `node dist/app.js`
- Mongoose 9.4.1 + MongoDB 7.x
- Redis: ioredis 5.x + redis 5.x
- JWT (jsonwebtoken 9.x) + bcrypt 6.x
- LangChain stack: @langchain/langgraph + @langchain/google-genai + @langchain/mongodb + @langchain/core
- AI features: doctor-recommendation (vector search), symptom-triage (LangGraph), conversational-ai (InMemoryChatMessageHistory), web-search (Brave API)
- Validators: Joi schemas in `src/validators/`, applied via `validate.middleware.ts`
- Multer 2.x (file uploads → `public/uploads/`)
- Puppeteer 24.x (PDF generation)
- pm2 (production), nodemon (dev)
- Jest 30 + supertest 7.x + ts-jest
- Backend port: **6089**

### Workspace Tooling
- Turborepo 2.10.1
- pnpm 10.9.0
- Biome 2.5.1 (format-only; ultracite preset via `extends: ["ultracite/biome/core"]`)
- Lefthook 1.7.0 (git hooks)
- TypeScript configs: all `.ts` (no `.js`/`.mjs` config files)
- PM2 ecosystem: `ecosystem.config.cjs` (must stay CJS — PM2 requirement)

---

## Critical Implementation Rules

### Language-Specific Rules (TypeScript)

#### Frontend (`apps/web/`)
- `strict: true` enforced — no implicit `any`, no loose nulls
- Path alias `@/*` maps to `src/*` — always use it, never relative `../../`
- `import type` for type-only imports (required by `isolatedModules: true`)
- Backend API returns `_id` (MongoDB ObjectId string) — adapters in `src/adapters/` MUST map `_id → id` before data reaches components
- Backend types prefixed `Backend*` (e.g. `BackendDoctor`), frontend types use `T*` prefix or plain names (e.g. `TDoctor`, `Doctor`)
- API response always wrapped: `{ success, message?, data: T, meta? }` — use `ApiResponse<T>` from `src/types/api.type.ts`
- `cookies-next` for client-side cookie access; `next/headers` for server-side — `src/lib/api.ts` handles both via `typeof window` check — never use `document.cookie`
- Auth token cookie key: use `CONSTANT.LOCAL_STORAGE_KEYS.AUTH_TOKEN` from `src/config/constant.ts`, never hardcode
- All API endpoint strings in `src/config/api.ts` `API.ENDPOINTS` — never hardcode URL paths in components or services

#### Backend (`apps/server/`)
- ESM: all local imports MUST include `.js` extension even for `.ts` source (e.g. `import Foo from './Foo.service.js'`)
- Module file naming: `PascalCase` matching domain (e.g. `Doctors.controller.ts`)
- Each module has exactly 4 files: `*.controller.ts`, `*.model.ts`, `*.routes.ts`, `*.service.ts`
- Mongoose models export `Document`-extended interface + Schema — password hashing in pre-save hook, NOT in service layer
- Use `sendResponse` utility from `utils/sendResponse.js` for all HTTP responses — never call `res.json()` directly
- Error handling: pass to `next(error)` for centralized handler — never catch-and-swallow in controllers
- Joi validators in `src/validators/` — apply AFTER multer middleware (multer must parse body first)

### Framework-Specific Rules

#### Next.js (`apps/web/`)
- Client components MUST have `"use client"` directive at top — omit for Server Components
- Route groups use parentheses: `(primary)`, `(dashboard)`, `(auth)`, `(secondary)` — don't affect URL paths
- `layout.tsx` wraps children — do NOT add sidebar/header inside page files, use layouts
- Feature flags gate entire pages via `src/config/features.ts` `PAGE_FEATURES` map and `proxy.ts` middleware — add new pages there when creating new routes
- Image domains must be whitelisted in `next.config.ts` `remotePatterns`
- Rewrite proxy: `/uploads/:path*` → `http://localhost:6089/uploads/:path*`
- `turbopack.root` set to workspace root (`../../`) — enables pnpm virtual store symlinks to resolve. Do NOT change.

#### React State Architecture (`apps/web/`)
- **Redux** (RTK): global UI/auth state only — `app` slice (sidebar), `auth` slice (user/token)
- **TanStack Query**: all server data fetching/caching — default `staleTime: 60000ms`
- **nuqs**: URL search params (filters, pagination) — not useState for URL-reflected state
- **Local useState**: ephemeral UI state only (modals, form steps, etc.)
- Redux hooks: use `useAppDispatch()` and `useAppSelector()` from `src/redux/hooks.ts`, never raw `useDispatch`/`useSelector`
- Auth state hydrated from cookies in `AuthProvider` on mount — don't read cookies in components, use `useAppSelector(state => state.auth)`

#### Admin Panel (`apps/admin/` — TanStack Router + Zustand)
- Routes are file-based under `src/routes/` — `routeTree.gen.ts` is auto-generated, **never edit manually**
- Every route file exports `const Route = createFileRoute('...')({...})`
- Main admin auth: custom JWT in cookie via Zustand `useAuthStore()` — cookie key `thisisjustarandomstring`
- Clerk used only for `/clerk/` user management routes — not for general admin auth
- Feature UIs live in `src/features/<domain>/` — route files just import from features, stay thin
- Package manager: **pnpm** (not npm/yarn)

#### Backend (Express 5 + Mongoose)
- File uploads stored at `public/uploads/`, accessed via frontend rewrite proxy
- Auth middleware order: `verifyAccessToken` (JWT) then `protect` (role) — always both on protected routes
- Use `.lean()` on Mongoose queries that don't need document methods
- Redis used for caching — check existing patterns before adding new cache logic
- AI pipelines in `src/base/` — never import langchain in frontend or admin

### Testing Rules

#### Backend (Jest 30 + supertest)
- Test files live in `src/tests/` — pattern: `*.test.ts`
- Jest config: `ts-jest/presets/js-with-ts-esm` with `useESM: true`
- Run: `NODE_ENV=test node --experimental-vm-modules node_modules/jest/bin/jest.js`
- Integration test pattern: `describe` → setup token → public routes → protected routes with `Authorization: Bearer <token>`
- Always close mongoose in `afterAll`: `await mongoose.connection.close()`
- Import `app` from `../app.js` for supertest
- `NODE_ENV=test` required — without it tests may hit production DB
- Mock external services (Redis, LangChain, Puppeteer) — never hit real services in tests

#### Frontend / Admin Panel
- No test framework configured in either — do NOT add test files without setting up config first

### Code Quality & Style Rules

#### Formatting (workspace-wide)
- Biome 2.5.1 formatter (via ultracite preset), `indentStyle: "space"`, `indentWidth: 2`, `lineWidth: 100`
- Run from workspace root: `pnpm format` (writes) or `pnpm format:check` (check only)
- Linter disabled in Biome — ESLint handles per-app linting
- ESLint configs: all `.ts` format (no `.js`/`.mjs`)

#### Frontend (`apps/web/`)
- ESLint: `eslint-config-next` (core-web-vitals + typescript) via `eslint.config.ts`
- `@typescript-eslint/no-unused-vars` and `no-explicit-any` are **warn** not error — fix before PR
- `react/no-unescaped-entities` and `@next/next/no-img-element` are **off**
- **Strict cross-repo isolation**: ESLint errors on any import matching `*my_doctor_backend*`, `*my-doctor-admin-panel*`, `*my_doctor_mobile*`

#### Admin Panel (`apps/admin/`)
- Prettier: `singleQuote: true`, `semi: false`, `tabWidth: 2`, `trailingComma: 'es5'`, `endOfLine: 'lf'`
- Dead code tracked with Knip (`knip.config.ts`)

#### Naming Conventions
- **Frontend files**: kebab-case (`doctor-sidebar.tsx`, `use-is-desktop.ts`)
- **Frontend components**: PascalCase exports (`export function DoctorSidebar`)
- **Frontend hooks**: `use-` prefix kebab-case file, camelCase export (`useIsDesktop`)
- **Frontend types**: `T*` for app types (`TDoctor`), `Backend*` for raw API shapes (`BackendDoctor`)
- **Backend files**: PascalCase module files (`Doctors.controller.ts`), camelCase for utilities
- **Backend interfaces**: `I*` prefix for Mongoose document interfaces (`IDoctor`)
- **Admin features**: kebab-case folders under `src/features/<domain>/`

---

## Critical Don't-Miss Rules

### Anti-Patterns to Avoid

**Frontend**
- NEVER use raw API response shape in components — always go through `src/adapters/` layer
- NEVER store auth token in `localStorage` — cookies only (`cookies-next` / `next/headers`)
- NEVER use raw `useDispatch`/`useSelector` — use typed wrappers from `src/redux/hooks.ts`
- NEVER fetch server data with `useEffect` + `useState` — use TanStack Query
- NEVER hardcode API URLs or cookie key strings — use `API.ENDPOINTS` and `CONSTANT` configs
- NEVER put business logic in `src/components/ui/` — shadcn primitives only
- NEVER edit `routeTree.gen.ts` in admin panel — auto-generated by TanStack Router

**Backend**
- NEVER use `res.json()` directly — use `sendResponse` utility
- NEVER skip `.js` extension on local ESM imports — Node throws at runtime
- NEVER hash passwords in service layer — Mongoose pre-save hook handles it
- NEVER run tests without `NODE_ENV=test` — may hit production DB
- NEVER add routes without registering in `src/routes/routes.ts`

### Security Rules
- JWT 401 → refresh → retry handled in `src/lib/api.ts` — don't implement this logic elsewhere
- Backend: `helmet` + `express-rate-limit` + `cors` already configured — don't bypass
- File uploads via Multer restricted to `public/uploads/` — never serve user files from `src/`
- Password validation: use `bcrypt.isValidPassword()` method on Mongoose model

### Domain-Specific Gotchas
- MongoDB `_id` is string in API responses — adapters map to `id`; never pass `_id` to frontend components
- Three separate auth systems — Doctor (JWT), Customer (OTP + JWT), Admin (custom JWT cookie + Clerk for /clerk/ section)
- `apps/server/public/` contains `uploads/` for file serving — the old admin SPA source at `public/src/` is stale and can be ignored; actual admin is at `apps/admin/`
- Backend serves uploads at `http://localhost:6089/uploads/` — frontend rewrites `/uploads/:path*` to that; use relative `/uploads/` paths in frontend only
- New pages MUST be registered in `src/config/features.ts` `PAGE_FEATURES` — unregistered routes get blocked by `proxy.ts`
- LangChain AI features are backend-only — never import langchain in frontend or admin
- `as unknown as T` pattern used in `doctor-recommendation.ts` for mongodb@7 vs @langchain/mongodb's mongodb@6 type mismatch — structurally identical at runtime

---

## Usage Guidelines

**For AI Agents:** Read this file before implementing any code. Follow ALL rules exactly. When in doubt, prefer the more restrictive option. Update this file if new patterns emerge.

**For Humans:** Keep lean and focused on agent needs. Update when tech stack changes.

_Last Updated: 2026-06-30_
