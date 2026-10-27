import Link from "next/link";
import { BusinessCard } from "@/components/business/BusinessCard";

export default function BusinessPage() {
  const dashboards = [
    {
      title: "Organiser",
      description: "Create events, manage lineups, track sales, run campaigns.",
      href: "/organizer",
      accent: "from-purple-600 to-pink-600",
    },
    {
      title: "Promoter",
      description: "Your dashboard, analytics, sent bookings, and profile.",
      href: "/promoter/dashboard",
      accent: "from-blue-600 to-cyan-500",
    },
    {
      title: "Venue",
      description: "Manage your venue profile, events, and bookings.",
      href: "/venue/dashboard",
      accent: "from-amber-500 to-orange-600",
    },
    {
      title: "Artist",
      description: "Tracks, analytics, inbox, and profile for artists.",
      href: "/artist/dashboard",
      accent: "from-emerald-500 to-teal-600",
    },
    {
      title: "Label",
      description: "Roster, releases, and label dashboard.",
      href: "/label/dashboard",
      accent: "from-rose-500 to-red-600",
    },
  ];

  return (
    <main className="mx-auto max-w-6xl px-5 py-10">
      <header className="mb-10">
        <p className="text-sm uppercase tracking-widest text-neutral-500">
          GRID / Business
        </p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight">
          Tools for the music industry.
        </h1>
        <p className="mt-3 max-w-2xl text-neutral-600">
          One place for organisers, promoters, venues, artists, and labels.
          Choose your dashboard, or claim a profile if you are new here.
        </p>
      </header>

      <section className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {dashboards.map((d) => (
          <BusinessCard
            key={d.href}
            title={d.title}
            description={d.description}
            href={d.href}
            accent={d.accent}
          />
        ))}
      </section>

      <section className="rounded-2xl border border-neutral-200 bg-white p-6">
        <h2 className="text-xl font-semibold">Not listed yet?</h2>
        <p className="mt-1 text-sm text-neutral-600">
          Claim a profile or list your first event. It is free to start.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/discover" className="rounded-full bg-neutral-900 px-5 py-2 text-sm font-semibold text-white">
            Explore GRID
          </Link>
          <Link href="/artist/register" className="rounded-full border border-neutral-300 px-5 py-2 text-sm font-semibold">
            Register as artist
          </Link>
          <Link href="/promoter/register" className="rounded-full border border-neutral-300 px-5 py-2 text-sm font-semibold">
            Register as promoter
          </Link>
          <Link href="/venue/dashboard" className="rounded-full border border-neutral-300 px-5 py-2 text-sm font-semibold">
            Venue dashboard
          </Link>
        </div>
      </section>

      <p className="mt-8 text-xs text-neutral-500">GRID — the network for live music.</p>
    </main>
  );
}