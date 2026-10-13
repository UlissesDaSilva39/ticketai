import { createClient } from "@supabase/supabase-js";
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });

// Tables we expect vs. suspect-missing
const known = [
  "profiles","venues","artists","events","posts","follows","tickets","orders",
  "post_likes","comments","comment_likes",
  "booking_requests","artist_messages","conversations","messages",
  "vouches","venue_availability","saved_items",
];

console.log("=== TABLE PRESENCE ===");
for (const t of known) {
  const { error } = await sb.from(t).select("*", { count: "exact", head: true });
  if (error) {
    console.log(`  ❌ ${t}  (${error.message.slice(0, 60)})`);
  } else {
    const { count } = await sb.from(t).select("*", { count: "exact", head: true });
    console.log(`  ✅ ${t}  (${count} rows)`);
  }
}

console.log("");
console.log("=== SAMPLE AUTH USERS (first 5) ===");
const { data: users } = await sb.auth.admin.listUsers();
for (const u of users.users.slice(0, 5)) {
  console.log(`  ${u.email}  id=${u.id}`);
}

console.log("");
console.log("=== SAMPLE ARTIST ROWS (first 3) ===");
const { data: arts } = await sb.from("artists").select("id, name, slug, owner_id, verified").limit(3);
for (const a of arts ?? []) {
  console.log(`  ${a.name}  slug=${a.slug}  owner=${a.owner_id}  verified=${a.verified}`);
}

console.log("");
console.log("=== SAMPLE VENUE ROWS (first 3) ===");
const { data: vens } = await sb.from("venues").select("id, name, slug, city, contact_email, verified").limit(3);
for (const v of vens ?? []) {
  console.log(`  ${v.name} (${v.city})  slug=${v.slug}  email=${v.contact_email ?? "—"}  verified=${v.verified}`);
}
