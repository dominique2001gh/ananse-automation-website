import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Defense-in-depth alongside the per-page `robots: { index: false }`
      // metadata on every /admin page and the X-Robots-Tag header set in
      // next.config.ts for /admin and /api -- crawlers that honor
      // robots.txt won't even request these paths.
      disallow: ["/admin", "/api"],
    },
    sitemap: "https://www.ananseautomation.com/sitemap.xml",
  };
}
