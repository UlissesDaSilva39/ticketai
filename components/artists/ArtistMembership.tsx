import Link from 'next/link';
import type { Membership } from '@/lib/artists';

export function ArtistMembership({ membership }: { membership?: Membership }) {
  if (!membership) return null;

  return (
    <section className="rounded-3xl bg-neutral-900 p-8 text-white md:p-10">
      <div className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400">
          Support my work
        </p>
        <h2 className="mt-3 text-2xl font-black tracking-tight md:text-3xl">
          Join the {membership.tier}
        </h2>
        <p className="mt-3 text-xl font-bold">{membership.price}</p>

        <ul className="mt-5 space-y-2 text-sm text-neutral-200">
          {membership.perks.map((perk) => (
            <li key={perk}>✓ {perk}</li>
          ))}
        </ul>

        <Link
          href={membership.url}
          target="_blank"
          rel="noreferrer"
          className="mt-7 inline-flex rounded-full bg-white px-6 py-3 text-sm font-semibold text-black hover:bg-neutral-100"
        >
          Join the {membership.tier} →
        </Link>

        {membership.comparison && (
          <p className="mt-6 border-t border-neutral-700 pt-5 text-xs text-neutral-400">
            {membership.comparison}
          </p>
        )}
      </div>
    </section>
  );
}