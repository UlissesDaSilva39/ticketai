const fs = require("fs");

const files = [
  "app/api/messages/send/route.ts",
  "app/api/messages/start/route.ts",
  "app/api/messages/read/route.ts",
  "app/api/messages/typing/route.ts",
  "app/api/messages/start-by-email/route.ts",
];
for (const f of files) {
  console.log("\n=== " + f + " ===");
  if (fs.existsSync(f)) {
    const src = fs.readFileSync(f, "utf8");
    console.log("  lines: " + src.split("\n").length);
    console.log("  exports: " + (src.match(/export async function \w+/g) || []).join(", "));
    // Show request shape
    const jsonMatch = src.match(/await req\.json\(\)[^;]*/);
    if (jsonMatch) console.log("  body shape hint: " + jsonMatch[0].slice(0, 200));
    const urlMatch = src.match(/searchParams\.get\("([^"]+)"\)/g);
    if (urlMatch) console.log("  query params: " + urlMatch.join(", "));
  } else {
    console.log("  ❌ MISSING");
  }
}

console.log("\n=== Existing message pages ===");
["app/messages/page.tsx", "app/messages/[id]/page.tsx", "app/messages/[[...id]]/page.tsx"].forEach((p) => {
  console.log("  " + (fs.existsSync(p) ? "✅" : "❌") + " " + p);
});
