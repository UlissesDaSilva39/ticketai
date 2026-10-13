import { createClient } from "@supabase/supabase-js";
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });

const tables = ["artist_follows", "venue_follows", "follows"];
for (const t of tables) {
  const { error, count } = await sb.from(t).select("*", { count: "exact", head: true });
  if (error) {
    console.log(`  ❌ ${t}: ${error.message}`);
  } else {
    console.log(`  ✅ ${t}: ${count} rows`);
    const { data } = await sb.from(t).select("*").limit(2);
    if (data?.[0]) console.log(`     columns: ${Object.keys(data[0]).join(", ")}`);
  }
}
