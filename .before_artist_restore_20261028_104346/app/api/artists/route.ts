// app/api/artists/route.ts
// Returns the artist list (with events / merch / clips).
// In production this would call the Spotify Web API for the embed data
// and your own DB for events + merch.

import { NextResponse } from "next/server";
import { artists } from "@/lib/artistData";

export async function GET() {
  return NextResponse.json({ artists });
}

// Follow endpoint placeholder (client calls POST /api/artists?action=follow)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { artistId } = body as { artistId?: string };

    if (!artistId) {
      return NextResponse.json(
        { ok: false, error: "artistId is required" },
        { status: 400 }
      );
    }

    // TODO: persist follow in your database here.
    // e.g. await db.follows.insert({ artistId, userId: session.user.id })

    return NextResponse.json({ ok: true, followed: true, artistId });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON body" },
      { status: 400 }
    );
  }
}