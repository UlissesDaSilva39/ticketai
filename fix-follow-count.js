const fs = require("fs");
const p = "app/page.tsx";
let t = fs.readFileSync(p, "utf8");
const before = t;

const oldBlock = `  // Batch: follow counts for the organizers of these events
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

const newBlock = `  // Batch: follow counts for the organizers of these events
  // follows.target_id is promoters.id, so we map organizer profile ids -> promoters.id first
  const organizerProfileIds = [...new Set(events.map((e) => e.organizer_id).filter(Boolean))] as string[];
  const followerCountByOrganizer: Record<string, number> = {};
  const promoterIdByUserId: Record<string, string> = {};
  for (const id of organizerProfileIds) followerCountByOrganizer[id] = 0;

  if (organizerProfileIds.length > 0) {
    const { data: promoterRows } = await supabase
      .from("promoters")
      .select("id, user_id")
      .in("user_id", organizerProfileIds);
    for (const row of promoterRows || []) {
      if (row.user_id) promoterIdByUserId[row.user_id] = row.id;
    }

    const promoterIds = Object.values(promoterIdByUserId);
    if (promoterIds.length > 0) {
      const { data: followRows } = await supabase
        .from("follows")
        .select("target_id")
        .eq("target_type", "promoter")
        .in("target_id", promoterIds);
      for (const row of followRows || []) {
        // row.target_id is a promoters.id; find its owner to increment the right bucket
        for (const [userId, promoterId] of Object.entries(promoterIdByUserId)) {
          if (promoterId === row.target_id) {
            followerCountByOrganizer[userId]++;
          }
        }
      }
    }
  }`;

if (t.includes(oldBlock)) {
  t = t.replace(oldBlock, newBlock);
  fs.writeFileSync(p, t);
  console.log("Follow count batch query fixed.");
} else {
  console.log("Anchor miss — checking.");
  const i = t.indexOf("followerCountByOrganizer");
  console.log(JSON.stringify(t.slice(i - 200, i + 600)));
}