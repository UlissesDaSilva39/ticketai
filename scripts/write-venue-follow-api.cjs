const fs = require("fs");
const path = require("path");

const routeDir = "app/api/venues/[slug]/follow";
fs.mkdirSync(routeDir, { recursive: true });

const route = `import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

type Ctx = { params: Promise<{ slug: string }> };

export async function POST(req: NextRequest, ctx: Ctx) {
  const { slug } = await ctx.params;
  const supabase = await createServerSupabase();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { following?: boolean };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const wantFollow = Boolean(body.following);

  const { data: existing } = await supabase
    .from("venue_follows")
    .select("id")
    .eq("follower_id", user.id)
    .eq("venue_slug", slug)
    .maybeSingle();

  if (wantFollow && !existing) {
    const { error } = await supabase.from("venue_follows").insert({
      follower_id: user.id,
      venue_slug: slug,
    });
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  } else if (!wantFollow && existing) {
    const { error } = await supabase
      .from("venue_follows")
      .delete()
      .eq("id", existing.id);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }

  const { count } = await supabase
    .from("venue_follows")
    .select("*", { count: "exact", head: true })
    .eq("venue_slug", slug);

  return NextResponse.json({ following: wantFollow, count: count ?? 0 });
}
`;

fs.writeFileSync(path.join(routeDir, "route.ts"), route, "utf8");
console.log("✅ " + path.join(routeDir, "route.ts") + " (" + route.split("\n").length + " lines)");
