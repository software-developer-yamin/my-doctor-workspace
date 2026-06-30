# Development Guide — Backend

**Part:** `my_doctor_backend/`  
**Generated:** 2026-06-25

---

## Prerequisites

- Node.js (v18+ recommended, ESM support required)
- pnpm (`npm install -g pnpm`)
- MongoDB (local or Atlas cluster)
- Redis (local or Redis Cloud)
- PM2 (optional, for production: `npm install -g pm2`)

---

## Environment Setup

Create `.env` in `my_doctor_backend/`:

```env
MONGODB_URI=mongodb://localhost:27017
DB_NAME=my_doctor
SESSION_SECRET=your-session-secret
ACCESS_TOKEN_SECRET=your-access-token-secret
REFRESH_TOKEN_SECRET=your-refresh-token-secret
PORT=5000
GREEN_WEB_KEY=your-sms-gateway-key

# AI Keys (add as needed)
GOOGLE_API_KEY=your-gemini-key
OPENAI_API_KEY=your-openai-key
BRAVE_SEARCH_API_KEY=your-brave-key
```

---

## Installation

```bash
cd my_doctor_backend
pnpm install
```

---

## Development Commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start with nodemon (auto-reload on file change) |
| `pnpm build` | Compile TypeScript → `dist/` |
| `pnpm start` | Run compiled `dist/bootstrap.js` |
| `pnpm watch` | Watch mode (alias for dev) |
| `pnpm test` | Run Jest test suite |
| `pnpm coverage` | Jest with coverage report |
| `pnpm seed` | Seed database with initial data |

---

## Database Seeding

Multiple seed scripts available:

```bash
pnpm seed                  # General seed
npx ts-node src/seed-hospital-data.ts
npx ts-node src/seed-ambulance-data.ts
npx ts-node src/seed-bdlocations.ts
npx ts-node src/seed-reviews.ts
```

Backfill scripts (for data migrations):
```bash
npx ts-node src/backfill-doctor-reviews.ts
npx ts-node src/backfill-lab-tests.ts
```

---

## Project Structure Quick Reference

```
src/
├── app.ts              ← Express app (middleware setup)
├── bootstrap.ts        ← Server start (HTTP listen)
├── routes/routes.ts    ← All API routes wired here
├── modules/            ← Feature modules (controller/service/model/routes)
├── middlewares/        ← Auth guard, error handler
├── database/           ← MongoDB + Redis init
├── utils/              ← Logger, error response helpers
├── helpers/            ← Business helper functions
├── base/               ← Base classes for modules
├── config/             ← App configuration constants
└── types/              ← Shared TypeScript types
```

---

## Adding a New Module

1. Create `src/modules/{domain}/` with 4 files:
   - `{Domain}.model.ts` — Mongoose schema
   - `{Domain}.service.ts` — Business logic
   - `{Domain}.controller.ts` — Request handlers
   - `{Domain}.routes.ts` — Express router
2. Register routes in `src/routes/routes.ts`:
   ```typescript
   import NewRoutes from "../modules/{domain}/{Domain}.routes.js";
   router.use("/{domain}", NewRoutes);
   ```

---

## Testing

```bash
pnpm test           # Run all tests in src/tests/
pnpm coverage       # With coverage report
```

Test files go in `src/tests/*.test.ts`. Config: `jest.config.js` (ts-jest ESM preset).

---

## PM2 Production Deployment

```bash
# Start
pm2 start ecosystem.config.cjs

# Other PM2 commands (mapped to pnpm scripts)
pnpm stop      # pm2 stop
pnpm restart   # pm2 restart
pnpm reload    # pm2 reload (zero-downtime)
pnpm delete    # pm2 delete
pnpm logs      # pm2 logs
pnpm monit     # pm2 monit
```

---

## API Documentation

See [API Contracts — Backend](./api-contracts-backend.md) for all endpoints.

Base URL: `http://localhost:{PORT}/api/v1`
