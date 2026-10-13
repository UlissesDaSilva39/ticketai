export default function Page({ params }: { params: { id: string } }) {
  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="text-2xl font-bold">Print ticket</h1>
      <p className="text-sm text-gray-600 mt-2">Ticket ID: {params.id}</p>
    </div>
  );
}