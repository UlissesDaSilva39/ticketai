import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { notifyUser } from "@/lib/notifications";

type Params = { params: Promise<{ id: string }> };

export async function POST(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const body = await request.json();

    if (!body.name || !body.email || !body.message) {
      return NextResponse.json(
        { ok: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const supabase = await createServerSupabase();
    const { data, error } = await supabase
      .from("promoter_messages")
      .insert({
        promoter_id: id,
        name: body.name,
        email: body.email,
        message: body.message,
      })
      .select("id")
      .single();

    if (error) {
      console.error("promoter message insert failed:", error);
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
        type: "message",
        title: "New message for " + (promoter.display_name ?? "your promoter profile"),
        body: body.name + ": " + (body.message ?? "").slice(0, 80),
        href: "/promoters/" + id + "/inbox",
      });
    }

    return NextResponse.json({
      ok: true,
      id: data.id,
      message: "Message received",
    });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: "Invalid payload" },
      { status: 400 }
    );
  }
}