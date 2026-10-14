const { createClient } = require("@supabase/supabase-js");
const sb = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
);

const email = "playwright@ticketai.test";
const password = "PlaywrightTest123!";

(async () => {
  const { data: list, error: listErr } = await sb.auth.admin.listUsers({ perPage: 200 });
  if (listErr) {
    console.log("List error: " + listErr.message);
    process.exit(1);
  }

  const existing = list.users.find((u) => u.email === email);
  if (existing) {
    console.log("User exists, resetting password...");
    const { error } = await sb.auth.admin.updateUserById(existing.id, {
      password,
      email_confirm: true,
    });
    if (error) console.log("  Update failed: " + error.message);
    else console.log("  ✅ Password reset for " + email);
  } else {
    console.log("Creating user " + email + "...");
    const { data, error } = await sb.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });
    if (error) console.log("  Create failed: " + error.message);
    else console.log("  ✅ Created " + email + " (id " + data.user.id + ")");
  }

  // Verify
  const { data: list2 } = await sb.auth.admin.listUsers({ perPage: 200 });
  const found = list2.users.find((u) => u.email === email);
  console.log("");
  console.log(found ? "✅ Verified: " + found.email + " exists" : "❌ User not found after create");
})();
