---
title: My Doctor Backend – API Experience Design
project: my-doctor-workspace / backend
date: 2026-06-26
status: final
updated: 2026-06-26
version: 1.0.0
design-ref: ./DESIGN.md
---

## Foundation

**Platform:** Node.js REST API (Express 5.2.1, ESM, TypeScript 6). Port 6089. Primary consumers: `my_doctor_frontend` (Next.js, cookie-based JWT) and `my_doctor_backend/public` (Vite admin SPA, Clerk token). No browser UI — this document specifies API behavior, developer experience, and system interaction design.

**Module pattern:** Domain-modular. One module per entity — 4 files each (`*.controller.ts`, `*.model.ts`, `*.routes.ts`, `*.service.ts`). Central route registry at `src/routes/routes.ts`.

**Data stores:** MongoDB 7 (Mongoose 9) + Redis (ioredis 5 / redis 5 — caching layer).

**Auth systems (three isolated, never mixed):**
| Actor | Mechanism | Token |
|-------|-----------|-------|
| Customer | OTP + JWT | HTTP-only cookie (`AUTH_TOKEN`) |
| Doctor | JWT (email/password) | HTTP-only cookie (`AUTH_TOKEN`) |
| Admin | Clerk | Clerk-managed session cookie |

**AI stack:** LangChain (langgraph + google-genai + openai + MongoDB vector store) — backend-only. Never import in frontend or admin panel.

Visual identity and API design conventions delegated to [DESIGN.md](./DESIGN.md). This document specifies system behavior, interaction flows, and developer experience only.

---

## Information Architecture

### Route Groups

```
/api/
├── Auth & Session
│   └── /auth/
│       ├── POST   /login                    — Admin Clerk auth (verify token)
│       └── POST   /logout
│
├── Customers
│   └── /customers/
│       ├── POST   /register
│       ├── POST   /login                    — OTP request
│       ├── POST   /verify-otp              — OTP verify → JWT cookie set
│       ├── POST   /logout
│       ├── GET    /me                       — [customer]
│       ├── PUT    /me                       — [customer]
│       ├── GET    /                         — [admin] list
│       └── GET    /:id                      — [admin] single
│
├── Doctors
│   └── /doctors/
│       ├── POST   /login                    — Doctor email+password → JWT cookie
│       ├── POST   /logout
│       ├── GET    /me                        — [doctor]
│       ├── PUT    /me                        — [doctor] profile update
│       ├── PUT    /me/password              — [doctor] password change
│       ├── GET    /                          — [public] list (paginated)
│       ├── GET    /:id                       — [public] single
│       ├── POST   /                          — [admin] create
│       ├── PUT    /:id                       — [admin] update
│       ├── DELETE /:id                       — [admin] delete
│       └── POST   /:id/verify               — [admin] verify doctor
│
├── Hospitals
│   └── /hospitals/
│       ├── GET    /                          — [public] list
│       ├── GET    /:id                       — [public] single
│       ├── POST   /                          — [admin] create
│       ├── PUT    /:id                       — [admin] update
│       └── DELETE /:id                       — [admin] delete
│
├── Appointments
│   └── /appointments/
│       ├── POST   /                          — [customer] book
│       ├── GET    /my                        — [customer] own list
│       ├── GET    /doctor                    — [doctor] own list
│       ├── PUT    /:id/complete              — [doctor] mark complete
│       ├── PUT    /:id/cancel               — [customer|doctor] cancel
│       ├── GET    /                          — [admin] list all
│       └── GET    /:id                       — [admin] single
│
├── Doctor Schedules
│   └── /doctor-schedules/
│       ├── GET    /doctor/:doctorId          — [public] get schedule
│       ├── POST   /                          — [doctor|admin] create
│       ├── PUT    /:id                       — [doctor|admin] update
│       └── DELETE /:id                       — [doctor|admin] delete
│
├── Doctor Live Queues
│   └── /doctor-live-queues/
│       ├── GET    /active                    — [public] active queues
│       ├── GET    /:doctorId/:date           — [public] queue status for tracker
│       ├── POST   /                          — [doctor] open queue
│       ├── PUT    /:id/advance              — [doctor] advance serial
│       └── PUT    /:id/close               — [doctor] close queue
│
├── Doctor Home Schedules  — /doctor-home-schedules/
├── Doctor Reviews         — /doctor-reviews/
├── Specialities           — /specialities/
├── Concentrations         — /concentrations/
├── BD Locations           — /bd-locations/
│
├── Ambulances             — /ambulances/
├── Ambulance Bookings     — /ambulance-bookings/
├── Diagnostic Tests       — /diagnostic-tests/
├── Diagnostic Bookings    — /diagnostic-bookings/
├── Labs                   — /labs/
├── Guides                 — /guides/
├── Guide Bookings         — /guide-bookings/
│
├── Home Doctor Bookings   — /home-doctor-bookings/
├── Prescriptions          — /prescriptions/
│
├── Users                  — /users/        [admin only]
├── Contact Messages       — /contact-messages/
├── Callback Requests      — /callback-requests/
├── SMS Logs               — /sms-logs/     [admin only]
│
└── Uploads
    └── /uploads/:path*    — static file serving (Multer output)
```

**Role permission matrix:**

| Route class | Guest | Customer | Doctor | Admin |
|-------------|-------|----------|--------|-------|
| Public read (doctors, hospitals, specialities, queues) | ✓ | ✓ | ✓ | ✓ |
| Booking create | — | ✓ | — | — |
| Own resource read/update | — | ✓ (own) | ✓ (own) | — |
| Doctor self-manage | — | — | ✓ | — |
| Admin CRUD | — | — | — | ✓ |

---

## Voice and Tone

*API design conventions live in [DESIGN.md § Typography](./DESIGN.md).*

**Response message guidelines:**
- `message` field: English, sentence-case, ends with period
- Success: describe the action completed. "Doctor created successfully." "Queue advanced."
- Error: cause first, fix second where possible. "OTP expired. Request a new one." "Email already registered."
- Not-found: name the resource. "Appointment not found." "Doctor not found."
- Never expose internal field names in user-facing messages. "Invalid input." not "req.body.doctorId is undefined."
- `errors[]` array (on 400): field-level messages for developer consumption. Field name is the JSON path. "firstName: Required."

---

## Component Patterns

*Payload shapes and API token conventions live in [DESIGN.md § Components](./DESIGN.md).*

### Domain Module Structure
Each domain module is self-contained:
- **Controller:** HTTP handler only. No business logic. Reads `req`, calls service, calls `sendResponse`. Errors go to `next(error)`.
- **Service:** All business logic. Queries Mongoose, reads/writes Redis, calls external APIs. No `req`/`res` references.
- **Model:** Mongoose schema + `I<Domain>` interface. Pre-save hooks for password hashing. Index declarations.
- **Routes:** Express Router. Declares middleware chain. Imports controller methods.

### Auth Middleware Chain
Always in this order, never reordered:
```typescript
router.get('/protected-resource',
  verifyAccessToken,    // 1st: decode JWT → attach req.user → 401 on failure
  protect('customer'),  // 2nd: check role → 403 on mismatch
  controller.method
);
```

Admin (Clerk) routes use Clerk middleware instead of the JWT pair — never mix.

### OTP Flow (Customer Login)
```
POST /customers/login   { phone: "+8801XXXXXXXXX" }
  → SMS sent via configured SMS provider
  → Returns: { success: true, message: "OTP sent." }

POST /customers/verify-otp  { phone, otp }
  → OTP validated (Redis TTL check)
  → JWT issued → set as HTTP-only cookie
  → Returns: { success: true, data: { customer: CustomerDTO } }
```

OTP is single-use. Expires in 5 minutes [ASSUMPTION]. Invalid/expired OTP returns 400 with message "OTP expired. Request a new one."

### File Upload Flow
```
POST /uploads (multipart/form-data)
  → Multer handles file → saves to /uploads/<filename>
  → Response: { success: true, data: { url: "/uploads/<filename>" } }
```
Frontend uses relative `/uploads/<filename>` (Next.js proxy rewrites to backend). Admin panel uses full backend URL. Max 5MB. Allowed types: images + PDF.

### Prescription Generation
```
POST /prescriptions
  body: { appointmentId, medications[], notes }
  → Creates Prescription document
  → Puppeteer generates PDF → saves to /uploads/prescriptions/<id>.pdf
  → Response: { success: true, data: { prescriptionId, pdfUrl } }
```
Puppeteer is backend-only. Never import in frontend or admin.

### Redis Cache Pattern
Routes with Redis caching:
- Cache key format: `<domain>:<identifier>` (e.g. `doctor:abc123`)
- TTL: 5 min for frequently changing (queues), 1 hr for stable (doctor profiles) [ASSUMPTION]
- Cache invalidation: triggered in service on write operations — delete key then set fresh
- Check existing Redis patterns in codebase before adding new cache logic

### AI / LangChain Integration
LangChain features are backend-internal only. No endpoint accepts a raw prompt from frontend — AI is triggered by business operations (e.g., AI triage happens inside an Appointment flow, not a raw `/ai/query` endpoint). MongoDB vector store used for semantic retrieval. AI responses are never surfaced as raw LLM output — always through a structured `sendResponse` envelope.

---

## State Patterns

### Request Lifecycle
```
Request arrives
  → Rate limit check (429 if exceeded)
  → Auth middleware (401/403 if fails)
  → Validation (Zod in controller or middleware) → 400 with errors[]
  → Service call
      → Redis cache hit → return cached data
      → Cache miss → MongoDB query → cache write → return data
  → sendResponse (2xx)
  → (on any throw) → next(error) → central error handler → sendResponse (4xx/5xx)
```

### Error Propagation
All errors flow to the central error handler via `next(error)`. Never `try/catch` with swallowed errors.

```typescript
// Correct:
try {
  const result = await service.doThing();
  sendResponse(res, { statusCode: 200, success: true, data: result });
} catch (error) {
  next(error);
}
```

Central error handler maps:
- `ValidationError` (Mongoose) → 400 + `errors[]`
- `CastError` (invalid ObjectId) → 404
- `MongoServerError 11000` (duplicate key) → 409
- `JsonWebTokenError` → 401
- `TokenExpiredError` → 401
- Unhandled → 500 (message hidden in production)

### Database Connection States
- Startup: `database/` init connects to MongoDB and Redis before Express starts listening
- MongoDB disconnect: all queries fail → 503 returned via error handler
- Redis disconnect: cache disabled, queries fall through to MongoDB (degraded, not broken)

### Pagination State
Consumers must always pass `?page` and `?limit`. No cursor-based pagination — offset only. Defaults applied server-side when params absent.

---

## Interaction Primitives

### HTTP Method Semantics
| Method | Use | Idempotent |
|--------|-----|-----------|
| GET | Read (no side effects) | Yes |
| POST | Create; trigger actions (OTP, advance queue) | No |
| PUT | Full replace of a resource | Yes |
| PATCH | Partial update [rarely used — prefer PUT] | Yes |
| DELETE | Remove resource | Yes |

### Query Parameters
- `page` + `limit`: pagination
- `search`: text search (domain-specific fields)
- `status`: enum filter (PENDING, CONFIRMED, etc.)
- `doctorId`, `hospitalId`, `customerId`: FK filters
- `date`, `from`, `to`: date range filters (ISO 8601 strings)
- `sort`: field name; `order`: `asc` | `desc`

All query params are optional. Unrecognized params are ignored (never throw on unknown param).

### Response Headers
| Header | When | Value |
|--------|------|-------|
| `Content-Type` | All responses | `application/json` |
| `Set-Cookie` | Login success | JWT cookie |
| `Retry-After` | 429 | Seconds until rate limit resets |
| `X-Request-Id` | All (if implemented) | UUID for log correlation |

### CORS
Origin whitelist configured in `cors` middleware. Frontend origin and admin panel origin are whitelisted. Credentials (`withCredentials: true`) required for cookie-based auth to work cross-origin in dev.

---

## Accessibility Floor

For a REST API, "accessibility" means consumer contract reliability:

- **Consistent envelope:** Every response — success or failure — uses the `ApiResponse<T>` shape. Consumers never need `instanceof` checks.
- **Typed errors:** 400 always includes `errors[]` for validation failures. Consumers can map field errors to form fields without parsing message strings.
- **Stable field names:** Payload fields never renamed without a version bump. `_id` always present on documents. `createdAt` / `updatedAt` always present on Mongoose documents.
- **No silent failures:** Service errors always propagate via `next(error)`. No 200 with `success: false` body. HTTP status always reflects semantic outcome.
- **Predictable auth errors:** 401 means "token problem" (missing/expired). 403 means "role problem" (wrong actor). Never swap these.
- **Idempotent GETs:** All GET endpoints are side-effect-free. Clients may retry failed GETs without risk.
- **Paginated lists never break on empty:** Empty list returns `{ success: true, data: [], meta: { total: 0, page: 1, limit: 10, totalPages: 0 } }` — never 404.

---

## Key Flows

### Flow 1: Rahima (Customer) Books an Appointment — Backend Perspective

**Protagonist:** Rahima's phone. My Doctor frontend as intermediary. Express 5 API receives the requests.

1. `POST /customers/login { phone }` → OTP generated → SMS sent → 200 "OTP sent."
2. `POST /customers/verify-otp { phone, otp }` → Redis OTP check → JWT minted → `Set-Cookie: AUTH_TOKEN=<jwt>` → 200 `{ data: customer }`
3. `GET /doctors?speciality=pediatrics&location=narsingdi` → cache check → MongoDB query → 200 paginated list
4. `GET /doctors/:id` → cache hit → 200 doctor with schedule populated
5. `GET /doctor-schedules/doctor/:doctorId` → 200 weekly slots
6. `POST /appointments { doctorId, slotTime, chamberIndex }` → verifyAccessToken → protect('customer') → creates Appointment → assigns serial in DoctorLiveQueue → 201 `{ data: { appointmentId, serial, trackerUrl } }`
7. *(Climax beat)* `GET /doctor-live-queues/:doctorId/:date` — public, no auth — returns `{ currentSerial: 8, patientSerial: 12, estimatedWaitMinutes: 30 }`. Frontend polls every 30s.

---

### Flow 2: Dr. Ahmed Advances the Queue

**Protagonist:** Dr. Ahmed's browser. Doctor dashboard frontend.

1. `POST /doctors/login { email, password }` → bcrypt compare (Mongoose model method) → JWT minted → 200 `{ data: doctor }`
2. `GET /appointments/doctor` → verifyAccessToken → protect('doctor') → 200 list for today
3. `PUT /appointments/:id/complete` → doctor → marks complete → `DoctorLiveQueue.advance()` → 200
4. `POST /prescriptions { appointmentId, ... }` → doctor → creates Prescription → triggers Puppeteer PDF → 201 `{ data: { pdfUrl } }`
5. *(Climax beat)* Queue serial advances. `GET /doctor-live-queues/:doctorId/:date` now returns `currentSerial: 10`. Rahima's tracker updates.

---

### Flow 3: Admin Kashem Creates a Hospital

**Protagonist:** Kashem. Admin Vite SPA. Clerk token in header.

1. `POST /hospitals` + Clerk token → Clerk middleware validates → creates Hospital doc → 201 `{ data: hospital }`
2. `POST /hospitals/:id/team { doctorId }` → 200 `{ data: { hospitalId, doctorIds: [...] } }`
3. `GET /hospitals/:id` — public — now returns hospital with team populated (depth 2)
4. *(Climax beat)* Hospital visible to patients. Next frontend GET of `/hospitals` returns updated list from cache (or fresh after TTL).

---

### Flow 4: OTP Failure Recovery

**Protagonist:** Rahima, wrong OTP entered.

1. `POST /customers/verify-otp { phone, otp: "000000" }` → Redis TTL check fails → `next(new AppError(400, "OTP invalid."))` → central error handler → 400 `{ success: false, message: "OTP invalid. Check the code and try again." }`
2. Frontend shows inline error: "OTP invalid. Check the code and try again."
3. Rahima requests new OTP: `POST /customers/login { phone }` → old Redis key overwritten → new OTP sent
4. `POST /customers/verify-otp { phone, otp: "correct" }` → success → *(Climax beat)* JWT cookie set. Rahima is now authenticated. Booking flow continues.

---

## Responsive & Platform

### Consumer Contract Stability
- **Frontend (Next.js):** Consumes via `src/lib/api.ts` Axios instance. Cookie-based auth with automatic refresh interceptor. All responses typed via `ApiResponse<T>`. Field mapping in `src/adapters/`.
- **Admin SPA (Vite):** Consumes via Clerk-authenticated Axios. No adapter layer (admin renders raw data). Responses consumed by TanStack Query + TanStack Table.
- **Future mobile (React Native):** Cookie-based auth may need adaptation to token storage; `sendResponse` envelope is compatible as-is.

### Versioning
No explicit `/v1/` prefix today [ASSUMPTION — API is pre-v1 internal only]. When a breaking change is needed: introduce `/v2/` path for affected routes, keep `/v1/` alive with deprecation header `Sunset: <date>`, remove after 90-day grace.

### Environment Parity
- **Dev:** `nodemon` + `.env` → local MongoDB + Redis
- **Test:** `NODE_ENV=test` required. Jest 30 + supertest 7. Mock Redis and LangChain. Never hit production DB.
- **Prod:** `pm2` + compiled `dist/node dist/app.js`. `NODE_ENV=production` suppresses stack traces in error responses.

### Deployment Notes (deferred — not finalized)
Infra provider, CDN, and environment promotion strategy are deferred per architecture decision log. Backend port 6089 is dev default; production port is configurable via `PORT` env var.
