/** Small pill shown next to paid members' names: "PRO" (amber) or "PREMIUM" (violet). */
export default function ProBadge({ tier = "pro", className = "" }: { tier?: "pro" | "premium" | string | null; className?: string }) {
  const premium = tier === "premium";
  return (
    <span
      title={premium ? "GRID Premium member" : "GRID Pro member"}
      className={`inline-flex items-center rounded px-1.5 py-px text-[10px] font-extrabold uppercase tracking-wide ${
        premium ? "bg-violet-600 text-white" : "bg-amber-400 text-amber-950"
      } ${className}`}
    >
      {premium ? "Premium" : "Pro"}
    </span>
  );
}
