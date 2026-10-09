import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

type Params = { params: Promise<{ slug: string }> };

export async function PATCH(request: Request, { params }: Params) {
  try {
    const { slug } = await params;
    const supabase = await createServerSupabase();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { ok: false, error: "Not signed in" },
        { status: 401 }
      );
    }

    const { data: existing } = await supabase
      .from("artists")
      .select("owner_id")
      .eq("slug", slug)
      .maybeSingle();

    if (!existing) {
      return NextResponse.json(
        { ok: false, error: "Artist not found" },
        { status: 404 }
      );
    }

    if (existing.owner_id !== user.id) {
      return NextResponse.json(
        { ok: false, error: "Not your artist page" },
        { status: 403 }
      );
    }

    const body = await request.json();

    const { error } = await supabase
      .from("artists")
      .update({
        name: body.name,
        bio: body.bio,
        genre: body.genre,
        artist_type: body.artistType,
        city: body.city,
        country: body.country,
        postcode: body.postcode || null,
        website: body.website || null,
        spotify: body.spotify || null,
        instagram: body.instagram || null,
        secondary_genres: Array.isArray(body.secondaryGenres)
          ? body.secondaryGenres
          : [],
      })
      .eq("slug", slug);

    if (error) {
      console.error("artist update failed:", error);
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("artist update route error:", err);
    return NextResponse.json(
      { ok: false, error: "Invalid payload" },
      { status: 400 }
    );
  }
}
