export function KpiRow({
  items,
}: {
  items: { label: string; value: number | string | null | undefined }[];
}) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {items.map((k) => (
        <div key={k.label} className="rounded-xl bg-white/5 p-3">
          <p className="text-2xl font-bold">{k.value ?? "—"}</p>
          <p className="text-xs text-white/60">{k.label}</p>
        </div>
      ))}
    </div>
  );
}
