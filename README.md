# my-doctor-workspace

Bangladeshi healthcare platform — Turborepo monorepo containing three apps and shared packages.

## Apps

| App | Path | Stack | Port |
|-----|------|-------|------|
| Patient Frontend | `apps/web/` | Next.js 16, React 19, TypeScript | 3000 |
| REST API Backend | `apps/server/` | Express 5, TypeScript (ESM), MongoDB, Redis | 6089 |
| Admin Panel | `apps/admin/` | Vite 8, React 19, TanStack Router, Zustand | 5173 |

## Packages

| Package | Path | Purpose |
|---------|------|---------|
| `@my-doctor/types` | `packages/types/` | Shared TypeScript types |
| `@my-doctor/api-client` | `packages/api-client/` | Shared Axios client |
| `@my-doctor/validation` | `packages/validation/` | Shared Zod schemas |
| `@my-doctor/config` | `packages/config/` | Shared constants and env schemas |
| `@my-doctor/ui` | `packages/ui/` | Shared UI components |
| `@my-doctor/utils` | `packages/utils/` | Shared utilities |

## Requirements

- Node.js 20+
- pnpm 9+
- MongoDB
- Redis

## Getting Started

```bash
# Clone the repo
git clone https://github.com/software-developer-yamin/my-doctor-workspace.git
cd my-doctor-workspace

# Install dependencies
pnpm install

# Copy env files
cp apps/server/.env.example apps/server/.env
cp apps/web/.env.example apps/web/.env
cp apps/admin/.env.example apps/admin/.env

# Run all apps in development
pnpm dev
```

## Commands

Run from the workspace root:

```bash
pnpm dev        # Start all apps concurrently (Turborepo)
pnpm build      # Build all apps
pnpm lint       # Lint all apps
pnpm typecheck  # TypeScript check all apps
pnpm test       # Run tests
```

Run per-app:

```bash
# Backend
cd apps/server && pnpm dev

# Frontend
cd apps/web && pnpm dev

# Admin
cd apps/admin && pnpm dev
```

## Architecture

```
apps/
  web/       → Next.js patient frontend
  server/    → Express REST API + LangChain AI features
  admin/     → Vite admin SPA (served statically by Express in production)
packages/
  types/
  api-client/
  validation/
  config/
  ui/
  utils/
```

The backend follows a modular MVC structure:

```
src/modules/{domain}/
  {Domain}.model.ts       ← Mongoose schema
  {Domain}.service.ts     ← Business logic
  {Domain}.controller.ts  ← Request handlers
  {Domain}.routes.ts      ← Express Router
```

## AI Features

| Feature | Stack |
|---------|-------|
| Doctor recommendation | LangChain + Gemini + MongoDB Atlas Vector Search |
| Symptom triage | LangGraph stateful agent + Gemini |
| Conversational AI | LangChain chains + chat memory |
| Web search in AI flows | Brave Search API + Gemini |

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Monorepo | Turborepo 2, pnpm workspaces |
| Frontend | Next.js 16, React 19, TanStack Query, Redux Toolkit |
| Backend | Express 5, TypeScript ESM, Mongoose, ioredis |
| Admin | Vite 8, TanStack Router, Clerk (user management) |
| Database | MongoDB, Redis |
| Auth | JWT (patients/doctors), express-session (admin) |
| AI | LangChain, LangGraph, Google Gemini |
| Linting | Biome 2 |
| Testing | Jest (backend only) |
