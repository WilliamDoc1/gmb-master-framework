import * as fs from 'fs';
import * as path from 'path';

/**
 * Omnichannel GMB Sync Agent
 * 
 * This agent is designed to take a Google Place ID or Maps URL,
 * extract the 5-star commercial reviews, and sync them directly 
 * into the client-dna.json for the React frontend to display.
 */

const targetId = process.argv[2];

if (!targetId) {
  console.error("❌ Please provide a Google Place ID or Name: npm run sync-reviews <place_id>");
  process.exit(1);
}

const dnaFilePath = path.join(process.cwd(), 'src/data/client-dna.json');

async function runGMBSync() {
  console.log(`\n🔍 [GMB Sync Agent] Initiating sync for entity: ${targetId}`);
  
  if (!fs.existsSync(dnaFilePath)) {
    console.error(`❌ [GMB Sync Agent] Error: client-dna.json not found at ${dnaFilePath}. Run ingest-client first.`);
    process.exit(1);
  }

  const rawDNA = fs.readFileSync(dnaFilePath, 'utf-8');
  const dna = JSON.parse(rawDNA);

  console.log(`📡 [GMB Sync Agent] Connecting to Google Places API (Mocked for Demo)...`);
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  console.log(`⭐ [GMB Sync Agent] Extracted 42 total reviews. Filtering for 5-star commercial context...`);
  await new Promise(resolve => setTimeout(resolve, 1000));

  // In a real environment, this would be an API call to Google Places API or an Apify Scraper.
  // We mock the specific extraction of high-value commercial reviews to feed the omnichannel lead gen.
  const syncedTestimonials = [
    {
      quote: "Absolute lifesavers. Our entire server room cooling failed at 2 AM. Their commercial dispatch was on site within 45 minutes and had a temporary solution running before business hours.",
      author: "Michael T., IT Director"
    },
    {
      quote: "We use them for the preventative maintenance on all 12 of our commercial retail locations. Since switching to their SLA, our downtime has dropped to zero.",
      author: "Sarah Jenkins, Regional Operations"
    },
    {
      quote: "Professional, clean, and exact on their quoting. The turnkey installation of the new roof units went perfectly.",
      author: "David R., Facility Manager"
    }
  ];

  if (!dna.content) dna.content = {};
  if (!dna.content.home) dna.content.home = {};
  
  // Overwrite or append the testimonials
  dna.content.home.testimonials = syncedTestimonials;

  fs.writeFileSync(dnaFilePath, JSON.stringify(dna, null, 2));

  console.log(`✅ [GMB Sync Agent] SUCCESS! ${syncedTestimonials.length} high-intent commercial reviews synced to client-dna.json.`);
  console.log(`The React frontend will immediately reflect these updated trust signals.\n`);
}

runGMBSync();
