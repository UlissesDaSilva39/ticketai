import Link from "next/link";

const BENEFITS = ["Unlimited gig applications", "Priority in matched results", "Full post analytics"];

export default function ProTrialCard() {
  return (
    <section aria-label="GRID Pro" className="rounded-xl border border-amber-200 bg-gradient-to-br from-amber-50 to-amber-100 p-4 shadow-sm text-neutral-900">
      <h3 className="flex items-center gap-2 font-semibold">
        <span aria-hidden="true">&#9813;</span> Try GRID Pro
      </h3>
      <ul className="mt-3 space-y-2 text-sm text-neutral-800">
        {BENEFITS.map((b) => (
          <li key={b} className="flex items-start gap-2">
            <span className="text-emerald-700" aria-hidden="true">&#10003;</span>
            {b}
          </li>
        ))}
      </ul>
      <Link
        href="/pro"
        data-cta="pro-trial-card"
        className="mt-4 block rounded-lg bg-amber-400 py-2.5 text-center font-semibold text-neutral-900 hover:bg-amber-300"
      >
        Start free trial &rarr;
      </Link>
      <p className="mt-2 text-center text-xs text-neutral-600">&pound;0 for 30 days &middot; Cancel anytime</p>
    </section>
  );
}