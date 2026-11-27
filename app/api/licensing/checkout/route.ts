import { NextRequest, NextResponse } from "next/server";
import { sellerFeeRate, feePercentLabel } from "@/lib/fees";
import { getTier } from "@/lib/pro";
import { stripe } from "@/lib/stripe";
import { createServerSupabase } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import {
  AGREEMENT_VERSION,
  LICENCE_INFO,
  buildAgreement,
  gridFeeFor,
  isLicenceType,
  sha256Hex,
  todayUtc,
} from "@/lib/licensing/agreement";
import { displayName, pricesOf } from "@/lib/licensing/server";

export const dynamic = "force-dynamic";

// POST /api/licensing/checkout
// { listingId, licenceType, projectTitle, legalName, agreed: true, agreementVersion }
// Freezes the agreement the buyer accepted (text + SHA-256 + name, time, IP),
// creates a pending deal and a Stripe Checkout session (licence fee + 10% GRID fee).
export async function POST(req: NextRequest) {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Please log in to licence this track." }, { status: 401 });
  if (!rateLimit(`licence-checkout:${user.id}`, 20, 60 * 60 * 1000).ok) {
    return NextResponse.json({ error: "Too many attempts. Try again later." }, { status: 429 });
  }

  const b = await req.json().catch(() => ({}));
  const listingId = String(b.listingId ?? "");
  const licenceType = b.licenceType;
  const projectTitle = String(b.projectTitle ?? "").trim().slice(0, 200);
  const legalName = String(b.legalName ?? "").trim().replace(/\s+/g, " ").slice(0, 200);

  if (!/^[0-9a-f-]{36}$/i.test(listingId)) return NextResponse.json({ error: "Track not found." }, { status: 404 });
  if (!isLicenceType(licenceType)) return NextResponse.json({ error: "Choose a licence type." }, { status: 400 });
  if (projectTitle.length < 2) return NextResponse.json({ error: "Tell us the name of your project." }, { status: 400 });
  if (legalName.length < 2) return NextResponse.json({ error: "Type your full legal name to sign." }, { status: 400 });
  if (b.agreed !== true) return NextResponse.json({ error: "Please tick the box to accept the licence agreement." }, { status: 400 });
  if (b.agreementVersion !== AGREEMENT_VERSION) {
    return NextResponse.json({ error: "The agreement has been updated. Please refresh the page and review it again." }, { status: 409 });
  }

  const admin = createAdminClient();
  const { data: listing } = await admin
    .from("licence_listings")
    .select("id, owner_id, track_title, artist_name, isrc, composer, publisher, price_creator, price_commercial, price_sync, status")
    .eq("id", listingId)
    .maybeSingle();
  if (!listing || listing.status !== "active") return NextResponse.json({ error: "This track is no longer available to licence." }, { status: 404 });
  if (listing.owner_id === user.id) return NextResponse.json({ error: "You can't licence your own track." }, { status: 400 });

  const amount = pricesOf(listing)[licenceType];
  if (!amount) return NextResponse.json({ error: "That licence type isn't offered for this track." }, { status: 400 });
  // Premium licensors pay a lower GRID fee (the buyer pays less too).
  const feeRate = sellerFeeRate(await getTier(listing.owner_id));
  const fee = gridFeeFor(amount, feeRate);

  const { data: owner } = await admin.from("profiles").select("full_name, username").eq("id", listing.owner_id).maybeSingle();
  const agreementText = buildAgreement({
    licenceType,
    trackTitle: listing.track_title,
    artistName: listing.artist_name,
    isrc: listing.isrc,
    composer: listing.composer,
    publisher: listing.publisher,
    licensorName: displayName(owner),
    licenseeName: legalName,
    projectTitle,
    licenceFeePence: amount,
    effectiveDate: todayUtc(),
    feeRate,
  });

  const { data: deal, error } = await admin
    .from("licence_deals")
    .insert({
      listing_id: listing.id,
      buyer_id: user.id,
      seller_id: listing.owner_id,
      licence_type: licenceType,
      project_title: projectTitle,
      buyer_legal_name: legalName,
      amount_pence: amount,
      fee_pence: fee,
      total_pence: amount + fee,
      agreement_version: AGREEMENT_VERSION,
      agreement_text: agreementText,
      agreement_sha256: await sha256Hex(agreementText),
      accepted_ip: clientIp(req.headers),
      accepted_user_agent: (req.headers.get("user-agent") ?? "").slice(0, 300) || null,
    })
    .select("id")
    .single();
  if (error || !deal) {
    console.error("[licensing/checkout]", error?.message);
    return NextResponse.json({ error: "Could not start checkout. Please try again." }, { status: 500 });
  }

  const origin = req.headers.get("origin") ?? new URL(req.url).origin;
  const info = LICENCE_INFO[licenceType];
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      client_reference_id: user.id,
      customer_email: user.email ?? undefined,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "gbp",
            unit_amount: amount,
            product_data: { name: `${info.name}: "${listing.track_title}" by ${listing.artist_name}`, description: `Project: ${projectTitle}` },
          },
        },
        ...(fee > 0 ? [{ quantity: 1, price_data: { currency: "gbp", unit_amount: fee, product_data: { name: `GRID fee (${feePercentLabel(feeRate)})` } } }] : []),
      ],
      metadata: { type: "licence", deal_id: deal.id, listing_id: listing.id, user_id: user.id },
      payment_intent_data: { metadata: { type: "licence", deal_id: deal.id } },
      success_url: `${origin}/licences/${deal.id}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/licensing/deal/${listing.id}?licence=${licenceType}&cancelled=1`,
    });
    await admin.from("licence_deals").update({ stripe_session_id: session.id }).eq("id", deal.id);
    return NextResponse.json({ url: session.url });
  } catch (e) {
    await admin.from("licence_deals").update({ status: "cancelled" }).eq("id", deal.id);
    console.error("[licensing/checkout] stripe", e);
    return NextResponse.json({ error: "Payments aren't available right now. Please try again." }, { status: 502 });
  }
}
