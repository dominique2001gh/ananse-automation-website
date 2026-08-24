import type { Metadata } from "next";

/**
 * Per-page metadata helper.
 *
 * Next.js metadata is only shallow-merged: a nested object like `openGraph`
 * defined on a page fully replaces (not merges with) the same object from
 * app/layout.tsx (see node_modules/next/dist/docs/.../generate-metadata.md
 * "Merging"). Since every subpage already sets its own `title`/`description`
 * but not its own `openGraph`/`twitter`, every page was sharing the root
 * layout's homepage-specific Open Graph/Twitter card -- correct as a
 * fallback, but it meant sharing e.g. /services on social media showed the
 * homepage's title and description instead of the Services page's own.
 *
 * This reuses each page's already-approved title/description (no new copy)
 * and the same logo image already used at the site level, just scoped to
 * the actual page being shared.
 */

const siteUrl = "https://ananseautomation.com";
const ogImage = { url: "/brand/ananse-logo-lockup.png", width: 1365, height: 421 };

export function buildPageMetadata({
  path,
  title,
  description,
}: {
  /** Route path, e.g. "/services". */
  path: string;
  title: string;
  description: string;
}): Metadata {
  const url = `${siteUrl}${path}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: "Ananse Automation",
      images: [ogImage],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage.url],
    },
  };
}
