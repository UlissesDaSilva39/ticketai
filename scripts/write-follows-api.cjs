const fs = require("fs");
const path = require("path");

// ---------- /api/follows/status/route.ts ----------
const statusDir = "app/api/follows/status";
fs.mkdirSync(statusDir, { recursive: true });
fs.writeFileSync(
  path.join(statusDir, "route.ts"),
  `import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const supabase = await createServerSupabase();
  const url = new URL(req.url);
  const targetType = url.searchParams.get("targetType");
  const targetId = url.searchParams.get("targetId");

  if (!targetType || !targetId) {
    return NextResponse.json(
      { error: "targetType and targetId required" },
      { status: 400 }
    );
  }

  const { count } = await supabase
    .from("follows")
    .select("*", { count: "exact", head: true })
    .eq("target_type", targetType)
    .eq("target_id", targetId);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let following = false;
  if (user) {
    const { data } = await supabase
      .from("follows")
      .select("id")
      .eq("follower_id", user.id)
      .eq("target_type", targetType)
      .eq("target_id", targetId)
      .maybeSingle();
    following = Boolean(data);
  }

  return NextResponse.json({
    following,
    count: count ?? 0,
    signedIn: Boolean(user),
  });
}
`,
  "utf8"
);
console.log("✅ app/api/follows/status/route.ts");

// ---------- /api/follows/toggle/route.ts ----------
const toggleDir = "app/api/follows/toggle";
fs.mkdirSync(toggleDir, { recursive: true });
fs.writeFileSync(
  path.join(toggleDir, "route.ts"),
  `import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { targetType?: string; targetId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { targetType, targetId } = body;
  if (!targetType || !targetId) {
    return NextResponse.json(
      { error: "targetType and targetId required" },
      { status: 400 }
    );
  }

  const { data: existing } = await supabase
    .from("follows")
    .select("id")
    .eq("follower_id", user.id)
    .eq("target_type", targetType)
    .eq("target_id", targetId)
    .maybeSingle();

  let nowFollowing: boolean;
  if (existing) {
    const { error } = await supabase
      .from("follows")
      .delete()
      .eq("id", existing.id);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    nowFollowing = false;
  } else {
    const { error } = await supabase.from("follows").insert({
      follower_id: user.id,
      target_type: targetType,
      target_id: targetId,
    });
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    nowFollowing = true;
  }

  const { count } = await supabase
    .from("follows")
    .select("*", { count: "exact", head: true })
    .eq("target_type", targetType)
    .eq("target_id", targetId);

  return NextResponse.json({ following: nowFollowing, count: count ?? 0 });
}
`,
  "utf8"
);
console.log("✅ app/api/follows/toggle/route.ts");
