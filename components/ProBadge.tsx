/** Small "PRO" pill shown next to GRID Pro members' names. */
export default function ProBadge({ className = "" }: { className?: string }) {
  return (
    <span
      title="GRID Pro member"
      className={`inline-flex items-center rounded bg-amber-400 px-1.5 py-px text-[10px] font-extrabold uppercase tracking-wide text-amber-950 ${className}`}
    >
      Pro
    </span>
  );
}
