const ITEMS: { big: string; small: string }[] = [
  { big: "10,000+", small: "artists and venues" },
  { big: "Escrow", small: "payments on every deal" },
  { big: "Verified", small: "badges build trust" },
];

export default function TrustStrip() {
  return (
    <section aria-label="Why GRID" className="grid grid-cols-3 gap-2 rounded-xl border border-neutral-200 bg-white p-3 text-center text-neutral-900">
      {ITEMS.map((i) => (
        <div key={i.big}>
          <p className="text-base font-bold">{i.big}</p>
          <p className="text-xs text-neutral-600">{i.small}</p>
        </div>
      ))}
    </section>
  );
}