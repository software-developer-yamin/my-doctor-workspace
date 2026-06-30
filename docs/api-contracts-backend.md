# API Contracts — Backend

**Generated:** 2026-06-25 (Quick Scan — route-level, no request/response schemas)  
**Base URL:** `http://{host}:{PORT}/api/v1`  
**Auth:** JWT cookies (patient/doctor) or express-session (admin)

---

> **Note:** This document was generated from a Quick Scan (directory structure + route file analysis only). Request/response schemas require a Deep or Exhaustive scan to document fully. Run `/bmad-document-project` and select Deep Scan → deep-dive on `api-contracts-backend` to generate full schemas.

---

## Auth Routes — `/api/v1/auth`

| Method | Path | Description |
|--------|------|-------------|
| POST | `/auth/register` | Register new patient user |
| POST | `/auth/login` | Patient/doctor login (returns JWT cookies) |
| POST | `/auth/logout` | Invalidate tokens |
| POST | `/auth/refresh` | Refresh access token using refresh token |
| GET | `/auth/me` | Get current authenticated user profile |
| PATCH | `/auth/me` | Update current user profile |
| PATCH | `/auth/change-password` | Update password |

## Analytics Routes — `/api/v1/analytics`

| Method | Path | Description |
|--------|------|-------------|
| GET | `/analytics/dashboard` | Admin dashboard aggregate stats |
| GET | `/analytics/*` | Various stat endpoints |

## Doctor Routes — `/api/v1/doctors`

| Method | Path | Description |
|--------|------|-------------|
| GET | `/doctors` | List doctors (filterable: speciality, location, fee, availability) |
| GET | `/doctors/:id` | Get single doctor profile |
| POST | `/doctors` | Create doctor (admin) |
| PATCH | `/doctors/:id` | Update doctor profile |
| DELETE | `/doctors/:id` | Delete doctor (admin) |

## Doctor Schedule Routes — `/api/v1/doctor-schedules`

| Method | Path | Description |
|--------|------|-------------|
| GET | `/doctor-schedules` | List schedules |
| GET | `/doctor-schedules/:doctorId` | Get doctor's weekly schedule |
| POST | `/doctor-schedules` | Create schedule |
| PATCH | `/doctor-schedules/:id` | Update schedule |
| DELETE | `/doctor-schedules/:id` | Delete schedule |

## Doctor Home Schedule Routes — `/api/v1/doctor-home-schedules`

| Method | Path | Description |
|--------|------|-------------|
| GET | `/doctor-home-schedules/:doctorId` | Get home visit schedule |
| POST | `/doctor-home-schedules` | Create home schedule |
| PATCH | `/doctor-home-schedules/:id` | Update home schedule |

## Doctor Live Queues — `/api/v1/doctor-live-queues`

| Method | Path | Description |
|--------|------|-------------|
| GET | `/doctor-live-queues/:doctorId` | Get current live queue for doctor |
| POST | `/doctor-live-queues` | Create/start a live queue session |
| PATCH | `/doctor-live-queues/:id/next` | Advance to next serial |
| PATCH | `/doctor-live-queues/:id` | Update queue state |
| DELETE | `/doctor-live-queues/:id` | End queue session |

## Hospital Routes — `/api/v1/hospitals`

| Method | Path | Description |
|--------|------|-------------|
| GET | `/hospitals` | List hospitals (filterable: location, type, facilities) |
| GET | `/hospitals/:id` | Get hospital detail |
| POST | `/hospitals` | Create hospital (admin) |
| PATCH | `/hospitals/:id` | Update hospital |
| DELETE | `/hospitals/:id` | Delete hospital (admin) |

## Appointment Routes — `/api/v1/appointments`

| Method | Path | Description |
|--------|------|-------------|
| GET | `/appointments` | List appointments (filter: doctorId, customerId, date, status) |
| GET | `/appointments/:id` | Get single appointment |
| POST | `/appointments` | Book new appointment |
| PATCH | `/appointments/:id` | Update appointment (confirm, complete, cancel) |
| DELETE | `/appointments/:id` | Delete appointment |

## Customer Routes — `/api/v1/customers`

| Method | Path | Description |
|--------|------|-------------|
| GET | `/customers` | List patients (admin) |
| GET | `/customers/:id` | Get patient profile |
| POST | `/customers` | Create customer profile |
| PATCH | `/customers/:id` | Update customer profile |

## Ambulance Routes — `/api/v1/ambulances`

| Method | Path | Description |
|--------|------|-------------|
| GET | `/ambulances` | List ambulances |
| GET | `/ambulances/:id` | Get ambulance detail |
| POST | `/ambulances` | Add ambulance (admin) |
| PATCH | `/ambulances/:id` | Update ambulance |

## Ambulance Booking Routes — `/api/v1/ambulance-bookings`

| Method | Path | Description |
|--------|------|-------------|
| GET | `/ambulance-bookings` | List ambulance bookings |
| GET | `/ambulance-bookings/:id` | Get booking detail |
| POST | `/ambulance-bookings` | Create ambulance request |
| PATCH | `/ambulance-bookings/:id` | Update booking status |

## Diagnostic Test Routes — `/api/v1/diagnostic-tests`

| Method | Path | Description |
|--------|------|-------------|
| GET | `/diagnostic-tests` | List all diagnostic tests |
| GET | `/diagnostic-tests/:id` | Get test detail |
| POST | `/diagnostic-tests` | Create test (admin) |
| PATCH | `/diagnostic-tests/:id` | Update test |
| DELETE | `/diagnostic-tests/:id` | Delete test |

## Lab Routes — `/api/v1/labs`

| Method | Path | Description |
|--------|------|-------------|
| GET | `/labs` | List labs (filterable: location, tests) |
| GET | `/labs/:id` | Get lab detail |
| POST | `/labs` | Create lab (admin) |
| PATCH | `/labs/:id` | Update lab |
| DELETE | `/labs/:id` | Delete lab |

## Diagnostic Booking Routes — `/api/v1/diagnostic-bookings`

| Method | Path | Description |
|--------|------|-------------|
| GET | `/diagnostic-bookings` | List bookings |
| GET | `/diagnostic-bookings/:id` | Get booking detail |
| POST | `/diagnostic-bookings` | Create lab test booking |
| PATCH | `/diagnostic-bookings/:id` | Update booking status |

## Prescription Routes — `/api/v1/prescriptions`

| Method | Path | Description |
|--------|------|-------------|
| GET | `/prescriptions` | List prescriptions (filter: doctorId, customerId) |
| GET | `/prescriptions/:id` | Get prescription detail |
| GET | `/prescriptions/:id/pdf` | Download prescription as PDF |
| POST | `/prescriptions` | Create prescription |
| PATCH | `/prescriptions/:id` | Update prescription |

## Guide Routes — `/api/v1/guides`

| Method | Path | Description |
|--------|------|-------------|
| GET | `/guides` | List guides |
| GET | `/guides/:id` | Get guide detail |
| POST | `/guides` | Create guide (admin) |
| PATCH | `/guides/:id` | Update guide |

## Guide Booking Routes — `/api/v1/guide-bookings`

| Method | Path | Description |
|--------|------|-------------|
| GET | `/guide-bookings` | List guide bookings |
| POST | `/guide-bookings` | Book a guide |
| PATCH | `/guide-bookings/:id` | Update booking |

## Home Doctor Booking Routes — `/api/v1/home-doctor-bookings`

| Method | Path | Description |
|--------|------|-------------|
| GET | `/home-doctor-bookings` | List home visit bookings |
| POST | `/home-doctor-bookings` | Request home doctor visit |
| PATCH | `/home-doctor-bookings/:id` | Update booking |

## Utility Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/specialities` | GET, POST, PATCH, DELETE | Specialization catalog CRUD |
| `/concentrations` | GET, POST, PATCH, DELETE | Sub-specialization CRUD |
| `/bd-locations` | GET | Bangladesh locations (division/district/upazila) |
| `/sms-logs` | GET, POST | SMS history + send app link |
| `/contact-messages` | GET, POST | Contact form submissions |
| `/callback-requests` | GET, POST, PATCH | Call-me-back requests |

---

## Response Format

Standard response envelope (inferred from `utils/errorResponse.ts` pattern):

```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

Error response:
```json
{
  "success": false,
  "message": "Error description",
  "statusCode": 400
}
```

## Pagination

Likely query params (inferred): `?page=1&limit=10&sort=createdAt&order=desc`
