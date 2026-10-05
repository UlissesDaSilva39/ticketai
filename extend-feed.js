const fs = require("fs");
const p = "app/feed/page.tsx";
let t = fs.readFileSync(p, "utf8");
const before = t;

// 1. Extend the type union
if (!t.includes('"new_event"')) {
  t = t.replace(
    'type: "going" | "interested" | "review";',
    'type: "going" | "interested" | "review" | "new_event";'
  );
  console.log("1. Type union extended.");
}

// 2. Add a new query block for followed promoters' events, right after the reviews loop closes
if (!t.includes("followedPromoterIds")) {
  const anchor = "  activities.sort((a, b) => (a.created_at < b.created_at ? 1 : -1));";

  const followedBlock = `  // Events from organizers the user follows
  const { data: followsRows } = await supabase
    .from("follows")
    .select("target_type, target_id")
    .eq("follower_id", user.id)
    .eq("target_type", "promoter");

  if (followsRows && followsRows.length > 0) {
    const promoterRowIds = followsRows.map((r) => r.target_id);
    const { data: promoterRows } = await supabase
      .from("promoters")
      .select("id, user_id, display_name")
      .in("id", promoterRowIds);

    const organizerIds = (promoterRows || []).map((p) => p.user_id).filter(Boolean) as string[];
    const promoterNameByUserId: Record<string, string> = {};
    for (const p of promoterRows || []) {
      if (p.user_id) promoterNameByUserId[p.user_id] = p.display_name || "Promoter";
    }

    if (organizerIds.length > 0) {
      const { data: newEvents } = await supabase
        .from("events")
        .select("id, title, start_date, hero_image, organizer_id, created_at")
        .in("organizer_id", organizerIds)
        .eq("status", "published")
        .gte("start_date", new Date().toISOString())
        .order("created_at", { ascending: false })
        .limit(20);

      for (const ev of newEvents || []) {
        activities.push({
          id: "new-" + ev.id,
          type: "new_event",
          user_id: ev.organizer_id,
          user_name: promoterNameByUserId[ev.organizer_id] || "Promoter",
          user_username: null,
          created_at: ev.created_at,
          event_id: ev.id,
          event_title: ev.title,
          event_date: ev.start_date,
          event_image: ev.hero_image,
        });
      }
    }
  }

`;

  if (t.includes(anchor)) {
    t = t.replace(anchor, followedBlock + anchor);
    console.log("2. Followed promoters' events query added.");
  } else {
    console.log("2. Anchor not found.");
  }
}

// 3. Add rendering case for "new_event"
const oldRender = `                      {a.type === "review" && <span className="text-gray-600"> reviewed </span>}`;
const newRender = `                      {a.type === "review" && <span className="text-gray-600"> reviewed </span>}
                      {a.type === "new_event" && <span className="text-gray-600"> announced a new event </span>}`;

if (t.includes(oldRender) && !t.includes('"new_event" && <span')) {
  t = t.replace(oldRender, newRender);
  console.log("3. Render case added.");
}

if (t !== before) {
  fs.writeFileSync(p, t);
  console.log("File saved.");
}