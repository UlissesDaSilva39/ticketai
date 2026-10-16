import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createServerSupabase } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ username: string }> };

type Artist = {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
};

type Merch = {
  id: string;
  title: string;
  description: string | null;
  price_pence: number;
  currency: string;
  image_url: string | null;
  stock: number | null;
};

function formatPrice(pence: number, currency: string): string {
  const symbol =
    currency === "GBP" ? "\u00A3" : currency === "USD" ? "$" : currency === "EUR" ? "\u20AC" : "";
  const v = (pence / 100).toFixed(2);
  return symbol ? symbol + v : v + " " + currency;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  const supabase = await createServerSupabase();
  const { data } = await supabase
    .from("profiles")
    .select("full_name, username")
    .eq("username", username)
    .maybeSingle();
  if (!data) return { title: "Artist not found" };
  const name = data.full_name || data.username || username;
  return { title: name + " merch", description: "Merch from " + name };
}

export default async function ArtistMerchListingPage({ params }: Props) {
  const { username } = await params;
  const supabase = await createServerSupabase();

  const { data: artistRow } = await supabase
    .from("profiles")
    .select("id, username, full_name, avatar_url")
    .eq("username", username)
    .maybeSingle();

  if (!artistRow) notFound();
  const artist = artistRow as Artist;
  const name = artist.full_name || artist.username || username;

  const { data: merchRows } = await supabase
    .from("merch")
    .select("id, title, description, price_pence, currency, image_url, stock")
    .eq("artist_id", artist.id)
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  const items = (merchRows || []) as Merch[];

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <nav className="mb-4 text-xs text-gray-500">
          <Link href={"/artists/" + username} className="hover:text-black">
            {name}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-800">Merch</span>
        </nav>

        <header className="mb-8 flex items-center gap-4">
          {artist.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={artist.avatar_url}
              alt={name}
              className="w-16 h-16 rounded-full object-cover"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-black text-white grid place-items-center text-lg font-bold">
              {name.slice(0, 2).toUpperCase()}
            </div>
          )}
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{name}</h1>
            <p className="text-sm text-gray-500 mt-1">
              {items.length} {items.length === 1 ? "product" : "products"}
            </p>
          </div>
        </header>

        {items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center">
            <p className="text-sm font-medium text-gray-900">No merch yet</p>
            <p className="mt-1 text-xs text-gray-500">
              This artist hasn&apos;t added any products.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {items.map((m) => {
              const inStock = m.stock === null || m.stock > 0;
              return (
                <Link
                  key={m.id}
                  href={"/merch/" + m.id}
                  className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg hover:border-gray-300 transition-all"
                >
                  <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden">
                    {m.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={m.image_url}
                        alt={m.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <span className="text-5xl font-bold text-gray-400 opacity-60">
                        {m.title.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-semibold truncate">{m.title}</p>
                    {m.description ? (
                      <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">
                        {m.description}
                      </p>
                    ) : null}
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm font-bold">
                        {formatPrice(m.price_pence, m.currency)}
                      </span>
                      {!inStock ? (
                        <span className="text-[10px] font-semibold text-red-600">Sold out</span>
                      ) : m.stock !== null ? (
                        <span className="text-[10px] text-gray-400">{m.stock} left</span>
                      ) : null}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}