import Link from "next/link";
import { Info } from "lucide-react";
import { promotedMerch } from "@/data/merch";

export function PromotedMerch() {
  return (
    <section className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4">
      <header className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold">Promoted Merch</h3>
        <span className="flex items-center gap-1 text-[11px] text-neutral-500">
          Sponsored <Info size={12} />
        </span>
      </header>

      <ul className="space-y-3">
        {promotedMerch.map(p => (
          <li key={p.id} className="flex gap-3">
            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-neutral-800">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.image} alt={p.name} className="h-full w-full object-cover" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{p.name}</p>
              <p className="text-xs text-neutral-400">{p.artistName} · £{p.price.toFixed(2)}</p>
              <div className="mt-2 flex gap-2">
                <Link href={`/artist/${p.artistSlug}/merch/${p.slug}`}
                      className="rounded-md bg-white px-2.5 py-1 text-xs font-medium text-black">
                  Buy now
                </Link>
                <Link href={`/artist/${p.artistSlug}/merch`}
                      className="rounded-md border border-neutral-700 px-2.5 py-1 text-xs">
                  View shop
                </Link>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <Link href="/artist/dj-poxy/merch"
            className="mt-3 block text-center text-xs text-neutral-400 hover:text-white">
        See all merch →
      </Link>
    </section>
  );
}