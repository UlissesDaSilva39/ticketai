const fs = require("fs");
const path = require("path");

const candidates = [
  "app/[city]/page.tsx",
  "app/cities/page.tsx",
  "app/city/[slug]/page.tsx",
  "app/london/page.tsx",
  "app/manchester/page.tsx",
];
for (const c of candidates) {
  console.log("  " + (fs.existsSync(c) ? "✅" : "❌") + " " + c);
  if (fs.existsSync(c)) {
    const src = fs.readFileSync(c, "utf8");
    console.log("      lines: " + src.split("\n").length);
  }
}

console.log("\n=== middleware.ts (to check for city route conflicts) ===");
if (fs.existsSync("middleware.ts")) {
  const src = fs.readFileSync("middleware.ts", "utf8");
  console.log("  lines: " + src.split("\n").length);
  const matcher = src.match(/matcher:\s*\[([^\]]+)\]/);
  if (matcher) console.log("  matcher: " + matcher[1].trim());
} else {
  console.log("  (no middleware.ts)");
}

console.log("\n=== Cities with events in DB ===");
