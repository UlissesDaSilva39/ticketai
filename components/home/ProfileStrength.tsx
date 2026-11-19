import Link from "next/link";

type Item = { label: string; done: boolean; href: string };

// PLACEHOLDER: connect this to the real profile data.
const DEFAULT_ITEMS: Item[] = [
  { label: "Add a profile photo", done: true, href: "/epk" },
  { label: "Add your genres", done: true, href: "/epk" },
  { label: "Upload a track", done: true, href: "/epk" },
  { label: "Get verified", done: false, href: "/verify" },
  { label: "Complete your EPK", done: false, href: "/epk" },
];

export default function ProfileStrength({ items = DEFAULT_ITEMS }: { items?: Item[] }) {
  const done = items.filter((i) => i.done).length;
  const pct = items.length ? Math.round((done / items.length) * 100) : 0;
  const next = items.find((i) => !i.done);

  return (
    <section aria-label="Profile strength" className="rounded-xl border border-neutral-200 bg-white p-4 text-neutral-900">
      <div className="flex items-center justify-between text-sm">
        <span className="font-semibold">Profile strength</span>
        <span className="font-semibold text-emerald-800">{pct}%</span>
      </div>
      <div
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Profile strength"
        className="mt-2 h-2 overflow-hidden rounded-full bg-neutral-200"
      >
        <div className="h-full rounded-full bg-emerald-600" style={{ width: pct + "%" }} />
      </div>
      {next ? (
        <p className="mt-2 text-xs text-neutral-600">
          Next:{" "}
          <Link href={next.href} data-cta="profile-next-step" className="font-semibold text-emerald-800 underline">
            {next.label}
          </Link>{" "}
          for better matches.
        </p>
      ) : (
        <p className="mt-2 text-xs text-neutral-600">Your profile is complete.</p>
      )}
    </section>
  );
}