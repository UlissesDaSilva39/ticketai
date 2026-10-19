import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { notifyUser } from "@/lib/notifications";

type Params = { params: Promise<{ id: string }> };

export async function POST(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const body = await request.json();

    if (!body.date || !body.name || !body.email) {
      return NextResponse.json(
        { ok: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const supabase = await createServerSupabase();
    const { data, error } = await supabase
      .from("booking_requests")
      .insert({
        promoter_id: id,
        date: body.date,
        name: body.name,
        email: body.email,
        venue: body.venue ?? null,
        message: body.message ?? null,
        status: "pending",
      })
      .select("id")
      .single();

    if (error) {
      console.error("promoter booking insert failed:", error);
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 500 }
      );
    }

    const { data: promoter } = await supabase
      .from("promoters")
      .select("user_id, display_name")
      .eq("id", id)
      .maybeSingle();

    if (promoter?.user_id) {
      await notifyUser(supabase, {
        userId: promoter.user_id,
        type: "booking",
        title: "New booking request for " + (promoter.display_name ?? "your promoter profile"),
        body: body.name + (body.venue ? " · " + body.venue : ""),
        href: "/promoters/" + id + "/inbox",
      });
    }

    return NextResponse.json({
      ok: true,
      id: data.id,
      message: "Booking request received",
    });
  } catch (err) {
    console.error("promoter booking route error:", err);
    return NextResponse.json(
      { ok: false, error: "Invalid payload" },
      { status: 400 }
    );
  }
}