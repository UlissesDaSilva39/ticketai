const fs = require("fs");

const routes = [
  "app/api/book/respond/route.ts",
  "app/api/messages/start-by-email/route.ts",
];

for (const f of routes) {
  console.log("\n========================================");
  console.log("=== " + f + " ===");
  console.log("========================================");
  if (fs.existsSync(f)) {
    console.log(fs.readFileSync(f, "utf8"));
  } else {
    console.log("  ❌ MISSING");
  }
}
