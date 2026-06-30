# Development Guide — Admin Panel

**Part:** `my_doctor_backend/public/`  
**Generated:** 2026-06-25

---

## Prerequisites

- Node.js v18+
- pnpm
- My Doctor Backend running

---

## Installation

```bash
cd my_doctor_backend/public
pnpm install
```

---

## Development Commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Vite dev server (separate port, typically :5173) |
| `pnpm build` | Build to `dist/` (served by Express in production) |
| `pnpm preview` | Preview production build |
| `pnpm lint` | ESLint check |
| `pnpm format` | Prettier format |
| `pnpm knip` | Dead code detection |

---

## Production Build Flow

```bash
# 1. Build admin SPA
cd my_doctor_backend/public
pnpm build

# 2. dist/ is now served by Express backend automatically
# Express: app.use(express.static('public/dist'))
# Admin panel accessible at: http://localhost:{PORT}/
```

---

## Project Structure Quick Reference

```
src/
├── main.tsx            ← React entry point
├── routes/             ← TanStack Router file-based routes
│   ├── __root.tsx      ← Root layout
│   ├── (auth)/         ← Login page
│   ├── _authenticated/ ← All protected admin routes
│   └── (errors)/       ← Error pages
├── features/           ← Feature modules (co-located UI + logic)
├── components/         ← Shared components
├── stores/             ← Zustand state stores
├── hooks/              ← Custom hooks
├── lib/                ← Axios, query client setup
├── config/             ← Constants
└── context/            ← React context
```

---

## Adding a New Admin Feature

1. Create `src/features/{domain}/` directory
2. Add components, hooks (useQuery/useMutation), and api functions
3. Add route file: `src/routes/_authenticated/{domain}/index.tsx`
4. TanStack Router auto-generates `routeTree.gen.ts` on next `pnpm dev`

---

## Tech Stack Notes

- **TanStack Router:** File-based routing with full type safety. Route params and search params are typed. `routeTree.gen.ts` is auto-generated — never edit manually.
- **TanStack Query:** All API state. Use `useQuery` for reads, `useMutation` for writes. Invalidate queries after mutations.
- **Zustand:** Auth state, UI preferences. Keep stores small and focused.
- **TanStack Table:** Data tables with sorting, filtering, pagination. Used across all list views.
