const SAMPLE = [
  { band: 'The Static Frames', venue: 'Village Underground', city: 'London',     doors: '7:30pm',  price: '£18', status: 'live' },
  { band: 'Low Tide',          venue: 'Fabric',              city: 'London',     doors: '10:00pm', price: '£22', status: 'live' },
  { band: 'Ghost Signals',     venue: 'YES',                 city: 'Manchester', doors: '8:00pm',  price: '£16', status: 'live' },
  { band: 'Northern Lights',   venue: 'Brudenell',           city: 'Leeds',      doors: '8:30pm',  price: '£14', status: 'live' },
  { band: 'Hard Knocks',       venue: 'O2 Academy',          city: 'Birmingham', doors: '7:00pm',  price: '£20', status: 'live' },
];

export function LiveGigBoard() {
  return (
    <section className="border-t border-neutral-200 py-20">
      <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
            Live gig board
          </p>
          <h2 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">
            12 gigs tonight across 6 cities.
          </h2>
          <p className="mt-4 max-w-xl text-lg text-neutral-600">
            Buy tickets directly from the band. No booking fees, no shady
            resellers, instant delivery.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="/gigs"
              className="rounded-full bg-black px-6 py-3 text-sm font-semibold text-white hover:bg-neutral-800">
              Browse gigs →
            </a>
            <a href="/bands/apply"
              className="rounded-full border border-neutral-300 bg-white px-6 py-3 text-sm font-semibold text-neutral-900 hover:border-neutral-900">
              List your band →
            </a>
          </div>
        </div>
        <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-neutral-50 text-left text-xs uppercase tracking-wider text-neutral-500">
              <tr>
                <th className="px-5 py-3">Band</th>
                <th className="px-5 py-3">Venue</th>
                <th className="px-5 py-3">City</th>
                <th className="px-5 py-3">Doors</th>
                <th className="px-5 py-3 text-right">From</th>
                <th className="px-5 py-3">Buy</th>
              </tr>
            </thead>
            <tbody>
              {SAMPLE.map((b, i) => (
                <tr key={i} className="border-t border-neutral-100">
                  <td className="px-5 py-3 font-medium">{b.band}</td>
                  <td className="px-5 py-3 text-neutral-700">{b.venue}</td>
                  <td className="px-5 py-3 text-neutral-600">{b.city}</td>
                  <td className="px-5 py-3 text-neutral-600">{b.doors}</td>
                  <td className="px-5 py-3 text-right font-medium">{b.price}</td>
                  <td className="px-5 py-3">
                    <button type="button"
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-black text-white hover:bg-neutral-800"
                      aria-label={`Buy tickets for ${b.band}`}>
                      ▶
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="border-t border-neutral-100 bg-neutral-50 px-5 py-3 text-xs text-neutral-500">
            Board refreshed 3 minutes ago · Powered by GRID Gigs
          </div>
        </div>
      </div>
    </section>
  );
}