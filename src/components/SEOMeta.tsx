import { useEffect } from "react";
import { siteConfig } from "../site-config";

interface SEOMetaProps {
  title?: string;
  description?: string;
  canonicalUrl?: string;
  ogType?: "website" | "article";
}

export default function SEOMeta({
  title,
  description = siteConfig.description,
  canonicalUrl = typeof window !== "undefined" ? window.location.href : "",
  ogType = "website",
}: SEOMetaProps) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // 1. Page Title
    const finalTitle = title ? `${title} | ${siteConfig.name}` : `${siteConfig.name} - ${siteConfig.description}`;
    document.title = finalTitle;

    // Helper to upsert meta tag
    const upsertMeta = (nameAttr: string, valueAttr: string, content: string) => {
      let meta = document.querySelector(`meta[${nameAttr}="${valueAttr}"]`);
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute(nameAttr, valueAttr);
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", content);
    };

    // Helper to upsert link tag
    const upsertLink = (rel: string, href: string) => {
      let link = document.querySelector(`link[rel="${rel}"]`);
      if (!link) {
        link = document.createElement("link");
        link.setAttribute("rel", rel);
        document.head.appendChild(link);
      }
      link.setAttribute("href", href);
    };

    // 2. Base SEO Meta Tags
    upsertMeta("name", "description", description);
    upsertMeta("name", "viewport", "width=device-width, initial-scale=1.0");

    // 3. OpenGraph Tags (Social Meta / AEO Scraping Compatibility)
    upsertMeta("property", "og:title", finalTitle);
    upsertMeta("property", "og:description", description);
    upsertMeta("property", "og:url", canonicalUrl || window.location.href);
    upsertMeta("property", "og:type", ogType);
    upsertMeta("property", "og:image", `${(canonicalUrl || window.location.href).replace(/\/$/, "")}/logo.png`);

    // 4. Canonical URL
    if (canonicalUrl || window.location.href) {
      upsertLink("canonical", canonicalUrl || window.location.href);
    }

  }, [title, description, canonicalUrl, ogType]);

  return null;
}
