import type { NextConfig } from "next";

// Demo build: everything is client-side sample data, so Cache Components is off
// (kept hidden routes mounted, which fights drawers/dialogs in a mock-data demo).
//
// GITHUB_PAGES=true builds a static copy for GitHub Pages, served from /<repo>/ (see
// .github/workflows/pages.yml). Pages that show a record created in the browser read the id
// from the query string (lib/routes.ts), and images are served without the optimizer.
const pages = process.env.GITHUB_PAGES === "true";
const basePath = pages ? (process.env.PAGES_BASE_PATH ?? "/sree-atchaya-jewellers") : "";

const nextConfig: NextConfig = {
  ...(pages && {
    output: "export",
    basePath,
    trailingSlash: true,
    images: { loader: "custom", loaderFile: "./lib/image-loader.ts" },
  }),
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
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
