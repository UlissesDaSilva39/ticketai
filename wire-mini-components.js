const fs = require("fs");
const p = "app/page.tsx";
let t = fs.readFileSync(p, "utf8");
t = t.replace(/\r\n/g, "\n");
const before = t;

/* ============================================================
   A. Add organizer_id to the events query
   ============================================================ */
if (!t.includes('select("id, title, start_date, hero_image, ticket_types, venue_id, organizer_id")')) {
  t = t.replace(
    '.select("id, title, start_date, hero_image, ticket_types, venue_id")',
    '.select("id, title, start_date, hero_image, ticket_types, venue_id, organizer_id")'
  );
  console.log("A. events query now selects organizer_id.");
}

/* ============================================================
   B. Add TrendingEvent type update — include organizer_id
   ============================================================ */
if (!t.includes("organizer_id: string | null;")) {
  t = t.replace(
    "type TrendingEvent = {",
    "type TrendingEvent = {\n  organizer_id?: string | null;"
  );
  console.log("B. TrendingEvent type updated.");
}

/* ============================================================
   C. Batch queries for interest counts, user status, friends going
   ============================================================ */
if (!t.includes("interestByEvent")) {
  const anchor = `  const events = (trending || []) as TrendingEvent[];`;

  const batch = `  const events = (trending || []) as TrendingEvent[];

  // Batch: interest counts + current user status
  const eventIds = events.map((e) => e.id);
  const interestByEvent: Record<string, { interested: number; going: number; mine: "interested" | "going" | null }> = {};
  for (const id of eventIds) {
    interestByEvent[id] = { interested: 0, going: 0, mine: null };
  }

  if (eventIds.length > 0) {
    const { data: allInterest } = await supabase
      .from("event_interest")
      .select("event_id, user_id, status")
      .in("event_id", eventIds);

    for (const row of allInterest || []) {
      const b = interestByEvent[row.event_id];
      if (!b) continue;
      if (row.status === "interested") b.interested++;
      else if (row.status === "going") b.going++;
    }
  }

  // Batch: current user's friendships
  const { data: { user: currentUser } } = await supabase.auth.getUser();
  let currentFriendIds: string[] = [];
  if (currentUser) {
    const { data: friendships } = await supabase
      .from("friendships")
      .select("user_id, friend_id")
      .eq("status", "accepted")
      .or("user_id.eq." + currentUser.id + ",friend_id.eq." + currentUser.id);
    currentFriendIds = (friendships || []).map((f) =>
      f.user_id === currentUser.id ? f.friend_id : f.user_id
    );

    // Set the current user's own status per event
    const { data: myInterest } = await supabase
      .from("event_interest")
      .select("event_id, status")
      .in("event_id", eventIds)
      .eq("user_id", currentUser.id);
    for (const row of myInterest || []) {
      const b = interestByEvent[row.event_id];
      if (b) b.mine = row.status as "interested" | "going";
    }
  }

  // Batch: going users per event (for MiniFriendsGoing friends-first display)
  const goingUsersByEvent: Record<string, Array<{ id: string; name: string; isFriend: boolean }>> = {};
  if (eventIds.length > 0) {
    const { data: goingRows } = await supabase
      .from("event_interest")
      .select("event_id, user_id")
      .in("event_id", eventIds)
      .eq("status", "going");

    const goingUserIds = [...new Set((goingRows || []).map((r) => r.user_id))];
    const profileById: Record<string, string> = {};
    if (goingUserIds.length > 0) {
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, full_name, username")
        .in("id", goingUserIds);
      for (const pr of profiles || []) {
        profileById[pr.id] = pr.full_name || pr.username || "Someone";
      }
    }

    for (const row of goingRows || []) {
      if (!goingUsersByEvent[row.event_id]) goingUsersByEvent[row.event_id] = [];
      goingUsersByEvent[row.event_id].push({
        id: row.user_id,
        name: profileById[row.user_id] || "Someone",
        isFriend: currentFriendIds.includes(row.user_id),
      });
    }
    // Sort: friends first
    for (const id of Object.keys(goingUsersByEvent)) {
      goingUsersByEvent[id].sort((a, b) => Number(b.isFriend) - Number(a.isFriend));
    }
  }

  // Batch: follow counts for the organizers of these events
  const organizerIds = [...new Set(events.map((e) => e.organizer_id).filter(Boolean))] as string[];
  const followerCountByOrganizer: Record<string, number> = {};
  for (const id of organizerIds) followerCountByOrganizer[id] = 0;
  if (organizerIds.length > 0) {
    const { data: followRows } = await supabase
      .from("follows")
      .select("target_id")
      .eq("target_type", "promoter")
      .in("target_id", organizerIds);
    for (const row of followRows || []) {
      if (followerCountByOrganizer[row.target_id] !== undefined) {
        followerCountByOrganizer[row.target_id]++;
      }
    }
  }`;

  if (t.includes(anchor) && !t.includes("interestByEvent")) {
    t = t.replace(anchor, batch);
    console.log("C. Batch queries added.");
  } else {
    console.log("C. MISS — anchor not found.");
  }
}

/* ============================================================
   D. Import the mini components
   ============================================================ */
if (!t.includes("MiniInterestButtons from")) {
  const imp = 'import Link from "next/link";';
  t = t.replace(
    imp,
    imp + '\nimport MiniInterestButtons from "@/components/MiniInterestButtons";\nimport MiniFriendsGoing from "@/components/MiniFriendsGoing";\nimport MiniFollowButton from "@/components/MiniFollowButton";'
  );
  console.log("D. Imports added.");
}

/* ============================================================
   E. Render the mini components inside each card
   ============================================================ */
const cardOld = `                    {from !== null && (
                      <p className="mt-3 text-sm font-medium">
                        From £{from.toFixed(2)}
                      </p>
                    )}
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-xs text-gray-500">{e.views ?? 0} interested</span>
                      <span className="rounded-full bg-black text-white px-4 py-2 text-xs font-medium">Get Tickets</span>
                    </div>`;

const cardNew = `                    {from !== null && (
                      <p className="mt-3 text-sm font-medium">
                        From £{from.toFixed(2)}
                      </p>
                    )}

                    <MiniFriendsGoing
                      eventId={e.id}
                      friends={(goingUsersByEvent[e.id] || [])
                        .filter((u) => u.isFriend)
                        .map((u) => ({ id: u.id, name: u.name }))}
                      totalCount={(interestByEvent[e.id] || { going: 0 }).going}
                    />

                    <div className="mt-3">
                      <MiniInterestButtons
                        eventId={e.id}
                        initialStatus={(interestByEvent[e.id] || { mine: null }).mine}
                        isSignedIn={!!currentUser}
                        initialInterested={(interestByEvent[e.id] || { interested: 0 }).interested}
                        initialGoing={(interestByEvent[e.id] || { going: 0 }).going}
                      />
                    </div>

                    <div className="mt-4 flex items-center justify-between gap-2">
                      {e.organizer_id && (
                        <MiniFollowButton
                          targetType="promoter"
                          targetId={e.organizer_id}
                          initialCount={followerCountByOrganizer[e.organizer_id] || 0}
                        />
                      )}
                      <span className="rounded-full bg-black text-white px-4 py-2 text-xs font-medium">Get Tickets</span>
                    </div>`;

if (t.includes(cardOld) && !t.includes("MiniInterestButtons\n")) {
  t = t.replace(cardOld, cardNew);
  console.log("E. Card content updated with mini components.");
} else if (t.includes("MiniInterestButtons\n")) {
  console.log("E. Already present.");
} else {
  console.log("E. MISS — card anchor not found.");
  const i = t.indexOf("Get Tickets</span>");
  console.log("Context:", JSON.stringify(t.slice(i - 300, i + 100)));
}

/* ============================================================
   Save
   ============================================================ */
if (t !== before) {
  fs.writeFileSync(p, t);
  console.log("File saved.");
} else {
  console.log("No changes made.");
}