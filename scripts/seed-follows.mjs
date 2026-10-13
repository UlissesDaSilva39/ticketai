import { createClient } from "@supabase/supabase-js";
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });

// Pull a wide set of valid auth users (any role)
const { data: authList } = await supabase.auth.admin.listUsers({ perPage: 200 });
const authIds = (authList.users || []).map(u => u.id);

const { data: profiles } = await supabase
  .from("profiles")
  .select("id, role")
  .in("id", authIds);

console.log("Total auth profiles:", profiles.length);
const byRole = {};
for (const p of profiles) byRole[p.role] = (byRole[p.role] || 0) + 1;
console.log("By role:", byRole);

// Any profile can be a target; use each profile's own role as target_type
const { data: existing } = await supabase.from("follows").select("follower_id, target_id").limit(1000);
const seen = new Set((existing || []).map(f => f.follower_id + ":" + f.target_id));

const candidates = profiles.filter(p => p.role);
const rows = [];
for (let i = 0; i < 40 && i < candidates.length * 2; i++) {
  const follower = candidates[Math.floor(Math.random() * candidates.length)];
  const target = candidates[Math.floor(Math.random() * candidates.length)];
  if (!follower || !target || follower.id === target.id) continue;
  const key = follower.id + ":" + target.id;
  if (seen.has(key)) continue;
  seen.add(key);
  rows.push({ follower_id: follower.id, target_type: target.role, target_id: target.id });
}

console.log("Prepared follows:", rows.length);
if (rows.length) {
  const { error } = await supabase.from("follows").insert(rows);
  if (error) console.error("Insert failed:", error.message);
  else console.log("Inserted", rows.length, "follows");
}

const { count } = await supabase.from("follows").select("*", { count: "exact", head: true });
console.log("follows total:", count);
