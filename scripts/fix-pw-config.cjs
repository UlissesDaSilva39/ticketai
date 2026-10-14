const fs = require("fs");
const path = "playwright.config.ts";
let src = fs.readFileSync(path, "utf8");

// Comment out the webServer block entirely so Playwright doesn't try to spawn its own
src = src.replace(
  /(\s*webServer:\s*\{[\s\S]*?\},?\n)/,
  "\n  // webServer disabled — run `npm run dev` manually in another terminal\n"
);

fs.writeFileSync(path, src, "utf8");
console.log("✅ playwright.config.ts patched — webServer disabled");
console.log("");
console.log("Current config:");
console.log(src);
