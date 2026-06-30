# Live Queues and Helper Assignment: API Guide (cURL)

This guide provides the direct API interactions required to manage live doctor queues and helper assignments.

## 1. Environment Configuration
- **Base URL**: `https://admin.mydoctor.com.bd/api`
- **Hospital ID**: `69fcacda1662acd6b27d6e65`
- **Doctor ID**: `69ff07dca40423bf2e9ce364`
- **Helper ID (helper3)**: `6a01d5934567e5419fdcc9fd`
- **Current Queue ID**: `6a01d65db696b9e65113c236` (Created on 2026-05-11)

### Verified Credentials for Testing:
- **Admin**: `admin@test.com` / `password123`
- **Helper**: `helper3@test.com` / `password123`

---

## 2. Admin Flow: Setup & Assignment

### Step 1: Admin Login
Obtain the `adminToken`.
```bash
curl -X POST https://admin.mydoctor.com.bd/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{
           "email": "admin@test.com",
           "password": "password123"
         }'
```

### Step 2: Register Helper User
```bash
curl -X POST https://admin.mydoctor.com.bd/api/auth/register_user \
     -H "Content-Type: application/json" \
     -d '{
           "name": "Kabir Helper",
           "email": "kabir@test.com",
           "username": "kabir_staff",
           "password": "password123",
           "role": "helpers"
         }'
```

### Step 3: Assign Helper to Hospital (CRITICAL)
A helper must be linked to a hospital to manage queues for doctors at that facility.
```bash
curl -X PATCH https://admin.mydoctor.com.bd/api/auth/update_user/REPLACE_WITH_HELPER_ID \
     -H "Authorization: Bearer ADMIN_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{
           "assignedHospital": "69fcacda1662acd6b27d6e65"
         }'
```

---

## 3. Helper Flow: Queue Management

### Step 1: Helper Login
Obtain the `helperToken`.
```bash
curl -X POST https://admin.mydoctor.com.bd/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{
           "email": "helper3@test.com",
           "password": "password123"
         }'
```

### Step 2: Start/Setup Live Queue
```bash
curl -X POST https://admin.mydoctor.com.bd/api/doctor-live-queues/setup \
     -H "Authorization: Bearer HELPER_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{
           "doctor": "69ff07dca40423bf2e9ce364",
           "date": "2026-05-11",
           "start_date_time": "2026-05-11T09:00:00Z",
           "total_serial": 40,
           "current_serial": 1,
           "avg_per_patient_visit_time_in_min": 15
         }'
```

### Step 3: Update Current Serial
```bash
curl -X PUT https://admin.mydoctor.com.bd/api/doctor-live-queues/REPLACE_WITH_QUEUE_ID/current-serial \
     -H "Authorization: Bearer HELPER_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{
           "current_serial": 2
         }'
```

### Step 4: End Live Queue
```bash
curl -X PUT https://admin.mydoctor.com.bd/api/doctor-live-queues/REPLACE_WITH_QUEUE_ID/end \
     -H "Authorization: Bearer HELPER_TOKEN"
```

---

## 4. Public View: Tracking (No Auth Required)

### Get All Hospital Queues
```bash
curl -X GET https://admin.mydoctor.com.bd/api/doctor-live-queues/hospital/69fcacda1662acd6b27d6e65
```

### Get Specific Doctor Status
```bash
curl -X GET https://admin.mydoctor.com.bd/api/doctor-live-queues/doctor/69ff07dca40423bf2e9ce364
```
