# Adversarial PRD Review — My Doctor
**Reviewer role:** Skeptical CTO / Regulator / Competing PM
**Date:** 2026-06-25
**PRD version:** draft 2026-06-25

---

## FINDING 1 — AI Triage Is a Medical Device Without Regulatory Coverage [CRITICAL]

**The problem:**
FR-14.2 specifies a "LangGraph stateful agent guides patient through symptom assessment and recommends care type." This is, by legal definition in most jurisdictions, a clinical decision-support tool or medical device. Bangladesh's Directorate General of Drug Administration (DGDA) and the Directorate General of Health Services (DGHS) have no published digital health SaaS exemption. The PRD acknowledges this only as an open question (Q4) with the parenthetical "[ASSUMPTION: yes — legal requirement for medical AI in BD]." An assumption in an open-questions section is not a compliance posture.

**Specific gaps:**
- No mention of BMRC (Bangladesh Medical Research Council) ethics clearance, which is required for any system that collects patient health data and makes clinical recommendations.
- No disclaimer, no emergency redirect (the PRD notes "call 999" as a possibility — 999 is Bangladesh's emergency number — but leaves it as an open question, not a requirement).
- No fallback when the LLM hallucinates a safe care recommendation for a patient who is having a cardiac event or stroke. The liability chain ends at the platform.
- The AI is backed by Gemini (Google). Google's terms of service for Gemini API explicitly prohibit using the API for "providing medical advice." This alone may be a ToS violation on day one.

**What a regulator would do:** Shut the AI triage feature pending ethics review. If a patient follows a wrong AI recommendation and is harmed, the platform is the proximate cause in a jurisdiction with no safe-harbor law for digital health AI.

**Minimum required before launch:** (a) Remove or gate AI triage behind a "for informational purposes only" hard wall with mandatory doctor booking CTA. (b) Add emergency detection heuristics with unconditional redirect. (c) Obtain DGHS written acknowledgment of the platform's AI scope. This is not a post-launch nice-to-have.

---

## FINDING 2 — Digital Prescriptions Have Zero Legal Standing Without BMDC Integration [CRITICAL]

**The problem:**
F-11 describes a full prescription workflow: doctor writes → PDF generated with barcode → patient downloads. A downloadable, barcoded prescription PDF from a digital platform will be presented at pharmacies as a real prescription. Bangladesh's Medical Practice and Private Clinics and Laboratories (Regulation) Ordinance 1982 and its amendments do not recognize digital prescriptions unless issued through a BMDC-registered electronic system. There is no such national system currently operational.

**Specific gaps:**
- The PRD never verifies that doctors on the platform are validated against the Bangladesh Medical and Dental Council (BMDC) registration database. Doctor profiles are created by admin CRUD (FR-16.3). An admin can create a fake doctor. A fake doctor can write a prescription. The patient downloads a convincing PDF with a barcode.
- Schedule H and psychotropic drugs prescribed digitally with no DEA/DGDA equivalent control = direct route to prescription fraud.
- No mention of prescription retention laws (typically 5 years in BD public health records).

**What a competing PM would say:** "Maya explicitly avoids prescription issuance for this exact reason. You are building the liability that they wisely sidestepped."

**Minimum required before launch:** Either (a) reduce prescriptions to "clinical notes / visit summary" with explicit non-prescription language and no barcode implying authenticity, or (b) implement BMDC API verification of every doctor before any prescription capability is enabled. The barcode on the PDF is particularly dangerous — it implies institutional validation that does not exist.

---

## FINDING 3 — Business Model Is Absent; The Platform Has No Revenue Path [HIGH]

**The problem:**
Section 7 explicitly states: "Payment gateway integration — fee display is informational; actual payment is offline." The success metrics in Section 8 include no revenue metric, no GMV, no platform fee, no take rate. The constraints section lists Clerk per-seat cost, Gemini API inference cost, MongoDB Atlas cost, Redis, and Green Web SMS — all outgoing cash — against zero incoming revenue in the MVP.

**Specific gaps:**
- No monetization model is defined anywhere. Is this a SaaS subscription to doctors? A commission on bookings? A lead-gen fee per appointment? A lab referral cut?
- The deferred payment item says "Revisit after MVP launch traction." Traction toward what? Without a revenue hypothesis, there is no signal to optimize for.
- Diagnostic lab bookings (F-6) and ambulance dispatch (F-8) are potentially the highest-value transactions on the platform. Neither has any monetization hook.
- AI inference costs (Gemini + vector search) are variable and will scale with usage. At 500 AI sessions/month (the target), at ~$0.002–0.01/session for Gemini, this is trivial — but the PRD shows no model for what happens at 50,000 sessions/month. The cost curve is open-ended with no monetization ceiling.

**What a skeptical CTO/investor would say:** "You've built a feature-complete platform with no revenue model, real AI cost exposure, and a note that payment is 'offline.' This is a referral directory, not a platform."

---

## FINDING 4 — Success Metrics Are Vanity Numbers With No Baseline [HIGH]

**The problem:**
Section 8 targets 5,000 registered patients and 1,000 appointments/month in 6 months post-launch. These numbers have no market sizing basis, no cohort model, no comparison to competitors, and no explanation of how the platform will acquire users.

**Specific gaps:**
- No customer acquisition strategy exists anywhere in the PRD. No marketing channel, no partnership pipeline, no doctor acquisition playbook. Doctorola and Shastho have 5–10 year head starts and established brand recognition. How does My Doctor reach 5,000 patients?
- "Doctor queue sessions started / day: 50" implies 50 doctors actively using the live queue feature daily. With admin-only doctor creation and no self-onboarding, how are 50+ doctors onboarded and activated by month 6?
- "AI recommendation sessions / month: 500" with "Recommendation→booking conversion" as counter-metric — but no conversion rate target is given. 500 sessions with 0.1% conversion is failure; with 30% conversion it is a signal. The metric is unmeasurable without the denominator.
- No retention metric. Monthly active users, 30-day return rate, appointment rebooking rate — none present. Signups without retention is a leaky bucket.

---

## FINDING 5 — Single-Host Architecture Creates a Hard Scaling Wall and a Single Point of Failure [HIGH]

**The problem:**
NFR-2 targets 99.5% monthly uptime managed by "PM2 for process restart on failure." NFR-4 acknowledges "PM2 cluster mode capable for horizontal scaling on single host." These two sentences together describe a system that will fail entirely if the host machine fails — no multi-AZ, no container orchestration, no database replica failover described.

**Specific gaps:**
- MongoDB Atlas is listed but without replica set configuration, write concern, or read preference settings. Atlas free/shared tiers have no SLA. A single M0 cluster is not 99.5% uptime.
- Redis as a caching layer: no Redis Sentinel or Cluster mode mentioned. Redis failure = cache stampede on MongoDB = cascading failure during peak load.
- Live queue (F-5) uses polling. At 50 concurrent queues with patients each polling every 5 seconds, this is 50 × N_patients_per_queue × 12 requests/minute hitting the Express server. With PM2 cluster mode on a single host, this is fine until it isn't.
- Ambulance dispatch (F-8) is safety-critical. A 30-second downtime during a cardiac emergency dispatch is not an availability SLA problem — it is a patient safety incident.
- Clerk admin auth is a third-party SaaS dependency with its own outage history. If Clerk is down, no admin can manage the platform. There is no documented break-glass procedure.

**What a CTO would flag:** "You've described a monolith on a single host with a 99.5% SLA. AWS us-east-1 alone has had months with less than 99.5% uptime. This is not achievable without multi-region or at minimum multi-AZ deployment. Budget for that before committing to SLA."

---

## FINDING 6 — Maya Has Already Won the AI Triage Race; Differentiation Is Weak [MEDIUM]

**The problem:**
Section 2.1 correctly identifies Maya as resolving ~70% of queries via symptom screening. The PRD's response is to build the same feature (FR-14.2 AI triage) while simultaneously listing five "differentiation opportunities" that exclude AI. This is an incoherent competitive position.

**Specific gaps:**
- Maya has years of Bangla-language training data, cultural health query patterns, and a large user base generating feedback loops. My Doctor's AI is backed by Gemini (English-primary) with no Bangla UI (explicitly out of scope, Section 7).
- The PRD's differentiation points (BD location depth, ambulance dispatch, live queue, home visits) are all operational / logistics features — none are defensible moats. Doctorola or Zaynax Health can replicate location filtering in a sprint.
- "No competitor publicly features real-time serial queue for physical clinics" — this is the most credible differentiator, but it requires clinic buy-in. No clinic partnership strategy is documented anywhere in the PRD.
- Without payment integration, the platform cannot own the transaction and therefore cannot own the relationship. It is a discovery layer that any competitor can leapfrog once they add SMS booking.

---

## Summary Table

| # | Finding | Severity | Blocks Launch? |
|---|---------|----------|----------------|
| 1 | AI triage with no regulatory clearance, potential Gemini ToS violation | CRITICAL | Yes |
| 2 | Digital prescriptions with no BMDC doctor validation; prescription fraud vector | CRITICAL | Yes |
| 3 | Zero revenue model; open-ended AI cost exposure | HIGH | No (but fatal post-launch) |
| 4 | Success metrics have no acquisition model or retention signal | HIGH | No |
| 5 | Single-host architecture cannot deliver 99.5% SLA; ambulance dispatch is safety-critical | HIGH | No (but high operational risk) |
| 6 | AI differentiation is weaker than Maya; core moat (live queue) has no clinic partnership strategy | MEDIUM | No |

**Bottom line:** Two CRITICAL findings (AI triage compliance, prescription legality) must be resolved before any public launch. The business model gap means the platform has no path to sustainability even if it launches successfully. Fix findings 1 and 2 first; they are launch blockers with legal and safety consequences.
