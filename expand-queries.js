const fs = require("fs");
const p = "app/page.tsx";
let t = fs.readFileSync(p, "utf8");
const before = t;

// 1. Expand the events query — change limit 3 to 6, order by views
t = t.replace(
  `.order("views", { ascending: false })
    .limit(3);`,
  `.order("views", { ascending: false })
    .limit(6);`
);

// 2. Get the current user + friends going this weekend
// Add a new query block right after the trending query
const anchor = `  const events = (trending || []) as TrendingEvent[];`;

const newQueries = `  const events = (trending || []) as TrendingEvent[];

  // Friends going this week (event ids)
  const { data: { user } } = await supabase.auth.getUser();
  let friendsGoingIds: string[] = [];
  if (user) {
    const { data: friendships } = await supabase
      .from("friendships")
      .select("user_id, friend_id")
      .eq("status", "accepted")
      .or("user_id.eq." + user.id + ",friend_id.eq." + user.id);

    const friendIds = (friendships || []).map((f) =>
      f.user_id === user.id ? f.friend_id : f.user_id
    );

    if (friendIds.length > 0) {
      const weekFromNow = new Date();
      weekFromNow.setDate(weekFromNow.getDate() + 7);

      const { data: friendGoing } = await supabase
        .from("event_interest")
        .select("event_id")
        .in("user_id", friendIds)
        .eq("status", "going");

      const candidateIds = [...new Set((friendGoing || []).map((r) => r.event_id))];

      if (candidateIds.length > 0) {
        const { data: upcomingFriendEvents } = await supabase
          .from("events")
          .select("id")
          .in("id", candidateIds)
          .eq("status", "published")
          .gte("start_date", new Date().toISOString())
          .lte("start_date", weekFromNow.toISOString());

        friendsGoingIds = (upcomingFriendEvents || []).map((e) => e.id);
      }
    }
  }

  // Fetch event details for friends going
  let friendsGoingEvents: TrendingEvent[] = [];
  if (friendsGoingIds.length > 0) {
    const { data: fg } = await supabase
      .from("events")
      .select("id, title, start_date, hero_image, ticket_types, venue_id")
      .in("id", friendsGoingIds)
      .limit(3);
    friendsGoingEvents = (fg || []) as TrendingEvent[];
  }`;

if (t.includes(anchor)) {
  t = t.replace(anchor, newQueries);
  fs.writeFileSync(p, t);
  console.log("Expanded query + friends going query added.");
} else {
  console.log("Query anchor not found.");
}