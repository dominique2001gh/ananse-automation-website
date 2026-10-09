import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // /admin pages already set `robots: { index: false }` in their own
  // metadata, but that only works for rendered HTML <head> tags. API
  // routes return JSON with no <head> at all, so they need this header
  // instead to stay out of search indexes -- robots.txt disallow (see
  // app/robots.ts) only stops crawlers from requesting the path in the
  // first place, it doesn't prevent indexing of URLs discovered elsewhere.
  async headers() {
    return [
      {
        source: "/admin/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
      {
        source: "/api/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
};

export default nextConfig;
