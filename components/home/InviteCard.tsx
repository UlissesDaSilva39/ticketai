"use client";

import { useState } from "react";

export default function InviteCard() {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(window.location.origin + "/join");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  }

  return (
    <section aria-label="Invite" className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm text-neutral-900">
      <h3 className="font-semibold">Grow your network</h3>
      <p className="mt-1 text-sm text-neutral-600">Invite a vocalist, producer or venue to join GRID.</p>
      <button
        type="button"
        onClick={copy}
        data-cta="invite-copy-link"
        className="mt-3 w-full rounded-lg border border-neutral-300 py-2 text-sm font-medium hover:bg-neutral-50"
      >
        {copied ? "Link copied!" : "Copy invite link"}
      </button>
    </section>
  );
}