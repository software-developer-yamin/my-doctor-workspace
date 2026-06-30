# SEO Action Plan — mydoctor.com.bd
**Generated**: 2026-06-27  
**Priority**: Critical → High → Medium → Low

---

## Phase 1: Critical Fixes (Week 1)

### 1. Fix OG Image (30 min)
**Impact**: All social sharing broken — Facebook, WhatsApp, Twitter, LinkedIn previews show nothing  
**File**: `my_doctor_frontend/public/og-image.jpg`

Create a 1200×630px OG image and place it at `/public/og-image.jpg`.  
Options:
- Use Figma/Canva to design branded healthcare image
- Or generate: `ffmpeg -i public/logo.svg -vf scale=1200:630 public/og-image.jpg`
- Also update `Organization` schema logo: change `og-image.jpg` → `/logo.svg`

```typescript
// src/config/site.ts — verify this path exists
ogImage: "https://mydoctor.com.bd/og-image.jpg",
```

### 2. Fix Homepage Title Duplication (10 min)
**File**: `src/app/(primary)/(home)/page.tsx`

Root layout template: `%s | My Doctor`  
Current page title: `"My Doctor — Trusted Healthcare Platform in Bangladesh"`  
Rendered: `"My Doctor — Trusted Healthcare Platform in Bangladesh | My Doctor"` ❌

Fix — change page title to NOT include "My Doctor":
```typescript
// src/app/(primary)/(home)/page.tsx
export const metadata: Metadata = {
  title: "Trusted Healthcare Platform in Bangladesh",  // ← remove "My Doctor —"
  // ...
};
// Renders as: "Trusted Healthcare Platform in Bangladesh | My Doctor" ✅
```

### 3. Move JSON-LD Schemas to Layout (server component) (20 min)
**File**: `src/app/layout.tsx`

Schemas in `page.tsx` don't appear in initial HTML. Move to root layout:
```typescript
// src/app/layout.tsx — add before </body>
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
/>
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
/>
```

### 4. Make H1 Visible (5 min)
**File**: `src/app/(primary)/(home)/page.tsx:60`

Current: `<h1 className="sr-only">My Doctor — Book Doctors...</h1>`  
Fix: Integrate H1 into the hero section visually, or remove `sr-only`:
```tsx
// Option A: Remove sr-only, style as page headline
<h1 className="text-2xl font-bold text-foreground mb-4">
  My Doctor — Book Doctors, Telemedicine & Healthcare Services in Bangladesh
</h1>

// Option B: Keep sr-only but ensure it's not the ONLY H1 signal
```

---

## Phase 2: High-Impact Fixes (Weeks 2-3)

### 5. Add Missing Routes to Sitemap (1 hour)
**File**: `src/app/sitemap.ts`

Import static data and add to sitemap. Also remove `/search`.

```typescript
// Add these imports (adjust paths/exports to match actual exports)
import { NURSE_DETAILS_DATA } from "@/data/nurse-details.data";
import { TELEMEDICINE_SPECIALIZATIONS } from "@/data/telemedicine.data";
// For blogs, get the news items array

// Add to sitemap() return:
const nurseRoutes = NURSE_DETAILS_DATA.map((n) => ({
  url: `${BASE_URL}/nurses/${n.id}`,
  lastModified: new Date(),
  changeFrequency: "monthly" as const,
  priority: 0.6,
}));

const telemedicineRoutes = TELEMEDICINE_SPECIALIZATIONS.map((s) => ({
  url: `${BASE_URL}/telemedicine/${s.slug || s.id}`,
  lastModified: new Date(),
  changeFrequency: "monthly" as const,
  priority: 0.7,
}));

// Remove from staticRoutes:
// { url: `${BASE_URL}/search`, ... }
```

### 6. Fix Organization Schema (30 min)
**File**: `src/app/(primary)/(home)/page.tsx`

```typescript
const organizationSchema = {
  // ...
  logo: "https://mydoctor.com.bd/logo.svg",  // ← fix: was og-image.jpg (404)
  sameAs: [
    "https://www.facebook.com/share/18TnLxUvHy/",
    "https://www.instagram.com/mydoctorinfo247?igsh=am9ncjJ2andiZnBp",
    "https://youtube.com/@mydoctorbd247?si=ES6XvYjy8irs-4lc",
    // Remove "#" entries for Twitter and LinkedIn until real URLs exist
  ],
};
```

### 7. Add Schema to Listing Pages (2-3 hours)
Add structured data to key listing pages:

**`/doctors` layout**:
```typescript
// Add MedicalBusiness + breadcrumb
const breadcrumb = {
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://mydoctor.com.bd" },
    { "@type": "ListItem", position: 2, name: "Doctors", item: "https://mydoctor.com.bd/doctors" },
  ]
};
```

**`/hospitals` layout**: Add `MedicalOrganization` + breadcrumb  
**`/ambulances` layout**: Add `EmergencyService` schema  
**`/diagnostics` layout**: Add `MedicalLaboratory` schema  

### 8. Convert Static Homepage Sections to Server Components (3-4 hours)
Sections with no client-side interactivity should not have `"use client"`:

- `StatsSection` — static numbers → remove `"use client"`
- `TrustSection` — static content → remove `"use client"`
- `HowItWorksSection` — static steps → remove `"use client"`
- `AppDownloadSection` — static download links → remove `"use client"`
- `ContactSection` — if form-less, remove `"use client"`

For `SpecializationsSection`, `ActiveDoctorsSection` — if they use `useQuery`, wrap data fetching in a Server Component and pass data as props to a thin client wrapper for interactivity only.

### 9. Fix Twitter/LinkedIn Links (5 min)
**File**: `src/config/site.ts`

```typescript
links: {
  facebook: "https://www.facebook.com/share/18TnLxUvHy/",
  twitter: "https://twitter.com/mydoctorbd",     // ← add real URL or remove
  linkedin: "https://linkedin.com/company/mydoctorbd", // ← add real URL or remove
  instagram: "...",
  youtube: "...",
},
```

---

## Phase 3: Content & Authority (Month 2)

### 10. Create llms.txt for AI Search (2 hours)
**File**: `public/llms.txt`

```
# My Doctor — Healthcare Platform Bangladesh
> My Doctor connects patients with doctors, hospitals, diagnostics, ambulances, and nursing services across Bangladesh. Available 24/7.

## Services
- [Book Doctor Appointments](https://mydoctor.com.bd/doctors) — Find and book specialist doctors
- [Telemedicine](https://mydoctor.com.bd/telemedicine) — Online video/chat consultations
- [Hospitals](https://mydoctor.com.bd/hospitals) — Find hospitals and clinics
- [Diagnostics](https://mydoctor.com.bd/diagnostics) — Book lab tests and scans
- [Ambulance](https://mydoctor.com.bd/ambulances) — Emergency ambulance booking 24/7
- [Home Nursing](https://mydoctor.com.bd/nurses) — Hire qualified nurses for home care
- [Specializations](https://mydoctor.com.bd/specializations) — Browse medical specialties

## Contact
- Phone: +8801974-200905
- Email: mydoctorinfo247@gmail.com
- Address: Ground floor, Khandakar General Hospital, Narsingdi, Bangladesh
```

### 11. Add Author Attribution to Blog Posts (1 hour)
**File**: `src/data/news.data.ts` + blog page

Add `author` field to news items with name and optional credentials. Update Article schema to include `author.@type: "Person"`.

### 12. Add BreadcrumbList to All Pages (2 hours)
Breadcrumbs improve SERP appearance and CTR. Add to all `layout.tsx` files for major routes.

### 13. Add hreflang (if Bengali content planned) (1 hour)
**File**: `src/app/layout.tsx`

```typescript
// Add to metadata:
alternates: {
  languages: {
    'en': 'https://mydoctor.com.bd',
    'bn-BD': 'https://mydoctor.com.bd/bn', // only if Bengali version exists
  }
}
```

---

## Phase 4: Monitoring & Iteration (Ongoing)

### 14. Set Up Google Search Console
- Submit `https://mydoctor.com.bd/sitemap.xml` to GSC
- Monitor Index Coverage for 404s (especially og-image.jpg)
- Track Core Web Vitals field data

### 15. Optimize Hero Image for LCP
- Convert `/images/hero/01.svg` and `/images/hero/03.svg` to WebP/AVIF
- Use Next.js Image component properly (add `unoptimized={false}` check)
- Or keep SVG but add explicit dimensions for faster rendering

### 16. Reduce Font Weights
**File**: `src/app/layout.tsx`

```typescript
const hindSiliguri = Hind_Siliguri({
  subsets: ["bengali", "latin"],
  weight: ["400", "600"],  // ← reduce from 4 to 2 weights
  // ...
});
```

### 17. Add CSP Header (Security + Trust)
**File**: `next.config.ts`

```typescript
{ key: 'Content-Security-Policy', value: "default-src 'self'; img-src 'self' https: data:; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://rybbit.mydoctor.com.bd; ..." }
```

---

## Priority Matrix

| # | Task | Effort | Impact | Priority |
|---|------|--------|--------|----------|
| 1 | Create og-image.jpg | 30min | Critical | Week 1 |
| 2 | Fix title duplication | 10min | High | Week 1 |
| 3 | Move schemas to layout | 20min | High | Week 1 |
| 4 | Fix H1 visibility | 5min | Medium | Week 1 |
| 5 | Sitemap: add missing routes | 1hr | High | Week 2 |
| 6 | Fix organization schema | 30min | Medium | Week 2 |
| 7 | Add listing page schemas | 3hr | High | Week 2 |
| 8 | Convert sections to RSC | 4hr | High | Week 2-3 |
| 9 | Fix Twitter/LinkedIn URLs | 5min | Low | Week 2 |
| 10 | Create llms.txt | 2hr | Medium | Month 2 |
| 11 | Blog author attribution | 1hr | Medium | Month 2 |
| 12 | BreadcrumbList schema | 2hr | Medium | Month 2 |
| 13 | hreflang | 1hr | Low | Month 2 |
| 14 | GSC setup | 1hr | High | Week 1 |
| 15 | Optimize hero images | 2hr | Medium | Month 2 |
| 16 | Reduce font weights | 15min | Low | Month 2 |
| 17 | CSP header | 1hr | Low | Month 2 |
