const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");
let raw = fs.readFileSync(".env.local", "utf8");
if (raw.charCodeAt(0) === 0xFEFF) raw = raw.slice(1);
const env = {};
for (const line of raw.split(/\r?\n/)) {
  const l = line.trim();
  if (!l || l.startsWith("#")) continue;
  const i = l.indexOf("=");
  if (i < 0) continue;
  env[l.slice(0, i)] = l.slice(i + 1);
}

const url = env.NEXT_PUBLIC_SUPABASE_URL;

(async () => {
  console.log("=== Testing API routes via HTTP ===");

  // 1. Submit
  console.log("\n[1] POST /api/reviews/submit");
  try {
    const r = await fetch(url.replace("supabase.co", "localhost:3000").replace("https://", "http://") + "/api/reviews/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventId: "2a1a8455-e783-468b-8ebd-91210f10a871", rating: 4, comment: "test from node" })
    });
    console.log("  Status:", r.status);
    console.log("  Body:", await r.text());
  } catch (e) {
    console.log("  ERROR:", e.message);
  }

  // 2. Delete
  console.log("\n[2] POST /api/reviews/delete");
  try {
    const r = await fetch("http://localhost:3000/api/reviews/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventId: "2a1a8455-e783-468b-8ebd-91210f10a871" })
    });
    console.log("  Status:", r.status);
    console.log("  Body:", await r.text());
  } catch (e) {
    console.log("  ERROR:", e.message);
  }
})();