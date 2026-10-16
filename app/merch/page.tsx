import Link from 'next/link';
import { CartProvider } from '@/components/merch/CartProvider';
import { MerchCard }    from '@/components/merch/MerchCard';
import { getArtists }   from '@/lib/artists';

export const metadata = {
  title: 'Merch — GRID',
  description: 'Shop merch directly from artists. No middlemen.',
};

export default async function AllMerchPage() {
  const artists = await getArtists();

  const items = artists.flatMap((a) =>
    (a.merch ?? []).map((m) => ({ ...m, artistSlug: a.slug, artistName: a.name }))
  );

  return (
    <CartProvider>
      <div className="mx-auto max-w-6xl px-6 py-10">
        <header>
          <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
            Merch
          </p>
          <h1 className="mt-2 text-4xl font-black tracking-tight">
            Shop directly from artists
          </h1>
          <p className="mt-3 max-w-2xl text-base text-neutral-600">
            Every purchase goes straight to the artist, minus a 3% platform fee.
            No venue cut, no middlemen.
          </p>
        </header>

        {items.length === 0 ? (
          <div className="mt-12 rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 p-12 text-center">
            <p className="text-base font-semibold">No merch yet</p>
            <p className="mt-1 text-sm text-neutral-500">
              Artists haven&apos;t listed any products.
            </p>
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <MerchCard key={item.id} item={item} artistSlug={item.artistSlug} />
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <Link href="/artists" className="text-sm font-semibold text-neutral-600 hover:text-black">
            ← Back to artists
          </Link>
        </div>
      </div>
    </CartProvider>
  );
}