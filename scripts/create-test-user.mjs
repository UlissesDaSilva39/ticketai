import { createClient } from "@supabase/supabase-js";
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });

const email = "playwright@ticketai.test";
const password = "TestPass123!";

const { data: list } = await supabase.auth.admin.listUsers({ perPage: 200 });
const existing = list.users.find(u => u.email === email);
if (existing) {
  console.log("User already exists:", existing.id);
  process.exit(0);
}

const { data, error } = await supabase.auth.admin.createUser({
  email,
  password,
  email_confirm: true,
});

if (error) {
  console.error("Failed:", error.message);
  process.exit(1);
}

console.log("Created auth user:", data.user.id);

const { error: profileErr } = await supabase.from("profiles").insert({
  id: data.user.id,
  username: "playwright_test",
  full_name: "Playwright Test",
  role: "admin",
  city: "London",
  is_public: true,
});

if (profileErr) console.error("Profile insert error:", profileErr.message);
else console.log("Profile created");
