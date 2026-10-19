import Link from 'next/link';

export function ArtistCard({ artist }: { artist: any }) {
  // Valores padrão seguros
  const name = artist.name || artist.full_name || artist.username || "Artist";
  const city = artist.city || "Unknown";
  const bio = artist.bio || "";
  const role = artist.role || "Artist";
  const key = artist.key || "";
  const genres = artist.genres || (artist.genre ? [artist.genre] : []);
  const slug = artist.username || artist.slug || artist.id || "";
  const verified = artist.verified || false;
  const bookingCount = artist.bookingCount || 0;
  const placements = artist.placements || 0;
  const photos = artist.photos || [];
  const demo = artist.featuredDemo || null;

  return (
    <article className="flex flex-col rounded-2xl border border-neutral-200 bg-white p-5 transition hover:border-neutral-900">
      <header className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          {artist.avatar_url ? (
            <img src={artist.avatar_url} alt={name} className="h-12 w-12 rounded-full object-cover" />
          ) : (
            <div className="h-12 w-12 rounded-full bg-neutral-900 text-white flex items-center justify-center text-sm font-bold">
              {name.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase()}
            </div>
          )}
          <div className="min-w-0">
            <h3 className="truncate text-lg font-semibold">{name}</h3>
            <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">{city}</p>
          </div>
        </div>
        {verified && (
          <span className="rounded-full bg-neutral-900 px-2 py-0.5 text-[10px] font-semibold text-white">VERIFIED</span>
        )}
      </header>

      {bio && <p className="mt-2 line-clamp-2 text-sm text-neutral-600">{bio}</p>}

      <div className="mt-3 flex flex-wrap gap-1.5 text-[11px]">
        <span className="rounded-full bg-neutral-100 px-2 py-1 font-medium">{role}</span>
        {key && <span className="rounded-full bg-neutral-100 px-2 py-1 font-medium">{key}</span>}
        {genres.map((g: string) => (
          <span key={g} className="rounded-full bg-neutral-100 px-2 py-1 font-medium">{g}</span>
        ))}
      </div>

      {demo ? (
        <div className="mt-4 rounded-xl border border-neutral-200 bg-neutral-50 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500">Featured demo</p>
          <p className="mt-1 text-sm font-semibold text-neutral-900">{demo.title}</p>
          <p className="mt-0.5 text-sm text-neutral-600">{demo.key} · {demo.role} · {demo.genre}</p>
          <div className="mt-3 flex items-center justify-between gap-3">
            <button type="button" className="inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-900 hover:border-neutral-900">▶ Preview</button>
            <span className="text-sm font-semibold text-neutral-900">{demo.rate}</span>
            <Link href={`/artists/${slug}/book`} className="rounded-full bg-black px-4 py-2 text-xs font-semibold text-white transition hover:bg-neutral-800">BOOK NOW</Link>
          </div>
        </div>
      ) : (
        <div className="mt-4 rounded-xl border border-dashed border-neutral-300 bg-neutral-50 p-4 text-sm text-neutral-500">
          No demos listed yet — <Link href={`/artists/${slug}`} className="underline">follow to be notified</Link>.
        </div>
      )}

      <div className="mt-4 flex items-center gap-2 text-xs text-neutral-600">
        <span className="rounded-full bg-neutral-100 px-2 py-1">{bookingCount} bookings</span>
        <span className="rounded-full bg-neutral-100 px-2 py-1">{placements} placements</span>
      </div>

      {photos.length > 0 && (
        <div className="mt-3 flex gap-1.5">
          {photos.slice(0, 4).map((src: string, i: number) => (
            <img key={i} src={src} alt="" className="h-10 w-10 rounded-md object-cover" />
          ))}
        </div>
      )}

      <div className="mt-5 flex items-center gap-2 border-t border-neutral-100 pt-4">
        <Link href={`/artists/${slug}`} className="text-xs font-semibold text-neutral-900 hover:underline">View profile →</Link>
      </div>
    </article>
  );
}