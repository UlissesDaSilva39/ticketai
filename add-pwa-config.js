const fs = require("fs");
const p = "next.config.ts";
let t = fs.readFileSync(p, "utf8");
const before = t;

if (t.includes("next-pwa") || t.includes("withPWA")) {
  console.log("next-pwa already configured.");
  process.exit(0);
}

const content = `import type { NextConfig } from "next";
import withPWAInit from "next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
  buildExcludes: [/app-build-manifest.json$/],
});

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "50mb",
    },
  },
};

export default withPWA(nextConfig);
`;

fs.writeFileSync(p, content);
console.log("next.config.ts rewritten with next-pwa.");