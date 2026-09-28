import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const { eventId, email } = await req.json();

    if (!eventId || !email) {
      return NextResponse.json(
        { error: "eventId and email are required" },
        { status: 400 }
      );
    }

    if (!email.includes("@") || !email.includes(".")) {
      return NextResponse.json(
        { error: "Enter a valid email" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from("waitlist")
      .insert({
        event_id: eventId,
        user_id: user?.id || null,
        email: email.trim().toLowerCase(),
      })
      .select()
      .single();

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json(
          { error: "You are already on this waitlist" },
          { status: 400 }
        );
      }
      throw error;
    }

    return NextResponse.json({ entry: data, success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to join";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
