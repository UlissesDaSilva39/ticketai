import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { checkNewChatAllowance, chatLimitMessage } from "@/lib/chat-limits";

export async function POST(req: NextRequest) {
  try {
    const { otherUserId } = await req.json();
    if (!otherUserId) return NextResponse.json({ error: "otherUserId required" }, { status: 400 });

    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
    if (user.id === otherUserId) return NextResponse.json({ error: "Cannot message yourself" }, { status: 400 });

    const a = user.id < otherUserId ? user.id : otherUserId;
    const b = user.id < otherUserId ? otherUserId : user.id;

    const { data: existing } = await supabase
      .from("conversations")
      .select("id")
      .eq("participant_a", a)
      .eq("participant_b", b)
      .maybeSingle();

    if (existing) return NextResponse.json({ conversationId: existing.id });

    // New conversation: weekly limit by plan (Free 5, Pro 30, Premium unlimited).
    const allowance = await checkNewChatAllowance(user.id);
    if (!allowance.ok) {
      return NextResponse.json({ error: chatLimitMessage(allowance), upgrade: "/pro", limit: allowance }, { status: 402 });
    }

    const { data: created, error } = await supabase
      .from("conversations")
      .insert({ participant_a: a, participant_b: b, started_by: user.id })
      .select("id")
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ conversationId: created.id });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}