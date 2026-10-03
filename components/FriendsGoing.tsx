"use client";

export default function FriendsGoing({
  friends,
  totalCount,
}: {
  friends: Array<{ id: string; full_name: string | null }>;
  totalCount: number;
}) {
  if (totalCount === 0) return null;

  return (
    <div className="flex items-center gap-3 mt-4">
      <div className="flex -space-x-2">
        {friends.slice(0, 5).map((f) => (
          <div
            key={f.id}
            className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold border-2 border-white"
          >
            {(f.full_name || "?").charAt(0).toUpperCase()}
          </div>
        ))}
      </div>
      <p className="text-sm text-white/90">
        {friends.length > 0
          ? friends.slice(0, 2).map((f) => (f.full_name || "Someone").split(" ")[0]).join(" and ") +
            (totalCount > 2 ? " and " + (totalCount - 2) + " others are going" : " are going")
          : totalCount + " people are going"}
      </p>
    </div>
  );
}
