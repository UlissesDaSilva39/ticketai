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

  const links: Array<{ label: string; url: string }> = [];
  if (artist.website) links.push({ label: "Website", url: artist.website });
  if (artist.instagram)
    links.push({
      label: "Instagram",
      url: "https://instagram.com/" + artist.instagram.replace("@", ""),
    });
  if (artist.twitter)
    links.push({
      label: "Twitter",
      url: "https://twitter.com/" + artist.twitter.replace("@", ""),
    });
  if (artist.spotify) links.push({ label: "Spotify", url: artist.spotify });
  if (artist.youtube) links.push({ label: "YouTube", url: artist.youtube });
  if (artist.soundcloud) links.push({ label: "SoundCloud", url: artist.soundcloud });

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-4 space-y-4">
      <div className="text-center">
        <div className="w-20 h-20 rounded-full bg-black text-white flex items-center justify-center font-bold text-2xl mx-auto overflow-hidden">
          {artist.avatar_url ? (
            <img src={artist.avatar_url} alt="" className="w-full h-full object-cover" />
          ) : (
            initials
          )}
        </div>
        <Link
          href={artist.username ? "/u/" + artist.username : "#"}
          className="block mt-2 font-semibold hover:underline"
        >
          {name}
        </Link>
        {artist.username ? (
          <p className="text-xs text-gray-500">@{artist.username}</p>
        ) : null}
      </div>

      <div className="grid grid-cols-3 text-center border-y border-gray-100 py-3">
        <div>
          <p className="font-semibold text-sm">{stats.events}</p>
          <p className="text-[11px] text-gray-500">Events</p>
        </div>
        <div>
          <p className="font-semibold text-sm">{stats.friends}</p>
          <p className="text-[11px] text-gray-500">Friends</p>
        </div>
        <div>
          <p className="font-semibold text-sm">{stats.followers}</p>
          <p className="text-[11px] text-gray-500">Followers</p>
        </div>
      </div>

      {artist.bio ? (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">
            About
          </p>
          <p className="text-sm text-gray-700 whitespace-pre-wrap">{artist.bio}</p>
        </div>
      ) : null}

      {links.length > 0 ? (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">
            Links
          </p>
          <ul className="space-y-1">
            {links.map((l) => (
              <li key={l.label}>
                <a
                  href={l.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-700 hover:text-black hover:underline"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {artist.label ? (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">
            Label
          </p>
          <p className="text-sm text-gray-700">{artist.label}</p>
        </div>
      ) : null}
    </div>
  );
}