'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CartProvider } from '@/components/merch/CartProvider';
import { useCart, parsePoundsToPence, formatPence } from '@/lib/cart';

// In a real app this would come from the DB. For now, a small lookup.
const CATALOGUE: Record<string, { id: string; name: string; price: string; image: string; description: string; sizes?: string[]; stock?: number; artistName: string }> = {
  'elena-logo-tee': {
    id: 'm1',
    name: 'Elena Petrova Logo Tee',
    price: '£25',
    image: '/img/merch-tee.svg',
    description: '100% organic cotton tee. Logo print on front, tour dates on back. Printed in Portugal.',
    sizes: ['S', 'M', 'L', 'XL'],
    artistName: 'Elena Petrova',
  },
  'elena-vinyl': {
    id: 'm2',
    name: 'A&R Sessions Vinyl',
    price: '£30',
    image: '/img/merch-vinyl.svg',
    description: 'Limited pressing of the A&R Sessions catalogue. 180g black vinyl, gatefold sleeve.',
    stock: 12,
    artistName: 'Elena Petrova',
  },
  'elena-zine': {
    id: 'm3',
    name: 'Studio Notes Zine',
    price: '£15',
    image: '/img/merch-zine.svg',
    description: '48-page zine with session notes, sketches, and unreleased lyric fragments.',
    stock: 50,
    artistName: 'Elena Petrova',
  },
};

type Params = { params: Promise<{ slug: string }> };

function ProductDetail({ slug }: { slug: string }) {
  const product = CATALOGUE[slug];
  if (!product) return notFound();

  const { add } = useCart();
  const [size, setSize] = useState(product.sizes?.[0] ?? '');
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  function handleAdd() {
    add(
      {
        id: product.id,
        slug: `/merch/${slug}`,
        name: product.name,
        price: parsePoundsToPence(product.price),
        image: product.image,
        size: size || undefined,
      },
      quantity
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  const pricePence = parsePoundsToPence(product.price);

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <Link href="/merch" className="inline-flex items-center gap-1 text-sm text-neutral-500 hover:text-black">
        ← Back to merch
      </Link>

      <div className="mt-6 grid gap-10 md:grid-cols-2">
        <div className="aspect-square w-full overflow-hidden rounded-2xl bg-neutral-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
            {product.artistName}
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight">{product.name}</h1>
          <p className="mt-4 text-2xl font-bold">{product.price}</p>

          {typeof product.stock === 'number' && (
            <p className="mt-1 text-xs text-neutral-500">{product.stock} in stock</p>
          )}

          <p className="mt-5 text-base text-neutral-700">{product.description}</p>

          {product.sizes && (
            <div className="mt-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Size</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSize(s)}
                    className={
                      'rounded-full border px-4 py-2 text-sm font-medium transition ' +
                      (size === s
                        ? 'border-black bg-black text-white'
                        : 'border-neutral-300 bg-white text-neutral-900 hover:border-neutral-900')
                    }
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Quantity</p>
            <div className="mt-2 inline-flex items-center gap-3 rounded-full border border-neutral-300 px-3 py-1">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="h-7 w-7 rounded-full hover:bg-neutral-100"
                aria-label="Decrease"
              >
                −
              </button>
              <span className="w-6 text-center text-sm font-semibold">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                className="h-7 w-7 rounded-full hover:bg-neutral-100"
                aria-label="Increase"
              >
                +
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={handleAdd}
            className={
              'mt-8 w-full rounded-full py-4 text-sm font-semibold transition ' +
              (added
                ? 'bg-emerald-600 text-white'
                : 'bg-black text-white hover:bg-neutral-800')
            }
          >
            {added ? `✓ Added — ${formatPence(pricePence * quantity)}` : `Add to cart — ${formatPence(pricePence * quantity)}`}
          </button>

          <div className="mt-6 space-y-2 text-xs text-neutral-500">
            <p>🚚 Ships within 3–5 business days</p>
            <p>🔒 Secure payment via Stripe</p>
            <p>↩️ 14-day returns</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MerchProductPage({ params }: Params) {
  const { slug } = use(params);
  return (
    <CartProvider>
      <ProductDetail slug={slug} />
    </CartProvider>
  );
}