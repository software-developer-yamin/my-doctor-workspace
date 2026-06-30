# Sitemap Findings — mydoctor.com.bd

## Current State

- Sitemap URL: `https://mydoctor.com.bd/sitemap.xml` → 200 ✅
- Linked from robots.txt ✅
- Dynamic generation via Next.js `sitemap.ts` ✅
- Fetches doctor + hospital slugs from API (limit=1000) ✅
- Static routes: 22 pages ✅

## ❌ Issues

**HIGH — Missing dynamic slug routes**

| Route Pattern | Data Source | Status |
|---------------|-------------|--------|
| `/nurses/[slug]` | `NURSE_DETAILS_DATA` (~8 items) | ❌ NOT in sitemap |
| `/blogs/[slug]` | `news.data.ts` (~5 items) | ❌ NOT in sitemap |
| `/telemedicine/[slug]` | `TELEMEDICINE_SPECIALIZATIONS` (~46 items) | ❌ NOT in sitemap |

These pages have `generateMetadata` and full page content but Google cannot discover them via sitemap.

**MEDIUM — /search included in sitemap**
- `{ url: "${BASE_URL}/search", ... }` should be removed
- Search result pages have no unique crawlable content and waste crawl budget

**MEDIUM — No `<image:image>` extensions**
- Doctor and hospital pages have profile photos, but sitemap doesn't declare image URLs
- Adding image sitemap extensions improves Google Image Search indexing

**LOW — lastModified always = `new Date()`**
- Every URL gets today's date as lastModified on every build
- Google may ignore `lastModified` if it changes on every deploy
- Fix: Use actual content modification timestamps from API/database

**LOW — No nurse/blog/telemedicine slugs from API**
- Current sitemap.ts only fetches `/doctors/public` and `/hospitals/public`
- Nurse and telemedicine data is static, so slugs can be hardcoded or extracted from the data files

## Recommended sitemap.ts Additions

```typescript
import { NURSE_DETAILS_DATA } from "@/data/nurse-details.data";
import { TELEMEDICINE_SPECIALIZATIONS } from "@/data/telemedicine.data";
import { NEWS_DATA } from "@/data/news.data"; // or whatever the export is

// Add to sitemap():
const nurseRoutes = NURSE_DETAILS_DATA.map(n => ({
  url: `${BASE_URL}/nurses/${n.id}`,
  changeFrequency: "monthly" as const,
  priority: 0.6,
}));

const telemedicineRoutes = TELEMEDICINE_SPECIALIZATIONS.map(s => ({
  url: `${BASE_URL}/telemedicine/${s.slug || s.id}`,
  changeFrequency: "monthly" as const,
  priority: 0.7,
}));

const blogRoutes = NEWS_DATA.map(b => ({
  url: `${BASE_URL}/blogs/${b.slug}`,
  changeFrequency: "monthly" as const,
  priority: 0.6,
}));
```
