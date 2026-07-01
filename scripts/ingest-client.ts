import * as cheerio from 'cheerio';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import Anthropic from '@anthropic-ai/sdk';

dotenv.config();

/**
 * Content Ingest Automation
 * Usage: npm run ingest -- <business-url> ["Business Name" (optional, improves GBP match)]
 *
 * Pipeline:
 *   1. Crawl the client's site (same-domain, depth 2) -> raw text + phone/email/image signals
 *   2. Look up their Google Business Profile via Places API -> address, hours, rating, phone, reviews
 *   3. Send both to Claude to structure into the exact client-dna.json v2 schema
 *   4. Merge (GBP data wins over LLM guesses for factual fields) and write a DRAFT file for human review
 *
 * Output: src/data/client-dna.draft.json  (never overwrites the live client-dna.json)
 */

const TARGET_URL = process.argv[2];
const BUSINESS_NAME_HINT = process.argv[3] || '';

if (!TARGET_URL) {
  console.error('Usage: npm run ingest -- <business-url> ["Business Name"]');
  process.exit(1);
}

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;

if (!ANTHROPIC_API_KEY) {
  console.error('Missing ANTHROPIC_API_KEY in .env — required to structure scraped content.');
  process.exit(1);
}
if (!GOOGLE_PLACES_API_KEY) {
  console.warn('No GOOGLE_PLACES_API_KEY set — skipping Google Business Profile lookup (address/hours/reviews will be blank, LLM will guess less-reliable fields).');
}

const baseUrl = new URL(TARGET_URL).origin;
const visited = new Set<string>();
const pages: { url: string; text: string }[] = [];
const images = new Set<string>();
const MAX_PAGES = 12;

// ---------------------------------------------------------------
// 1. SITE CRAWL
// ---------------------------------------------------------------
async function crawl(url: string, depth = 0): Promise<void> {
  if (depth > 2 || visited.size >= MAX_PAGES || visited.has(url)) return;
  visited.add(url);

  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (GMB-Ingest-Bot)' } });
    if (!res.ok) return;
    const html = await res.text();
    const $ = cheerio.load(html);

    $('img').each((_, el) => {
      const src = $(el).attr('src');
      if (src && !src.startsWith('data:')) {
        images.add(src.startsWith('http') ? src : new URL(src, baseUrl).href);
      }
    });

    const links: string[] = [];
    $('a[href]').each((_, el) => {
      const href = $(el).attr('href')!;
      try {
        const abs = new URL(href, url).href;
        if (abs.startsWith(baseUrl) && !visited.has(abs) && !abs.match(/\.(pdf|jpg|jpeg|png|zip)$/i)) {
          links.push(abs);
        }
      } catch { /* skip malformed */ }
    });

    $('script, style, nav, footer, noscript').remove();
    const text = $('body').text().replace(/\s+/g, ' ').trim();
    pages.push({ url, text: text.slice(0, 6000) });
    console.log(`  crawled: ${url} (${text.length} chars)`);

    for (const link of links) {
      if (visited.size >= MAX_PAGES) break;
      await crawl(link, depth + 1);
    }
  } catch (err) {
    console.warn(`  failed: ${url}`);
  }
}

// ---------------------------------------------------------------
// 2. GOOGLE BUSINESS PROFILE LOOKUP
// ---------------------------------------------------------------
interface GBPData {
  name?: string;
  formatted_address?: string;
  formatted_phone_number?: string;
  international_phone_number?: string;
  rating?: number;
  user_ratings_total?: number;
  opening_hours?: { weekday_text?: string[] };
  reviews?: { author_name: string; rating: number; text: string; relative_time_description: string }[];
  website?: string;
  address_components?: { long_name: string; types: string[] }[];
}

async function fetchGBP(): Promise<GBPData | null> {
  if (!GOOGLE_PLACES_API_KEY) return null;

  const query = `${BUSINESS_NAME_HINT} ${baseUrl}`.trim();
  const findUrl = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(query)}&inputtype=textquery&fields=place_id,name&key=${GOOGLE_PLACES_API_KEY}`;

  const findRes = await fetch(findUrl).then(r => r.json());
  const placeId = findRes?.candidates?.[0]?.place_id;
  if (!placeId) {
    console.warn('  No Google Business Profile match found.');
    return null;
  }

  const fields = 'name,formatted_address,formatted_phone_number,international_phone_number,rating,user_ratings_total,opening_hours,reviews,website,address_component';
  const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=${fields}&key=${GOOGLE_PLACES_API_KEY}`;
  const detailsRes = await fetch(detailsUrl).then(r => r.json());
  return detailsRes?.result ?? null;
}

// ---------------------------------------------------------------
// 3. LLM STRUCTURING
// ---------------------------------------------------------------
const DNA_SCHEMA_GUIDE = `
Return ONLY valid JSON (no markdown fences, no commentary) matching exactly this shape:

{
  "_meta": { "version": "2.0", "industry": "trade|hospitality|professional|retail|wellness", "industryLabel": string, "themePreset": "dark-accent", "siteUrl": string, "deployTarget": "netlify" },
  "brand": { "name": string, "shortName": string, "tagline": string, "established": string, "logo": "/images/logo.png", "colors": { "primary": "#hex", "accent": "#hex", "light": "#hex", "text": "#hex" }, "fonts": { "heading": "Inter", "body": "Inter" } },
  "seo": { "metaTitle": string, "metaDescription": string, "keywords": string[], "ogImage": "/images/og-image.jpg", "googleVerification": "", "locality": string, "region": string, "serviceRadius": string },
  "trust": { "guarantee": string, "established": string, "badges": string[], "stats": [{ "value": string, "label": string }] },
  "content": {
    "hero": { "headline": string, "subheadline": string, "ctaPrimary": { "label": string, "href": string }, "ctaSecondary": { "label": string, "href": "#contact" }, "images": ["/images/hero-1.jpg","/images/hero-2.jpg","/images/hero-3.jpg"] },
    "about": { "headline": string, "body": string, "image": "/images/about.jpg", "points": string[] },
    "process": [{ "step": number, "title": string, "body": string }],
    "faq": [{ "q": string, "a": string }]
  },
  "services": [{ "id": "kebab-case-slug", "title": string, "shortDesc": string, "metaTitle": string, "metaDesc": string, "heroImage": "/images/SLUG-1.jpg", "galleryImages": ["/images/SLUG-2.jpg","/images/SLUG-3.jpg"], "guarantee": string, "points": string[], "faq": [{ "q": string, "a": string }] }],
  "navigation": { "taxonomy": [{ "category": string, "services": ["service-id",...] }], "footerLinks": ["about","contact"], "serviceAreas": string[] }
}

Rules:
- Infer "industry" from content: trade = home services/contractors/roofing/plumbing/electrical; hospitality = restaurants/wineries/hotels/venues; professional = law/accounting/consulting/agencies; retail = shops/product sellers; wellness = spas/gyms/therapists/salons.
- All copy must be written from the actual scraped content — do not invent services, credentials, or stats that aren't implied by the source text. If a fact isn't in the source, omit it rather than fabricate it (leave arrays shorter, fields empty string).
- "colors" should reflect the brand's actual visual identity if evident from the site, otherwise pick sensible defaults for the industry.
- Generate 1 faq array in "content.faq" (site-wide) AND per-service faq arrays.
- "id" fields must be lowercase kebab-case, derived from the service title.
`.trim();

async function structureWithClaude(gbp: GBPData | null): Promise<any> {
  const anthropic = new Anthropic({ apiKey: ANTHROPIC_API_KEY });

  const sitePayload = pages.map(p => `URL: ${p.url}\n${p.text}`).join('\n\n---\n\n').slice(0, 40000);
  const gbpPayload = gbp ? JSON.stringify(gbp, null, 2) : 'No Google Business Profile data available.';

  const msg = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 8000,
    messages: [{
      role: 'user',
      content: `You are structuring a local business's raw website content and Google Business Profile data into a strict JSON schema for a website generator.

SITE URL: ${TARGET_URL}

--- SCRAPED SITE CONTENT ---
${sitePayload}

--- GOOGLE BUSINESS PROFILE DATA ---
${gbpPayload}

--- SCHEMA ---
${DNA_SCHEMA_GUIDE}`,
    }],
  });

  const textBlock = msg.content.find(b => b.type === 'text');
  const raw = textBlock && 'text' in textBlock ? textBlock.text : '{}';
  const cleaned = raw.replace(/^```json\s*|```$/g, '').trim();
  return JSON.parse(cleaned);
}

// ---------------------------------------------------------------
// 4. MERGE + WRITE DRAFT
// ---------------------------------------------------------------
function mergeGBPFacts(dna: any, gbp: GBPData | null): any {
  if (!gbp) return dna;

  dna.contact = dna.contact || {};
  if (gbp.formatted_phone_number || gbp.international_phone_number) {
    dna.contact.phone1 = {
      raw: (gbp.international_phone_number || gbp.formatted_phone_number || '').replace(/\s+/g, ''),
      display: gbp.formatted_phone_number || '',
      label: 'Main',
    };
  }
  if (gbp.formatted_address) {
    const comp = (type: string) => gbp.address_components?.find(c => c.types.includes(type))?.long_name || '';
    dna.contact.address = {
      street: comp('route'),
      suburb: comp('sublocality') || comp('locality'),
      city: comp('locality'),
      province: comp('administrative_area_level_1'),
      postcode: comp('postal_code'),
      country: comp('country') || 'South Africa',
      countryCode: dna.contact.address?.countryCode || 'ZA',
    };
  }
  if (gbp.opening_hours?.weekday_text?.length) {
    dna.contact.hours = gbp.opening_hours.weekday_text.join(', ');
  }
  if (gbp.rating && gbp.user_ratings_total) {
    dna.trust = dna.trust || { stats: [] };
    dna.trust.stats = dna.trust.stats || [];
    dna.trust.stats.unshift({ value: `${gbp.rating}★`, label: `${gbp.user_ratings_total} Google Reviews` });
  }
  if (gbp.reviews?.length) {
    dna.trust.testimonials = gbp.reviews.slice(0, 5).map(r => ({
      quote: r.text?.slice(0, 400) || '',
      author: r.author_name,
      location: '',
      rating: r.rating,
    }));
  }
  return dna;
}

async function run() {
  console.log(`Crawling ${baseUrl} ...`);
  await crawl(baseUrl);
  console.log(`Crawled ${pages.length} page(s).\n`);

  console.log('Looking up Google Business Profile ...');
  const gbp = await fetchGBP();
  if (gbp) console.log(`  matched: ${gbp.name} (${gbp.rating}★, ${gbp.user_ratings_total} reviews)`);

  console.log('\nStructuring content with Claude ...');
  let dna = await structureWithClaude(gbp);
  dna = mergeGBPFacts(dna, gbp);
  dna._meta = dna._meta || {};
  dna._meta.siteUrl = dna._meta.siteUrl || TARGET_URL;

  const outPath = path.join(process.cwd(), 'src/data/client-dna.draft.json');
  fs.writeFileSync(outPath, JSON.stringify(dna, null, 2));

  console.log(`\nDraft written to: ${outPath}`);
  console.log('Review checklist before promoting to client-dna.json:');
  console.log('  - Verify brand colors match actual logo/site');
  console.log('  - Confirm services list is complete (nothing invented, nothing missing)');
  console.log('  - Source real images to replace /images/*.jpg placeholders');
  console.log('  - Check locations[] — LLM does not populate this, add manually');
  console.log('  - Proofread all copy for accuracy before deploy');
}

run();
