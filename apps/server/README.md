# My Doctor — Backend API

Express 5 REST API serving patient frontend and admin panel. Runs on port **6089**.

## Stack

| Layer | Tech |
|-------|------|
| Runtime | Node.js 20+ (ESM) |
| Framework | Express 5.2.1 |
| Language | TypeScript 6 (compiled → `dist/`) |
| Database | MongoDB + Mongoose 9.x |
| Cache | Redis (ioredis 5) |
| Auth | JWT access/refresh tokens + express-session (admin) |
| AI | LangChain, LangGraph, Google Gemini, MongoDB Atlas Vector Search |
| SMS | Green Web SMS API |
| PDF | pdfkit + bwip-js |
| Process manager | PM2 (prod), nodemon (dev) |

## Commands

```bash
pnpm dev        # nodemon → tsc build + node dist/app.js on each change
pnpm build      # tsc → dist/
pnpm start      # PM2 cluster (production)
pnpm test       # Jest (ESM mode via --experimental-vm-modules)
pnpm coverage   # Jest with coverage
pnpm seed       # build + run dist/seed.js
```

Single test file: `NODE_ENV=test node --experimental-vm-modules node_modules/jest/bin/jest.js --testPathPattern=user`

## Module Structure

Every domain follows this exact layout:

```
src/modules/{domain}/
├── {Domain}.model.ts       ← Mongoose schema + interface
├── {Domain}.service.ts     ← Business logic
├── {Domain}.controller.ts  ← req/res handlers
└── {Domain}.routes.ts      ← Express Router
```

All routers mount at `/api/v1/` via `src/routes/routes.ts`.

## Domain Modules (26 total)

`ambulance-bookings`, `ambulances`, `appointments`, `bd-locations`, `callback-requests`, `cities`, `concentrations`, `contact-messages`, `customers`, `diagnostic-bookings`, `diagnostic-tests`, `doctor-home-schedules`, `doctor-live-queues`, `doctor-reviews`, `doctor-schedules`, `doctors`, `guide-bookings`, `guides`, `home-doctor-bookings`, `hospitals`, `labs`, `prescriptions`, `sms-logs`, `specialities`, `users`, **`ai`**

## AI Features (`src/base/` + `src/modules/ai/`)

| Feature | File | Endpoint |
|---------|------|----------|
| Doctor recommendation | `base/doctor-recommendation.ts` | `POST /api/v1/ai/recommend-doctors` |
| Symptom triage | `base/symptom-triage.ts` | `POST /api/v1/ai/triage` |
| Conversational AI | `base/conversational-ai.ts` | `POST /api/v1/ai/chat` |
| Web health search | `base/web-search.ts` | `POST /api/v1/ai/search` |

## Validators (`src/validators/`)

Joi schemas validated by `validate.middleware.ts`. Applied after multer (multer must parse body first):

```
router.post("/", verifyAccessToken, upload.single('photo'), validate(createDoctorSchema), Controller.Create)
```

## Critical ESM Rule

All local imports must use `.js` extension:
```ts
import { sendResponse } from './utils/sendResponse.js'   // correct
import { sendResponse } from './utils/sendResponse'       // breaks at runtime
```

## Response Contract

```ts
// Success
{ success: true, data: T, message?: string, meta?: { total, page, limit, totalPages } }

// Error
{ success: false, error: { status: number, message: string, code: string } }
```

Use `sendResponse()` from `utils/sendResponse.ts` for success. Use `ErrorUtils.*` from `utils/errorResponse.ts` for errors. Never call `res.json()` directly.

## Auth Middleware

```ts
// Protected routes: JWT then role check
router.get("/", verifyAccessToken, protect(["admin"]), Controller.List)
```

## Environment Variables

| Variable | Purpose |
|----------|---------|
| `MONGODB_URI` | MongoDB connection string |
| `DB_NAME` | Database name |
| `SESSION_SECRET` | express-session signing key |
| `ACCESS_TOKEN_SECRET` | JWT access token |
| `REFRESH_TOKEN_SECRET` | JWT refresh token |
| `PORT` | HTTP port (default: 6089) |
| `GREEN_WEB_KEY` | SMS gateway API key |
| `GOOGLE_API_KEY` | Gemini AI |
| `BRAVE_SEARCH_API_KEY` | Brave Search API |
| `FRONTEND_URL` | Patient frontend origin |
| `MAIN_URL` | Backend base URL |
| `API_URL` | API base URL |
