# GMB Master Framework v2

A production-ready React/Vite framework for building high-converting local business websites. One DNA file. Any industry. Deploy in one session.

---

## What This Framework Does

- Generates a full multi-page site from a single `client-dna.json` file
- Auto-creates service pages, location sub-pages, about, and contact
- Injects SEO meta, OpenGraph, JSON-LD schema, and AEO FAQ schema on every page
- Switches layout behaviour based on industry type (trade, hospitality, professional)
- Netlify Forms built in — leads captured from day one, zero backend
- `_headers` file for cache control and security headers
- `robots.txt` + `sitemap.xml` included
- Graceful image fallbacks — works before client photos are uploaded

---

## File Structure

```
src/
  data/client-dna.json        ← ONLY FILE YOU EDIT PER CLIENT
  components/
    IndustryConfig.ts         ← Industry layout switching
    CommercialLayout.tsx      ← Header + footer (reads from DNA)
    SchemaMarkup.tsx          ← JSON-LD schema injection
    SEOMeta.tsx               ← Meta/OpenGraph tag injection
    Img.tsx                   ← Image component with fallback
  pages/
    Home.tsx                  ← Homepage (100% data-driven)
    ServicePage.tsx           ← Service pages (100% data-driven)
    LocationPage.tsx          ← Location sub-pages (auto-generated)
    AboutPage.tsx             ← About page (100% data-driven)
    ContactPage.tsx           ← Contact + Netlify form
  site-config.ts              ← Derives from DNA — do not edit directly
public/
  _redirects                  ← SPA routing for Netlify
  _headers                    ← Cache control + security headers
  robots.txt                  ← AI crawler permissions
  sitemap.xml                 ← Update URLs before deploy
  images/                     ← Drop client images here
```

---

## New Client Checklist

### 1. Fill in `client-dna.json`

Key fields:

```json
{
  "_meta": {
    "industry": "trade",        // trade | hospitality | professional | retail | wellness
    "siteUrl": "https://..."    // live domain
  },
  "brand": { ... },
  "contact": { ... },
  "seo": { ... },
  "trust": { ... },
  "content": { "hero": { "images": ["/images/hero-1.jpg", ...] }, ... },
  "services": [ { "id": "...", "heroImage": "/images/...", ... } ],
  "locations": [ { "suburb": "...", "slug": "..." } ]
}
```

### 2. Drop images into `public/images/`

Required images:
- `logo.png` — company logo
- `hero-1.jpg`, `hero-2.jpg`, `hero-3.jpg` — hero slider
- `about.jpg` — about section
- `og-image.jpg` — social share (1200×630px)
- Per service: `{service-id}-1.jpg`, `{service-id}-2.jpg`, `{service-id}-3.jpg`

Missing images show a branded placeholder automatically.

### 3. Update `public/sitemap.xml`

Replace `https://yourdomain.co.za` with the live domain.

### 4. Set industry type

| Client Type | `_meta.industry` |
|---|---|
| Roofing, plumbing, electrical, painting | `trade` |
| Restaurant, wine farm, hotel, spa | `hospitality` |
| Law firm, accounting, consulting | `professional` |
| E-commerce, retail shop | `retail` |
| Gym, yoga, therapy | `wellness` |

### 5. Deploy

```bash
npm install
npm run build
# Push to GitHub → Vercel or Netlify auto-deploys
```

Netlify: drag `dist/` to netlify.com/drop or connect GitHub repo.
Vercel: import repo, framework = Vite, output = dist.

---

## Industry Profiles

Each industry preset controls:
- Hero overlay darkness (trade = heavy, hospitality = light)
- Emergency top bar visibility (trade only)
- Primary CTA (phone vs book vs enquire)
- Service card layout (grid vs editorial vs list)
- Which sections show (process, areas, guarantee)

---

## Content Ingest Prompt

Use this prompt to gather client DNA in one session:

```
Analyse everything available for [BUSINESS NAME]:
- Website: [URL]
- Google Business Profile: [URL or search]
- Facebook: [URL]
- Any directories (Yellow Pages, Gumtree, etc.)

Extract and structure:
1. Business name, tagline, established year
2. Phone(s), email, address, hours
3. All services with descriptions
4. All suburbs/areas served
5. Guarantees, certifications, trust signals
6. Testimonials (exact quotes + attribution)
7. Brand colours (primary + accent)
8. FAQs (implicit or explicit)
9. Industry type (trade/hospitality/professional/retail/wellness)

Output as gmb-master-framework client-dna.json v2 format.
```

---

## Ranking Checklist (14–21 Day Window)

- [ ] DNA complete with all fields
- [ ] Images uploaded (hero, about, per-service)
- [ ] `sitemap.xml` updated with live domain
- [ ] `og-image.jpg` uploaded (1200×630)
- [ ] Google Search Console verified + sitemap submitted
- [ ] Google Business Profile updated with same NAP as site
- [ ] Logo matches GBP logo
- [ ] Phone number consistent across GBP, site, directories
- [ ] Site deployed and live on custom domain (not .netlify.app)
