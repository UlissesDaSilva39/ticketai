import Link from "next/link";

type Other = {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  city: string | null;
  genre: string | null;
};

export default function FansAlsoLike({ artists }: { artists: Other[] }) {
  if (artists.length === 0) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100">
        <h2 className="text-lg font-bold">Fans Also Like</h2>
      </div>
      <ul className="p-4 grid grid-cols-2 gap-3">
        {artists.slice(0, 4).map((a) => {
          const name = a.full_name || a.username || "Artist";
          const initials = name
            .split(" ")
            .map((w) => w[0])
            .join("")
            .slice(0, 2)
            .toUpperCase();
          return (
            <li key={a.id}>
              <Link
                href={a.username ? "/artists/" + a.username : "#"}
                className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors group"
              >
                <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center text-sm font-bold shrink-0 overflow-hidden">
                  {a.avatar_url ? (
                    <img src={a.avatar_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    initials
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold truncate group-hover:underline">
                    {name}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {a.genre || a.city || "Artist"}
                  </p>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}