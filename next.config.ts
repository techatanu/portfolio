import type { NextConfig } from "next";

// Static export for GitHub Pages (spec §0.4 / Phase 7). No server features:
// cacheComponents/partialPrefetching need the Node runtime, so they stay off.
const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
