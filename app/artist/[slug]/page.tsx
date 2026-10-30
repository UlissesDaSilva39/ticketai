import { createClient } from '@supabase/supabase-js';
import { ClaimButton } from '@/components/claims/ClaimButton';
import Link from 'next/link';
import { ArtistBioSection } from '@/components/artist/ArtistBioSection'
import { ArtistTopTracks } from '@/components/artist/ArtistTopTracks'
import { ArtistUpcomingShows } from '@/components/artist/ArtistUpcomingShows'
import { ArtistBookingCTA } from '@/components/artist/ArtistBookingCTA'

export const dynamic = 'force-dynamic';

async function getArtist(slug: string) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return null;
  const supabase = createClient(url, key);
  
  const { data: artist } = await supabase
    .from('artists')
    .select('id, slug, name, handle, artist_type, genre, secondary_genres, city, country, bio, website, spotify, instagram, avatar_url, cover_image, verified')
    .eq('slug', slug)
    .maybeSingle();

  return artist;
}

export default async function ArtistPage({ params }: { params: { slug: string } }) {
  const artist = await getArtist(params.slug);

  if (!artist) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center dark:bg-gray-950 dark:text-gray-100">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 mb-4">Artist not found</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">This profile does not exist yet.</p>
        <Link href="/discover/artists" className="inline-block px-6 py-3 bg-black text-white font-bold rounded-lg hover:bg-gray-800">
          Back to artists
        </Link>
      </div>
    );
  }

  // Mock follower count for now
  const followerCount = 12400; 

  // Fallback image if no cover/avatar exists
  const fallbackImage = 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1200&q=80';
  const coverImage = artist.cover_image || fallbackImage;
  const avatarImage = artist.avatar_url || fallbackImage;

  return (
    <div className="max-w-3xl mx-auto px-4 py-20 text-center dark:bg-gray-950 dark:text-gray-100">
      
      {/* 1. COVER IMAGE (Hero) */}
      <div className="max-w-3xl mx-auto px-4 py-20 text-center dark:bg-gray-950 dark:text-gray-100">
        <img 
          src={coverImage} 
          alt="" 
          className="w-full h-full object-cover opacity-60"
        />
        <div className="max-w-3xl mx-auto px-4 py-20 text-center dark:bg-gray-950 dark:text-gray-100" />
        
        {/* Back button */}
        <Link href="/discover/artists" className="absolute top-4 left-4 bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-white/30 transition">
          â† Back
        </Link>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-20 text-center dark:bg-gray-950 dark:text-gray-100">
        
        {/* 2. PROFILE PICTURE + ACTION BAR */}
        <div className="max-w-3xl mx-auto px-4 py-20 text-center dark:bg-gray-950 dark:text-gray-100">
          
          {/* Profile Picture */}
          <div className="max-w-3xl mx-auto px-4 py-20 text-center dark:bg-gray-950 dark:text-gray-100">
            <img 
              src={avatarImage} 
              alt={artist.name} 
              className="w-full h-full object-cover"
            />
          </div>

          {/* Stats & Claim */}
          <div className="max-w-3xl mx-auto px-4 py-20 text-center dark:bg-gray-950 dark:text-gray-100">
            <div className="max-w-3xl mx-auto px-4 py-20 text-center dark:bg-gray-950 dark:text-gray-100">
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{followerCount.toLocaleString()}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold">Fans</p>
            </div>
            <div className="max-w-3xl mx-auto px-4 py-20 text-center dark:bg-gray-950 dark:text-gray-100"></div>
            <div className="max-w-3xl mx-auto px-4 py-20 text-center dark:bg-gray-950 dark:text-gray-100">
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{artist.verified ? 'Verified' : 'Listed'}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold">Status</p>
            </div>
            <div className="max-w-3xl mx-auto px-4 py-20 text-center dark:bg-gray-950 dark:text-gray-100">
              <ClaimButton targetType="artist" targetId={artist.id} targetName={artist.name} />
            </div>
          </div>
        </div>

        {/* 3. ARTIST DETAILS */}
        <div className="max-w-3xl mx-auto px-4 py-20 text-center dark:bg-gray-950 dark:text-gray-100">
          
          {/* Left Column: Bio & Info */}
          <div className="max-w-3xl mx-auto px-4 py-20 text-center dark:bg-gray-950 dark:text-gray-100">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-gray-100">{artist.name}</h1>
              <p className="text-base text-gray-600 dark:text-gray-400 mt-1">
                {[artist.artist_type, artist.genre, artist.city].filter(Boolean).join(' Â· ')}
              </p>
            </div>

            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">About</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                {artist.bio || `${artist.name} is an artist on GRID.`}
              </p>
            </section>

            {/* Links */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">Links</h2>
              <div className="max-w-3xl mx-auto px-4 py-20 text-center dark:bg-gray-950 dark:text-gray-100">
                {artist.website && (
                  <a href={artist.website} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-sm font-semibold text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200">
                    Website
                  </a>
                )}
                {artist.spotify && (
                  <a href={artist.spotify} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-green-50 text-sm font-semibold text-green-700 rounded-lg hover:bg-green-100">
                    Spotify
                  </a>
                )}
                {artist.instagram && (
                  <a href={artist.instagram} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-pink-50 text-sm font-semibold text-pink-700 rounded-lg hover:bg-pink-100">
                    Instagram
                  </a>
                )}
              </div>
            </section>
          </div>

          {/* Right Column: CTAs */}
          <div className="max-w-3xl mx-auto px-4 py-20 text-center dark:bg-gray-950 dark:text-gray-100">
            {/* Live Shows */}
            <div className="max-w-3xl mx-auto px-4 py-20 text-center dark:bg-gray-950 dark:text-gray-100">
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">Live Shows</h3>
      {/* --- v2 auto-inserted artist profile sections --- */}
      <ArtistBioSection bio={artist.bio} name={artist.display_name || artist.username} />
      <ArtistTopTracks tracks={tracks || []} artistName={artist.display_name || artist.username} />
      <ArtistUpcomingShows shows={events || []} />
      <ArtistBookingCTA artistId={artist.id} artistSlug={artist.slug} isLoggedIn={!!user} />
      {/* --- end auto-inserted --- */}

              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Tickets and tour dates are managed by Ticketmaster.
              </p>
              <a 
                href={`https://www.ticketmaster.co.uk/search?q=${encodeURIComponent(artist.name)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full py-3 bg-black text-white text-center font-bold rounded-xl hover:bg-gray-800 transition"
              >
                View Tickets â†—
              </a>
            </div>

            {/* Booking */}
            <div className="max-w-3xl mx-auto px-4 py-20 text-center dark:bg-gray-950 dark:text-gray-100">
              <div className="space-y-4 mt-6">
        <ArtistBioSection bio={artist.bio} name={artist.display_name || artist.username} />
        <ArtistTopTracks tracks={[] || []} artistName={artist.display_name || artist.username} />
        <ArtistUpcomingShows shows={[] || []} />
        <ArtistBookingCTA artistId={artist.id} artistSlug={artist.slug} isLoggedIn={!!user} />
      </div>
              <Link 
                href={`/book/artist/${artist.slug}`}
                className="block w-full py-3 bg-purple-600 text-white text-center font-bold rounded-xl hover:bg-purple-700 transition"
              >
                Sign up to book
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



