"use client";

export function SavedIndicator({ saved }: { saved: boolean }) {
  if (!saved) return null;
  return (
    <span
      className="absolute right-3 top-3 z-10 inline-flex h-6 w-6 items-center justify-center rounded-full bg-neutral-900 text-white shadow"
      title="Saved"
      aria-label="Saved"
    >
      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17 3H7a2 2 0 0 0-2 2v16l7-4 7 4V5a2 2 0 0 0-2-2z" />
      </svg>
    </span>
  );
}