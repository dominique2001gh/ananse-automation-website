import type { MetadataRoute } from "next";

const siteUrl = "https://www.ananseautomation.com";

// Keep in sync with lib/nav.ts / the actual routes under app/. Every route
// here is a real page with an approved metadata title.
//
// /project-questionnaire is deliberately excluded: per its own page
// comment, it's sent directly to prospects rather than discovered
// organically, so it shouldn't be promoted for crawling/indexing here.
const routes = [
  "",
  "/services",
  "/analytics",
  "/solutions",
  "/industries",
  "/about",
  "/contact",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified,
    changeFrequency: "monthly",
    priority: route === "" ? 1 : 0.8,
  }));
}
