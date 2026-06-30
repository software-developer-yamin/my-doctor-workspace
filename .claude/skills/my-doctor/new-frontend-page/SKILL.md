---
name: new-frontend-page
description: Scaffold a new page in the My Doctor Next.js frontend (apps/web/). Triggers on "add a new page", "create a frontend page", "add the X page to the web app". Enforces mandatory PAGE_FEATURES registration, adapter pattern, and correct state/data-fetching patterns.
metadata:
  priority: 8
  pathPatterns:
    - "apps/web/src/**"
    - "apps/web/app/**"
---

# New Frontend Page — My Doctor Web App

## Mandatory steps (never skip)

1. Register the route in `src/config/features.ts` → `PAGE_FEATURES`
2. Create the page file in `app/{route}/page.tsx`
3. Create an adapter in `src/adapters/` if the page fetches API data
4. Use TanStack Query for data fetching (never `fetch` directly in components)

## Step 1: Register in PAGE_FEATURES

**This is required.** The middleware blocks disabled routes and shows a "coming soon" page.

```typescript
// apps/web/src/config/features.ts
export const PAGE_FEATURES: Record<string, TPageFeature> = {
  // ...existing entries...
  "/{route}": {
    enabled: true,
    name: "Your Feature Name",
    description: "Optional description",
  },
};
```

For pages under development set `enabled: false` — they show the coming-soon UI automatically.

## Step 2: Page file

```typescript
// apps/web/app/{route}/page.tsx
import { Metadata } from "next";
import YourPageClient from "@/components/{domain}/YourPageClient";

export const metadata: Metadata = {
  title: "Page Title | My Doctor",
  description: "Page description for SEO",
};

export default function YourPage() {
  return <YourPageClient />;
}
```

Server component (`page.tsx`) handles metadata only. Data fetching and interactivity go in the client component.

## Step 3: Client component

```typescript
// apps/web/src/components/{domain}/YourPageClient.tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import { YourService } from "@/services/your.service";
import { adaptYourData } from "@/adapters/your.adapter";

export default function YourPageClient() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["your-key"],
    queryFn: async () => {
      const raw = await YourService.getAll();
      return raw.map(adaptYourData);
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading data</div>;

  return (
    <div>
      {/* render data */}
    </div>
  );
}
```

## Step 4: Service

```typescript
// apps/web/src/services/your.service.ts
import api from "@/lib/api";
import { API } from "@/config/api";

export class YourService {
  static async getAll() {
    const { data } = await api.get(API.ENDPOINTS.YOUR_ENDPOINT);
    return data.data; // unwrap { success, data, meta }
  }

  static async getById(id: string) {
    const { data } = await api.get(`${API.ENDPOINTS.YOUR_ENDPOINT}/${id}`);
    return data.data;
  }
}
```

Also add the endpoint to `src/config/api.ts`:
```typescript
YOUR_ENDPOINT: "/your-route",
```

## Step 5: Adapter

**Required** — never pass raw API response shapes to components.

```typescript
// apps/web/src/adapters/your.adapter.ts
import type { YourApiResponse } from "@/types/your.types";
import type { YourUI } from "@/types/your.types";

export function adaptYourData(raw: YourApiResponse): YourUI {
  return {
    id: raw._id,           // always map _id → id
    name: raw.name,
    // transform any other shape mismatches here
  };
}
```

## Auth state (when needed)

```typescript
import { useAppSelector } from "@/redux/hooks";

const { user, isAuthenticated } = useAppSelector((state) => state.auth);
```

Use Redux only for auth state. All server data goes through TanStack Query.

## URL params

```typescript
import { useQueryState } from "nuqs";

const [search, setSearch] = useQueryState("search");
const [page, setPage] = useQueryState("page", { defaultValue: "1" });
```

Never use `useSearchParams` + `router.push` for URL state — always `nuqs`.

## Path alias rules

- Always `@/` — never relative imports (`../../`)
- Components: `@/components/{domain}/ComponentName`
- Services: `@/services/{domain}.service`
- Adapters: `@/adapters/{domain}.adapter`
- Types: `@/types/{domain}.types`
- Config: `@/config/api`, `@/config/features`

## Component placement

| What | Where |
|------|-------|
| Page-level client component | `src/components/{domain}/` |
| Shared UI primitives | `src/components/ui/` (shadcn) |
| Layout sections (navbar, footer) | `src/components/shared/` |
| Page-specific sub-components | `src/components/{domain}/` |

## Checklist

- [ ] Route added to `PAGE_FEATURES` in `src/config/features.ts`
- [ ] Page file at `app/{route}/page.tsx` with `export const metadata`
- [ ] Client component uses TanStack Query for data
- [ ] Adapter created in `src/adapters/` mapping `_id → id`
- [ ] Endpoint added to `src/config/api.ts`
- [ ] All imports use `@/` alias
- [ ] Run `pnpm typecheck` from `apps/web/`
