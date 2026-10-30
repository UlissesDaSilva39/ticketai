import Link from 'next/link';
import { MessageButton } from '@/components/promoters/MessageButton';

export function ArtistBottomCTA({ handle, name }: { handle: string; name: string }) {
  return (
    <section className="flex flex-wrap items-center justify-center gap-3 border-t border-neutral-200 pt-10">
      <MessageButton promoterSlug={handle} promoterName={name} variant="secondary" size="md" />
      <Link
        href={`/artists/${handle}/book`}
        className="rounded-full bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800"
      >
        Book a session →
      </Link>
    </section>
  );
}