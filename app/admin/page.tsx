import Link from "next/link";

// Admin index: each page below checks that the visitor is an admin.
const LINKS = [
  { href: "/admin/ads", title: "Ad review", text: "Approve or reject paid ads (rejecting refunds them)." },
  { href: "/admin/payouts", title: "Payouts", text: "Seller payout requests." },
  { href: "/admin/featured", title: "Featured", text: "Featured content." },
  { href: "/admin/curators", title: "Curators", text: "Playlist curators." },
  { href: "/admin/claims", title: "Claims", text: "Profile claims." },
  { href: "/admin/waitlist", title: "Waitlist", text: "Waitlist sign-ups." },
];

export default function Page() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin</h1>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-6">
        {LINKS.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="block bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 p-5 hover:border-emerald-400 transition-colors">
              <p className="font-bold text-gray-900 dark:text-white">{l.title}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{l.text}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
