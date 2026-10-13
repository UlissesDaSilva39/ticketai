import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const service = process.env.SUPABASE_SERVICE_ROLE_KEY;

const tables = ["comments","comment_likes","vouches","venue_availability","saved_items","conversations","messages"];

console.log("=== ANON vs SERVICE ROLE ===");
for (const t of tables) {
  const anonSb = createClient(url, anon, { auth: { persistSession: false } });
  const svcSb  = createClient(url, service, { auth: { persistSession: false } });

  const a = await anonSb.from(t).select("*", { count: "exact", head: true });
  const s = await svcSb.from(t).select("*", { count: "exact", head: true });

  const aStr = a.error ? `err: ${a.error.message.slice(0,40)}` : `count=${a.count}`;
  const sStr = s.error ? `err: ${s.error.message.slice(0,40)}` : `count=${s.count}`;
  console.log(`  ${t.padEnd(20)} anon: ${aStr.padEnd(50)} svc: ${sStr}`);
}
