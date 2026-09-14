import type { NextConfig } from "next";

// PostHog is reached through our own domain (/relay/*), so privacy extensions
// that block third-party trackers by hostname don't silently drop events.
// The region must match the PostHog project; "eu" unless told otherwise.
const posthogRegion = process.env.NEXT_PUBLIC_POSTHOG_REGION === "us" ? "us" : "eu";

const nextConfig: NextConfig = {
  // PostHog's API paths end in a slash; redirecting them would break ingestion.
  skipTrailingSlashRedirect: true,
  async rewrites() {
    return [
      {
        source: "/relay/static/:path*",
        destination: `https://${posthogRegion}-assets.i.posthog.com/static/:path*`,
      },
      {
        source: "/relay/array/:path*",
        destination: `https://${posthogRegion}-assets.i.posthog.com/array/:path*`,
      },
      {
        source: "/relay/:path*",
        destination: `https://${posthogRegion}.i.posthog.com/:path*`,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // The site is never meant to be framed.
          { key: "X-Frame-Options", value: "DENY" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
          },
        ],
      },
      {
        // Release DMGs. File names carry the version, so a given URL never
        // changes content and can be cached for good.
        source: "/downloads/:file*",
        headers: [
          { key: "Content-Type", value: "application/x-apple-diskimage" },
          { key: "Content-Disposition", value: "attachment" },
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
};

export default nextConfig;
