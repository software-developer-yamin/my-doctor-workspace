# Schema / Structured Data Findings — mydoctor.com.bd

## Current Implementation

### ✅ What Works

**Homepage**
- `Organization` schema: name, url, logo, contactPoint, address, sameAs ✅
- `WebSite` schema with `SearchAction` (Sitelinks Searchbox eligible) ✅

**Doctor Detail Pages (`/doctors/[slug]`)**
- `Physician` schema: name, description, image, url, medicalSpecialty, knowsAbout ✅
- `hasCredential` with `EducationalOccupationalCredential` ✅
- `aggregateRating` with ratingValue and reviewCount ✅

**Blog Pages (`/blogs/[slug]`)**
- `Article` schema with publishedTime ✅

**Hospital Pages (`/hospitals/[slug]`)**
- Need to verify — not inspected in detail

## ❌ Issues

**CRITICAL — JSON-LD schemas NOT in initial HTML**
- `curl http://localhost:3000/` returns 0 JSON-LD blocks
- Schemas defined via `dangerouslySetInnerHTML` in page.tsx but ONLY visible after JS hydration
- Cause: All homepage sections wrapped in client components; RSC streaming may delay schema injection
- Impact: Googlebot may see schemas on re-render pass, but initial crawl finds nothing
- Fix: Move Organization + WebSite schema to root `layout.tsx` or a server component that renders before hydration

**HIGH — Missing schema on listing pages**
- `/doctors` — no `ItemList`, `MedicalBusiness`, or `BreadcrumbList` schema
- `/hospitals` — no `Hospital` or `MedicalOrganization` schema
- `/specializations` — no `MedicalSpecialty` schema
- `/ambulances` — no `EmergencyService` schema
- `/diagnostics` — no `DiagnosticLab` schema

**HIGH — Organization.logo is og-image.jpg (not a logo)**
- `logo: "https://mydoctor.com.bd/og-image.jpg"` — this is the OG image, not a logo
- Google Knowledge Panel expects a proper logo URL
- Fix: Use `https://mydoctor.com.bd/logo.svg` or a dedicated logo PNG

**MEDIUM — Organization.sameAs has invalid URLs**
- `twitter: "#"` and `linkedin: "#"` resolve as relative URLs, not valid sameAs entries
- Remove or replace with actual profile URLs

**MEDIUM — No BreadcrumbList schema**
- No breadcrumb structured data on any page
- Breadcrumbs in SERPs improve CTR

**LOW — Hospital detail pages — verify schema exists**
- `/hospitals/[slug]/page.tsx` not fully audited — check if `Hospital` or `MedicalOrganization` schema is implemented
