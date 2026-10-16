'use client';

import { useState } from 'react';
import Link from 'next/link';

type Props = {
  booking: {
    id: string;
    service: string;
    startDate: string;
    details: string;
    status: string;
    booker: { username: string; displayName: string };
  };
};

export function BookingRow({ booking }: Props) {
  const [busy, setBusy] = useState(false);
  const [localStatus, setLocalStatus] = useState(booking.status);
  const [showCounter, setShowCounter] = useState(false);
  const [counterPrice, setCounterPrice] = useState('');
  const [error, setError] = useState<string | null>(null);

  const startDate = new Date(booking.startDate).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  });

  async function action(path: string, body?: unknown) {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/bookings/${booking.id}/${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: body ? JSON.stringify(body) : undefined,
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? 'Action failed');
      }
      return await res.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      return null;
    } finally {
      setBusy(false);
    }
  }

  async function approve() {
    const res = await action('approve');
    if (res?.booking) setLocalStatus('confirmed');
  }

  async function decline() {
    if (!confirm('Decline this booking request?')) return;
    const res = await action('decline');
    if (res?.booking) setLocalStatus('declined');
  }

  async function submitCounter(e: React.FormEvent) {
    e.preventDefault();
    const price = Number(counterPrice);
    if (!Number.isFinite(price) || price <= 0) {
      setError('Enter a valid price');
      return;
    }
    const res = await action('counter', { price });
    if (res?.booking) {
      setShowCounter(false);
      setLocalStatus('countered');
    }
  }

  return (
    <li className="rounded-2xl border border-neutral-200 bg-white p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-semibold">{booking.booker.displayName}</p>
            <span className="text-xs text-neutral-500">@{booking.booker.username}</span>
            <span
              className={
                'rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ' +
                (localStatus === 'pending'
                  ? 'bg-amber-50 text-amber-700'
                  : localStatus === 'confirmed'
                  ? 'bg-emerald-50 text-emerald-700'
                  : localStatus === 'declined'
                  ? 'bg-red-50 text-red-700'
                  : localStatus === 'countered'
                  ? 'bg-blue-50 text-blue-700'
                  : 'bg-neutral-100 text-neutral-700')
              }
            >
              {localStatus}
            </span>
          </div>
          <p className="mt-2 text-sm font-medium text-neutral-900">{booking.service}</p>
          <p className="mt-0.5 text-xs text-neutral-500">Starts {startDate}</p>
        </div>
        <Link
          href={`/messages?to=${booking.booker.username}`}
          className="text-xs font-semibold text-neutral-600 hover:text-black"
        >
          Message →
        </Link>
      </div>

      <p className="mt-4 whitespace-pre-line text-sm text-neutral-700">
        {booking.details}
      </p>

      {error && (
        <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">
          {error}
        </p>
      )}

      {showCounter ? (
        <form onSubmit={submitCounter} className="mt-5 flex flex-wrap items-center gap-2">
          <input
            type="number"
            min="1"
            step="1"
            placeholder="Counter price (£)"
            value={counterPrice}
            onChange={(e) => setCounterPrice(e.target.value)}
            className="w-40 rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-black"
          />
          <button
            type="submit"
            disabled={busy}
            className="rounded-full bg-black px-4 py-2 text-xs font-semibold text-white hover:bg-neutral-800 disabled:opacity-60"
          >
            Send counter
          </button>
          <button
            type="button"
            onClick={() => setShowCounter(false)}
            className="text-xs text-neutral-500 hover:text-black"
          >
            Cancel
          </button>
        </form>
      ) : localStatus === 'pending' ? (
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={approve}
            disabled={busy}
            className="rounded-full bg-black px-5 py-2.5 text-sm font-semibold text-white hover:bg-neutral-800 disabled:opacity-60"
          >
            Approve & send contract
          </button>
          <button
            type="button"
            onClick={() => setShowCounter(true)}
            disabled={busy}
            className="rounded-full border border-neutral-300 bg-white px-5 py-2.5 text-sm font-semibold text-neutral-900 hover:border-neutral-900 disabled:opacity-60"
          >
            Counter
          </button>
          <button
            type="button"
            onClick={decline}
            disabled={busy}
            className="rounded-full px-4 py-2.5 text-sm font-medium text-red-600 hover:text-red-700 disabled:opacity-60"
          >
            Decline
          </button>
        </div>
      ) : localStatus === 'confirmed' ? (
        <p className="mt-5 text-xs text-neutral-500">
          Waiting for the deposit. The booker has been sent a Stripe checkout link.
        </p>
      ) : localStatus === 'countered' ? (
        <p className="mt-5 text-xs text-neutral-500">
          Counter offer sent. Waiting for the booker to respond.
        </p>
      ) : null}
    </li>
  );
}