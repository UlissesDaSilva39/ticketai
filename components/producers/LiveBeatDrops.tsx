const SAMPLE = [
  { producer: 'Kaytranada Jr.',   title: 'Motion',        key: 'Am', bpm: 92,  price: '£49', status: 'live' },
  { producer: 'Ghost Loops',      title: 'Static',        key: 'Cm', bpm: 140, price: '£79', status: 'live' },
  { producer: 'Neon Frames',      title: 'Afterglow',     key: 'F',  bpm: 128, price: '£39', status: 'live' },
  { producer: 'Bristol Bass Co.', title: 'Low Tide',      key: 'G',  bpm: 174, price: '£59', status: 'live' },
  { producer: 'Kaytranada Jr.',   title: 'Reflection',    key: 'Dm', bpm: 88,  price: '£49', status: 'live' },
];

export function LiveBeatDrops() {
  return (
    <section className="border-t border-neutral-200 py-20">
      <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
            Live beat drops
          </p>
          <h2 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">
            12 new beats this week from Manchester producers.
          </h2>
          <p className="mt-4 max-w-xl text-lg text-neutral-600">
            Play previews inline. License in three clicks. Full-track previews,
            instant delivery, contract included.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="/beats"
              className="rounded-full bg-black px-6 py-3 text-sm font-semibold text-white hover:bg-neutral-800">
              Browse beats →
            </a>
            <a href="/beats/sell"
              className="rounded-full border border-neutral-300 bg-white px-6 py-3 text-sm font-semibold text-neutral-900 hover:border-neutral-900">
              Sell your beats →
            </a>
          </div>
        </div>
        <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-neutral-50 text-left text-xs uppercase tracking-wider text-neutral-500">
              <tr>
                <th className="px-5 py-3">Producer</th>
                <th className="px-5 py-3">Title</th>
                <th className="px-5 py-3">Key</th>
                <th className="px-5 py-3 text-right">BPM</th>
                <th className="px-5 py-3 text-right">Lease</th>
                <th className="px-5 py-3">Play</th>
              </tr>
            </thead>
            <tbody>
              {SAMPLE.map((b, i) => (
                <tr key={i} className="border-t border-neutral-100">
                  <td className="px-5 py-3 font-medium">{b.producer}</td>
                  <td className="px-5 py-3 text-neutral-700">{b.title}</td>
                  <td className="px-5 py-3 text-neutral-600">{b.key}</td>
                  <td className="px-5 py-3 text-right text-neutral-600">{b.bpm}</td>
                  <td className="px-5 py-3 text-right font-medium">{b.price}</td>
                  <td className="px-5 py-3">
                    <button type="button"
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-black text-white hover:bg-neutral-800"
                      aria-label={`Preview ${b.title}`}>
                      ▶
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="border-t border-neutral-100 bg-neutral-50 px-5 py-3 text-xs text-neutral-500">
            Previews refreshed 2 minutes ago · Powered by GRID Beats
          </div>
        </div>
      </div>
    </section>
  );
}