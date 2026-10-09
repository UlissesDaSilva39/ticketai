import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { notifyUser } from "@/lib/notifications";

type Params = { params: Promise<{ slug: string }> };

export async function POST(request: Request, { params }: Params) {
  try {
    const { slug } = await params;
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
        artist_slug: slug,
        date: body.date,
        name: body.name,
        email: body.email,
        venue: body.venue ?? null,
        message: body.message ?? null,
      })
      .select("id")
      .single();

    if (error) {
      console.error("booking insert failed:", error);
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 500 }
      );
    }

    const { data: artist } = await supabase
      .from("artists")
      .select("owner_id, name")
      .eq("slug", slug)
      .maybeSingle();

    if (artist?.owner_id) {
      await notifyUser(supabase, {
        userId: artist.owner_id,
        type: "booking",
        title: "New booking request for " + artist.name,
        body: body.name + (body.venue ? " · " + body.venue : ""),
        href: "/artist/" + slug + "/inbox",
      });
    }

    return NextResponse.json({
      ok: true,
      id: data.id,
      message: "Booking request received",
    });
  } catch (err) {
    console.error("booking route error:", err);
    return NextResponse.json(
      { ok: false, error: "Invalid payload" },
      { status: 400 }
    );
  }
}
