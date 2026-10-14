import Link from "next/link";

type MerchItem = {
  id: string;
  artist_id: string;
  title: string;
  description: string | null;
  price_pence: number;
  currency: string;
  image_url: string | null;
  external_url: string | null;
  stock: number | null;
};

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

export default function EventArtistMerch({ items }: { items: MerchItem[] }) {
  if (items.length === 0) return null;

  return (
    <section className="mt-10">
      <h2
        className="text-2xl font-bold uppercase mb-4"
        style={{ fontFamily: "var(--font-antonio)" }}
      >
        Artist merch
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((item) => {
          const inStock = item.stock === null || item.stock > 0;
          const href = item.external_url || "#";

          return (
            <Link
              key={item.id}
              href={href}
              target={item.external_url ? "_blank" : undefined}
              rel={item.external_url ? "noopener noreferrer" : undefined}
              className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center relative overflow-hidden">
                {item.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <span className="text-5xl font-bold text-gray-400 opacity-60">
                    {item.title.charAt(0).toUpperCase()}
                  </span>
                )}
                {!inStock ? (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="text-white text-xs font-bold uppercase tracking-wider">
                      Sold out
                    </span>
                  </div>
                ) : null}
              </div>

              <div className="p-3">
                <p className="text-sm font-semibold truncate">{item.title}</p>
                {item.description ? (
                  <p className="text-xs text-gray-500 truncate mt-0.5">
                    {item.description}
                  </p>
                ) : null}
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm font-bold">
                    {formatPrice(item.price_pence, item.currency)}
                  </span>
                  {item.stock !== null ? (
                    <span className="text-[10px] text-gray-400">
                      {item.stock > 0 ? item.stock + " left" : "0"}
                    </span>
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