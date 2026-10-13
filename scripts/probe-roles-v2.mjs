import { createClient } from "@supabase/supabase-js";
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(url, key, { auth: { persistSession: false } });

// Approach 1: query existing profiles for distinct roles (DB has users!)
const { data: existing } = await supabase.from("profiles").select("role").limit(200);
const roles = [...new Set((existing || []).map(p => p.role))].filter(Boolean).sort();
console.log("Roles already in DB:", roles.join(", ") || "(none)");

// Approach 2: probe candidate roles
const { data: authData } = await supabase.auth.admin.createUser({
  email: `seed-role-probe-${Date.now()}@ticketai.test`,
  password: "probe-password-12345",
  email_confirm: true,
});
const userId = authData.user.id;

const candidates = [
  "user","fan","artist","musician","band","promoter","venue",
  "organizer","admin","label","manager","producer","listener",
  "creator","host","member",
];

const accepted = [];
for (const role of candidates) {
  const { error } = await supabase.from("profiles").insert({
    id: userId,
    username: `probe-${role}-${Date.now()}`,
    full_name: `Probe ${role}`,
    role,
    is_public: true,
  });
  if (!error) {
    accepted.push(role);
    console.log(`✅ "${role}" accepted`);
    await supabase.from("profiles").delete().eq("id", userId);
  } else if (error.message.includes("role_check")) {
    console.log(`❌ "${role}" rejected`);
  } else if (error.message.includes("duplicate key")) {
    console.log(`⚠️  "${role}" — dup key`);
    await supabase.from("profiles").delete().eq("id", userId);
  } else {
    console.log(`⚠️  "${role}" — ${error.message.slice(0, 100)}`);
    await supabase.from("profiles").delete().eq("id", userId);
  }
}

console.log("\nAccepted roles:", accepted.join(", ") || "(none)");
await supabase.auth.admin.deleteUser(userId);
console.log("Cleaned up probe user");
