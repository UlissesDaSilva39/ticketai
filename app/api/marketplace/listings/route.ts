import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { rateLimit } from "@/lib/rate-limit";
import { promotedIds } from "@/lib/promote/server";
import { DOWNLOADABLE, MAX_PRICE_PENCE, MIN_PRICE_PENCE, isKind } from "@/lib/marketplace";

export const dynamic = "force-dynamic";

const nameOf = (p: { full_name: string | null; username: string | null } | null | undefined) =>
  (p?.full_name && !p.full_name.includes("@") ? p.full_name : p?.username) || "GRID member";

// GET /api/marketplace/listings?kind=beat: active listings, newest first, with
// seller details and, for signed-in members, which ones they already bought.
export async function GET(req: NextRequest) {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const kind = req.nextUrl.searchParams.get("kind");

  let q = supabase
    .from("marketplace_listings")
    .select("id, seller_id, kind, title, description, price_pence, pay_what_you_want, cover_url, sales_count, created_at")
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(60);
  if (isKind(kind)) q = q.eq("kind", kind);
  const { data: newest, error } = await q;
  if (error) {
    // Table not created yet (migration not applied): show an empty marketplace.
    console.error("[marketplace/listings]", error.message);
    return NextResponse.json({ listings: [], setupPending: true });
  }

  // Paid promotions ("GRID Boost") go first, with a Promoted label.
  const boosted = await promotedIds("listing");
  let promotedRows: NonNullable<typeof newest> = [];
  if (boosted.length) {
    let pq = supabase
      .from("marketplace_listings")
      .select("id, seller_id, kind, title, description, price_pence, pay_what_you_want, cover_url, sales_count, created_at")
      .eq("status", "active")
      .in("id", boosted);
    if (isKind(kind)) pq = pq.eq("kind", kind);
    promotedRows = (await pq).data ?? [];
  }
  const promotedSet = new Set(promotedRows.map((r) => r.id));
  const rows = [...promotedRows, ...(newest ?? []).filter((r) => !promotedSet.has(r.id))];

  const sellerIds = [...new Set((rows ?? []).map((r) => r.seller_id))];
  const { data: sellers } = sellerIds.length
    ? await supabase.from("profiles").select("id, full_name, username, avatar_url").in("id", sellerIds)
    : { data: [] as { id: string; full_name: string | null; username: string | null; avatar_url: string | null }[] };
  const sellerById = new Map((sellers ?? []).map((s) => [s.id, s]));

  let owned = new Set<string>();
  let orderByListing = new Map<string, string>();
  if (user && rows?.length) {
    const { data: orders } = await supabase
      .from("marketplace_orders")
      .select("id, listing_id")
      .eq("buyer_id", user.id)
      .eq("status", "paid")
      .in("listing_id", rows.map((r) => r.id));
    owned = new Set((orders ?? []).map((o) => o.listing_id));
    orderByListing = new Map((orders ?? []).map((o) => [o.listing_id as string, o.id as string]));
  }

  return NextResponse.json({
    listings: (rows ?? []).map((r) => {
      const s = sellerById.get(r.seller_id);
      return {
        id: r.id,
        kind: r.kind,
        title: r.title,
        description: r.description,
        pricePence: r.price_pence,
        payWhatYouWant: r.pay_what_you_want,
        coverUrl: r.cover_url,
        salesCount: r.sales_count,
        createdAt: r.created_at,
        seller: { id: r.seller_id, name: nameOf(s), username: s?.username ?? null },
        mine: user?.id === r.seller_id,
        promoted: promotedSet.has(r.id),
        owned: owned.has(r.id),
        orderId: orderByListing.get(r.id) ?? null,
        downloadable: (DOWNLOADABLE as string[]).includes(r.kind),
      };
    }),
  });
}

// POST /api/marketplace/listings: create a listing (signed-in members).
export async function POST(req: NextRequest) {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Please log in to sell on GRID." }, { status: 401 });
  if (!rateLimit(`market-list:${user.id}`, 10, 60 * 60 * 1000).ok) {
    return NextResponse.json({ error: "You've created a lot of listings. Try again later." }, { status: 429 });
  }

  const body = await req.json().catch(() => ({}));
  const kind = body.kind;
  const title = String(body.title ?? "").trim();
  const description = String(body.description ?? "").trim();
  const pricePence = Math.round(Number(body.pricePence));
  const payWhatYouWant = body.payWhatYouWant === true;
  const coverUrl = typeof body.coverUrl === "string" && /^https:\/\//.test(body.coverUrl) ? body.coverUrl.slice(0, 500) : null;
  const file = body.file as { path?: string; name?: string } | undefined;

  if (!isKind(kind)) return NextResponse.json({ error: "Choose what you're selling." }, { status: 400 });
  if (title.length < 3 || title.length > 120) return NextResponse.json({ error: "Title must be 3–120 characters." }, { status: 400 });
  if (description.length > 2000) return NextResponse.json({ error: "Description is too long (max 2,000 characters)." }, { status: 400 });
  if (!Number.isFinite(pricePence) || pricePence < MIN_PRICE_PENCE || pricePence > MAX_PRICE_PENCE) {
    return NextResponse.json({ error: "Price must be between £1 and £5,000." }, { status: 400 });
  }
  const needsFile = (DOWNLOADABLE as string[]).includes(kind);
  if (needsFile && (!file?.path || !file.path.startsWith(`${user.id}/`))) {
    return NextResponse.json({ error: "Upload the file buyers will download." }, { status: 400 });
  }

  const admin = createAdminClient();
  const { data: listing, error } = await admin
    .from("marketplace_listings")
    .insert({
      seller_id: user.id,
      kind,
      title,
      description: description || null,
      price_pence: pricePence,
      pay_what_you_want: payWhatYouWant,
      cover_url: coverUrl,
    })
    .select("id")
    .single();
  if (error || !listing) {
    console.error("[marketplace/listings POST]", error?.message);
    return NextResponse.json({ error: "Could not create the listing. Please try again." }, { status: 500 });
  }

  if (needsFile && file?.path) {
    const { error: fileErr } = await admin
      .from("marketplace_listing_files")
      .insert({ listing_id: listing.id, file_path: file.path, file_name: String(file.name ?? "download").slice(0, 200) });
    if (fileErr) {
      await admin.from("marketplace_listings").delete().eq("id", listing.id);
      return NextResponse.json({ error: "Could not save the file. Please try again." }, { status: 500 });
    }
  }

  return NextResponse.json({ id: listing.id });
}
