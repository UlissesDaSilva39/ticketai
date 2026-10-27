import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll(); },
          setAll(cookiesToSet) {
            try { cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options)); } catch {}
          },
        },
      }
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    if (!profile || profile.role !== "admin") {
      return NextResponse.json({ error: "Admin only" }, { status: 403 });
    }

    const body = await request.json();
    const { artist_name, placement_type, days, amount_paid_gbp, notes } = body;

    if (!artist_name) return NextResponse.json({ error: "Missing artist_name" }, { status: 400 });

    const ends = new Date();
    ends.setDate(ends.getDate() + (days || 30));

    const { data, error } = await supabase
      .from("featured_placements")
      .insert({
        artist_id: "00000000-0000-0000-0000-000000000000",
        artist_name,
        placement_type: placement_type || "music_page",
        ends_at: ends.toISOString(),
        amount_paid_gbp: amount_paid_gbp || 0,
        payment_status: "paid",
        notes: notes || null,
        created_by: user.id,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ placement: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed" }, { status: 500 });
  }
}
