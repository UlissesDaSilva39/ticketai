'use client';

import { useEffect, useRef, useState } from 'react';

type Props = {
  open: boolean;
  onClose: () => void;
  promoterSlug: string;
  promoterName: string;
  context?: {
    eventSlug?: string;
    eventTitle?: string;
    venueSlug?: string;
    venueName?: string;
  };
};

const MAX = 1000;

export function MessageModal({
  open, onClose, promoterSlug, promoterName, context,
}: Props) {
  const [body, setBody]       = useState('');
  const [subject, setSubject] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent]       = useState(false);
  const [error, setError]     = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!open) return;
    const parts: string[] = [];
    if (context?.eventTitle) parts.push(`Event: ${context.eventTitle}`);
    if (context?.venueName) parts.push(`Venue: ${context.venueName}`);
    setSubject(parts.join(' · '));
    setSent(false);
    setError(null);
    setTimeout(() => textareaRef.current?.focus(), 50);
  }, [open, context?.eventTitle, context?.venueName]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (body.trim().length < 5) { setError('Message is too short.'); return; }
    if (body.length > MAX)      { setError(`Message too long (max ${MAX} characters).`); return; }

    setSending(true);
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toSlug: promoterSlug,
          subject: subject.trim() || null,
          body: body.trim(),
          context: context ?? null,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? 'Failed to send message.');
      }
      setSent(true);
      setBody('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setSending(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50 p-0 md:items-center md:p-6"
      role="dialog" aria-modal="true" aria-labelledby="message-modal-title"
      onClick={onClose}>
      <div className="w-full max-w-lg rounded-t-2xl bg-white shadow-2xl md:rounded-2xl"
        onClick={(e) => e.stopPropagation()}>
        <header className="flex items-center justify-between border-b border-neutral-200 px-5 py-4">
          <div>
            <h2 id="message-modal-title" className="text-base font-semibold">
              Message {promoterName}
            </h2>
            <p className="text-xs text-neutral-500">
              They typically reply within 1–2 days.
            </p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close"
            className="rounded-full p-2 text-neutral-500 hover:bg-neutral-100">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="2"
              strokeLinecap="round" className="h-4 w-4" aria-hidden>
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </header>

        {sent ? (
          <div className="px-5 py-10 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
              ✓
            </div>
            <p className="mt-4 text-base font-semibold">Message sent</p>
            <p className="mt-1 text-sm text-neutral-500">
              You&apos;ll get a reply in your inbox at{' '}
              <a href="/messages" className="underline">/messages</a>.
            </p>
            <button type="button" onClick={onClose}
              className="mt-6 rounded-full bg-black px-6 py-2.5 text-sm font-semibold text-white hover:bg-neutral-800">
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 px-5 py-5">
            <div>
              <label htmlFor="message-subject"
                className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                Subject (optional)
              </label>
              <input id="message-subject" type="text" value={subject}
                onChange={(e) => setSubject(e.target.value.slice(0, 120))}
                placeholder={`Booking enquiry · ${promoterName}`}
                className="mt-2 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-black" />
            </div>

            <div>
              <label htmlFor="message-body"
                className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                Message
              </label>
              <textarea id="message-body" ref={textareaRef} value={body}
                onChange={(e) => setBody(e.target.value.slice(0, MAX))}
                rows={6}
                placeholder={`Hi ${promoterName.split(' ')[0]}, I wanted to ask about…`}
                className="mt-2 w-full resize-none rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-black"
                required />
              <p className="mt-1 text-right text-xs text-neutral-400">
                {body.length} / {MAX}
              </p>
            </div>

            {error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
            )}

            <footer className="flex items-center justify-end gap-3 pt-1">
              <button type="button" onClick={onClose}
                className="rounded-full px-4 py-2 text-sm font-medium text-neutral-600 hover:text-black">
                Cancel
              </button>
              <button type="submit" disabled={sending}
                className="rounded-full bg-black px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60">
                {sending ? 'Sending…' : 'Send message'}
              </button>
            </footer>
          </form>
        )}
      </div>
    </div>
  );
}