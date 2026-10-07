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
      <div className="px-4 py-3 border-b border-gray-100">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
          Fans Also Like
        </p>
      </div>
      <ul className="p-3 grid grid-cols-2 gap-3">
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
                className="flex items-center gap-2 group"
              >
                <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold shrink-0 overflow-hidden">
                  {a.avatar_url ? (
                    <img src={a.avatar_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    initials
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium truncate group-hover:underline">
                    {name}
                  </p>
                  <p className="text-[10px] text-gray-500 truncate">
                    {a.genre || a.city || ""}
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