import PromoterClient from './PromoterClient'
export default async function PromoterProfile({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return <PromoterClient id={resolvedParams.id} />
}