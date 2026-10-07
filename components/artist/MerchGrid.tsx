const MOCK_MERCH = [
  { title: "Logo Tee", price: "25", emoji: "\uD83D\uDC55" },
  { title: "Neon Hours Vinyl", price: "30", emoji: "\uD83D\uDCBF" },
  { title: "Tour Poster", price: "15", emoji: "\uD83D\uDDBC" },
];

export default function MerchGrid() {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-100">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
          Merch
        </p>
      </div>
      <ul className="p-3 grid grid-cols-3 gap-3">
        {MOCK_MERCH.map((m) => (
          <li key={m.title} className="text-center">
            <div className="aspect-square bg-gray-100 rounded-xl flex items-center justify-center text-3xl">
              {m.emoji}
            </div>
            <p className="text-xs font-medium mt-2 truncate">{m.title}</p>
            <p className="text-xs text-gray-500">
              {"\u00A3" + m.price}
            </p>
          </li>
        ))}
      </ul>
      <div className="px-4 py-2 border-t border-gray-100 text-center">
        <p className="text-[11px] text-gray-400">Demo - store coming soon</p>
      </div>
    </div>
  );
}