import { createClient } from '@supabase/supabase-js';
import { ClaimButton } from '@/components/claims/ClaimButton';
import Link from 'next/link';

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
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-4">Artist not found</h1>
        <p className="text-gray-600 mb-8">This profile does not exist yet.</p>
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
    <div className="min-h-screen bg-gray-50 pb-20">
      
      {/* 1. COVER IMAGE (Hero) */}
      <div className="relative h-48 sm:h-64 w-full bg-gray-900">
        <img 
          src={coverImage} 
          alt="" 
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        
        {/* Back button */}
        <Link href="/discover/artists" className="absolute top-4 left-4 bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-white/30 transition">
          ← Back
        </Link>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* 2. PROFILE PICTURE + ACTION BAR */}
        <div className="relative -mt-16 sm:-mt-20 mb-8 flex flex-col sm:flex-row items-center sm:items-end justify-between gap-4">
          
          {/* Profile Picture */}
          <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl border-4 border-white shadow-xl overflow-hidden bg-gray-200 shrink-0">
            <img 
              src={avatarImage} 
              alt={artist.name} 
              className="w-full h-full object-cover"
            />
          </div>

          {/* Stats & Claim */}
          <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-4 rounded-2xl shadow-lg sm:mb-4 w-full sm:w-auto">
            <div className="text-center px-4">
              <p className="text-2xl font-bold text-gray-900">{followerCount.toLocaleString()}</p>
              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Fans</p>
            </div>
            <div className="hidden sm:block w-px h-10 bg-gray-200"></div>
            <div className="text-center px-4">
              <p className="text-2xl font-bold text-gray-900">{artist.verified ? 'Verified' : 'Listed'}</p>
              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Status</p>
            </div>
            <div className="w-full sm:w-auto mt-2 sm:mt-0">
              <ClaimButton targetType="artist" targetId={artist.id} targetName={artist.name} />
            </div>
          </div>
        </div>

        {/* 3. ARTIST DETAILS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Left Column: Bio & Info */}
          <div className="md:col-span-2 space-y-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">{artist.name}</h1>
              <p className="text-base text-gray-600 mt-1">
                {[artist.artist_type, artist.genre, artist.city].filter(Boolean).join(' · ')}
              </p>
            </div>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">About</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {artist.bio || `${artist.name} is an artist on GRID.`}
              </p>
            </section>

            {/* Links */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-3">Links</h2>
              <div className="flex flex-wrap gap-3">
                {artist.website && (
                  <a href={artist.website} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-gray-100 text-sm font-semibold text-gray-700 rounded-lg hover:bg-gray-200">
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
          <div className="space-y-4">
            {/* Live Shows */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Live Shows</h3>
              <p className="text-sm text-gray-600 mb-4">
                Tickets and tour dates are managed by Ticketmaster.
              </p>
              <a 
                href={`https://www.ticketmaster.co.uk/search?q=${encodeURIComponent(artist.name)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full py-3 bg-black text-white text-center font-bold rounded-xl hover:bg-gray-800 transition"
              >
                View Tickets ↗
              </a>
            </div>

            {/* Booking */}
            <div className="bg-purple-50 p-6 rounded-2xl border border-purple-100 shadow-sm">
              <h3 className="text-lg font-bold text-purple-900 mb-2">Booking</h3>
              <p className="text-sm text-purple-700 mb-4">
                Request for your next event. Escrow protected.
              </p>
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