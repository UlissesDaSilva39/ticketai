'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart, formatPence } from '@/lib/cart';

export function CartDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { items, subtotal, itemCount, setQty, remove } = useCart();
  const [checkingOut, setCheckingOut] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function checkout() {
    setError(null);
    setCheckingOut(true);
    try {
      const res = await fetch('/api/merch/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? 'Checkout failed');
      }
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setCheckingOut(false);
    }
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex justify-end bg-black/50"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Shopping cart"
    >
      <aside
        className="flex h-full w-full max-w-md flex-col bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center justify-between border-b border-neutral-200 px-5 py-4">
          <h2 className="text-base font-semibold">
            Cart {itemCount > 0 && <span className="text-neutral-500">({itemCount})</span>}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close cart"
            className="rounded-full p-2 text-neutral-500 hover:bg-neutral-100"
          >
            ✕
          </button>
        </header>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
            <p className="text-base font-semibold">Your cart is empty</p>
            <p className="mt-1 text-sm text-neutral-500">
              Add merch from any artist profile.
            </p>
            <Link
              href="/artists"
              className="mt-6 rounded-full bg-black px-6 py-2.5 text-sm font-semibold text-white hover:bg-neutral-800"
              onClick={onClose}
            >
              Browse artists →
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-neutral-200 overflow-y-auto">
              {items.map((item) => (
                <li key={`${item.id}-${item.size ?? ''}`} className="flex gap-4 px-5 py-4">
                  <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-neutral-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{item.name}</p>
                    {item.size && (
                      <p className="text-xs text-neutral-500">Size {item.size}</p>
                    )}
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setQty(item.id, item.size, item.quantity - 1)}
                        className="h-7 w-7 rounded-full border border-neutral-300 text-sm hover:border-neutral-900"
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span className="w-6 text-center text-sm">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => setQty(item.id, item.size, item.quantity + 1)}
                        className="h-7 w-7 rounded-full border border-neutral-300 text-sm hover:border-neutral-900"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                      <button
                        type="button"
                        onClick={() => remove(item.id, item.size)}
                        className="ml-auto text-xs text-neutral-500 hover:text-red-600"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  <p className="text-sm font-semibold">
                    {formatPence(item.price * item.quantity)}
                  </p>
                </li>
              ))}
            </ul>

            <footer className="border-t border-neutral-200 p-5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-600">Subtotal</span>
                <span className="text-base font-semibold">{formatPence(subtotal)}</span>
              </div>
              <p className="mt-1 text-xs text-neutral-500">
                Shipping calculated at checkout
              </p>

              {error && (
                <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">
                  {error}
                </p>
              )}

              <button
                type="button"
                onClick={checkout}
                disabled={checkingOut}
                className="mt-4 w-full rounded-full bg-black py-3 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:opacity-60"
              >
                {checkingOut ? 'Redirecting…' : `Checkout — ${formatPence(subtotal)}`}
              </button>

              <p className="mt-3 text-center text-xs text-neutral-500">
                🔒 Secure payment via Stripe
              </p>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}