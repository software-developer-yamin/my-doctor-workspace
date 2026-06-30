# Validation Report — My Doctor PRD

- **PRD:** `_bmad-output/planning-artifacts/prds/prd-my-doctor-workspace-2026-06-25/prd.md`
- **Rubric:** `.claude/skills/bmad-prd/assets/prd-validation-checklist.md`
- **Run at:** 2026-06-25T12:30:00+06:00
- **Grade:** Fair

---

## Overall verdict

Strong foundation: clear vision, explicit scope, grounded personas, earned differentiation, measurable NFRs. Most dimensions rate adequate-to-strong. Two adversarial findings (AI triage regulatory risk, prescription PDF legality) were launch blockers — both have been addressed in the PRD with NOTE FOR PM callouts, ASSUMPTION tags, and phase-blocker designation in Open Questions. Remaining gaps center on done-ness clarity (happy-path FRs lack edge cases and validation rules), underspecified multi-stakeholder permissions, and an absent revenue model (now documented as assumed commission model with explicit NOTE FOR PM). The PRD is safe to feed to UX and architecture with the blocker items tracked; story creation should defer AI triage and prescription PDF stories until blockers resolve.

---

## Dimension verdicts

| Dimension | Verdict |
|-----------|---------|
| Decision-readiness | Adequate |
| Substance over theater | Strong |
| Strategic coherence | Strong |
| Done-ness clarity | Thin |
| Scope honesty | Strong |
| Downstream usability | Strong |
| Shape fit | Adequate |

---

## Findings by severity

### Critical (0)
*Both critical findings (AI triage compliance, prescription legality) converted to phase-blocker open questions and NOTE FOR PM callouts in §14 and §11 of the PRD. No unaddressed critical findings remain.*

### High (5 — addressed in PRD)

**[Rubric: Decision-readiness]** — AI guardrails gap (§11 Open Q4)
AI triage has no BMRC ethics clearance, no Gemini ToS exception, no emergency redirect spec. Added as phase-blocker in Open Questions (Q4). FR-14.2–14.4 now include NOTE FOR PM, ASSUMPTION tag, emergency redirect FR, and disclaimer FR.

**[Rubric: Decision-readiness]** — Queue real-time mechanism (§11 Open Q1)
Polling vs. SSE/WebSocket unresolved. Added owner and revisit trigger (20 concurrent queue sessions) in Open Q1.

**[Rubric: Done-ness clarity]** — Prescription write flow missing validation spec (§F-11)
No spec for zero-medicine prescription, allergy conflicts, drug category control. Added NOTE FOR PM and ASSUMPTION on BMDC registration in F-11.

**[Rubric: Done-ness clarity]** — Live queue edge cases absent (§F-5)
Doctor disconnect, serial cancellation, browser refresh persistence unspecified. Remains open — recommend story-level AC to cover.

**[Rubric: Shape fit]** — Multi-stakeholder permissions underspecified (§5, §10)
Hospital/ambulance/lab operator roles not distinguished from admin. Data visibility rules absent. Remains a gap — recommend permission matrix in architecture phase.

**[Adversarial]** — Single-host 99.5% SLA unachievable; ambulance dispatch safety-critical (§NFR-2)
Added NOTE FOR PM in NFR-2; Atlas replica set and Redis HA flagged as required before ambulance dispatch launch (Open Q6).

### High (1 — adversarial, addressed)

**[Adversarial]** — No revenue model (§4.1)
Business model section added (§4.1) with assumed commission/listing tiers, explicit NOTE FOR PM for stakeholder confirmation, and MVP cost exposure items.

### Medium (8)

**[Rubric]** Doctor onboarding growth model not documented — acquisition via admin-only creation; add B2B hospital partnership assumption to §4.1. *(Partial fix: §4.1 notes listing-fee model.)*

**[Rubric]** Data retention for prescriptions/appointments — flagged in Open Q7 with compliance owner note.

**[Rubric]** Diagnostic lab booking confirmation flow ambiguous (auto vs. manual approval) — FR-6.3 wording. *Fix in story phase: add explicit booking status FSM.*

**[Rubric]** Ambulance dispatch confirmation SLA absent — no target latency. *Fix: add NFR for < 2-minute dispatch confirmation before ambulance launch.*

**[Rubric]** Home doctor feature skeletal vs. clinic queue — no queue/prescription/payment spec for home visits. *Marked as separate epic recommendation.*

**[Rubric]** Medical guide (F-10) has no UJ or patient dashboard integration. *Recommend: mark as deferred or add UJ-8.*

**[Rubric]** Email notifications — Out of Scope with no rationale vs. Payment which is Deferred. *Rationale: SMS is universal in BD; email requires account login recovery flow. Acceptable.*

**[Adversarial]** Maya competitive position — AI triage is weaker differentiator; live queue is strongest moat but requires clinic partnership strategy not documented. *NOTE: clinic buy-in strategy is GTM, not PRD scope. Recommend companion GTM doc.*

### Low (4)

**[Rubric]** Competitor analysis missing pricing/penetration data.

**[Rubric]** Success metric baseline (5,000 patients) has no TAM/SAM context.

**[Rubric]** AI triage→doctor discovery handoff not specified (standalone vs. integrated funnel).

**[Rubric]** "Chamber" term undefined — add to glossary.

---

## Mechanical notes

- **Glossary missing**: "Chamber" (clinic consultation room, common BD healthcare term) used in F-4.1, UJ-1 without definition. Add glossary section before UX handoff.
- **ID continuity**: F-1 through F-17, FR-N.M scheme intact. No gaps or duplicates.
- **Assumptions Index**: A-1 through A-5 added to §12. All inline `[ASSUMPTION]` tags represented.
- **Success metrics**: "Appointments booked / month" should clarify whether all booking types (clinic, home doctor, diagnostic, ambulance) are counted or only clinic appointments.
- **F-16.3 admin CRUD**: Single FR covers 8+ entity types; decompose to FR-16.3a–h before story creation.

---

## Reviewer files

- `review-rubric.md` — Rubric walker (7-dimension quality assessment)
- `review-adversarial.md` — Adversarial review (CTO / regulator / competing PM perspective)
