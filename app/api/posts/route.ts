import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { fetchFeed } from "@/lib/posts";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  const followingOnly = req.nextUrl.searchParams.get("type") === "following";

  const posts = await fetchFeed(supabase, {
    userId: user?.id ?? null,
    followingOnly,
  });

  return NextResponse.json({ posts });
}