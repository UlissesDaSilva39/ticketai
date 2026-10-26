import VenueClient from './VenueClient'

export default async function VenueProfile({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return <VenueClient id={resolvedParams.id} />
}