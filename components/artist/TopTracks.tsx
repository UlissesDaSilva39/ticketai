type Track = {
  title: string;
  duration: string;
  plays: string;
};

const MOCK_TRACKS: Track[] = [
  { title: "Midnight Drive", duration: "3:42", plays: "1.2M" },
  { title: "Neon Hours", duration: "4:10", plays: "890K" },
  { title: "Afterglow", duration: "3:28", plays: "640K" },
  { title: "Static Love", duration: "5:02", plays: "410K" },
];

export default function TopTracks() {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-100">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
          Top Tracks
        </p>
      </div>
      <ul>
        {MOCK_TRACKS.map((t, i) => (
          <li
            key={t.title}
            className="flex items-center gap-3 px-4 py-2.5 border-b border-gray-100 last:border-b-0 hover:bg-gray-50"
          >
            <button
              type="button"
              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-xs hover:bg-black hover:text-white"
              aria-label={"Play " + t.title}
            >
              &#9654;
            </button>
            <span className="text-xs text-gray-400 w-4 text-right">{i + 1}</span>
            <p className="flex-1 text-sm font-medium truncate">{t.title}</p>
            <span className="text-xs text-gray-500">{t.duration}</span>
            <span className="text-xs text-gray-400 w-14 text-right">{t.plays}</span>
          </li>
        ))}
      </ul>
      <div className="px-4 py-2 border-t border-gray-100 text-center">
        <p className="text-[11px] text-gray-400">Demo tracks - streaming coming soon</p>
      </div>
    </div>
  );
}