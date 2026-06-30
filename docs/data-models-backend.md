# Data Models — Backend

**Generated:** 2026-06-25 (Quick Scan — collection-level from module names + domain knowledge)  
**Database:** MongoDB (Mongoose ODM)  
**Note:** Field-level schemas require Deep/Exhaustive scan to document fully.

---

## Collections Overview

| Collection | Module | Description |
|------------|--------|-------------|
| `users` | `users/` | Platform users (patients + doctors + admins) |
| `customers` | `customers/` | Patient extended profiles |
| `doctors` | `doctors/` | Doctor profiles and credentials |
| `doctor_schedules` | `doctor-schedules/` | Weekly recurring appointment schedules |
| `doctor_home_schedules` | `doctor-home-schedules/` | Home visit availability schedules |
| `doctor_live_queues` | `doctor-live-queues/` | Real-time daily queue sessions |
| `doctor_reviews` | `doctor-reviews/` | Patient reviews and ratings for doctors |
| `hospitals` | `hospitals/` | Hospital entities |
| `appointments` | `appointments/` | Appointment bookings |
| `ambulances` | `ambulances/` | Ambulance fleet records |
| `ambulance_bookings` | `ambulance-bookings/` | Ambulance dispatch requests |
| `diagnostic_tests` | `diagnostic-tests/` | Diagnostic test catalog |
| `labs` | `labs/` | Diagnostic laboratory entities |
| `diagnostic_bookings` | `diagnostic-bookings/` | Lab test appointment bookings |
| `prescriptions` | `prescriptions/` | Doctor-written prescriptions |
| `guides` | `guides/` | Medical guide/companion profiles |
| `guide_bookings` | `guide-bookings/` | Guide session bookings |
| `home_doctor_bookings` | `home-doctor-bookings/` | Home visit booking records |
| `specialities` | `specialities/` | Medical specialization catalog |
| `concentrations` | `concentrations/` | Sub-specialization (concentration area) catalog |
| `bd_locations` | `bd-locations/` | Bangladesh geographic data |
| `sms_logs` | `sms-logs/` | Outbound SMS notification history |
| `contact_messages` | `contact-messages/` | Website contact form submissions |
| `callback_requests` | `callback-requests/` | "Call me back" request records |

---

## Key Relationships

```
User (1) ──────────── (1) Customer (patient profile)
User (1) ──────────── (1) Doctor (doctor profile)

Doctor (1) ─────────── (N) DoctorSchedule (weekly slots)
Doctor (1) ─────────── (N) DoctorHomeSchedule (home visit slots)
Doctor (1) ─────────── (N) DoctorLiveQueue (one per day/session)
Doctor (1) ─────────── (N) DoctorReview (patient reviews)
Doctor (1) ─────────── (N) Appointment

Hospital (1) ──────────── (N) Doctor (doctors work at hospitals)

Customer (1) ─────── (N) Appointment
Customer (1) ─────── (N) DiagnosticBooking
Customer (1) ─────── (N) AmbulanceBooking
Customer (1) ─────── (N) HomeDoctorBooking
Customer (1) ─────── (N) GuideBooking

Appointment (1) ──── (1) Prescription (optional)

Lab (1) ────────────── (N) DiagnosticTest (tests offered)
Lab (1) ────────────── (N) DiagnosticBooking

Ambulance (1) ──────── (N) AmbulanceBooking

Guide (1) ──────────── (N) GuideBooking

Speciality (1) ──────── (N) Doctor
Concentration (1) ───── (N) Doctor

BdLocation ─────────── referenced by Doctor, Hospital, Customer, Lab, Ambulance
```

---

## Core Schema Shapes (Inferred)

### User
```typescript
{
  _id: ObjectId,
  email: string,           // unique
  password: string,        // bcrypt hashed
  role: 'patient' | 'doctor' | 'admin',
  refreshToken: string[],  // stored refresh tokens
  createdAt: Date,
  updatedAt: Date
}
```

### Doctor
```typescript
{
  _id: ObjectId,
  userId: ObjectId,        // ref: User
  name: string,
  speciality: ObjectId,    // ref: Speciality
  concentration: ObjectId, // ref: Concentration
  hospital: ObjectId,      // ref: Hospital
  profilePhoto: string,    // URL
  bio: string,
  consultationFee: number,
  rating: number,
  totalReviews: number,
  bmdc: string,            // Bangladesh Medical & Dental Council reg no
  experience: number,      // years
  location: {
    division: string,
    district: string,
    upazila: string
  },
  isActive: boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Appointment
```typescript
{
  _id: ObjectId,
  doctor: ObjectId,        // ref: Doctor
  customer: ObjectId,      // ref: Customer
  date: Date,
  serial: number,          // queue serial number
  type: 'in-person' | 'telemedicine' | 'home',
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled',
  visitDuration: number,   // minutes per patient
  fee: number,
  notes: string,
  createdAt: Date,
  updatedAt: Date
}
```

### DoctorLiveQueue
```typescript
{
  _id: ObjectId,
  doctor: ObjectId,        // ref: Doctor
  date: Date,
  currentSerial: number,   // currently serving
  totalSerials: number,    // total booked today
  visitDurationMinutes: number, // per-patient duration
  isActive: boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Prescription
```typescript
{
  _id: ObjectId,
  doctor: ObjectId,        // ref: Doctor
  patient: ObjectId,       // ref: Customer
  appointment: ObjectId,   // ref: Appointment
  medicines: [{
    name: string,
    dose: string,
    frequency: string,
    duration: string,
    instructions: string
  }],
  diagnosticTests: string[],
  notes: string,
  followUpDate: Date,
  createdAt: Date
}
```

---

## Infrastructure

- **MongoDB** hosted on MongoDB Atlas or self-hosted
- **Mongoose** ODM with TypeScript-first model definitions
- **Redis** used for: session caching, rate limiting, short-lived data (live queue state)
- **Sessions** persisted in MongoDB via `connect-mongo` (admin panel sessions)
- **Indexes:** Expected on `doctor`, `date`, `status` fields in appointments; `email` in users; geolocation fields in hospitals/labs
