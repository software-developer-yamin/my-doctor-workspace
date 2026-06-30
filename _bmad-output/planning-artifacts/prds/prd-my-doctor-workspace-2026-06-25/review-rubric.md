# PRD Quality Review — My Doctor

## Overall verdict

Strong foundation with clear vision, explicit scope boundaries, and honest feature inventory. Emerges as adequate-to-strong across most dimensions; decision-readiness and downstream usability are robust. Weaknesses center on vague AI feature acceptance criteria, absent done-ness metrics for non-trivial features, and unresolved architectural risk on real-time queue mechanics that blocks scaling decisions.

---

## Decision-readiness — **Adequate**

PRD surfaces key trade-offs (web-only vs. mobile, SMS-only vs. email, offline payment vs. gateway integration) and defers decisions with explicit ownership gaps (payment provider, video consultation). Open Questions (§11) are well-populated. However, several design decisions lack decision gates:

### Findings

- **[high]** AI guardrails gap (§11, Q4) — Triage/symptom checker requirement for medical disclaimer and emergency flow is flagged as an assumption ("yes — legal requirement") but not validated by legal/compliance. Platform cannot ship F-14.2 without sign-off. *Fix:* Add decision owner and rollout date to deferred items.

- **[high]** Queue real-time mechanism (§11, Q1) — Polling vs. SSE/WebSocket is unresolved and blocks scaling. No guidance given to architect on constraints (latency SLA < 5s from §6 NFR-1 vs. infrastructure budget). *Fix:* Add architecture decision record (ADR) with constraints and owner target.

- **[medium]** Doctor onboarding growth model (§11, Q2) — Deferred as open question but drives viral/referral strategy. PRD gives no guidance on go-to-market assumptions. *Fix:* Add assumption list ("assumes B2B2C partnerships with hospitals for bulk doctor import").

- **[medium]** Data retention for appointment/prescription (§11, Q5) — Legal/compliance implication; affects GDPR/local healthcare regulations in Bangladesh. Not even deferred; embedded as open question without risk framing. *Fix:* Flag as CRITICAL deferred item with compliance owner.

---

## Substance over theater — **Strong**

Personas (§3) are specific and grounded (Rafiq, Nadia, Shaheen's family); user journeys (§4) are concrete and walkable. No NFR boilerplate; every non-functional requirement has a concrete measurement (LCP < 2.5s, 99.5% uptime, < 500ms p95). Market context (§2.1) identifies real competitors by name and differentiators are earned, not aspirational (e.g., "live queue visibility — no competitor publicly features" is falsifiable).

### Findings

- **[low]** Competitor analysis missing pricing/penetration data (§2.1) — Mentions "membership/benefits model" for Shastho and "premium" positioning for Praava but no data on market share or willingness-to-pay thresholds in rural vs. urban. Doesn't affect decision-readiness but limits strategic risk assessment. *Fix:* Cite market research or data source.

- **[low]** Success metrics (§8) lack baseline or target distribution (§8) — "Registered patients 5,000" in 6 months is given without context of addressable market (Bangladesh has ~170M people; rural penetration target?). *Fix:* Add TAM/SAM/SOM context or regional rollout assumptions.

---

## Strategic coherence — **Strong**

North Star is unified and measurable: "Any Bangladeshi patient can find the right care, book it in under two minutes, and track their care journey end-to-end" (§1). Feature set aligns: discovery (F-3, F-6, F-7, F-8, F-9) → booking (F-4, F-6.3, F-8.2, F-9.3) → live tracking (F-5) → follow-up (F-11, F-12). AI features (F-14) serve the arc, not distract from it (recommendation, triage, conversational).

Differentiation thesis (BD location depth, live queue, home doctor, integrated ambulance, prescription digitization) is consistently threaded through features and NFRs (mobile-first responsive design, BD location hierarchy in NFR-5).

### Findings

- **[low]** Unclear integration point between AI triage (F-14.2) and doctor discovery (F-3) — Triage recommends care type; does it feed into doctor search, or is triage standalone? Current FRs suggest both exist in parallel. *Fix:* Clarify handoff in UJ or add FR for triage→discovery flow.

---

## Done-ness clarity — **Thin**

Feature Functional Requirements (§5) define happy-path acceptance criteria but lack:

1. **Edge cases / error flows** — F-4.1 "Patient can view doctor's weekly schedule" but no spec for "doctor has no available slots" or "schedule is null."
2. **Quantitative performance metrics** — F-5.3 "Patient can view live queue" but no spec on refresh cadence, precision (estimated wait time vs. actual), or failure mode if queue connection drops.
3. **Data completeness / validation** — F-1.3 "Patient can update profile (name, phone, medical history)" but no spec on required fields, medical history structure, or validation rules.
4. **Role-permission matrices** — F-16.2-16.6 Admin operations listed but no spec on which admin roles can CRUD which entities (e.g., can all admins delete doctors, or only super-admins?).

### Findings

- **[high]** Prescription write flow (F-11.1) missing validation spec (§5 F-11) — Can doctor submit a prescription with zero medicines? Can medicines reference non-existent diagnostic tests? What happens if patient has an allergy that conflicts with prescribed medicine? *Fix:* Add acceptance criteria matrix for prescription validation rules.

- **[high]** Live queue edge cases (F-5) absent (§5 F-5) — What happens if doctor disconnects mid-queue? If patient is serial #5 but serials #2-4 cancel, does serial number update? Is queue persistent across browser refresh? *Fix:* Add edge-case matrix (connection loss, cancellation, data sync).

- **[medium]** Diagnostic lab booking confirmation (F-6.3) incomplete (§5 F-6) — Is booking auto-confirmed, or does lab have to approve? Current wording "Patient can book a diagnostic test at a lab for a specific date" is ambiguous on confirmation flow. *Fix:* Add FR-6.3a: "Booking status: pending → confirmed (admin approval) OR auto-confirmed" + SLA for approval.

- **[medium]** Ambulance request confirmation (F-8.2) missing SLA (§5 F-8) — "Dispatch confirmed" is stated (UJ-3) but no spec on target confirmation latency. Is 5 minutes acceptable? 30 seconds? Affects patient expectations and dispatch resource planning. *Fix:* Add NFR for ambulance dispatch confirmation SLA (e.g., < 2 minutes).

---

## Scope honesty — **Strong**

Out of Scope (§7) is explicit: no mobile native, no WebRTC video, no payment gateway, no Bangla UI, no email, no third-party API. Deferred items (§7) are itemized with ownership gaps called out ("Owner: TBD").

Assumptions are tagged inline (e.g., "Three isolated auth systems — tokens never cross roles" in NFR-3, "assumes B2B2C partnerships" implied but not stated) but could be more systematic.

### Findings

- **[medium]** Out of Scope vs. Deferred boundary unclear (§7) — "Email notifications" are Out of Scope; "Payment integration" is Deferred. Both block user engagement or monetization. No rationale given for why Email is forever-out and Payment is revisitable. *Fix:* Add rationale or move Email to Deferred with owner.

- **[medium]** Assumption inventory incomplete (§7) — PRD assumes "single Node.js host (PM2)" and "MongoDB Atlas with potential vector search" but doesn't state assumptions about data sovereignty (e.g., does healthcare data need to stay in Bangladesh?), regulatory compliance (HIPAA-equivalent), or backup/DR strategy. *Fix:* Add explicit assumptions section (e.g., "Assumes data can be hosted on MongoDB Atlas in AWS region X").

---

## Downstream usability — **Strong**

Feature catalog (§5) is organized by functional area (Auth, Discovery, Booking, Queue, Labs, Hospitals, Ambulance, Home Doctor, Guides, Prescriptions, Dashboards, AI, Notifications, Admin, Contact). Each FR has a unique ID (FR-N.M) enabling traceability to user stories and acceptance tests. 

Architecture summary (§10) provides layer map (Next.js Frontend / Express Backend / React Admin) and auth strategy, allowing UX and architecture teams to decompose cleanly.

User journeys (§4) are implementable as story scaffolds.

### Findings

- **[medium]** FR ID scheme lacks feature-to-layer mapping — FR-3.4 "AI-powered doctor recommendation" doesn't indicate whether it's a backend-only or frontend-visible FR. Must reverse-engineer from NFR-4 ("no LangChain imports in frontend") to deduce backend-only. *Fix:* Add layer tag to each FR (e.g., `FR-3.4 [backend-only]`, `FR-1.1 [frontend]`).

- **[low]** Admin CRUD operations (F-16.3) listed as single FR; each CRUD entity (doctors, hospitals, labs, ambulances, guides, specialities) is a complex micro-feature. Current structure prevents story granularity. *Fix:* Decompose F-16.3 into FR-16.3a (CRUD doctors), FR-16.3b (CRUD hospitals), etc.

---

## Shape fit — **Adequate**

PRD is appropriately sized for a B2C multi-stakeholder healthcare platform in a developing market. Persona diversity (urban Dhaka, regional Chittagong, rural Sylhet) signals geographic segmentation. Feature surface area (patient, doctor, admin) is justified.

However, some shape concerns:

### Findings

- **[high]** Multi-stakeholder complexity underestimated (§5, §10) — Three auth systems (patient JWT, doctor JWT, admin Clerk) are siloed in spec; no spec for data visibility boundaries (e.g., can a doctor see all patients' prescriptions, or only their own?). No mention of hospital/ambulance/lab operator roles or their admin surfaces. Current spec conflates "Admin" with all backend operations. *Fix:* Add role/permission matrix (patient, doctor, hospital operator, ambulance operator, lab operator, admin) and data visibility rules.

- **[medium]** Home doctor service (F-9) is skeletal compared to clinic queue (F-5) — Home doctor is listed as "browsable and bookable" but has no queue, prescription, or payment flow spec unlike clinic appointments. Is home doctor a lower-priority feature, or is the spec incomplete? *Fix:* Clarify home doctor scope or decompose into separate epic.

- **[medium]** Medical guide feature (F-10) is orphaned — No user journey (UJ) for guide booking, no integration into patient dashboard (F-12), no prescription or follow-up interaction. Is this a placeholder? *Fix:* Add UJ for guide booking or mark F-10 as deferred.

---

## Mechanical notes

- **Glossary drift**: "Chamber" (used in F-4.1, UJ-1, NFR-5) is not defined; assumed to mean clinic location or consultation room, but unclear for non-Bangladeshi readers or engineering teams unfamiliar with local healthcare terminology. *Fix:* Add glossary.

- **ID continuity**: Feature section (§5) uses F-1 through F-17 (features) and FR-N.M (functional requirements). No issues with tracking.

- **Metric continuity**: Success metrics (§8) reference "appointments booked / month" but don't specify appointment type (clinic, home doctor, diagnostic, ambulance). Are all counted equally, or weighted? *Fix:* Clarify metric definition.

- **Template completeness**: Sections 1–11 are present; no Architecture Decision Records (ADRs) or implementation roadmap / timeline. PRD is requirements-focused, not execution-focused. Appropriate for a PRD but may need companion roadmap doc.

---

## Summary Table

| Dimension | Verdict | Key Finding |
|-----------|---------|------------|
| Decision-readiness | Adequate | AI guardrails and queue real-time mechanism unresolved; missing architecture decision gates. |
| Substance over theater | Strong | Grounded personas, measurable NFRs, earned differentiation. |
| Strategic coherence | Strong | North Star aligned across all features; AI serves core arc. |
| Done-ness clarity | Thin | Happy-path FRs lack edge cases, validation rules, error flows, and role-permission matrices. |
| Scope honesty | Strong | Explicit Out/Deferred lists; assumption inventory could be more systematic. |
| Downstream usability | Strong | Organized FR catalog with IDs; user journeys walkable. Layer mapping implicit. |
| Shape fit | Adequate | Multi-stakeholder complexity (hospital/ambulance/lab operators) underspecified; home doctor and medical guide are skeletal. |

**Finding counts by severity:**
- Critical: 0
- High: 5 (AI guardrails, queue mechanism, prescription validation, live queue edge cases, multi-stakeholder roles)
- Medium: 8 (doctor onboarding, data retention, competitor analysis context, email/deferred boundary, assumptions, admin CRUD decomposition, home doctor scope, medical guide integration)
- Low: 4 (competitor pricing data, success metric context, AI triage handoff, glossary, metric definition)

**File path:** `/home/yamin/Documents/smartechedge/my-doctor-workspace/_bmad-output/planning-artifacts/prds/prd-my-doctor-workspace-2026-06-25/review-rubric.md`
