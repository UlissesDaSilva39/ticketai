const SAMPLE = [
  { dj: 'DJ Proxy',        venue: 'Fabric',     city: 'London',     set: '1:00am',  fee: '£800' },
  { dj: 'Nightshift Nina', venue: 'Hidden',     city: 'Manchester', set: '12:00am', fee: '£700' },
  { dj: 'Berlin Bass',     venue: 'Kraftwerk',  city: 'Berlin',     set: '2:00am',  fee: 'EUR 1500' },
  { dj: 'Selecta Jade',    venue: 'Printworks', city: 'London',     set: '1:30am',  fee: '£900' },
  { dj: 'Techno Nation',   venue: 'Printworks', city: 'London',     set: '2:00am',  fee: '£1,200' },
];

export function LiveSetBoard() {
  return (
    <section className="border-t border-neutral-200 py-20">
      <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
            Live set board
          </p>
          <h2 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">
            18 DJs playing tonight across 7 cities.
          </h2>
          <p className="mt-4 max-w-xl text-lg text-neutral-600">
            Book a DJ directly, pay a deposit, sign the contract, and confirm
            the set time. No more DM-chasing.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="/djs/book"
              className="rounded-full bg-black px-6 py-3 text-sm font-semibold text-white hover:bg-neutral-800">
              Book a DJ →
            </a>
            <a href="/djs/apply"
              className="rounded-full border border-neutral-300 bg-white px-6 py-3 text-sm font-semibold text-neutral-900 hover:border-neutral-900">
              List yourself →
            </a>
          </div>
        </div>
        <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-neutral-50 text-left text-xs uppercase tracking-wider text-neutral-500">
              <tr>
                <th className="px-5 py-3">DJ</th>
                <th className="px-5 py-3">Venue</th>
                <th className="px-5 py-3">City</th>
                <th className="px-5 py-3">Set</th>
                <th className="px-5 py-3 text-right">Fee</th>
                <th className="px-5 py-3">Book</th>
              </tr>
            </thead>
            <tbody>
              {SAMPLE.map((d, i) => (
                <tr key={i} className="border-t border-neutral-100">
                  <td className="px-5 py-3 font-medium">{d.dj}</td>
                  <td className="px-5 py-3 text-neutral-700">{d.venue}</td>
                  <td className="px-5 py-3 text-neutral-600">{d.city}</td>
                  <td className="px-5 py-3 text-neutral-600">{d.set}</td>
                  <td className="px-5 py-3 text-right font-medium">{d.fee}</td>
                  <td className="px-5 py-3">
                    <button type="button"
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-black text-white hover:bg-neutral-800"
                      aria-label={`Book ${d.dj}`}>
                      ▶
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="border-t border-neutral-100 bg-neutral-50 px-5 py-3 text-xs text-neutral-500">
            Board refreshed 3 minutes ago · Powered by GRID DJs
          </div>
        </div>
      </div>
    </section>
  );
}