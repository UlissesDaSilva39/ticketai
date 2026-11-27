import Link from "next/link";
import { sellerFeeRate } from "@/lib/fees";
import { getTier } from "@/lib/pro";
import { notFound } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import { displayName, pricesOf } from "@/lib/licensing/server";
import { isLicenceType } from "@/lib/licensing/agreement";
import DealForm from "./DealForm";

export const dynamic = "force-dynamic";

export default async function LicenceDealPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { id } = await params;
  const sp = await searchParams;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();

  const supabase = await createServerSupabase();
  const [{ data: listing }, { data: auth }] = await Promise.all([
    supabase
      .from("licence_listings")
      .select("id, owner_id, track_title, artist_name, genre, isrc, composer, publisher, description, cover_url, preview_url, price_creator, price_commercial, price_sync, deals_count, status")
      .eq("id", id)
      .maybeSingle(),
    supabase.auth.getUser(),
  ]);
  if (!listing || listing.status === "deleted") notFound();

  const { data: owner } = await supabase.from("profiles").select("full_name, username").eq("id", listing.owner_id).maybeSingle();
  const user = auth.user;
  const initialType = typeof sp.licence === "string" && isLicenceType(sp.licence) ? sp.licence : null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 py-8 sm:py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <Link href="/licensing" className="text-xs font-semibold text-gray-500 hover:text-emerald-600 mb-6 inline-block">
          ← GRID Licensing
        </Link>

        {sp.cancelled === "1" && (
          <p className="mb-6 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 text-amber-800 dark:text-amber-300 px-4 py-3 text-sm">
            Payment cancelled. You haven&apos;t been charged, and no licence was created.
          </p>
        )}

        <DealForm
          listing={{
            id: listing.id,
            trackTitle: listing.track_title,
            artistName: listing.artist_name,
            genre: listing.genre,
            isrc: listing.isrc,
            composer: listing.composer,
            publisher: listing.publisher,
            description: listing.description,
            coverUrl: listing.cover_url,
            previewUrl: listing.preview_url,
            prices: pricesOf(listing),
            dealsCount: listing.deals_count,
            active: listing.status === "active",
            feeRate: sellerFeeRate(await getTier(listing.owner_id)),
          }}
          licensorName={displayName(owner)}
          viewer={user ? { signedIn: true, isOwner: user.id === listing.owner_id } : { signedIn: false, isOwner: false }}
          initialType={initialType}
        />
      </div>
    </div>
  );
}
