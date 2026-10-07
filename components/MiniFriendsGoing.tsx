"use client";

export default function MiniFriendsGoing({
  eventId,
  friends,
  totalCount,
}: {
  eventId: string;
  friends: Array<{ id: string; name: string }>;
  totalCount: number;
}) {
  if (totalCount === 0) return null;

  const shown = friends.slice(0, 3);
  const firstNames = friends.slice(0, 2).map((f) => f.name.split(" ")[0]);
  const others = totalCount - firstNames.length;

  let text: string;
  if (firstNames.length === 0) {
    text =
      totalCount + (totalCount === 1 ? " person is going" : " people are going");
  } else if (firstNames.length === 1 && others === 0) {
    text = firstNames[0] + " is going";
  } else if (firstNames.length === 1) {
    text =
      firstNames[0] +
      " and " +
      others +
      (others === 1 ? " other" : " others") +
      " are going";
  } else {
    text =
      firstNames.join(" and ") +
      (others > 0 ? " and " + others + " others" : "") +
      " are going";
  }

  return (
    <a
      href={"/event/" + eventId + "/attendees"}
      className="flex items-center gap-2 mt-2 hover:opacity-80"
    >
      <div className="flex -space-x-1.5">
        {shown.map((f) => (
          <div
            key={f.id}
            className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-[9px] font-bold border border-white"
          >
            {f.name.charAt(0).toUpperCase()}
          </div>
        ))}
      </div>
      <span className="text-xs text-gray-600">
        {text} · {totalCount} going
      </span>
    </a>
  );
}