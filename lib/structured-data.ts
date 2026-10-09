/**
 * JSON-LD builders, following Next's recommended pattern of rendering
 * structured data as an inline <script> tag per layout/page
 * (node_modules/next/dist/docs/01-app/02-guides/json-ld.md).
 *
 * Deliberately no LocalBusiness/NAP schema here -- there's no verified
 * street address, phone number or opening hours for the business yet, and
 * inventing one would be worse for SEO (and trust) than omitting it. Scope
 * is limited to what's actually known: the organization itself, the
 * website, and the services offered. `areaServed` on each Service is kept
 * to broad, true statements (Texas / United States) rather than specific
 * city claims.
 */

const siteUrl = "https://ananseautomation.com";
// Google's logo guidelines for Organization structured data call for a
// roughly square mark, not a wide wordmark lockup -- ananse-logo-mark.png
// (497x436, an existing brand asset already shipped in public/brand/) is
// the square mark; ananse-logo-lockup.png (1365x421) stays the OG/Twitter
// share image, where a wide image is what those crawlers expect instead.
const logoImage = {
  "@type": "ImageObject",
  url: `${siteUrl}/brand/ananse-logo-mark.png`,
  width: 497,
  height: 436,
};

const organizationDescription =
  "Ananse Automation is a technology consulting and software development company that helps businesses of all sizes -- across Texas, the United States, and beyond -- solve operational problems using data analytics, AI, automation, websites and custom software.";

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteUrl}/#organization`,
    name: "Ananse Automation",
    url: siteUrl,
    logo: logoImage,
    description: organizationDescription,
    knowsAbout: [
      "Data analytics",
      "Business intelligence",
      "Automation",
      "Artificial intelligence",
      "AI agents",
      "CRM systems",
      "Web development",
      "Custom software",
      "SaaS platforms",
    ],
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    name: "Ananse Automation",
    url: siteUrl,
    inLanguage: "en-US",
    publisher: { "@id": `${siteUrl}/#organization` },
  };
}

const texasArea = { "@type": "State", name: "Texas" };
const usArea = { "@type": "Country", name: "United States" };

export function serviceJsonLd({
  name,
  description,
  path,
  serviceType,
}: {
  name: string;
  description: string;
  path: string;
  serviceType?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    serviceType,
    url: `${siteUrl}${path}`,
    provider: { "@id": `${siteUrl}/#organization` },
    areaServed: [texasArea, usArea],
  };
}

/** XSS-safe serialization for a <script type="application/ld+json"> body, per Next's JSON-LD guide. */
export function jsonLdScriptProps(data: unknown) {
  return { __html: JSON.stringify(data).replace(/</g, "\\u003c") };
}
