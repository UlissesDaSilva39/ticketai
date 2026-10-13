import { createClient } from "@supabase/supabase-js";
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });

const checks = [
  ["venues",  "venues"],
  ["artists", "artists"],
  ["events",  "events"],
  ["posts",   "posts"],
];

for (const [label, table] of checks) {
  const { count, error } = await sb.from(table).select("*", { count: "exact", head: true });
  console.log(error ? `  ❌ ${label}: ${error.message}` : `  ✅ ${label}: ${count}`);
}

const { data: users } = await sb.auth.admin.listUsers();
console.log(`  ✅ auth users: ${users.users.length}`);
