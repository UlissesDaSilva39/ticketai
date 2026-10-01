 import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

function inferChannel(referrer: string | null | undefined): string {
  if (!referrer) return "Direct";
  const r = referrer.toLowerCase();
  if (r.includes("instagram.com")) return "Instagram";
  if (r.includes("facebook.com") || r.includes("fb.com") || r.includes("l.facebook.com")) return "Facebook";
  if (r.includes("google.com") || r.includes("googleadservices.com")) return "Google";
  if (r.includes("tiktok.com")) return "TikTok";
  if (r.includes("twitter.com") || r.includes("t.co") || r.includes("x.com")) return "Twitter/X";
  if (r.includes("mail.google.com") || r.includes("outlook.com") || r.includes("mail.yahoo.com")) return "Email";
  return "Organic";
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const { code, eventId, visitorId, referrer } = (body ?? {}) as {
    code?: string;
    eventId?: string;
    visitorId?: string;
    referrer?: string;
  };

  if (!code || !code.startsWith("tk_")) {
    return NextResponse.json({ ok: false }, { status: 200 });
  }

  const supabase = await createServerSupabase();

  const { data: campaign } = await supabase
    .from("campaigns")
    .select("id")
    .eq("tracking_code", code)
    .maybeSingle();

  if (!campaign) return NextResponse.json({ ok: false }, { status: 200 });

  const ua = req.headers.get("user-agent") || null;
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    null;

  const ipHash = ip ? Buffer.from(ip).toString("base64").slice(0, 24) : null;

  await supabase.from("campaign_events").insert({
    campaign_id: campaign.id,
    event_id: eventId ?? null,
    type: "click",
    visitor_id: visitorId ?? null,
    user_agent: ua,
    ip_hash: ipHash,
    referrer: referrer ?? null,
    channel: inferChannel(referrer),
  });

  await supabase.rpc("increment_campaign_clicks", {
    campaign_id_in: campaign.id,
  });

  return NextResponse.json({ ok: true });
}