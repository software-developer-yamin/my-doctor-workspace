# Content Quality Findings — mydoctor.com.bd

## E-E-A-T Signals

### ✅ What Works
- Contact information present in SITE config (phone, address, email)
- Physical address included in Organization schema
- Social media profiles linked (Facebook, Instagram, YouTube)
- Doctor profiles have credentials, degrees, ratings (via Physician schema)
- Review count and aggregate rating on doctor pages

### ❌ Issues

**HIGH — Static/Hardcoded Content for Nurses and Blogs**
- `NURSE_DETAILS_DATA` (~8 nurses) is static TypeScript data — no real CMS backing
- Blog/news is static (`news.data.ts` ~5 items) — not a scalable content strategy
- Telemedicine specializations use `TELEMEDICINE_SPECIALIZATIONS` static data (~46 items)
- Google cannot crawl dynamically updated content if it doesn't exist

## Heading Structure

### ❌ Issues

**HIGH — H1 visually hidden (sr-only) on homepage**
- Homepage H1 uses `className="sr-only"` — visually hidden
- Content: "My Doctor — Book Doctors, Telemedicine & Healthcare Services in Bangladesh"
- Google CAN read this, but visual H1s send stronger relevance signals
- Risk: may be flagged as hidden text if Google deems it manipulative (unlikely here, but non-ideal)

**HIGH — Home page sections are "use client" — no SSR headings**
- `hero-section.tsx`, `specializations-section.tsx`, `active-doctors-section.tsx`, `ambulance-section.tsx`, `diagnostics-section.tsx`, `faqs-section.tsx`, `news-section.tsx`, `testimonials-section.tsx` all have `"use client"`
- Headings inside these sections do NOT appear in initial server-rendered HTML from `curl`
- Googlebot executes JS but relies on rendered output — delay before these are indexed
- H2 count from static HTML: 0 (all headings are in client components)

## Meta Content Quality

### ✅ What Works
- Title tags: descriptive, keyword-rich, under 60 chars for most pages
- Meta descriptions: 130-160 chars, include CTAs and location keywords
- Keyword arrays defined per page

### ❌ Issues

**CRITICAL — Homepage title has "My Doctor" duplicated**
- Root layout template: `%s | My Doctor`
- Homepage title: `"My Doctor — Trusted Healthcare Platform in Bangladesh"`
- Final rendered title: `"My Doctor — Trusted Healthcare Platform in Bangladesh | My Doctor"`
- Confirmed in live HTML: appears exactly as above
- Wastes title real estate; looks unprofessional in SERPs

**MEDIUM — Social links incomplete**
- `SITE.links.twitter = "#"` — placeholder
- `SITE.links.linkedin = "#"` — placeholder
- These appear in schema `sameAs` arrays — invalid URLs

## Language & Localization

**MEDIUM — No Bengali (bn/bn-BD) hreflang**
- `<html lang="en">` — English only
- Site targets Bangladeshi users but has no Bengali content or hreflang
- Opportunity: add `<link rel="alternate" hreflang="bn-BD">` if Bengali content exists or is planned
