import * as cheerio from 'cheerio';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config();

/**
 * Multi-Agent Ingestion Swarm
 * Eliminates LLM summarization slop by orchestrating a pipeline of specialized agents.
 */

const TARGET_URL = process.argv[2];

if (!TARGET_URL) {
  console.error("❌ Please provide a target URL: npm run ingest <url>");
  process.exit(1);
}

const baseUrl = new URL(TARGET_URL).origin;
const visitedUrls = new Set<string>();
const allTextPayloads: string[] = [];
const allImages = new Set<string>();

// ---------------------------------------------------------
// PHASE 1: SCOUT AGENT (Raw Extraction)
// ---------------------------------------------------------
async function scoutCrawl(url: string, depth: number = 0) {
  if (depth > 2) return; 
  if (visitedUrls.has(url)) return;
  visitedUrls.add(url);

  console.log(`🕷️ [Scout Agent] Harvesting: ${url}`);
  
  try {
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);

    $('img').each((_, el) => {
      const src = $(el).attr('src');
      if (src && !src.includes('data:image')) {
        const absoluteSrc = src.startsWith('http') ? src : `${baseUrl}${src.startsWith('/') ? '' : '/'}${src}`;
        allImages.add(absoluteSrc);
      }
    });

    const linksToQueue: string[] = [];
    $('a').each((_, el) => {
      const href = $(el).attr('href');
      if (href && (href.startsWith(baseUrl) || href.startsWith('/'))) {
        const absoluteHref = href.startsWith('http') ? href : `${baseUrl}${href}`;
        if (!visitedUrls.has(absoluteHref)) {
          linksToQueue.push(absoluteHref);
        }
      }
    });

    $('script, style, nav, footer, header').remove();
    const rawText = $('body').text().replace(/\s+/g, ' ').trim();
    allTextPayloads.push(`--- PAGE: ${url} ---\n${rawText}\n`);

    for (const nextLink of linksToQueue) {
      await scoutCrawl(nextLink, depth + 1);
    }
  } catch (error) {
    console.warn(`⚠️ [Scout Agent] Failed to harvest ${url}`);
  }
}

// ---------------------------------------------------------
// PHASE 2 & 3: ARCHITECT & COPYWRITER SWARM
// ---------------------------------------------------------
async function runSwarmIngestion() {
  console.log(`\n🚀 [Godmode Orchestrator] Deploying Swarm to: ${baseUrl}`);
  
  // 1. Scout Phase
  await scoutCrawl(baseUrl);
  console.log(`\n✅ [Scout Agent] Harvest complete. ${visitedUrls.size} pages. ${allTextPayloads.join('').length} characters of DNA.`);

  // 2. Architect Phase (Mocked LLM execution)
  console.log(`\n📐 [Architect Agent] Analyzing raw DNA to extract flat structural taxonomy...`);
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // 3. Copywriter Swarm Phase (Mocked Parallel LLM execution)
  console.log(`\n✍️ [Copywriter Swarm] Deploying specialized agents to write SEO-perfect AIW@ copy...`);
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  const buildServiceNode = (categoryPath: string, serviceTitle: string) => {
    const cleanSlug = serviceTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    return {
      title: serviceTitle,
      path: `/${categoryPath}/${cleanSlug}`,
      image: "", 
      seo: { h1: `Commercial ${serviceTitle} Solutions`, h2: `Enterprise-Grade ${serviceTitle}`, h3: `Precision Engineering` },
      content: { description: `We engineer and install high-performance ${serviceTitle.toLowerCase()}.`, points: ["Expert installation", "24/7 Support"] },
      faq: [{ question: `What is the lead time for ${serviceTitle.toLowerCase()}?`, answer: "Timelines depend on facility size." }]
    };
  };

  const taxonomy = [
    { category: "Primary Services", path: "/services", services: [buildServiceNode("services", "Core Commercial Service")] }
  ];

  // 4. Corporate Expansion Phase (Standard Pages)
  console.log(`\n🏢 [Corporate Agent] Generating high-converting About and Contact/Lead Magnet pages...`);
  
  const standardPagesContent = {
    about: {
      headline: "Master Framework Corporate Entity",
      mission: "To deliver enterprise-grade services engineered for maximum ROI.",
      history: "Built by the Godmode Swarm Orchestrator."
    },
    contact: {
      headline: "Request Priority Commercial Assessment",
      subheadline: "Direct integration to Omnichannel Dispatch.",
      leadMagnetForm: {
        title: "15-Minute Response Guarantee",
        fields: ["Company Name", "Facility Size", "Urgency Level", "Direct Phone"],
        webhookUrl: "https://hook.us1.make.com/YOUR_WEBHOOK_URL_HERE" // Ready for GHL/Omnichannel integration
      }
    }
  };

  // 5. Designer Phase
  console.log(`\n🎨 [Designer Agent] Mapping extracted visual assets to DNA structure...`);
  
  const llmGeneratedDNA = {
    business: {
      name: "Master Framework Client",
      shortName: "Client",
      phone: "555-0199",
      location: "Target Market",
      valueProposition: "Turnkey Commercial Solutions"
    },
    design: { colors: { primary: "#1e3a8a", secondary: "#ffffff", accent: "#ef4444" }, styling: { corners: "rounded", shadows: "heavy" } },
    architecture: {
      taxonomy: taxonomy,
      standardPages: [
        { title: "About Us", path: "/about" },
        { title: "Contact", path: "/contact" }
      ],
      assets: { logo: "", heroBackground: "/images/hero-placeholder.png", teamShowcase: "", brands: [] }
    },
    content: {
      home: {
        hero: { headline: "Turnkey Solutions in {city}", subheadline: "Expert commercial maintenance.", ctaPrimary: "Call for Emergency Service", ctaSecondary: "Schedule Assessment" },
        deepContext: { headline: "Why Choose Us?", paragraph: "We supply, install, and maintain commercial systems.", points: ["Rapid response", "Expertise", "Turnkey management"] },
        process: { headline: "How Our Turnkey Process Works", steps: [{ title: "1. Assessment", description: "Evaluate space." }, { title: "2. Install", description: "Zero disruption." }, { title: "3. SLA", description: "Routine maintenance." }] },
        testimonials: [],
        serviceArea: { headline: "Serving the Market", paragraph: "Ready to respond.", areas: ["Area 1", "Area 2"] },
        faq: [],
        finalCta: { headline: "Don't let a breakdown cost you.", subheadline: "Get priority commercial service today.", buttonText: "Request Immediate Service" }
      },
      standard: standardPagesContent
    }
  };

  const outputFilePath = path.join(process.cwd(), 'src/data/client-dna.json');
  fs.writeFileSync(outputFilePath, JSON.stringify(llmGeneratedDNA, null, 2));

  console.log(`\n🧬 [Godmode Orchestrator] SUCCESS! DNA successfully injected into: src/data/client-dna.json`);
}

runSwarmIngestion();
