import { createClient } from "@supabase/supabase-js";
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });

const tables = ["profiles","venues","artists","events","posts","follows","tickets","orders"];
for (const t of tables) {
  const { data, error } = await sb.from(t).select("*").limit(1);
  if (error) {
    console.log(`  ❌ ${t}: ${error.message}`);
  } else {
    const cols = data?.[0] ? Object.keys(data[0]).join(", ") : "(no rows — columns unknown)";
    console.log(`  ✅ ${t}: ${cols}`);
  }
}
