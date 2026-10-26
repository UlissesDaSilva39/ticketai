import LabelClient from './LabelClient'

export default async function LabelProfile({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return <LabelClient id={resolvedParams.id} />
}