const fs = require("fs");
let src = fs.readFileSync("playwright.config.ts", "utf8");
if (src.includes("webServer:")) {
  src = src.replace(/(\s*webServer:\s*\{[\s\S]*?\},?\n)/, "\n  // webServer disabled — run dev manually\n");
  fs.writeFileSync("playwright.config.ts", src, "utf8");
  console.log("  ✅ webServer block removed");
} else {
  console.log("  ℹ️  already patched");
}
