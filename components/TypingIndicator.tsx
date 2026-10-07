"use client";

export default function TypingIndicator({ names }: { names: string[] }) {
  if (names.length === 0) return null;
  const label =
    names.length === 1
      ? names[0] + " is typing"
      : names.length === 2
      ? names[0] + " and " + names[1] + " are typing"
      : names.length + " people are typing";

  return (
    <div className="px-4 pb-2 text-xs text-gray-500 flex items-center gap-1">
      <span>{label}</span>
      <span className="inline-flex gap-0.5">
        <span className="w-1 h-1 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0ms" }} />
        <span className="w-1 h-1 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "150ms" }} />
        <span className="w-1 h-1 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "300ms" }} />
      </span>
    </div>
  );
}