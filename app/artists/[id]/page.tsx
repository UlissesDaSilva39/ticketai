import ArtistClient from './ArtistClient'

export default async function ArtistProfile({ params }: { params: Promise<{ id: string }> }) {
  // In Next.js 16, params is a Promise. We must await it in a Server Component.
  const resolvedParams = await params;
  
  return <ArtistClient id={resolvedParams.id} />
}