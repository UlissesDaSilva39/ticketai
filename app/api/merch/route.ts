import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const artistId = req.nextUrl.searchParams.get("artistId");
  if (!artistId) return NextResponse.json({ error: "artistId required" }, { status: 400 });

  const supabase = await createServerSupabase();
  const { data, error } = await supabase
    .from("merch")
    .select("id, title, description, price_pence, image_url, shipping_required, stock, active, position")
    .eq("artist_id", artistId)
    .eq("active", true)
    .order("position", { ascending: true })
    .limit(20);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ items: data || [] });
}

export async function POST(req: NextRequest) {
  const { title, description, price_pence, image_url, shipping_required } = await req.json();
  if (!title || typeof price_pence !== "number") {
    return NextResponse.json({ error: "title and price_pence required" }, { status: 400 });
  }

  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const { count } = await supabase
    .from("merch").select("*", { count: "exact", head: true }).eq("artist_id", user.id);

  const { data, error } = await supabase
    .from("merch")
    .insert({
      artist_id: user.id,
      title,
      description: description ?? null,
      price_pence,
      image_url: image_url ?? null,
      shipping_required: shipping_required ?? true,
      position: count ?? 0,
    })
    .select("id, title, price_pence, image_url")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ item: data });
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  await supabase.from("merch").delete().eq("id", id).eq("artist_id", user.id);
  return NextResponse.json({ ok: true });
}