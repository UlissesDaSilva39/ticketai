import { BRAND } from '@config/brand';
import { Headphones, Mic, Tent } from 'lucide-react';

export function HomeLoggedOut() {
  return (
    <main className="bg-white">
      <section className="mx-auto max-w-5 xl px-6 pt-24 pb-16 text-center">
        <h1 className="text-5xl md:text-7xl font-black tracking-tight text-gray-900">
          {BRAND.tagline}
        </h1>
        <p className="mt-4 text-lg text-gray-500">
          Discover events. Connect with artists. Book talent. Grow your career.
        </p>

        <div className="mt-10 max-w-2xl mx-auto">
          <div className="flex items-center rounded-full border border-gray-300 bg-white px-4 py-2 focus-within!:border-black">
            <input
              type="text"
              placeholder="What do you want to do tonight?"
              className="flex-1 bg-transparent outline-none text-sm"
            />
            <a
              href="/search"
              className="rounded-full bg-black px-4 py-2 text-sm font-medium text-white"
            >
              Search
            </a>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap justify-center gap-2 text-sm text-gray-500">
          {['Tonight','This Weekend','Music','Clubs','Festivals','Comedy'].map((t) => (
            <a
              key={t}
              href={`/events?when=${t.toLowerCase().replace(' ', '-')}`}
              className="rounded-full border border-gray-200 px-4 py-1.5 hover:bg-gray-50"
            >
              {t}
            </a>
          ))}
        </div>

        <div className="mt-10 flex justify-center gap-3">
          <a href="/login" className="rounded-xl bg-black px-6 py-3 font-semibold text-white hover:bg-gray-900">
            Get Started Free
          </a>
          <a href="/events" className="rounded-xl border border-gray-300 px-6 py-3 font-semibold text-gray-900 hover:bg-gray-50">
            Explore Events
          </a>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">
          Built for the entire music ecosystem
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: Headphones, title: 'For Fans', items: ['Discover events','Follow artists','See what friends are going to','Buy tickets'], cta: 'Start Free', href: '/login' },
            { icon: Mic, title: 'For Artists', items: ['Build your profile','Get bookings','Find collabs','Track your career'], cta: 'Create Profile', href: '/artist/register' },
            { icon: Tent, title: 'For Promoters', items: ['Find artists','Book venues','Grow your audience','Sell more tickets'], cta: 'List Event', href: '/for-promoters' },
          ].map((p) => {
            const IconCmp = p.icon;
            return (
              <div key={p.title} className="rounded-2xl border border-gray-200 bg-white p-6">
                <IconCmp className="h-8 w-8 mb-3 text-gray-900" />
                <h3 className="font-bold text-gray-900 mb-3">{p.title}</h3>
                <ul className="text-sm text-gray-600 space-y-1 mb-4">
                  {p.items.map((i) => <li key={i}>· {i}</li>)}
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

      <section className="mx-auto max-w-7xl px-6 py-16 bg-gray-50">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">
          The GRID effect
        </h2>
        <p className="text-sm text-gray-600 mb-6 max-w-2xl">
          Every event, artist, venue, and fan is connected. When you join GRID, you're not
          just buying tickets — you're plugging into the network that powers live music.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { from: 'Artist', to: 'Producer' },
            { from: 'Promoter', to: 'Venue' },
            { from: 'Event', to: 'Fan' },
          ].map((r) => (
            <div key={r.from} className="rounded-2xl border border-gray-200 bg-white p-5 text-center">
              <div className="text-sm font-semibold text-gray-900">{r.from}</div>
              <div className="text-xs text-gray-400 my-2">── connects ──</div>
              <div className="text-sm font-semibold text-gray-900">{ r.to}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-24 text-center">
        <h2 className="text-3xl font-bold mb-6 text-gray-900">Ready to plug in?</h2>
        <p className="text-sm text-gray-500 mb-6">
          No credit card. No spam. Just music.
        </p>
        <a href="/login" className="inline-block rounded-xl bg-black px-8 py-3 font-semibold text-white hover:bg-gray-900">
          Join GRID Free
        </a>
      </section>
    </main>
  );
}
