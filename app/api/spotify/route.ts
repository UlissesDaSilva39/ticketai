import { NextResponse } from "next/server";

let cachedToken: string | null = null;
let tokenExpiry: number = 0;

async function getAccessToken() {
  if (cachedToken && Date.now() < tokenExpiry) return cachedToken;
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  if (!clientId || !clientSecret) throw new Error("Spotify credentials missing");

  const auth = Buffer.from(clientId + ":" + clientSecret).toString("base64");
  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { "Authorization": "Basic " + auth, "Content-Type": "application/x-www-form-urlencoded" },
    body: "grant_type=client_credentials",
  });
  if (!res.ok) throw new Error("Failed to get Spotify token");
  const data = await res.json();
  cachedToken = data.access_token;
  tokenExpiry = Date.now() + (data.expires_in - 100) * 1000;
  return cachedToken;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");
  if (!query) return NextResponse.json({ error: "Missing query" }, { status: 400 });

  try {
    const token = await getAccessToken();
    const searchUrl = "https://api.spotify.com/v1/search?q=" + encodeURIComponent(query) + "&type=artist&limit=1";
    const res = await fetch(searchUrl, { headers: { "Authorization": "Bearer " + token } });
    if (!res.ok) throw new Error("Spotify search failed");
    const data = await res.json();
    const artist = data.artists?.items?.[0];
    if (!artist) return NextResponse.json({ found: false });

    return NextResponse.json({
      found: true,
      id: artist.id,
      name: artist.name,
      followers: artist.followers?.total || 0,
      image: artist.images?.[0]?.url || null,
      spotifyUrl: artist.external_urls?.spotify || null,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}