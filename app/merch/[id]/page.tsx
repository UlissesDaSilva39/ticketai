import Link from 'next/link';
import { notFound } from 'next/navigation';

type Params = { params: Promise<{ id: string }> };

export default async function MerchProductPage({ params }: Params) {
  const { id } = await params;
  if (!id) notFound();

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <Link href="/merch" className="inline-flex items-center gap-1 text-sm text-neutral-500 hover:text-black">
        ← Back to merch
      </Link>

      <div className="mt-6 grid gap-8 md:grid-cols-2">
        <div className="aspect-square w-full overflow-hidden rounded-3xl border border-neutral-200 bg-neutral-100 flex items-center justify-center text-5xl font-black text-neutral-300">
          {id.charAt(0).toUpperCase()}
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
            Merch
          </p>
          <h1 className="mt-2 text-2xl font-black tracking-tight md:text-3xl">
            {id}
          </h1>
          <p className="mt-3 text-sm text-neutral-600">
            Limited edition item. Ships worldwide. 100% of proceeds go to the artist.
          </p>
          <p className="mt-5 text-2xl font-black">£5.00</p>

          <div className="mt-6 space-y-3">
            <label htmlFor="size" className="block text-sm font-semibold">Size</label>
            <select
              id="size"
              name="size"
              className="w-full rounded-xl border border-neutral-300 px-4 py-2.5 text-sm outline-none focus:border-neutral-900"
            >
              <option>S</option>
              <option>M</option>
              <option>L</option>
              <option>XL</option>
            </select>
          </div>

          <button
            type="button"
            className="mt-6 w-full rounded-full bg-black px-6 py-3 text-sm font-semibold text-white hover:bg-neutral-800"
          >
            Add to cart · £5.00
          </button>

          <p className="mt-4 text-xs text-neutral-500">
            Free shipping over £30 · 30-day returns · Secure checkout
          </p>
        </div>
      </div>
    </div>
  );
}