import type { Metadata } from "next";

// Right-hand panel when no conversation is open (the list comes from layout.tsx).
export const metadata: Metadata = { title: "Messages" };

export default function MessagesIndexPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
      <div className="grid h-16 w-16 place-items-center rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-3xl" aria-hidden="true">
        💬
      </div>
      <h2 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">Your messages</h2>
      <p className="mt-1 max-w-xs text-sm text-gray-500">
        Pick a conversation on the left, or start a new one with the ✎ button.
      </p>
    </div>
  );
}
