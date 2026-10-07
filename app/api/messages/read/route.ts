import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const { conversationId } = await req.json();
  if (!conversationId) return NextResponse.json({ error: "conversationId required" }, { status: 400 });
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  const { data: conv } = await supabase.from("conversations").select("participant_a, participant_b").eq("id", conversationId).maybeSingle();
  if (!conv) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const column = conv.participant_a === user.id ? "participant_a_last_read" : "participant_b_last_read";
  const { error } = await supabase.from("conversations").update({ [column]: new Date().toISOString() }).eq("id", conversationId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}