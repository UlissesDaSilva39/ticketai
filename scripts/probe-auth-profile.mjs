import { createClient } from "@supabase/supabase-js";
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(url, key, { auth: { persistSession: false } });

const testEmail = `seed-probe-${Date.now()}@ticketai.test`;
const { data, error } = await supabase.auth.admin.createUser({
  email: testEmail,
  password: "probe-password-12345",
  email_confirm: true,
});

if (error) {
  console.log("createUser error:", error.message);
} else {
  console.log("Created auth user:", data.user.id);
  console.log("Email:", testEmail);

  // Try inserting a profile with that id
  const { error: profileErr } = await supabase.from("profiles").insert({
    id: data.user.id,
    username: testEmail.replace(/[^a-z0-9]/g, "-").toLowerCase(),
    full_name: "Probe User",
    role: "fan",
    is_public: true,
  });

  if (profileErr) {
    console.log("Profile insert error:", profileErr.message);
  } else {
    console.log("✅ Profile insert works with auth.users.id");
  }

  // Cleanup
  await supabase.from("profiles").delete().eq("id", data.user.id);
  await supabase.auth.admin.deleteUser(data.user.id);
  console.log("Cleaned up probe user");
}
