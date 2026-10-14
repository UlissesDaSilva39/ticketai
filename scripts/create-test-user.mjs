import { createClient } from "@supabase/supabase-js";

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
);

const email = "playwright@ticketai.test";
const password = "PlaywrightTest123!";

const { data: list, error: listErr } = await sb.auth.admin.listUsers({ perPage: 200 });
if (listErr) { console.log("  List error: " + listErr.message); process.exit(1); }

const existing = list.users.find((u) => u.email === email);

if (existing) {
  const { error } = await sb.auth.admin.updateUserById(existing.id, {
    password,
    email_confirm: true,
  });
  console.log(error ? "  Reset failed: " + error.message : "  Password reset OK");
} else {
  const { data, error } = await sb.auth.admin.createUser({
    email, password, email_confirm: true,
  });
  console.log(error ? "  Create failed: " + error.message : "  Created " + data.user.id);
}
