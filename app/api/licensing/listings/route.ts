import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { rateLimit } from "@/lib/rate-limit";
import { displayName, pricesOf } from "@/lib/licensing/server";

export const dynamic = "force-dynamic";

const MIN = 100;
const MAX = 500_000;

// GET /api/licensing/listings?q=: active tracks available to licence.
export async function GET(req: NextRequest) {
  const supabase = await createServerSupabase();
  const q = (req.nextUrl.searchParams.get("q") ?? "").trim().slice(0, 60);

  let query = supabase
    .from("licence_listings")
    .select("id, owner_id, track_title, artist_name, genre, description, cover_url, preview_url, price_creator, price_commercial, price_sync, deals_count, created_at")
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(60);
  if (q) {
    const safe = q.replace(/[%,()]/g, " ");
    query = query.or(`track_title.ilike.%${safe}%,artist_name.ilike.%${safe}%,genre.ilike.%${safe}%`);
  }
  const { data: rows, error } = await query;
  if (error) {
    console.error("[licensing/listings]", error.message);
    return NextResponse.json({ listings: [], setupPending: true });
  }

  const ownerIds = [...new Set((rows ?? []).map((r) => r.owner_id))];
  const { data: owners } = ownerIds.length
    ? await supabase.from("profiles").select("id, full_name, username").in("id", ownerIds)
    : { data: [] as { id: string; full_name: string | null; username: string | null }[] };
  const ownerById = new Map((owners ?? []).map((o) => [o.id, o]));

  return NextResponse.json({
    listings: (rows ?? []).map((r) => ({
      id: r.id,
      trackTitle: r.track_title,
      artistName: r.artist_name,
      genre: r.genre,
      description: r.description,
      coverUrl: r.cover_url,
      previewUrl: r.preview_url,
      prices: pricesOf(r),
      dealsCount: r.deals_count,
      licensor: displayName(ownerById.get(r.owner_id)),
    })),
  });
}

const price = (v: unknown): number | null | "bad" => {
  if (v === null || v === undefined || v === "") return null;
  const n = Math.round(Number(v));
  return Number.isFinite(n) && n >= MIN && n <= MAX ? n : "bad";
};
const text = (v: unknown, max: number) => String(v ?? "").trim().slice(0, max);
const httpsUrl = (v: unknown) => (typeof v === "string" && /^https:\/\/\S+$/.test(v.trim()) ? v.trim().slice(0, 500) : null);

// POST /api/licensing/listings: list a track for licensing (signed-in members).
export async function POST(req: NextRequest) {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Please log in to licence your music." }, { status: 401 });
  if (!rateLimit(`licence-list:${user.id}`, 10, 60 * 60 * 1000).ok) {
    return NextResponse.json({ error: "You've listed a lot of tracks. Try again later." }, { status: 429 });
  }

  const b = await req.json().catch(() => ({}));
  const trackTitle = text(b.trackTitle, 120);
  const artistName = text(b.artistName, 120);
  const composer = text(b.composer, 200);
  const publisher = text(b.publisher, 200) || null;
  const genre = text(b.genre, 40) || null;
  const description = text(b.description, 1000) || null;
  const isrc = text(b.isrc, 15).toUpperCase().replace(/[-\s]/g, "") || null;
  const prices = { creator: price(b.prices?.creator), commercial: price(b.prices?.commercial), sync: price(b.prices?.sync) };
  const file = b.file as { path?: string; name?: string } | undefined;

  if (!trackTitle) return NextResponse.json({ error: "Enter the track title." }, { status: 400 });
  if (!artistName) return NextResponse.json({ error: "Enter the artist name." }, { status: 400 });
  if (!composer) return NextResponse.json({ error: "Enter the composer(s)." }, { status: 400 });
  if (isrc && !/^[A-Z]{2}[A-Z0-9]{3}[0-9]{7}$/.test(isrc)) {
    return NextResponse.json({ error: "ISRC should look like GBABC2400001 (or leave it empty)." }, { status: 400 });
  }
  if (Object.values(prices).includes("bad")) {
    return NextResponse.json({ error: "Prices must be between £1 and £5,000." }, { status: 400 });
  }
  if (Object.values(prices).every((p) => p === null)) {
    return NextResponse.json({ error: "Set a price for at least one licence type." }, { status: 400 });
  }
  if (b.rightsConfirmed !== true) {
    return NextResponse.json({ error: "Please confirm you own or control the rights." }, { status: 400 });
  }
  if (!file?.path || !file.path.startsWith(`${user.id}/`)) {
    return NextResponse.json({ error: "Upload the full-quality track licensees will receive." }, { status: 400 });
  }

  const admin = createAdminClient();
  const { data: listing, error } = await admin
    .from("licence_listings")
    .insert({
      owner_id: user.id,
      track_title: trackTitle,
      artist_name: artistName,
      composer,
      publisher,
      genre,
      description,
      isrc,
      cover_url: httpsUrl(b.coverUrl),
      preview_url: httpsUrl(b.previewUrl),
      price_creator: prices.creator,
      price_commercial: prices.commercial,
      price_sync: prices.sync,
      rights_confirmed_at: new Date().toISOString(),
    })
    .select("id")
    .single();
  if (error || !listing) {
    console.error("[licensing/listings POST]", error?.message);
    return NextResponse.json({ error: "Could not list the track. Please try again." }, { status: 500 });
  }

  const { error: fileErr } = await admin
    .from("licence_listing_files")
    .insert({ listing_id: listing.id, file_path: file.path, file_name: String(file.name ?? "track").slice(0, 200) });
  if (fileErr) {
    await admin.from("licence_listings").delete().eq("id", listing.id);
    return NextResponse.json({ error: "Could not save the audio file. Please try again." }, { status: 500 });
  }

  return NextResponse.json({ id: listing.id });
}
