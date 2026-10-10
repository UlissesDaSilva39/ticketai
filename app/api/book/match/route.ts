import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type Artist = {
  id: string;
  slug: string;
  name: string;
  genre: string | null;
  secondary_genres: string[] | null;
  city: string | null;
  country: string | null;
  avatar_url: string | null;
  verified: boolean;
  artist_type: string | null;
};

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const {
    location = "",
    date = "",
    genre = "",
    capacity = 0,
  } = body;

  const supabase = await createServerSupabase();

  const { data: artists, error } = await supabase
    .from("artists")
    .select("id, slug, name, genre, secondary_genres, city, country, avatar_url, verified, artist_type")
    .eq("status", "active")
    .limit(100);

  if (error || !artists) {
    return NextResponse.json({ matches: [], error: error?.message });
  }

  const genreLower = String(genre).toLowerCase().trim();
  const cityLower = String(location).toLowerCase().trim();

  const matches = (artists as Artist[])
    .map((a) => {
      let score = 40;
      const reasons: string[] = [];

      const primary = (a.genre || "").toLowerCase();
      const secondary = (a.secondary_genres || []).map((g) => g.toLowerCase());

      if (genreLower) {
        if (primary === genreLower) {
          score += 30;
          reasons.push("Exact genre match");
        } else if (primary.includes(genreLower) || genreLower.includes(primary)) {
          score += 20;
          reasons.push("Related genre");
        } else if (secondary.includes(genreLower)) {
          score += 18;
          reasons.push("Plays " + genreLower);
        } else if (secondary.some((s) => s.includes(genreLower))) {
          score += 10;
          reasons.push("Similar genre");
        }
      }

      if (cityLower && a.city) {
        const ac = a.city.toLowerCase();
        if (ac === cityLower) {
          score += 20;
          reasons.push(`Based in ${a.city}`);
        } else if (ac.includes(cityLower) || cityLower.includes(ac)) {
          score += 10;
          reasons.push(`Near ${a.city}`);
        }
      }

      if (a.verified) {
        score += 5;
        reasons.push("Verified artist");
      }

      if (a.avatar_url) score += 3;

      score = Math.min(score, 99);

      return {
        ...a,
        match: score,
        reasons: reasons.slice(0, 3),
      };
    })
    .filter((a) => a.match >= 50)
    .sort((a, b) => b.match - a.match)
    .slice(0, 10);

  return NextResponse.json({
    matches,
    query: { location, date, genre, capacity },
  });
}
