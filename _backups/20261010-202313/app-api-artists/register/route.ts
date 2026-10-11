import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { slugify, uniqueSlug } from "@/lib/slug";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Basic server-side validation
    const required = ["artistName", "handle", "email", "genre", "artistType", "city", "country", "bio"];
    for (const key of required) {
      if (!body?.[key] || String(body[key]).trim() === "") {
        return NextResponse.json(
          { ok: false, error: `Missing field: ${key}` },
          { status: 400 }
        );
      }
    }

    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();

    // Check handle uniqueness
    const { data: existingHandle } = await supabase
      .from("artists")
      .select("id")
      .eq("handle", body.handle)
      .maybeSingle();

    if (existingHandle) {
      return NextResponse.json(
        { ok: false, error: "That handle is already taken." },
        { status: 409 }
      );
    }

    // Build a unique slug
    const baseSlug = slugify(body.artistName) || "artist";
    let slug = baseSlug;
    for (let attempt = 0; attempt < 5; attempt++) {
      const { data: clash } = await supabase
        .from("artists")
        .select("id")
        .eq("slug", slug)
        .maybeSingle();
      if (!clash) break;
      slug = uniqueSlug(baseSlug, crypto.randomUUID());
    }

    // Insert
    const { data, error } = await supabase
      .from("artists")
      .insert({
        owner_id: user?.id ?? null,
        slug,
        name: body.artistName,
        handle: body.handle,
        email: body.email,
        phone: body.phone || null,
        genre: body.genre,
        artist_type: body.artistType,
        secondary_genres: Array.isArray(body.secondaryGenres) ? body.secondaryGenres : [],
        city: body.city,
        country: body.country,
        postcode: body.postcode || null,
        bio: body.bio,
        website: body.website || null,
        spotify: body.spotify || null,
        instagram: body.instagram || null,
        avatar_url: body.avatar || null,
      })
      .select("id, slug")
      .single();

    if (error) {
      console.error("artists insert failed:", error);
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      artist: { id: data.id, slug: data.slug },
      redirectTo: `/artist/${data.slug}`,
    });
  } catch (err) {
    console.error("register route error:", err);
    return NextResponse.json(
      { ok: false, error: "Invalid payload" },
      { status: 400 }
    );
  }
}
