import { createClient } from "@supabase/supabase-js";
import fs from "fs";

const sql = fs.readFileSync("./scripts/seed.sql", "utf8");
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const sb = createClient(url, key);

console.log("Running seed...");
// Supabase JS doesn't support multi-statement SQL directly.
// Best path: use the Supabase SQL Editor, or split into individual inserts.
console.log("⚠️  Use Option A (Supabase SQL Editor) — paste scripts/seed.sql there.");
