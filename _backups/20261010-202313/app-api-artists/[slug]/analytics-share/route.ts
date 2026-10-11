import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

type Params = { params: Promise<{ slug: string }> };

const MAX_ACTIVE_SHARES = 3;

function generateToken(): string {
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function POST(request: Request, { params }: Params) {
  try {
    const { slug } = await params;
    const supabase = await createServerSupabase();
    const url = new URL(request.url);
    const daysParam = url.searchParams.get("days");
    const days = daysParam === "7" || daysParam === "90" ? Number(daysParam) : 30;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ ok: false, error: "Not signed in" }, { status: 401 });
    }

    const { data: artist } = await supabase
      .from("artists")
      .select("owner_id")
      .eq("slug", slug)
      .maybeSingle();
    if (!artist) {
      return NextResponse.json({ ok: false, error: "Artist not found" }, { status: 404 });
    }
    if (artist.owner_id !== user.id) {
      return NextResponse.json({ ok: false, error: "Not your artist" }, { status: 403 });
    }

    const { data: activeShares } = await supabase
      .from("analytics_shares")
      .select("token, expires_at")
      .eq("artist_slug", slug)
      .eq("created_by", user.id)
      .gt("expires_at", new Date().toISOString())
      .order("created_at", { ascending: false });

    const active = activeShares ?? [];

    if (active.length >= MAX_ACTIVE_SHARES) {
      return NextResponse.json(
        {
          ok: false,
          error: `You already have ${MAX_ACTIVE_SHARES} active share links. Revoke one to create a new one.`,
          limitReached: true,
        },
        { status: 429 }
      );
    }

    const token = generateToken();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + days);

    const { data: share, error } = await supabase
      .from("analytics_shares")
      .insert({
        artist_slug: slug,
        token,
        created_by: user.id,
        expires_at: expiresAt.toISOString(),
      })
      .select("token, expires_at")
      .single();

    if (error) {
      console.error("analytics-share insert failed:", error);
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      ok: true,
      token: share.token,
      expiresAt: share.expires_at,
    });
  } catch (err) {
    console.error("analytics-share route error:", err);
    return NextResponse.json({ ok: false, error: "Invalid payload" }, { status: 400 });
  }
}

export async function GET(request: Request, { params }: Params) {
  try {
    const { slug } = await params;
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ ok: false, error: "Not signed in" }, { status: 401 });
    }

    const { data: artist } = await supabase
      .from("artists")
      .select("owner_id")
      .eq("slug", slug)
      .maybeSingle();
    if (!artist) {
      return NextResponse.json({ ok: false, error: "Artist not found" }, { status: 404 });
    }
    if (artist.owner_id !== user.id) {
      return NextResponse.json({ ok: false, error: "Not your artist" }, { status: 403 });
    }

    const { data, error } = await supabase
      .from("analytics_shares")
      .select("token, created_at, expires_at")
      .eq("artist_slug", slug)
      .eq("created_by", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }
    return NextResponse.json({ ok: true, shares: data ?? [] });
  } catch (err) {
    console.error("analytics-share GET error:", err);
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }
}

export async function DELETE(request: Request, { params }: Params) {
  try {
    const { slug } = await params;
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ ok: false, error: "Not signed in" }, { status: 401 });
    }

    const { data: artist } = await supabase
      .from("artists")
      .select("owner_id")
      .eq("slug", slug)
      .maybeSingle();
    if (!artist) {
      return NextResponse.json({ ok: false, error: "Artist not found" }, { status: 404 });
    }
    if (artist.owner_id !== user.id) {
      return NextResponse.json({ ok: false, error: "Not your artist" }, { status: 403 });
    }

    const body = await request.json().catch(() => ({ token: null }));
    const token = body?.token;
    if (!token || typeof token !== "string") {
      return NextResponse.json({ ok: false, error: "Missing token" }, { status: 400 });
    }

    const { error } = await supabase
      .from("analytics_shares")
      .delete()
      .eq("token", token)
      .eq("created_by", user.id);

    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("analytics-share DELETE error:", err);
    return NextResponse.json({ ok: false, error: "Invalid payload" }, { status: 400 });
  }
}