# AI Search / GEO Readiness Findings — mydoctor.com.bd

## AI Crawler Access

### ✅ What Works
- robots.txt `Allow: /` — AI crawlers (GPTBot, Claude-Web, PerplexityBot) can access site
- Clean URL structure, semantic page names

### ❌ Issues

**HIGH — llms.txt missing**
- `https://mydoctor.com.bd/llms.txt` → HTTP 404
- llms.txt is the emerging standard for AI-readable site documentation
- Without it, AI assistants have no structured understanding of the site's services
- ChatGPT, Perplexity, Claude Web all check for this file

**MEDIUM — No robots.txt rules for AI crawlers**
- No explicit `Allow` or `Disallow` for:
  - `GPTBot` (OpenAI)
  - `ClaudeBot` (Anthropic)
  - `PerplexityBot`
  - `Googlebot-Extended` (AI training)
- Currently all get default `Allow: /` — this may or may not be desired

## Content Citability

### ✅ What Works
- Doctor profiles have structured, factual content (name, specialty, credentials, ratings)
- Organization contact details are well-structured
- FAQ section on homepage is a strong citability signal for AI

### ❌ Issues

**MEDIUM — Homepage content not in initial HTML**
- Most homepage text is in "use client" components — not visible in raw HTML crawl
- AI crawlers that don't execute JS see very little content
- Particularly affects: specializations list, active doctors, diagnostic services, FAQs
- The FAQ section (strong citability target) is client-rendered only

**MEDIUM — No author attribution on blog posts**
- Blog articles have no author name/credentials
- E-E-A-T requires "Experience" signals — anonymous content ranks lower for health topics
- YMYL (Your Money Your Life) content requires strong E-E-A-T

**LOW — No structured health content (MedicalCondition, Drug, etc.)**
- Potential to create condition-specific landing pages with `MedicalCondition` schema
- Would improve AI citation in "best doctor for [condition] in Bangladesh" queries

## Brand Mention Signals

### ✅ What Works
- Social media presence: Facebook, Instagram, YouTube with real URLs
- Contact phone number consistent (+8801974-200905)

### ❌ Issues
**MEDIUM — Twitter/X and LinkedIn have "#" as URLs**
- `SITE.links.twitter = "#"` and `SITE.links.linkedin = "#"`
- Missing presence on major professional network (LinkedIn especially relevant for healthcare)
