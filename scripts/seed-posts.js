// One-off seed script — inserts sample posts for testing
// Run: node scripts/seed-posts.js

const { createClient } = require("@supabase/supabase-js");
require("dotenv").config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function main() {
  const { data: users } = await supabase
    .from("profiles")
    .select("id, username, role")
    .limit(5);

  if (!users || users.length === 0) {
    console.log("No users found");
    return;
  }

  const { data: events } = await supabase
    .from("events")
    .select("id, title")
    .eq("status", "published")
    .limit(3);

  const evt = events?.[0];
  const u1 = users[0];
  const u2 = users[1] || u1;

  const posts = [
    {
      author_id: u1.id,
      author_type: "user",
      body: "Just grabbed my ticket for Fresh Test Purchases 🎉 Who else is going?",
      event_id: evt?.id || null,
    },
    {
      author_id: u2.id,
      author_type: "promoter",
      body: "Announcing our next night: deep house all evening, no phones on the dancefloor. Lineup drops tomorrow. #HouseMusic #LondonEvents",
    },
    {
      author_id: u1.id,
      author_type: "user",
      body: "Anyone got a spare ticket for Folk & Whisky Festival? Happy to pay face value + a round 🍻",
    },
    {
      author_id: u2.id,
      author_type: "promoter",
      body: "Sold out shows, sold out hearts. Thanks to everyone who came out last weekend — best crowd yet ❤️",
    },
    {
      author_id: u1.id,
      author_type: "user",
      body: "Just discovered this platform. The feed layout is slick. Looking forward to seeing events from my people here 👋",
    },
    {
      author_id: u2.id,
      author_type: "promoter",
      body: "New artist on our roster — demo landing this Friday. #LiveMusic",
    },
  ];

  const { data, error } = await supabase.from("posts").insert(posts).select("id");

  if (error) {
    console.error("Insert failed:", error.message);
    process.exit(1);
  }

  console.log("Inserted", data?.length, "posts");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});