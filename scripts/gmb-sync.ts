import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

/**
 * Google Reviews Sync
 * Usage: npm run sync-reviews -- [place_id]
 *   place_id is optional after the first run — it gets saved to _meta.googlePlaceId
 *   in client-dna.json and reused automatically (including at build time).
 *
 * Pulls live reviews + rating from the Google Business Profile via the Places API
 * and writes them into trust.testimonials / trust.stats. Never wipes existing
 * testimonials on failure — fails soft so a broken API key can't break a build.
 */

const dnaFilePath = path.join(process.cwd(), 'src/data/client-dna.json');
const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;
const MIN_RATING = 4; // don't surface anything below this
const MAX_TESTIMONIALS = 6;

interface GBPReview {
  author_name: string;
  rating: number;
  text: string;
  time: number; // unix seconds
  relative_time_description: string;
}

function softFail(message: string): never {
  // Non-zero would break `npm run build` if wired as a prebuild step. Reviews are
  // a nice-to-have refresh, not a build-blocking dependency — warn and exit clean.
  console.warn(`[gmb-sync] ${message} — leaving existing testimonials untouched.`);
  process.exit(0);
}

async function run() {
  if (!fs.existsSync(dnaFilePath)) {
    softFail(`client-dna.json not found at ${dnaFilePath}. Run ingest first.`);
  }
  if (!GOOGLE_PLACES_API_KEY) {
    softFail('Missing GOOGLE_PLACES_API_KEY in .env');
  }

  const dna = JSON.parse(fs.readFileSync(dnaFilePath, 'utf-8'));

  const placeId = process.argv[2] || dna._meta?.googlePlaceId;
  if (!placeId) {
    softFail('No place_id provided and none saved in _meta.googlePlaceId. Run: npm run sync-reviews -- <place_id> once.');
  }

  console.log(`Fetching Google Business Profile reviews for place_id: ${placeId}`);

  const fields = 'name,rating,user_ratings_total,reviews';
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=${fields}&key=${GOOGLE_PLACES_API_KEY}`;

  let result: any;
  try {
    const res = await fetch(url);
    const json = await res.json();
    if (json.status !== 'OK') {
      softFail(`Places API returned status "${json.status}": ${json.error_message || 'no details'}`);
    }
    result = json.result;
  } catch (err) {
    softFail(`Network error calling Places API: ${(err as Error).message}`);
  }

  const reviews: GBPReview[] = result.reviews || [];
  const filtered = reviews
    .filter(r => r.rating >= MIN_RATING && r.text && r.text.trim().length > 0)
    .sort((a, b) => b.time - a.time)
    .slice(0, MAX_TESTIMONIALS);

  if (filtered.length === 0) {
    softFail('Places API returned no qualifying reviews (rating >= 4 with text)');
  }

  dna.trust = dna.trust || {};
  dna.trust.testimonials = filtered.map(r => ({
    quote: r.text.slice(0, 500),
    author: r.author_name,
    location: 'Google Review',
    rating: r.rating,
  }));

  // Refresh the "X Google Reviews" stat if one already exists; otherwise leave stats alone.
  if (result.rating && result.user_ratings_total && Array.isArray(dna.trust.stats)) {
    const idx = dna.trust.stats.findIndex((s: any) => /google review/i.test(s.label));
    const stat = { value: `${result.rating}★`, label: `${result.user_ratings_total} Google Reviews` };
    if (idx >= 0) dna.trust.stats[idx] = stat;
    else dna.trust.stats.unshift(stat);
  }

  dna._meta = dna._meta || {};
  dna._meta.googlePlaceId = placeId;
  dna._meta.reviewsLastSynced = new Date().toISOString();

  fs.writeFileSync(dnaFilePath, JSON.stringify(dna, null, 2));
  console.log(`Synced ${filtered.length} review(s) into trust.testimonials. Rating: ${result.rating}★ (${result.user_ratings_total} total).`);
}

run();
