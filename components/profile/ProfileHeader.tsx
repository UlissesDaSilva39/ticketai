import Link from "next/link";

type ProfileHeaderProps = {
  profile: {
    id: string;
    username: string | null;
    full_name: string | null;
    avatar_url: string | null;
    cover_image: string | null;
    bio: string | null;
    city: string | null;
    genre: string | null;
    role: string | null;
    website: string | null;
    instagram: string | null;
    twitter: string | null;
    spotify: string | null;
    youtube: string | null;
    soundcloud: string | null;
  };
  isOwnProfile: boolean;
  stats: { posts: number; events: number; following: number; followers: number };
};

export default function ProfileHeader({ profile, isOwnProfile, stats }: ProfileHeaderProps) {
  const name = profile.full_name || profile.username || "User";
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const socialLinks: Array<{ label: string; href: string }> = [];
  if (profile.website) socialLinks.push({ label: "Website", href: profile.website });
  if (profile.instagram) socialLinks.push({ label: "Instagram", href: "https://instagram.com/" + profile.instagram.replace(/^@/, "") });
  if (profile.twitter) socialLinks.push({ label: "Twitter", href: "https://twitter.com/" + profile.twitter.replace(/^@/, "") });
  if (profile.spotify) socialLinks.push({ label: "Spotify", href: profile.spotify });
  if (profile.youtube) socialLinks.push({ label: "YouTube", href: profile.youtube });
  if (profile.soundcloud) socialLinks.push({ label: "SoundCloud", href: profile.soundcloud });

  return (
    <header className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
      <div className="relative h-40 bg-gradient-to-br from-gray-800 via-gray-900 to-black">
        {profile.cover_image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={profile.cover_image} alt="" className="absolute inset-0 w-full h-full object-cover opacity-70" />
        ) : null}
      </div>
      <div className="px-6 pb-6 -mt-12 relative">
        <div className="flex items-end gap-4">
          {profile.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={profile.avatar_url} alt={name} className="w-24 h-24 rounded-full object-cover border-4 border-white bg-white shrink-0" />
          ) : (
            <div className="w-24 h-24 rounded-full bg-black text-white flex items-center justify-center text-2xl font-bold border-4 border-white shrink-0">
              {initials}
            </div>
          )}
          <div className="flex-1 min-w-0 pb-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold truncate">{name}</h1>
              {profile.role ? (
                <span className="text-[10px] uppercase tracking-wider bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">{profile.role}</span>
              ) : null}
            </div>
            {profile.username ? (
              <p className="text-sm text-gray-500">@{profile.username}</p>
            ) : null}
          </div>
          {isOwnProfile ? (
            <Link
              href="/profile/edit"
              className="px-4 py-2 border border-gray-300 rounded-full text-sm font-medium hover:border-gray-800 transition shrink-0"
            >
              Edit profile
            </Link>
          ) : null}
        </div>

        {profile.bio ? (
          <p className="text-sm text-gray-700 mt-4 whitespace-pre-wrap">{profile.bio}</p>
        ) : null}

        <div className="flex flex-wrap gap-3 text-xs text-gray-500 mt-4">
          {profile.city ? <span>{profile.city}</span> : null}
          {profile.genre ? <span>· {profile.genre}</span> : null}
        </div>

        {socialLinks.length > 0 ? (
          <div className="flex flex-wrap gap-3 text-xs mt-3">
            {socialLinks.map((l) => (
              <a
                key={l.label}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-black underline"
              >
                {l.label}
              </a>
            ))}
          </div>
        ) : null}

        <dl className="grid grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-100 text-center">
          <div>
            <dd className="text-xl font-bold">{stats.posts}</dd>
            <dt className="text-xs text-gray-500 uppercase tracking-wide">Posts</dt>
          </div>
          <div>
            <dd className="text-xl font-bold">{stats.events}</dd>
            <dt className="text-xs text-gray-500 uppercase tracking-wide">Events</dt>
          </div>
          <div>
            <dd className="text-xl font-bold">{stats.followers}</dd>
            <dt className="text-xs text-gray-500 uppercase tracking-wide">Followers</dt>
          </div>
          <div>
            <dd className="text-xl font-bold">{stats.following}</dd>
            <dt className="text-xs text-gray-500 uppercase tracking-wide">Following</dt>
          </div>
        </dl>
      </div>
    </header>
  );
}
