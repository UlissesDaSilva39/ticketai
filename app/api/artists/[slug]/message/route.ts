import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

type Params = { params: Promise<{ slug: string }> };

export async function POST(request: Request, { params }: Params) {
  try {
    const { slug } = await params;
    const body = await request.json();

    if (!body.name || !body.email || !body.message) {
      return NextResponse.json(
        { ok: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const supabase = await createServerSupabase();
    const { data, error } = await supabase
      .from("artist_messages")
      .insert({
        artist_slug: slug,
        name: body.name,
        email: body.email,
        message: body.message,
      })
      .select("id")
      .single();

    if (error) {
      console.error("message insert failed:", error);
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      id: data.id,
      message: "Message received",
    });
  } catch (err) {
    console.error("message route error:", err);
    return NextResponse.json(
      { ok: false, error: "Invalid payload" },
      { status: 400 }
    );
  }
}
