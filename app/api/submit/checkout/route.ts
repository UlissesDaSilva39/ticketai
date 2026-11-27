import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createServerSupabase } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { rateLimit } from "@/lib/rate-limit";
import { REVIEWER_SHARE, SUBMISSION_PRICE, isSubmissionKind } from "@/lib/submissions/catalog";
import { cleanHttpsUrl } from "@/lib/ads/server";

export const dynamic = "force-dynamic";
const UUID = /^[0-9a-f-]{36}$/i;

// POST /api/submit/checkout { reviewerId, kind, title, trackUrl, message } -> Stripe Checkout URL.
export async function POST(req: NextRequest) {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Please log in to send." }, { status: 401 });
  if (!rateLimit(`submit:${user.id}`, 30, 60 * 60 * 1000).ok) return NextResponse.json({ error: "Too many attempts. Try again later." }, { status: 429 });

  const b = await req.json().catch(() => ({}));
  if (!isSubmissionKind(b.kind) || typeof b.reviewerId !== "string" || !UUID.test(b.reviewerId)) return NextResponse.json({ error: "Choose who to send to." }, { status: 400 });
  if (b.reviewerId === user.id) return NextResponse.json({ error: "You can't send to yourself." }, { status: 400 });
  const message = typeof b.message === "string" ? b.message.trim() : "";
  if (!message || message.length > 1000) return NextResponse.json({ error: "Write a short message (up to 1,000 characters)." }, { status: 400 });
  const title = typeof b.title === "string" ? b.title.trim().slice(0, 120) : "";
  const track = b.kind === "demo" ? cleanHttpsUrl(b.trackUrl) : null;
  if (b.kind === "demo" && (!track || !title)) return NextResponse.json({ error: "Add your track title and an https:// link (SoundCloud, YouTube, Dropbox, GRID…)." }, { status: 400 });

  const admin = createAdminClient();
  const { data: reviewer } = await admin.from("reviewers").select("active, accepts_demos, accepts_messages").eq("user_id", b.reviewerId).maybeSingle();
  if (!reviewer?.active || (b.kind === "demo" ? !reviewer.accepts_demos : !reviewer.accepts_messages)) {
    return NextResponse.json({ error: "They aren't accepting this right now." }, { status: 409 });
  }
  const { count } = await admin.from("submissions").select("id", { count: "exact", head: true }).eq("sender_id", user.id).eq("reviewer_id", b.reviewerId).eq("status", "sent");
  if ((count ?? 0) > 0) return NextResponse.json({ error: "Wait for their reply before sending them another one." }, { status: 409 });

  const price = SUBMISSION_PRICE[b.kind as "demo" | "message"];
  const { data: row, error } = await admin
    .from("submissions")
    .insert({ kind: b.kind, sender_id: user.id, reviewer_id: b.reviewerId, title: title || null, track_url: track, message, amount_pence: price, reviewer_earn_pence: Math.floor(price * REVIEWER_SHARE) })
    .select("id")
    .single();
  if (error || !row) {
    console.error("[submit/checkout]", error?.message);
    return NextResponse.json({ error: "Submissions are being set up. Please try again soon." }, { status: 500 });
  }
  const origin = req.headers.get("origin") ?? new URL(req.url).origin;
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    client_reference_id: user.id,
    customer_email: user.email ?? undefined,
    line_items: [{ quantity: 1, price_data: { currency: "gbp", unit_amount: price, product_data: { name: b.kind === "demo" ? "GRID demo submission" : "GRID priority message", description: "Guaranteed reply within 7 days or a full refund" } } }],
    metadata: { type: "submission", submission_id: row.id, user_id: user.id },
    success_url: `${origin}/submit?tab=sent&sent=success&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/submit?sent=cancelled`,
  });
  await admin.from("submissions").update({ stripe_session_id: session.id }).eq("id", row.id);
  return NextResponse.json({ url: session.url });
}
