'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Service } from '@/lib/artists';

type Props = {
  artistSlug: string;
  artistName: string;
  services: Service[];
};

function parsePrice(price: string): { amount: number } | null {
  const m = price.match(/([£€$])?\s*([\d,]+)/);
  if (!m) return null;
  return { amount: Number(m[2].replace(/,/g, '')) };
}

function formatMoney(n: number): string {
  return `£${n.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function BookingFlow({ artistSlug, artistName, services }: Props) {
  const [service, setService] = useState(services[0]?.label ?? '');
  const [date, setDate] = useState('');
  const [details, setDetails] = useState('');
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selected = services.find((s) => s.label === service);
  const parsed = selected ? parsePrice(selected.price) : null;
  const total = parsed?.amount ?? 0;
  const deposit = Math.round(total * 0.3 * 100) / 100;
  const balance = Math.round((total - deposit) * 100) / 100;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!service) { setError('Please select a service.'); return; }
    if (!date) { setError('Please select a start date.'); return; }
    if (details.trim().length < 10) {
      setError('Please describe your project (at least 10 characters).');
      return;
    }

    setSending(true);
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ artistSlug, service, date, details: details.trim() }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? 'Booking failed');
      }

      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setSending(false);
    }
  }

  if (done) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 text-xl">
          ✓
        </div>
        <p className="mt-4 text-base font-semibold">Booking requested</p>
        <p className="mt-1 text-sm text-neutral-600">
          {artistName} will confirm shortly. You&apos;ll be asked to pay a
          deposit of {formatMoney(deposit)} once confirmed.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href={`/artists/${artistSlug}`}
            className="rounded-full border border-neutral-300 bg-white px-6 py-2.5 text-sm font-semibold text-neutral-900 hover:border-neutral-900"
          >
            Back to profile
          </Link>
          <Link
            href="/dashboard/bookings"
            className="rounded-full bg-black px-6 py-2.5 text-sm font-semibold text-white hover:bg-neutral-800"
          >
            View my bookings
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      <section>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
          1. Select a service
        </h2>
        <div className="mt-3 space-y-2">
          {services.map((s) => (
            <label
              key={s.label}
              className={
                'flex cursor-pointer items-center justify-between rounded-xl border p-4 transition ' +
                (service === s.label
                  ? 'border-black bg-neutral-50'
                  : 'border-neutral-200 bg-white hover:border-neutral-400')
              }
            >
              <span className="flex items-center gap-3">
                <input
                  type="radio"
                  name="service"
                  value={s.label}
                  checked={service === s.label}
                  onChange={(e) => setService(e.target.value)}
                  className="h-4 w-4"
                />
                <span className="text-sm font-medium">{s.label}</span>
              </span>
              <span className="text-sm font-semibold">{s.price}</span>
            </label>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
          2. Choose a start date
        </h2>
        <input
          type="date"
          value={date}
          min={new Date().toISOString().slice(0, 10)}
          onChange={(e) => setDate(e.target.value)}
          className="mt-3 w-full max-w-xs rounded-xl border border-neutral-300 px-4 py-3 text-sm outline-none focus:border-black"
        />
      </section>

      <section>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
          3. Describe your project
        </h2>
        <textarea
          value={details}
          onChange={(e) => setDetails(e.target.value.slice(0, 1000))}
          rows={5}
          placeholder="Tell the artist what you need — reference tracks, deliverable, timeline, budget, anything relevant."
          className="mt-3 w-full resize-none rounded-xl border border-neutral-300 px-4 py-3 text-sm outline-none focus:border-black"
        />
        <p className="mt-1 text-right text-xs text-neutral-400">{details.length} / 1000</p>
      </section>

      {parsed && (
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
            4. Deposit
          </h2>
          <div className="mt-3 rounded-2xl border border-neutral-200 bg-white p-5">
            <dl className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-neutral-600">Total</dt>
                <dd className="font-semibold">{formatMoney(total)}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-neutral-600">Deposit due now (30%)</dt>
                <dd className="font-semibold">{formatMoney(deposit)}</dd>
              </div>
              <div className="flex items-center justify-between border-t border-neutral-200 pt-3">
                <dt className="text-neutral-600">Balance on completion</dt>
                <dd className="font-semibold">{formatMoney(balance)}</dd>
              </div>
            </dl>
            <div className="mt-5 space-y-2 border-t border-neutral-200 pt-4 text-xs text-neutral-500">
              <p>🔒 Secure payment via Stripe — funds held until 24h before start</p>
              <p>📝 Contract auto-generated on confirmation</p>
              <p>💸 Artist payout lands the morning after completion</p>
            </div>
          </div>
        </section>
      )}

      {error && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
      )}

      <section className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={sending}
          className="rounded-full bg-black px-7 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {sending ? 'Sending…' : `Request booking${parsed ? ` — ${formatMoney(deposit)} deposit` : ''}`}
        </button>
        <Link
          href={`/artists/${artistSlug}`}
          className="text-sm font-medium text-neutral-600 hover:text-black"
        >
          Cancel
        </Link>
      </section>

      <p className="text-xs text-neutral-500">
        No charge until the artist confirms. You can cancel without penalty until 24h before the start date.
      </p>
    </form>
  );
}