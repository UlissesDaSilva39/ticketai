"use client";
import Link from "next/link";
type MerchItem = {
  id: string; artist_id: string; title: string; description: string | null;
  price_pence: number; currency: string; image_url: string | null;
  external_url: string | null; stock: number | null;
};
function formatPrice(p: number, c: string): string {
  const s = c === "GBP" ? "\u00A3" : c === "USD" ? "$" : c === "EUR" ? "\u20AC" : "";
  const v = (p / 100).toFixed(2);
  return s ? s + v : v + " " + c;
}
export default function EventArtistMerch({ items, viewAllHref }: { items: MerchItem[]; viewAllHref?: string }) {
  if (items.length === 0) return null;
  return (
    <section className="mt-10">
      <div className="flex items-end justify-between mb-4 flex-wrap gap-2">
        <div>
          <h2 className="text-2xl font-bold uppercase" style={{ fontFamily: "var(--font-antonio)" }}>Merch</h2>
          <p className="text-xs text-gray-500 mt-1">Support the artist directly</p>
        </div>
        {viewAllHref ? (
          <Link href={viewAllHref} className="text-xs font-medium underline text-gray-700 hover:text-black">View all</Link>
        ) : null}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((item) => {
          const inStock = item.stock === null || item.stock > 0;
          return (
            <Link key={item.id} href={"/merch/" + item.id} className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg hover:border-gray-300 transition-all">
              <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center relative overflow-hidden">
                {item.image_url ? (
                  <img src={item.image_url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                ) : (
                  <span className="text-5xl font-bold text-gray-400 opacity-60">{item.title.charAt(0).toUpperCase()}</span>
                )}
                {!inStock ? (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="text-white text-xs font-bold uppercase tracking-wider">Sold out</span>
                  </div>
                ) : (
                  <div className="absolute inset-x-0 bottom-0 bg-black/70 text-white text-[11px] font-bold uppercase tracking-wider text-center py-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300">View details</div>
                )}
              </div>
              <div className="p-3">
                <p className="text-sm font-semibold truncate">{item.title}</p>
                {item.description ? <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">{item.description}</p> : null}
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm font-bold">{formatPrice(item.price_pence, item.currency)}</span>
                  {item.stock !== null && item.stock > 0 && item.stock <= 20 ? (
                    <span className="text-[10px] font-semibold text-amber-600">Only {item.stock} left</span>
                  ) : item.stock !== null ? (
                    <span className="text-[10px] text-gray-400">{item.stock} left</span>
                  ) : null}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}