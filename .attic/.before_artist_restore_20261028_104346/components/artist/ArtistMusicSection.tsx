type Props = {
  spotifyUrl: string | null;
  artistName: string;
};

export default function ArtistMusicSection({ spotifyUrl, artistName }: Props) {
  const embedUrl = (() => {
    if (!spotifyUrl) return null;
    try {
      const url = new URL(spotifyUrl);
      if (!url.hostname.includes("spotify.com")) return null;
      const parts = url.pathname.split("/").filter(Boolean);
      const artistIdx = parts.indexOf("artist");
      if (artistIdx === -1) return null;
      const id = parts[artistIdx + 1];
      if (!id) return null;
      return "https://open.spotify.com/embed/artist/" + id + "?utm_source=generator&theme=0";
    } catch {
      return null;
    }
  })();

  return (
    <section className="bg-white border border-gray-200 rounded-2xl p-6">
      <div className="flex items-baseline justify-between mb-4">
        <h2 className="text-lg font-semibold">Music</h2>
        {spotifyUrl && (
          <a
            href={spotifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-500 hover:text-black"
          >
            Open in Spotify ↗
          </a>
        )}
      </div>

      {embedUrl ? (
        <iframe
          src={embedUrl}
          width="100%"
          height="380"
          frameBorder="0"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          title={artistName + " on Spotify"}
          className="rounded-xl"
        />
      ) : (
        <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
          <p className="text-sm text-gray-500 mb-4">No playlist available yet.</p>
          <a
            href={"https://open.spotify.com/search/" + encodeURIComponent(artistName)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-5 py-2 border border-gray-300 rounded-full text-sm font-medium hover:bg-white"
          >
            Search {artistName} on Spotify ↗
          </a>
        </div>
      )}
    </section>
  );
}
