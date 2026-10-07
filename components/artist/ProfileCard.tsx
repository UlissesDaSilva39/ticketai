import Link from "next/link";

type Props = {
  artist: {
    username: string | null;
    full_name: string | null;
    avatar_url: string | null;
    bio: string | null;
    label: string | null;
    website: string | null;
    instagram: string | null;
    twitter: string | null;
    spotify: string | null;
    youtube: string | null;
    soundcloud: string | null;
  };
  stats: { events: number; friends: number; followers: number };
};

export default function ProfileCard({ artist, stats }: Props) {
  const name = artist.full_name || artist.username || "Artist";
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const links: Array<{ label: string; url: string; glyph: string }> = [];
  if (artist.website) links.push({ label: "Website", url: artist.website, glyph: "🌐" });
  if (artist.instagram)
    links.push({
      label: "Instagram",
      url: "https://instagram.com/" + artist.instagram.replace("@", ""),
      glyph: "📷",
    });
  if (artist.twitter)
    links.push({
      label: "Twitter / X",
      url: "https://twitter.com/" + artist.twitter.replace("@", ""),
      glyph: "𝕏",
    });
  if (artist.spotify) links.push({ label: "Spotify", url: artist.spotify, glyph: "🎵" });
  if (artist.youtube) links.push({ label: "YouTube", url: artist.youtube, glyph: "▶" });
  if (artist.soundcloud)
    links.push({ label: "SoundCloud", url: artist.soundcloud, glyph: "☁" });

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 space-y-5">
      <div className="text-center">
        <div className="w-24 h-24 rounded-full bg-black text-white flex items-center justify-center font-bold text-2xl mx-auto overflow-hidden">
          {artist.avatar_url ? (
            <img src={artist.avatar_url} alt="" className="w-full h-full object-cover" />
          ) : (
            initials
          )}
        </div>
        <Link
          href={artist.username ? "/u/" + artist.username : "#"}
          className="block mt-3 font-bold hover:underline text-lg"
        >
          {name}
        </Link>
        {artist.username ? (
          <p className="text-xs text-gray-500 mt-0.5">@{artist.username}</p>
        ) : null}
      </div>

      <div className="grid grid-cols-3 text-center border-y border-gray-100 py-4">
        <div>
          <p className="font-bold text-lg">{stats.events}</p>
          <p className="text-[10px] uppercase tracking-wider text-gray-500 mt-0.5">
            Events
          </p>
        </div>
        <div className="border-l border-r border-gray-100">
          <p className="font-bold text-lg">{stats.friends}</p>
          <p className="text-[10px] uppercase tracking-wider text-gray-500 mt-0.5">
            Friends
          </p>
        </div>
        <div>
          <p className="font-bold text-lg">{stats.followers}</p>
          <p className="text-[10px] uppercase tracking-wider text-gray-500 mt-0.5">
            Followers
          </p>
        </div>
      </div>

      {artist.bio ? (
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-2">
            About
          </p>
          <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
            {artist.bio}
          </p>
        </div>
      ) : null}

      {links.length > 0 ? (
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-2">
            Links
          </p>
          <ul className="space-y-1.5">
            {links.map((l) => (
              <li key={l.label}>
                <a
                  href={l.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-gray-700 hover:text-black"
                >
                  <span className="text-base">{l.glyph}</span>
                  <span>{l.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {artist.label ? (
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-2">
            Label
          </p>
          <p className="text-sm text-gray-700">{artist.label}</p>
        </div>
      ) : null}
    </div>
  );
}