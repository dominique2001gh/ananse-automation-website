import type { MetadataRoute } from "next";

const siteUrl = "https://ananseautomation.com";

// Keep in sync with lib/nav.ts / the actual routes under app/. Every route
// here is a real page with an approved metadata title.
const routes = ["", "/services", "/solutions", "/industries", "/about", "/contact"];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified,
    changeFrequency: "monthly",
    priority: route === "" ? 1 : 0.8,
  }));
}
