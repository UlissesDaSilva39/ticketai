"use client";

export default function FriendsGoing({
  friends,
  totalCount,
}: {
  friends: Array<{ id: string; full_name: string | null; username?: string | null }>;
  totalCount: number;
}) {
  if (totalCount === 0) return null;

  const displayName = (f: { full_name: string | null; username?: string | null }) =>
    f.full_name || f.username || "Someone";

  const firstNames = friends
    .slice(0, 2)
    .map((f) => displayName(f).split(" ")[0]);

  return (
    <div className="flex items-center gap-3 mt-4">
      <div className="flex -space-x-2">
        {friends.slice(0, 5).map((f) => (
          <div
            key={f.id}
            className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold border-2 border-white"
          >
            {displayName(f).charAt(0).toUpperCase()}
          </div>
        ))}
      </div>
      <p className="text-sm text-white/90">
        {friends.length === 0
          ? totalCount + " people are going"
          : firstNames.join(" and ") +
            (totalCount > firstNames.length
              ? " and " + (totalCount - firstNames.length) + " more " + (totalCount - firstNames.length === 1 ? "is" : "are") + " going"
              : (firstNames.length === 1 ? " is going" : " are going"))}
      </p>
    </div>
  );
}
