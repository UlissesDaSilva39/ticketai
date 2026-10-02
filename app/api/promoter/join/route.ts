 import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

    const {
      display_name,
      bio,
      instagram,
      tiktok,
      youtube,
      city,
      contact_email,
      contact_phone,
      website,
    } = await req.json();

    if (!display_name) {
      return NextResponse.json({ error: "Display name required" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("promoters")
      .upsert(
        {
          user_id: user.id,
          display_name,
          bio: bio || null,
          instagram: instagram || null,
          tiktok: tiktok || null,
          youtube: youtube || null,
          city: city || null,
          contact_email: contact_email || null,
          contact_phone: contact_phone || null,
          website: website || null,
        },
        { onConflict: "user_id" }
      )
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ promoter: data });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Join failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}