# SEO Full Audit Report — mydoctor.com.bd
**Audit Date**: 2026-06-27  
**Platform**: My Doctor — Healthcare Platform, Bangladesh  
**Stack**: Next.js 15 App Router, React 19, TypeScript  
**Business Type**: Healthcare SaaS / Local Medical Services (YMYL)

---

## Executive Summary

**Overall SEO Health Score: 52 / 100**

| Category | Score | Weight | Weighted |
|----------|-------|--------|---------|
| Technical SEO | 68 | 22% | 14.9 |
| Content Quality | 45 | 23% | 10.4 |
| On-Page SEO | 60 | 20% | 12.0 |
| Schema / Structured Data | 35 | 10% | 3.5 |
| Performance (CWV) | 55 | 10% | 5.5 |
| AI Search Readiness | 30 | 10% | 3.0 |
| Images | 20 | 5% | 1.0 |

**Top 5 Critical Issues**
1. OG image (`/og-image.jpg`) returns 404 — all social sharing broken
2. Homepage title renders as "...| My Doctor" twice due to template + title overlap
3. JSON-LD schemas (Organization, WebSite) not present in initial server HTML
4. All homepage sections are `"use client"` — headings and content invisible to raw crawlers
5. H1 on homepage is `sr-only` (visually hidden)

**Top 5 Quick Wins**
1. Fix homepage title — remove "My Doctor" from page title or override template
2. Create `/public/og-image.jpg` (1200×630px) — fix social sharing immediately
3. Move Organization + WebSite schema to `layout.tsx` (server component)
4. Add nurse/blog/telemedicine slugs to `sitemap.ts`
5. Remove `/search` from sitemap

---

## 1. Technical SEO

**Score: 68/100**

### ✅ Strengths
- All public pages return HTTP 200
- robots.txt present and linked from sitemap
- WWW → non-WWW redirect configured
- 5 security headers implemented (HSTS, X-Frame-Options, etc.)
- Canonical tags on all major pages
- Dynamic sitemap with doctor + hospital slugs from API

### ❌ Issues

| Severity | Issue | File |
|----------|-------|------|
| Medium | robots.txt `Allow: /_next/static/` is redundant | `public/robots.txt` |
| Medium | `/search` included in sitemap (crawl budget waste) | `src/app/sitemap.ts` |
| Low | No Content-Security-Policy header | `next.config.ts` |
| Low | `/uploads/` blocked in robots.txt — verify intent | `public/robots.txt` |

---

## 2. Content Quality

**Score: 45/100**

### ✅ Strengths
- Page titles are descriptive and keyword-rich
- Meta descriptions are well-crafted (130-160 chars)
- Contact info, address, phone present
- Doctor profiles have credentials and ratings
- FAQ section present on homepage

### ❌ Issues

| Severity | Issue | Location |
|----------|-------|----------|
| Critical | Homepage title: "...in Bangladesh \| My Doctor" — "My Doctor" appears twice | `src/app/(primary)/(home)/page.tsx` + `src/app/layout.tsx` |
| High | H1 on homepage uses `sr-only` — visually hidden | `src/app/(primary)/(home)/page.tsx:60` |
| High | All homepage sections are `"use client"` — H2/H3 headings not in initial HTML | Multiple component files |
| High | Blog and nurse content is static hardcoded data (~5 blogs, ~8 nurses) | `src/data/news.data.ts`, `src/data/nurse-details.data.ts` |
| Medium | No hreflang for Bengali (bn-BD) despite Bangladesh-focused audience | `src/app/layout.tsx` |
| Medium | Twitter and LinkedIn links are `"#"` (invalid) | `src/config/site.ts` |
| Medium | Blog posts have no author attribution — YMYL E-E-A-T risk | `src/app/(primary)/blogs/[slug]/page.tsx` |

**Root cause of "use client" problem**: The following homepage components all have `"use client"` at the top:
- `hero-section.tsx` — contains carousel with `Autoplay` plugin (needs client)
- `specializations-section.tsx` — likely for interactivity
- `active-doctors-section.tsx`, `ambulance-section.tsx`, `diagnostics-section.tsx`
- `faqs-section.tsx`, `news-section.tsx`, `testimonials-section.tsx`

When Googlebot fetches the page, the initial HTML body is almost entirely `self.__next_f` RSC payload scripts with no visible rendered text. Google does execute JS, but this adds latency to indexing.

**Recommendation**: Extract static display content from client components into server sub-components. Only the interactive shell (carousels, accordions) needs to be client.

---

## 3. On-Page SEO

**Score: 60/100**

### ✅ Strengths
- Title tags: keyword-rich, include location (Bangladesh, Dhaka)
- Meta descriptions: action-oriented, include services
- Keywords arrays defined per page
- OpenGraph + Twitter Card tags on all pages
- Canonical URLs on all public pages

### ❌ Issues

| Severity | Issue | Page |
|----------|-------|------|
| Critical | Title duplication: template `%s \| My Doctor` + title already containing "My Doctor" | Homepage |
| High | OG image 404 — social previews broken on ALL pages | All pages |
| Medium | Twitter card `images` array only has URL (no width/height declared) | `src/app/layout.tsx` |
| Medium | `og:title` on root layout repeats `SITE.name` without template | `src/app/layout.tsx:51` |
| Low | No `og:locale` tag (should be `en_BD` or `en_US`) | `src/app/layout.tsx` |

---

## 4. Schema / Structured Data

**Score: 35/100**

### ✅ Strengths
- Organization schema on homepage (name, logo, contactPoint, address, sameAs)
- WebSite schema with SearchAction (Sitelinks Searchbox eligible)
- Physician schema on doctor detail pages (medicalSpecialty, credentials, rating)
- Article schema on blog pages

### ❌ Issues

| Severity | Issue | Fix |
|----------|-------|-----|
| Critical | JSON-LD schemas not in initial HTML (SCHEMA COUNT: 0 from curl) | Move to layout.tsx server component |
| High | Organization.logo points to og-image.jpg (which is 404) | Use `/logo.svg` or dedicated PNG |
| High | No schema on listing pages (/doctors, /hospitals, /specializations, /ambulances) | Add ItemList + MedicalBusiness schema |
| High | sameAs includes `"#"` for Twitter and LinkedIn | Remove or update with real URLs |
| Medium | No BreadcrumbList schema on any page | Add to all detail and listing pages |
| Low | No MedicalClinic schema for hospital pages | Add Hospital/MedicalClinic type |

**Why schemas aren't in initial HTML**: The homepage `page.tsx` injects schemas via `dangerouslySetInnerHTML` inside JSX, but Next.js App Router's RSC streaming sends the component tree as JS payload rather than static HTML for pages containing client component subtrees. Moving schemas to `layout.tsx` (a guaranteed server component) ensures they're in the initial HTML response.

---

## 5. Performance (Core Web Vitals)

**Score: 55/100** *(estimated — no lab measurement tool available)*

### ✅ Strengths
- Hero image has `priority={true}` on first slide
- Manual `<link rel="preload">` for hero SVG in page.tsx
- Fixed aspect-ratio containers prevent layout shift
- `next/font` with `display: swap` for all fonts

### ❌ Issues

| Severity | Issue | Impact |
|----------|-------|--------|
| Critical | OG image missing — not a CWV issue but blocks social traffic | Social |
| High | Hero section is client component — LCP delayed until JS hydration | LCP |
| High | SVG hero images not optimized by Next.js Image pipeline | LCP |
| Medium | 30+ JS script chunks on initial load | INP/FCP |
| Medium | ~10 font files preloaded (3 fonts × weights) | FCP |
| Low | Hind Siliguri loads 4 weights — reduce to 2 | FCP |

**LCP element**: `/images/hero/01.svg` inside `HeroSection` (client component)  
**Recommendation**: Convert hero to server component + lazy-load Autoplay only on client, or use CSS animation instead.

---

## 6. AI Search Readiness (GEO)

**Score: 30/100**

### ✅ Strengths
- AI crawlers allowed via `Allow: /` in robots.txt
- FAQ section on homepage is a strong AI citation target
- Structured doctor data (specialty, credentials) is citation-friendly

### ❌ Issues

| Severity | Issue | Impact |
|----------|-------|--------|
| High | `llms.txt` missing (404) | AI assistants can't structure-understand the site |
| High | Homepage content not in initial HTML (client components) | AI crawlers that skip JS miss most content |
| Medium | No explicit AI crawler directives in robots.txt | GPTBot, ClaudeBot, PerplexityBot status unclear |
| Medium | Blog posts lack author credentials | YMYL citability risk |
| Low | No MedicalCondition schema for health condition pages | Missed AI citation trigger |

---

## 7. Images

**Score: 20/100**

### ❌ Issues

| Severity | Issue | Location |
|----------|-------|----------|
| Critical | `/og-image.jpg` returns 404 — referenced by ALL pages | `src/config/site.ts` → `SITE.ogImage` |
| High | Hero images are SVG (bypasses Next.js Image optimization) | `src/components/app-primary/home-page/hero-section.tsx` |
| Medium | Organization schema logo = `og-image.jpg` (wrong image + 404) | `src/app/(primary)/(home)/page.tsx` |
| Low | No explicit image sitemap extensions | `src/app/sitemap.ts` |

---

## 8. Sitemap

**Score: 65/100**

### ✅ Strengths
- Dynamic sitemap.ts fetches doctor + hospital slugs
- 22 static routes included
- Correct production URLs
- Sitemap linked in robots.txt

### ❌ Issues

| Severity | Issue |
|----------|-------|
| High | `/nurses/[slug]` (~8 pages) missing |
| High | `/blogs/[slug]` (~5 pages) missing |
| High | `/telemedicine/[slug]` (~46 pages) missing |
| Medium | `/search` page should be excluded |
| Low | `lastModified` always `new Date()` — changes every build |

---

## Summary Score Breakdown

```
Overall Health Score: 52 / 100

Critical Issues:  5
High Issues:     17
Medium Issues:   14
Low Issues:       9

Total Findings:  45
```
