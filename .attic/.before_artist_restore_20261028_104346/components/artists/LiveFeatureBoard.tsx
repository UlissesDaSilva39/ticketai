const SAMPLE = [
  { artist: 'Aaliyah J.',       role: 'Singer',    key: 'Am', genre: 'R&B',      rate: '£350', status: 'live' },
  { artist: 'Marcus K.',        role: 'Rapper',    key: 'Cm', genre: 'Hip-Hop',  rate: '£280', status: 'live' },
  { artist: 'Nova Rae',         role: 'Topliner',  key: 'F',  genre: 'Pop',      rate: '£450', status: 'live' },
  { artist: 'Bristol Soul Co.', role: 'Singer',    key: 'G',  genre: 'Soul',     rate: '£220', status: 'live' },
  { artist: 'Aaliyah J.',       role: 'Topliner',  key: 'Dm', genre: 'R&B',      rate: '£180', status: 'live' },
];

export function LiveFeatureBoard() {
  return (
    <section className="border-t border-neutral-200 py-20">
      <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
            Live feature board
          </p>
          <h2 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">
            12 artists available for features this week.
          </h2>
          <p className="mt-4 max-w-xl text-lg text-neutral-600">
            Stream previews inline, book the session, get the stems. Full-track
            previews, instant delivery, contract included.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="/artists/book"
              className="rounded-full bg-black px-6 py-3 text-sm font-semibold text-white hover:bg-neutral-800">
              Browse artists →
            </a>
            <a href="/artists/apply"
              className="rounded-full border border-neutral-300 bg-white px-6 py-3 text-sm font-semibold text-neutral-900 hover:border-neutral-900">
              List yourself →
            </a>
          </div>
        </div>
        <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-neutral-50 text-left text-xs uppercase tracking-wider text-neutral-500">
              <tr>
                <th className="px-5 py-3">Artist</th>
                <th className="px-5 py-3">Role</th>
                <th className="px-5 py-3">Key</th>
                <th className="px-5 py-3">Genre</th>
                <th className="px-5 py-3 text-right">Rate</th>
                <th className="px-5 py-3">Play</th>
              </tr>
            </thead>
            <tbody>
              {SAMPLE.map((a, i) => (
                <tr key={i} className="border-t border-neutral-100">
                  <td className="px-5 py-3 font-medium">{a.artist}</td>
                  <td className="px-5 py-3 text-neutral-700">{a.role}</td>
                  <td className="px-5 py-3 text-neutral-600">{a.key}</td>
                  <td className="px-5 py-3 text-neutral-600">{a.genre}</td>
                  <td className="px-5 py-3 text-right font-medium">{a.rate}</td>
                  <td className="px-5 py-3">
                    <button type="button"
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-black text-white hover:bg-neutral-800"
                      aria-label={`Preview ${a.artist}`}>
                      ▶
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="border-t border-neutral-100 bg-neutral-50 px-5 py-3 text-xs text-neutral-500">
            Board refreshed 2 minutes ago · Powered by GRID Artists
          </div>
        </div>
      </div>
    </section>
  );
}