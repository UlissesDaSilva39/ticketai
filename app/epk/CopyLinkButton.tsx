"use client";

import { useState } from "react";

/** Copies the full URL of a GRID page (e.g. the public profile) to the clipboard. */
export default function CopyLinkButton({ path, label = "Copy public link" }: { path: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(window.location.origin + path);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch {
          /* clipboard blocked */
        }
      }}
      className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
    >
      {copied ? "Copied ✓" : label}
    </button>
  );
}
