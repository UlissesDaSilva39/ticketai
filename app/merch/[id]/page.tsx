import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createServerSupabase } from "@/lib/supabase/server";
import { Sidebar } from "@/components/sidebar/Sidebar";
import BuyMerchButton from "@/components/merch/BuyMerchButton";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

type MerchRow = {
  id: string;
  artist_id: string;
  title: string;
  description: string | null;
  price_pence: number;
  currency: string;
  image_url: string | null;
  external_url: string | null;
  checkout_url: string | null;
  stock: number | null;
  is_active: boolean;
};

type ArtistRow = {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  genre: string | null;
  city: string | null;
};

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function formatPrice(pence: number, currency: string): string {
  const symbol =
    currency === "GBP"
      ? "\u00A3"
      : currency === "USD"
      ? "$"
      : currency === "EUR"
      ? "\u20AC"
      : "";
  const value = (pence / 100).toFixed(2);
  return symbol ? symbol + value : value + " " + currency;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createServerSupabase();
  const { data } = await supabase
    .from("merch")
    .select("title, description")
    .eq("id", id)
    .maybeSingle();
  if (!data) return { title: "Product not found" };
  return {
    title: data.title,
    description: data.description ?? "Buy from an artist on GRID.",
  };
}

export default async function MerchDetailPage({ params }: Props) {
  const { id } = await params;
  if (!UUID_RE.test(id)) notFound();

  const supabase = await createServerSupabase();

  const { data: row } = await supabase
    .from("merch")
    .select(
      "id,artist_id,title,description,price_pence,currency,image_url,external_url,checkout_url,stock,is_active"
    )
    .eq("id", id)
    .maybeSingle();

  if (!row) notFound();
  const merch = row as MerchRow;

  const { data: artistRow } = await supabase
    .from("profiles")
    .select("id, username, full_name, avatar_url, bio, genre, city")
    .eq("id", merch.artist_id)
    .maybeSingle();

  const artist = (artistRow as ArtistRow) || null;
  const artistName = artist?.full_name || artist?.username || "Artist";
  const inStock = merch.stock === null || merch.stock > 0;

  return (
    <div className="bg-gray-50 min-h-screen pb-32">
      <div className="mx-auto max-w-[1400px] px-6 py-6 grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-3">
          <Sidebar />
        </div>

        <main className="col-span-12 lg:col-span-9 min-w-0">
          <nav className="mb-4 text-xs text-gray-500">
            <Link href="/merch" className="hover:text-black">Merch</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-800">{merch.title}</span>
          </nav>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Product image */}
            <div className="bg-white border border-gray-200 rounded-2xl aspect-square flex items-center justify-center overflow-hidden">
              {merch.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={merch.image_url}
                  alt={merch.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-8xl font-bold text-gray-300">
                  {merch.title.charAt(0).toUpperCase()}
                </span>
              )}
            </div>

            {/* Details */}
            <div className="flex flex-col">
              <h1
                className="text-3xl md:text-4xl font-bold uppercase leading-tight"
                style={{ fontFamily: "var(--font-antonio)" }}
              >
                {merch.title}
              </h1>

              <p className="text-3xl font-bold mt-3">
                {formatPrice(merch.price_pence, merch.currency)}
              </p>

              {merch.stock !== null ? (
                <p className={`text-sm mt-1 ${merch.stock > 0 ? "text-gray-600" : "text-red-600"}`}>
                  {merch.stock > 0
                    ? `${merch.stock} in stock`
                    : "Sold out"}
                </p>
              ) : null}

              {artist ? (
                <div className="mt-6 flex items-center gap-3">
                  {artist.avatar_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={artist.avatar_url}
                      alt={artistName}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 text-white flex items-center justify-center text-sm font-bold">
                      {artistName.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className="text-xs text-gray-500">Sold by</p>
                    <Link
                      href={artist.username ? `/artists/${artist.username}` : "#"}
                      className="text-sm font-bold hover:underline"
                    >
                      {artistName}
                    </Link>
                  </div>
                </div>
              ) : null}

              {merch.description ? (
                <div className="mt-6">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                    Description
                  </h2>
                  <p className="text-sm text-gray-800 whitespace-pre-line">
                    {merch.description}
                  </p>
                </div>
              ) : null}

              <div className="mt-8 pt-6 border-t border-gray-200">
                <BuyMerchButton
                  merchId={merch.id}
                  artistId={merch.artist_id}
                  externalUrl={merch.external_url}
                  checkoutUrl={merch.checkout_url}
                  inStock={inStock}
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}