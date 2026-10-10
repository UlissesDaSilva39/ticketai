import { BRAND } from '@/config/brand';
import {
  Headphones,
  Mic,
  Building2,
  Sparkles,
  Calendar,
  Music,
  MapPin,
  Ticket,
} from 'lucide-react';

export function HomeLoggedOut() {
  return (
    <main className="bg-white">
      {/* HERO */}
      <section className="mx-auto max-w-5xl px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-1.5 text-xs font-medium text-gray-600">
          <Sparkles className="h-3.5 w-3.5 text-fuchsia-500" />
          New — The network for music
        </div>

        <h1 className="mt-6 text-5xl md:text-7xl font-black tracking-tight text-gray-900">
          The network for music.
        </h1>

        <p className="mt-5 text-lg text-gray-500 max-w-2xl mx-auto">
          Discover events. Connect with artists. Book talent. Grow your career.
        </p>

        <div className="mt-10 max-w-2xl mx-auto">
          <div className="flex items-center rounded-full border border-gray-300 bg-white px-4 py-2 focus-within:border-black transition">
            <MapPin className="h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="What do you want to do tonight?"
              className="flex-1 bg-transparent outline-none text-sm ml-2"
            />
            <a
              href="/search"
              className="rounded-full bg-black px-5 py-2 text-sm font-medium text-white"
            >
              Search
            </a>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap justify-center gap-2 text-sm text-gray-600">
          {['Tonight','This Weekend','Music','Clubs','Festivals','Comedy'].map((t) => (
            <a
              key={t}
              href={`/events?when=${t.toLowerCase().replace(' ', '-')}`}
              className="rounded-full border border-gray-200 px-4 py-1.5 hover:bg-gray-50 transition"
            >
              {t}
            </a>
          ))}
        </div>

        <div className="mt-10 flex justify-center gap-3">
          <a
            href="/login"
            className="rounded-full bg-black px-6 py-3 text-sm font-medium text-white hover:bg-gray-900 transition"
          >
            Get Started Free
          </a>
          <a
            href="/events"
            className="rounded-full border border-gray-300 px-6 py-3 text-sm font-medium text-gray-900 hover:bg-gray-50 transition"
          >
            Explore Events
          </a>
        </div>
      </section>

      {/* PERSONA CARDS */}
      <section className="mx-auto max-w-7xl px-6 py-16 border-t border-gray-100">
        <h2 className="text-2xl font-bold mb-8 text-gray-900 text-center">
          Built for the entire music ecosystem
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: Headphones,
              title: 'For Fans',
              items: ['Discover events','Follow artists','See what friends are going to','Buy tickets'],
              cta: 'Start Free',
              href: '/login',
            },
            {
              icon: Mic,
              title: 'For Artists',
              items: ['Build your profile','Get bookings','Find collabs','Track your career'],
              cta: 'Create Profile',
              href: '/artist/register',
            },
            {
              icon: Building2,
              title: 'For Promoters',
              items: ['Find artists','Book venues','Grow your audience','Sell more tickets'],
              cta: 'List Event',
              href: '/for-promoters',
            },
          ].map((p) => {
            const IconCmp = p.icon;
            return (
              <div
                key={p.title}
                className="rounded-2xl border border-gray-200 bg-white p-6 hover:border-black transition"
              >
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-gray-50 mb-4">
                  <IconCmp className="h-6 w-6 text-gray-900" />
                </div>
                <h3 className="font-bold text-gray-900 mb-3 text-lg">{p.title}</h3>
                <ul className="text-sm text-gray-600 space-y-1.5 mb-5">
                  {p.items.map((i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="h-1 w-1 rounded-full bg-gray-400" />
                      {i}
                    </li>
                  ))}
                </ul>
                <a
                  href={p.href}
                  className="inline-block rounded-full border border-gray-900 px-4 py-2 text-sm font-medium hover:bg-gray-900 hover:text-white transition"
                >
                  {p.cta}
                </a>
              </div>
            );
          })}
        </div>
      </section>

      {/* THE GRID EFFECT */}
      <section className="mx-auto max-w-7xl px-6 py-16 bg-gray-50">
        <div className="max-w-3xl">
          <h2 className="text-2xl font-bold mb-3 text-gray-900">
            The GRID effect
          </h2>
          <p className="text-sm text-gray-600 mb-8">
            Every event, artist, venue, and fan is connected. When you join GRID, you're not
            just buying tickets — you're plugging into the network that powers live music.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { from: 'Artist',     to: 'Producer', icon1: Mic,       icon2: Music },
            { from: 'Promoter',   to: 'Venue',    icon1: Calendar,  icon2: Building2 },
            { from: 'Event',      to: 'Fan',      icon1: Ticket,    icon2: Headphones },
          ].map((r) => {
            const Icon1 = r.icon1;
            const Icon2 = r.icon2;
            return (
              <div
                key={r.from}
                className="rounded-2xl border border-gray-200 bg-white p-5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex flex-col items-center gap-2 flex-1">
                    <Icon1 className="h-5 w-5 text-gray-700" />
                    <span className="text-xs font-semibold text-gray-900">{r.from}</span>
                  </div>

                  <div className="flex-1 flex items-center justify-center">
                    <div className="h-px bg-gradient-to-r from-gray-200 via-black to-gray-200 w-full" />
                  </div>

                  <div className="flex flex-col items-center gap-2 flex-1">
                    <Icon2 className="h-5 w-5 text-gray-700" />
                    <span className="text-xs font-semibold text-gray-900">{r.to}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="mx-auto max-w-3xl px-6 py-24 text-center">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Ready to plug in?</h2>
        <p className="text-sm text-gray-500 mb-8">
          No credit card. No spam. Just music.
        </p>
        <a
          href="/login"
          className="inline-block rounded-full bg-black px-8 py-3 font-semibold text-white hover:bg-gray-900 transition"
        >
          Join GRID Free
        </a>
      </section>
    </main>
  );
}
