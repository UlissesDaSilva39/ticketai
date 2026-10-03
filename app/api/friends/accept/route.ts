import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.redirect(new URL("/login", req.url));

  const form = await req.formData();
  const senderId = String(form.get("senderId") || "");
  if (!senderId) return NextResponse.redirect(new URL("/friends/requests", req.url));

  await supabase
    .from("friendships")
    .update({ status: "accepted" })
    .eq("user_id", senderId)
    .eq("friend_id", user.id)
    .eq("status", "pending");

  return NextResponse.redirect(new URL("/friends/requests", req.url));
}