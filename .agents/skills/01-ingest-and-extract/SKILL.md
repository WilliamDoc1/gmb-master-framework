---
name: ingest-and-extract
description: Use when you need to ingest a client's legacy website URL or index.html and map their entire business DNA into the site-config.ts file.
---

# 01 Ingest and Extract Pipeline

This skill instructs you (the agent) on how to autonomously ingest a client's old website and map it into the Godmode Master Repository configuration.

## Process Flow

1. **The Ingestion Target:** You will be provided with either a URL (e.g. `https://clientoldwebsite.com`) or an absolute path to a legacy `index.html` file on the filesystem.
2. **Visual & Semantic Extraction:** Do not just parse the DOM. Read the text, analyze the headings, and extract the following:
   - **Business Name** (e.g. Apex HVAC)
   - **Emergency Contact Number** (e.g. +27 82 ...)
   - **License Numbers** (Often found in the footer or header)
   - **Physical Address**
   - **Primary Services** (List out the 2-5 core services they offer)
   - **Brand Colors** (Determine the primary and accent hex codes based on their logo or buttons)
3. **The Transformation (site-config.ts):**
   Once you have extracted the data, you MUST use the `multi_replace_file_content` tool to update `/src/site-config.ts`.
   - Map the extracted services into the `services` array.
   - Inject the exact hex codes into the `theme` object.
   - Update the contact and licensing strings.

> [!IMPORTANT]
> DO NOT generate new React pages during this phase. This phase is STRICTLY for data extraction and populating the `site-config.ts` Master Brain. The `02-page-generator` skill will handle routing later.
