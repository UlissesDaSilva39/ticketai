const SAMPLE = [
  { vocalist: 'Aaliyah J.',       type: 'Topliner',     key: 'Am', range: 'Alto',     rate: '£350', status: 'live' },
  { vocalist: 'Marcus K.',        type: 'Session',      key: 'Cm', range: 'Tenor',    rate: '£280', status: 'live' },
  { vocalist: 'Nova Rae',         type: 'Featured Hook',key: 'F',  range: 'Soprano',  rate: '£450', status: 'live' },
  { vocalist: 'Bristol Soul Co.', type: 'Session',      key: 'G',  range: 'Baritone', rate: '£220', status: 'live' },
  { vocalist: 'Aaliyah J.',       type: 'Featured Hook',key: 'Dm', range: 'Alto',     rate: '£180', status: 'live' },
];

export function LiveVocalShowcase() {
  return (
    <section className="border-t border-neutral-200 py-20">
      <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
            Live vocal showcase
          </p>
          <h2 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">
            12 new vocals this week from Manchester vocalists.
          </h2>
          <p className="mt-4 max-w-xl text-lg text-neutral-600">
            Play previews inline. Book sessions in three clicks. Full-track
            previews, instant delivery, contract included.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="/vocalists/browse"
              className="rounded-full bg-black px-6 py-3 text-sm font-semibold text-white hover:bg-neutral-800">
              Browse vocalists →
            </a>
            <a href="/vocalists/apply"
              className="rounded-full border border-neutral-300 bg-white px-6 py-3 text-sm font-semibold text-neutral-900 hover:border-neutral-900">
              Get booked →
            </a>
          </div>
        </div>
        <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-neutral-50 text-left text-xs uppercase tracking-wider text-neutral-500">
              <tr>
                <th className="px-5 py-3">Vocalist</th>
                <th className="px-5 py-3">Type</th>
                <th className="px-5 py-3">Key</th>
                <th className="px-5 py-3">Range</th>
                <th className="px-5 py-3 text-right">Rate</th>
                <th className="px-5 py-3">Play</th>
              </tr>
            </thead>
            <tbody>
              {SAMPLE.map((v, i) => (
                <tr key={i} className="border-t border-neutral-100">
                  <td className="px-5 py-3 font-medium">{v.vocalist}</td>
                  <td className="px-5 py-3 text-neutral-700">{v.type}</td>
                  <td className="px-5 py-3 text-neutral-600">{v.key}</td>
                  <td className="px-5 py-3 text-neutral-600">{v.range}</td>
                  <td className="px-5 py-3 text-right font-medium">{v.rate}</td>
                  <td className="px-5 py-3">
                    <button type="button"
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-black text-white hover:bg-neutral-800"
                      aria-label={`Preview ${v.vocalist}`}>
                      ▶
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="border-t border-neutral-100 bg-neutral-50 px-5 py-3 text-xs text-neutral-500">
            Showcase refreshed 2 minutes ago · Powered by GRID Vocalists
          </div>
        </div>
      </div>
    </section>
  );
}