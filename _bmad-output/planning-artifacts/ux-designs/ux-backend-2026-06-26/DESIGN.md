---
title: My Doctor Backend – API Design System
project: my-doctor-workspace / backend
source-app: my_doctor_backend
date: 2026-06-26
status: final
updated: 2026-06-26
version: 1.0.0

# API Design System — token vocabulary for the REST API surface
# "colors" → HTTP status code taxonomy
# "typography" → naming and casing conventions
# "rounded" → payload depth limits
# "spacing" → pagination and rate-limit scales
# "components" → canonical payload shapes

colors:
  # 2xx — Success
  ok: "200"                   # GET, PUT, PATCH — resource returned or updated
  created: "201"              # POST — new resource created
  no-content: "204"           # DELETE — success with no body

  # 4xx — Client error
  bad-request: "400"          # Validation failure, malformed body
  unauthorized: "401"         # Missing or invalid token
  forbidden: "403"            # Valid token, insufficient role
  not-found: "404"            # Resource does not exist
  conflict: "409"             # Duplicate (email, phone, etc.)
  unprocessable: "422"        # Business rule violation (not schema error)
  too-many-requests: "429"    # Rate limit exceeded

  # 5xx — Server error
  internal: "500"             # Unexpected server failure
  service-unavailable: "503"  # DB or Redis down, maintenance mode

typography:
  # URL path casing
  path-style: "kebab-case"         # /doctor-live-queues not /DoctorLiveQueues
  resource-name: "plural-noun"     # /doctors not /doctor
  action-endpoints: "verb-suffix"  # /doctors/:id/verify not /verifyDoctor

  # Field naming in JSON payloads
  field-style: "camelCase"         # firstName not first_name
  id-field: "_id"                  # MongoDB ObjectId — raw in backend; adapters map to id in frontend
  timestamp-fields: ["createdAt", "updatedAt"]  # ISO 8601 strings
  enum-values: "SCREAMING_SNAKE"   # PENDING, CONFIRMED, CANCELLED

  # File naming (module files)
  module-file-style: "PascalCase"  # Doctors.controller.ts
  util-file-style: "camelCase"     # sendResponse.ts

rounded:
  # Payload nesting limits
  max-depth: 3            # Root → object → scalar. Never nest resources 4 levels.
  populate-limit: 2       # Mongoose .populate() max 2 levels
  array-inline-max: 20    # Arrays embedded in a response body capped at 20 items; paginate beyond

spacing:
  # Pagination defaults
  page-size-default: 10
  page-size-max: 100
  page-size-min: 5

  # Rate limits (express-rate-limit)
  public-window-ms: 900000    # 15 min
  public-max-requests: 100    # 100 req / 15 min per IP (public routes)
  auth-window-ms: 60000       # 1 min
  auth-max-requests: 10       # 10 login attempts / min per IP (auth routes)
  upload-window-ms: 3600000   # 1 hr
  upload-max-requests: 50     # 50 uploads / hr per user

components:
  # Canonical response envelope — every response uses sendResponse()
  response-envelope:
    shape: "{ success: boolean, message?: string, data: T, meta?: PaginationMeta }"
    success-true: "always for 2xx"
    success-false: "always for 4xx/5xx"
    message: "human-readable, English, sentence-case, ends with period"
    data: "null for errors; resource or array for success"
    meta: "only present on paginated list responses"

  pagination-meta:
    shape: "{ total: number, page: number, limit: number, totalPages: number }"

  error-body:
    shape: "{ success: false, message: string, errors?: FieldError[] }"
    field-error: "{ field: string, message: string }"
    field-errors-present: "on 400 validation failures — one entry per failing field"

  auth-token:
    storage: "HTTP-only cookie"
    header-not-used: "never Bearer header from frontend — cookie only"
    cookie-key-customer: "AUTH_TOKEN (via CONSTANT.LOCAL_STORAGE_KEYS)"
    cookie-key-admin: "thisisjustarandomstring (Clerk-managed)"
    expiry-access: "15 min [ASSUMPTION — confirm in auth config]"
    expiry-refresh: "7 days [ASSUMPTION]"

  file-upload:
    handler: "Multer 2.x"
    storage: "disk — /uploads/"
    access-url: "http://localhost:6089/uploads/<filename>"
    frontend-path: "/uploads/<filename>  (rewritten by Next.js proxy)"
    allowed-types: "image/jpeg, image/png, image/webp, application/pdf"
    max-size: "5MB [ASSUMPTION]"
---

## Brand & Style

**My Doctor Backend** is a domain-modular Express 5 REST API. Primary consumers: the Next.js frontend (customer/doctor sessions) and the Vite admin SPA (Clerk-authenticated admin sessions). Secondary consumer: future mobile clients.

**Design character:** Predictable and contract-first. Every endpoint behaves the same way — same envelope, same error shape, same naming patterns. No surprises for consuming teams.

**Voice (API messages):** English, sentence-case, ends with period. Human-readable for end-users where the frontend surfaces them; technical only in field-level errors intended for developers. Examples: "Doctor not found." · "Invalid OTP. Please request a new one." · "Email already registered."

**Anti-patterns:**
- No raw `res.json()` calls — always `sendResponse()`
- No `_id` in error message strings — use resource name
- No HTML in API responses
- No stack traces in production responses
- No custom status codes outside the defined taxonomy

---

## Colors

HTTP status code taxonomy governs all response semantics. No custom codes.

| Token | Code | When |
|-------|------|------|
| `ok` | 200 | GET success, PUT/PATCH success |
| `created` | 201 | POST creating a new resource |
| `no-content` | 204 | DELETE success |
| `bad-request` | 400 | Zod/Mongoose validation failure |
| `unauthorized` | 401 | Token missing, expired, or invalid |
| `forbidden` | 403 | Authenticated but wrong role |
| `not-found` | 404 | Resource with given ID does not exist |
| `conflict` | 409 | Unique constraint violation (email, phone) |
| `unprocessable` | 422 | Valid schema but business rule violated |
| `too-many-requests` | 429 | Rate limit exceeded |
| `internal` | 500 | Unhandled error — caught by central handler |
| `service-unavailable` | 503 | MongoDB/Redis connection failure |

---

## Typography

### URL Path Conventions
- Paths: `kebab-case` plural nouns: `/doctors`, `/ambulance-bookings`, `/doctor-live-queues`
- Nested resources: `/:resourceId/sub-resource` (max 2 levels): `/hospitals/:id/team`
- Action verbs as path suffix for non-CRUD: `/doctors/:id/verify`, `/appointments/:id/complete`
- No verbs in collection paths: `/doctors` not `/getDoctors`

### JSON Field Naming
- All fields: `camelCase`
- MongoDB ID: `_id` in raw response (adapters map to `id` in frontend)
- Timestamps: `createdAt`, `updatedAt` (ISO 8601 strings, UTC)
- Enum values: `SCREAMING_SNAKE_CASE` — `PENDING`, `CONFIRMED`, `CANCELLED`, `COMPLETED`
- Boolean fields: `is` prefix — `isVerified`, `isActive`, `isAvailable`
- Count fields: `count` or `total` suffix — `appointmentCount`, `totalDoctors`
- Reference fields: singular resource name + `Id` suffix — `doctorId`, `hospitalId`

### Module File Naming
- Domain modules: `PascalCase` matching domain name: `Doctors.controller.ts`, `Appointments.service.ts`
- Utilities: `camelCase`: `sendResponse.ts`, `verifyToken.ts`
- ESM imports: always include `.js` extension even for `.ts` source

---

## Layout & Spacing

### Pagination
All list endpoints support pagination via query params `?page=1&limit=10`. Default page size: 10. Max: 100.

Response includes `meta` object:
```json
{
  "success": true,
  "data": [...],
  "meta": { "total": 247, "page": 1, "limit": 10, "totalPages": 25 }
}
```

### Rate Limits
| Surface | Window | Limit |
|---------|--------|-------|
| Public API routes | 15 min | 100 req/IP |
| Auth endpoints (login, OTP) | 1 min | 10 req/IP |
| File upload endpoints | 1 hr | 50 req/user |

Rate-limit exceeded returns `429` with `Retry-After` header (seconds until reset).

### Payload Depth
- Max nesting depth: 3 (root → object → scalar)
- Max Mongoose `.populate()` depth: 2
- Arrays embedded in response body: max 20 items inline; paginate beyond

---

## Elevation & Depth

Middleware execution order establishes priority (outermost = highest priority):

```
Request
  └── helmet (security headers)
  └── express-rate-limit (429 guard)
  └── cors (origin whitelist)
  └── express.json() body parser
  └── Router
        └── verifyAccessToken (JWT decode → 401)
        └── protect(role) (role check → 403)
        └── Controller
  └── Central error handler (all next(error) flows)
```

Never bypass this stack. Never add auth middleware outside this order.

---

## Shapes

### Response Envelope (every response)
```typescript
interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T | null;
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
```

### Error Response
```typescript
// 400 with field errors:
{
  "success": false,
  "message": "Validation failed.",
  "errors": [
    { "field": "email", "message": "Invalid email format." },
    { "field": "phone", "message": "Phone number is required." }
  ]
}

// 401:
{ "success": false, "message": "Unauthorized. Please log in." }

// 404:
{ "success": false, "message": "Doctor not found." }
```

### Auth Cookie Shape
```
Cookie: AUTH_TOKEN=<jwt>; HttpOnly; SameSite=Strict; Secure; Path=/
```

---

## Components

### Domain Module (4 files per domain)
```
src/modules/<Domain>/
├── <Domain>.controller.ts   — HTTP handlers; calls service; calls sendResponse
├── <Domain>.model.ts        — Mongoose schema + interface I<Domain>; pre-save hooks
├── <Domain>.routes.ts       — Express Router; mounts middleware + controller
└── <Domain>.service.ts      — Business logic; queries MongoDB; no HTTP concepts
```

### Auth Middleware Pair
Always applied in order on protected routes:
1. `verifyAccessToken` — decodes JWT, attaches user to `req.user`, returns 401 on failure
2. `protect(role)` — checks `req.user.role` matches required role, returns 403 on mismatch

### sendResponse Utility
```typescript
sendResponse(res, {
  statusCode: 200,
  success: true,
  message: "Doctor retrieved successfully.",
  data: doctor,
  meta: undefined,
});
```

### Mongoose Model Conventions
- Interface: `I<Domain>` extending `Document`
- Pre-save hook owns password hashing (never service layer)
- Use `.lean()` on read-only queries (no document methods needed)
- `_id` is string in JSON output (Mongoose default serialization)

---

## Do's and Don'ts

**Do:**
- Always use `sendResponse()` for all HTTP responses
- Always apply `verifyAccessToken` + `protect(role)` in that order on protected routes
- Include `.js` extension on all local ESM imports
- Use `next(error)` for all error propagation — never catch-and-swallow
- Register every new route in `src/routes/routes.ts`
- Use `.lean()` on Mongoose queries that don't call document methods
- Return `201` for successful POST/create operations
- Return `204` with no body for successful DELETE operations

**Don't:**
- Never call `res.json()` directly — always `sendResponse()`
- Never hash passwords in the service layer — pre-save Mongoose hook only
- Never skip `.js` extension on local imports — Node.js throws at runtime
- Never skip route registration in `src/routes/routes.ts`
- Never expose stack traces in production error responses
- Never use `console.log` in production code — use the logger utility
- Never return `_id` as the sole identifier without exposing it consistently
- Never add custom HTTP status codes outside the defined taxonomy
