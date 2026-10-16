const SAMPLE = [
  { venue: 'The Dome',  city: 'London',     cap: 800,  price: '£1,200', status: 'open' },
  { venue: 'Fabric',    city: 'London',     cap: 1600, price: '£4,500', status: 'open' },
  { venue: 'Kraftwerk', city: 'Berlin',     cap: 1200, price: '€2,800', status: 'open' },
  { venue: 'Hidden',    city: 'Manchester', cap: 600,  price: '£900',   status: 'waitlist' },
  { venue: 'Motion',    city: 'Bristol',    cap: 3000, price: '£3,200', status: 'open' },
];

export function VenueAvailability() {
  return (
    <section className="border-t border-neutral-200 py-20">
      <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
            Live availability
          </p>
          <h2 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">
            14 venues free this Saturday in London.
          </h2>
          <p className="mt-4 max-w-xl text-lg text-neutral-600">
            Real-time calendars from every venue on GRID. Filter by capacity,
            curfew, tech spec, and budget. Book in three clicks.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="/venues"
              className="rounded-full bg-black px-6 py-3 text-sm font-semibold text-white hover:bg-neutral-800">
              Search venues →
            </a>
            <a href="/venues/list"
              className="rounded-full border border-neutral-300 bg-white px-6 py-3 text-sm font-semibold text-neutral-900 hover:border-neutral-900">
              List your venue →
            </a>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-neutral-50 text-left text-xs uppercase tracking-wider text-neutral-500">
              <tr>
                <th className="px-5 py-3">Venue</th>
                <th className="px-5 py-3">City</th>
                <th className="px-5 py-3 text-right">Cap</th>
                <th className="px-5 py-3 text-right">Night from</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {SAMPLE.map((v) => (
                <tr key={v.venue} className="border-t border-neutral-100">
                  <td className="px-5 py-3 font-medium">{v.venue}</td>
                  <td className="px-5 py-3 text-neutral-600">{v.city}</td>
                  <td className="px-5 py-3 text-right text-neutral-600">{v.cap}</td>
                  <td className="px-5 py-3 text-right font-medium">{v.price}</td>
                  <td className="px-5 py-3">
                    {v.status === 'open' ? (
                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">Open</span>
                    ) : (
                      <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700">Waitlist</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="border-t border-neutral-100 bg-neutral-50 px-5 py-3 text-xs text-neutral-500">
            Data refreshed 4 minutes ago · Powered by GRID Venues
          </div>
        </div>
      </div>
    </section>
  );
}