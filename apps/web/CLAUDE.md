<!-- gitnexus:start -->
# GitNexus — Code Intelligence

This project is indexed by GitNexus as **my-doctor-frontend** (symbols, relationships, execution flows). Use the GitNexus MCP tools to understand code, assess impact, and navigate safely.

> Index stale? Run `node .gitnexus/run.cjs analyze` from the project root — it auto-selects an available runner.

## Always Do

- **MUST run impact analysis before editing any symbol.** Before modifying a function, class, or method, run `impact({target: "symbolName", direction: "upstream"})` and report the blast radius to the user.
- **MUST run `detect_changes()` before committing** to verify your changes only affect expected symbols.
- **MUST warn the user** if impact analysis returns HIGH or CRITICAL risk before proceeding with edits.
- When exploring unfamiliar code, use `query({search_query: "concept"})` to find execution flows.
- When you need full context on a symbol, use `context({name: "symbolName"})`.

## Never Do

- NEVER edit a function, class, or method without first running `impact` on it.
- NEVER ignore HIGH or CRITICAL risk warnings from impact analysis.
- NEVER rename symbols with find-and-replace — use `rename` which understands the call graph.
- NEVER commit changes without running `detect_changes()`.

## Resources

| Resource | Use for |
|----------|---------|
| `gitnexus://repo/my-doctor-frontend/context` | Codebase overview, index freshness |
| `gitnexus://repo/my-doctor-frontend/clusters` | All functional areas |
| `gitnexus://repo/my-doctor-frontend/processes` | All execution flows |
| `gitnexus://repo/my-doctor-frontend/process/{name}` | Step-by-step execution trace |
<!-- gitnexus:end -->

---

# Frontend-Specific Rules

## Path Alias
Always use `@/` mapping to `src/`. Never use relative `../../` paths.

## Adapters Are Mandatory
Never pass raw API response to components. Always go through `src/adapters/` which maps `_id → id` and shapes backend types to frontend types.

```
API response (BackendDoctor) → adapter → component (TDoctor)
```

## State Architecture
| Store | Purpose |
|-------|---------|
| Redux Toolkit (`src/redux/`) | Auth state + app UI state only |
| TanStack Query | All server data fetching/caching |
| `nuqs` | URL search params (filters, pagination) |
| `useState` | Ephemeral UI state (modals, steps) |

Use `useAppDispatch()` / `useAppSelector()` from `src/redux/hooks.ts`. Never raw `useDispatch`/`useSelector`.

## Auth
- Token cookie key: `CONSTANT.LOCAL_STORAGE_KEYS.AUTH_TOKEN` — never hardcode
- Cookie access: `cookies-next` client-side, `next/headers` server-side
- JWT refresh on 401 handled in `src/lib/api.ts` — don't re-implement elsewhere

## New Routes
Register every new page in `src/config/features.ts` → `PAGE_FEATURES`. Unregistered routes get blocked by `proxy.ts` middleware.

## Turbopack (next.config.ts)
`turbopack.root` is set to workspace root (`../..`) so pnpm virtual store symlinks resolve correctly. Don't change this.

## Component Locations
- `src/components/ui/` — shadcn/ui primitives only, no business logic
- `src/components/common/` — shared layout (Header, Footer)
- `src/components/sections/` — page sections
- `src/components/cards/` — card components
