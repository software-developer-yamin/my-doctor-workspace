# Development Guide — Patient Frontend

**Part:** `my_doctor_frontend/`  
**Generated:** 2026-06-25

---

## Prerequisites

- Node.js v18+
- pnpm (`npm install -g pnpm`)
- My Doctor Backend running (see [Development Guide — Backend](./development-guide-backend.md))
- Firebase project (for Google OAuth)

---

## Environment Setup

Create `.env` (or `.env.local`) in `my_doctor_frontend/`:

```env
# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_ASSETS_URL=http://localhost:5000

# Firebase Auth
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key

# Feature Toggles
NEXT_PUBLIC_ENABLE_ANALYTICS=false
NEXT_PUBLIC_ENABLE_MAINTENANCE_MODE=false

# Contact
NEXT_PUBLIC_WHATSAPP_NUMBER=880xxxxxxxxxx
NEXT_PUBLIC_WHATSAPP_MESSAGE=Hello
NEXT_PUBLIC_CONTACT_PHONE=+880xxxxxxxxxx

NODE_ENV=development
```

---

## Installation

```bash
cd my_doctor_frontend
pnpm install
```

---

## Development Commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Dev server on http://localhost:3000 (Turbopack) |
| `pnpm build` | Production build |
| `pnpm start` | Start production server |
| `pnpm lint` | ESLint check |

---

## Project Structure Quick Reference

```
src/
├── app/                ← Next.js App Router (pages + layouts)
│   ├── (auth)/         ← Auth pages
│   ├── (primary)/      ← Public pages
│   ├── (secondary)/    ← Info pages
│   └── (dashboard)/    ← Protected dashboards
├── components/         ← Reusable UI (ui/, common/, cards/, sections/)
├── services/           ← Axios API calls
├── adapters/           ← API → UI type transforms
├── redux/              ← Redux store + slices
├── hooks/              ← Custom React hooks
├── types/              ← TypeScript interfaces
├── lib/                ← Axios config, utilities
├── config/             ← Constants
├── context/            ← React context providers
├── providers/          ← App-level providers
└── data/               ← Static data
```

---

## Key Patterns

### Adding a New Page

1. Create folder in `src/app/(primary)/my-page/`
2. Add `page.tsx` (and `layout.tsx` if needed)
3. Page auto-routes to `/my-page`

### Adding a New Service

```typescript
// src/services/my-feature.service.ts
import axiosClient from "@/lib/axios";

export const getMyFeatures = async () => {
  const res = await axiosClient.get("/my-features");
  return res.data;
};
```

### Adding a New Adapter

```typescript
// src/adapters/my-feature.adapter.ts
import { IMyFeature } from "@/types/my-feature.types";

export const adaptMyFeature = (raw: any): IMyFeature => ({
  id: raw._id,
  name: raw.name,
  // ... transform fields
});
```

### Adding Redux State

Add slice to `src/redux/slices/` and register in `src/redux/store.ts`.

---

## PM2 Production Deployment

```bash
pm2 start ecosystem.config.cjs
```

---

## Component Libraries

| Library | Usage |
|---------|-------|
| shadcn/ui | Base UI primitives (Button, Card, Input, Dialog, etc.) |
| Phantom UI (`@aejkatappaja/phantom-ui`) | Custom skeleton/loading components |
| HugeIcons | Icon set |
| Embla Carousel | Carousels |
| Radix UI | Accessible headless primitives (via shadcn) |
| cmdk | Command palette |
