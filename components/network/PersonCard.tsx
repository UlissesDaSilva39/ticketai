import Link from "next/link";
import FollowButton from "./FollowButton";

type Person = {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  genre: string | null;
  city: string | null;
  role: string | null;
};

const ROLE_LABELS: Record<string, string> = {
  artist: "Artist",
  a_and_r: "A&R",
  promoter: "Promoter",
  venue: "Venue",
  manager: "Manager",
  producer: "Producer",
  dj: "DJ",
  band: "Band",
};

export default function PersonCard({
  person,
  initiallyFollowing,
}: {
  person: Person;
  initiallyFollowing: boolean;
}) {
  const name = person.full_name || person.username || "Someone";
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const href = person.username ? "/artists/" + person.username : "#";

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-4 flex flex-col gap-3">
      <Link href={href} className="flex items-start gap-3 group">
        {person.avatar_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={person.avatar_url}
            alt={name}
            className="w-14 h-14 rounded-full object-cover shrink-0"
          />
        ) : (
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 text-white flex items-center justify-center text-base font-bold shrink-0">
            {initials}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold truncate group-hover:underline">
            {name}
          </p>
          {person.username ? (
            <p className="text-xs text-gray-500 truncate">@{person.username}</p>
          ) : null}
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            {person.role ? (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 uppercase font-semibold">
                {ROLE_LABELS[person.role] ?? person.role}
              </span>
            ) : null}
            {person.genre ? (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                {person.genre}
              </span>
            ) : null}
            {person.city ? (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                {person.city}
              </span>
            ) : null}
          </div>
        </div>
      </Link>

      {person.bio ? (
        <p className="text-xs text-gray-600 line-clamp-2">{person.bio}</p>
      ) : null}

      <div className="mt-auto flex items-center justify-between gap-2">
        <Link
          href={href}
          className="text-xs text-gray-600 hover:text-black underline"
        >
          View profile
        </Link>
        <FollowButton targetId={person.id} initiallyFollowing={initiallyFollowing} />
      </div>
    </div>
  );
}
