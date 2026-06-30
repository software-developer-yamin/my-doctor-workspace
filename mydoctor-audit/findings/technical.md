# Technical SEO Findings — mydoctor.com.bd

## Crawlability & Indexing

### ✅ What Works
- robots.txt present, correct `Allow: /` default
- Sitemap at `/sitemap.xml` returns 200
- Sitemap linked in robots.txt
- All key pages return HTTP 200
- WWW → non-WWW redirect configured in next.config.ts
- `robots: { index: true, follow: true, googleBot: {...} }` set in root layout

### ❌ Issues

**HIGH — robots.txt redundant directives**
- `Allow: /_next/static/` is redundant (already covered by `Allow: /`)
- `/uploads/` blocked unnecessarily — may prevent image files from being indexed if they're patient-facing content. Verify intent.
- Missing explicit `Disallow: /api/` for Googlebot-specifically. Current implementation is fine but could be more explicit.

**MEDIUM — /search page in sitemap**
- `https://mydoctor.com.bd/search` is included in sitemap
- Search result pages offer no unique crawlable value and waste crawl budget

## Security Headers

### ✅ What Works
- `X-Frame-Options: SAMEORIGIN`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=(self)`
- `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`

### ❌ Issues
**LOW — No Content-Security-Policy (CSP)**
- Missing CSP header. Relevant for security and increasingly for trust signals.

## Canonical URLs

### ✅ What Works
- All major pages have canonical tags pointing to `https://mydoctor.com.bd/...`
- Dynamic pages ([slug]) generate canonical via `generateMetadata`

### ❌ Issues
**MEDIUM — Canonical hardcoded to production on localhost**
- Not a production issue, but dev/staging environments will incorrectly signal production canonicals

## URL Structure
- Clean, semantic URLs: `/doctors`, `/hospitals/[slug]`, `/telemedicine/[slug]` ✅
- No `.html` extensions ✅
- Lowercase, hyphenated ✅
