import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

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

    const supabase = await createServerSupabase();
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
      console.error("Waitlist insert error:", JSON.stringify(error));

      if (error.code === "23505") {
        return NextResponse.json(
          { error: "You are already on this waitlist" },
          { status: 400 }
        );
      }

      if (error.code === "23503") {
        return NextResponse.json(
          { error: "This event does not exist" },
          { status: 400 }
        );
      }

      if (error.code === "42501") {
        return NextResponse.json(
          { error: "Permission denied - check RLS policy" },
          { status: 500 }
        );
      }

      return NextResponse.json(
        { error: error.message || error.code || "Insert failed" },
        { status: 500 }
      );
    }

    return NextResponse.json({ entry: data, success: true });
  } catch (err) {
    console.error("Waitlist route error:", err);
    const message =
      err instanceof Error ? err.message :
      typeof err === "object" && err !== null && "message" in err
        ? String((err as { message: unknown }).message)
        : "Failed to join";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

