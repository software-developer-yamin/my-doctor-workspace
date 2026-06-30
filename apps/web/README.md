# My Doctor — Patient Frontend

Next.js 16 App Router web app for patients. Connects to the Express backend at port 6089.

## Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 16.2.2 (App Router, Turbopack) |
| Language | TypeScript 5 (strict) |
| UI | Tailwind CSS 4 + shadcn/ui (radix-ui) |
| State | Redux Toolkit 2 (auth/UI) + TanStack Query 5 (server data) |
| HTTP | Axios 1.14 |
| Forms | React Hook Form 7 + Zod 4 |
| Maps | Leaflet 1.9 + react-leaflet 5 |
| Charts | Recharts 3.8 |
| Auth cookie | `cookies-next` (client) / `next/headers` (server) |

## Commands

```bash
pnpm dev    # Next.js dev server → localhost:3000
pnpm build  # Production build
pnpm lint   # ESLint (eslint-config-next)
```

## Architecture

```
app/                        ← Next.js App Router pages
  (primary)/                ← Main site pages (no URL impact)
  (dashboard)/              ← Patient/doctor dashboards
  (auth)/                   ← Sign-in, sign-up, OTP
  (secondary)/              ← Static pages (about, blog, etc.)
src/
  components/
    ui/                     ← shadcn/ui primitives only
    common/                 ← Shared layout (Header, etc.)
    sections/               ← Page sections
    cards/                  ← Card components
  services/                 ← Axios calls to /api/v1/
  adapters/                 ← Transform API response → UI types (MANDATORY)
  types/                    ← TypeScript types
  redux/                    ← Auth + UI state (RTK)
  config/
    api.ts                  ← All endpoint strings (API.ENDPOINTS.*)
    constant.ts             ← App-wide constants (CONSTANT.*)
    features.ts             ← PAGE_FEATURES gate for route guard
  lib/
    api.ts                  ← Axios instance + JWT refresh interceptor
```

## Key Rules

- **Adapters are mandatory** — never pass raw API `_id` response to components; use `src/adapters/` to map `_id → id`
- **Path alias** — always `@/` not relative `../../`
- **State**: Redux for auth only; TanStack Query for server data; `nuqs` for URL search params
- **API endpoints** — all in `src/config/api.ts`; never hardcode URLs
- **Auth cookie key** — always `CONSTANT.LOCAL_STORAGE_KEYS.AUTH_TOKEN`
- **New pages** must be registered in `src/config/features.ts` `PAGE_FEATURES` or `proxy.ts` blocks them

## Proxy Rewrites (next.config.ts)

```
/api/v1/:path*   →  http://localhost:6089/api/:path*
/uploads/:path*  →  http://localhost:6089/uploads/:path*
```

## Environment Variables

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL |
| `NEXT_PUBLIC_ASSETS_URL` | Media/uploads CDN URL |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase (Google OAuth) |
