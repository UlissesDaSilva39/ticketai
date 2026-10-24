'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

export function ApplyModal({
  opportunity,
  onClose,
}: {
  opportunity: { id: string; title: string; org: string };
  onClose: () => void;
}) {
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    await new Promise((r) => setTimeout(r, 800));
    setSent(true);
    setSending(false);
  }

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div>
            <div className="text-xs font-semibold text-gray-400">{opportunity.org}</div>
            <div className="mt-1 text-lg font-bold text-gray-900">
              {opportunity.title}
            </div>
          </div>
          <button onClick={onClose} className="rounded-full p-1 hover:bg-gray-100">
            <X className="h-4 w-4" />
          </button>
        </div>

        {sent ? (
          <div className="mt-6 rounded-xl bg-green-50 p-4 text-center">
            <div className="text-sm font-medium text-green-900">
              Application sent
            </div>
            <p className="mt-1 text-xs text-green-700">
              They will get back to you if interested.
            </p>
            <button
              onClick={onClose}
              className="mt-3 rounded-full bg-black px-4 py-1.5 text-xs font-medium text-white"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-4 space-y-3">
            <textarea
              value={message}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setMessage(e.target.value)}
              placeholder="Why are you a good fit? Add links to your work."
              rows={5}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-black"
            />
            <button
              type="submit"
              disabled={sending}
              className="w-full rounded-full bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
            >
              {sending ? 'Sending...' : 'Send application'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
