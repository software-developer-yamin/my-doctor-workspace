# Performance / Core Web Vitals Findings — mydoctor.com.bd

## LCP (Largest Contentful Paint)

### ❌ Issues

**HIGH — Hero image in "use client" carousel**
- `HeroSection` is `"use client"` with `embla-carousel` + Autoplay plugin
- LCP element is `/images/hero/01.svg` inside a `<Carousel>`
- Image has `priority={index === 0}` ✅ — but this only matters for Next.js `<Image>` preload
- Since the component is client-rendered, the `<link rel="preload">` in `<head>` is added manually in page.tsx ✅
- However: carousel Autoplay plugin may block initial render
- The `aspect-[16/5]` container has fixed aspect ratio — no layout shift expected ✅

**MEDIUM — SVG hero images**
- Hero slides use `.svg` format: `/images/hero/01.svg`, `/images/hero/03.svg`
- SVG files can be large and unoptimized; Next.js Image optimization does NOT apply to SVG
- Consider converting to WebP/AVIF for better compression

## CLS (Cumulative Layout Shift)

### ✅ What Works
- Hero carousel uses fixed `aspect-[16/5]` — prevents layout shift ✅
- Fonts loaded via `next/font/google` with `display: swap` ✅

### ❌ Issues
**LOW — Multiple fonts loaded (Geist, Geist Mono, Hind Siliguri)**
- 10+ font files preloaded (visible in `<head>`)
- Each `font-display: swap` can cause FOUT (flash of unstyled text)
- Hind Siliguri loads 4 weights (400, 500, 600, 700) — consider reducing

## INP (Interaction to Next Paint)

**MEDIUM — Heavy client bundle**
- 30+ script chunks detected in initial page load
- Most home page sections are "use client" — large JS bundle shipped to client
- Consider converting static sections (StatsSection, TrustSection, HowItWorksSection) to server components

## Bundle Size

**MEDIUM — All home sections are client components**
Components that don't need client-side interactivity:
- `StatsSection` — likely static data → convert to server component
- `TrustSection` — likely static → convert to server component  
- `HowItWorksSection` — likely static → convert to server component
- `AppDownloadSection` — likely static links → convert to server component

## Image Optimization

### ✅ What Works
- Next.js `<Image>` used with `fill`, `sizes`, and `priority` for hero ✅
- Remote patterns configured for CDN domains ✅

### ❌ Issues
**CRITICAL — OG image does not exist**
- `https://mydoctor.com.bd/og-image.jpg` → HTTP 404
- `/public/og-image.jpg` does not exist in the project
- Social sharing previews (Facebook, Twitter, WhatsApp, LinkedIn) all broken
- All pages reference this missing image

**MEDIUM — SVG format for hero images**
- Not optimized by Next.js Image (SVG bypasses optimization pipeline)
