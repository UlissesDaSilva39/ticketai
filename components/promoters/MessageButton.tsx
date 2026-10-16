'use client';

import { useState } from 'react';
import { MessageModal } from './MessageModal';

type Props = {
  promoterSlug: string;
  promoterName: string;
  context?: {
    eventSlug?: string;
    eventTitle?: string;
    venueSlug?: string;
    venueName?: string;
  };
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md';
  className?: string;
};

export function MessageButton({
  promoterSlug, promoterName, context,
  variant = 'secondary', size = 'sm', className = '',
}: Props) {
  const [open, setOpen] = useState(false);

  const styles =
    variant === 'primary'
      ? 'bg-black text-white hover:bg-neutral-800'
      : variant === 'secondary'
      ? 'border border-neutral-300 bg-white text-neutral-900 hover:border-neutral-900'
      : 'text-neutral-700 hover:text-black';

  const dims = size === 'sm' ? 'px-4 py-2 text-xs' : 'px-6 py-3 text-sm';

  return (
    <>
      <button type="button" onClick={() => setOpen(true)}
        className={`inline-flex items-center gap-2 rounded-full font-semibold transition ${styles} ${dims} ${className}`}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" strokeWidth="1.8"
          strokeLinecap="round" strokeLinejoin="round"
          className="h-4 w-4" aria-hidden>
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
        Message
      </button>

      <MessageModal
        open={open}
        onClose={() => setOpen(false)}
        promoterSlug={promoterSlug}
        promoterName={promoterName}
        context={context}
      />
    </>
  );
}