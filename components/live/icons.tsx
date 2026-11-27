// GRID LIVE icon set: one consistent line style (lucide), brand colours.
// Gifts get a tile whose colour rises with the value, so bigger gifts look bigger.
import { Disc3, Flame, Headphones, Mic, Rocket, Sparkles, Trophy, type LucideIcon } from "lucide-react";

const GIFT_STYLE: Record<string, { Icon: LucideIcon; tile: string }> = {
  clap: { Icon: Sparkles, tile: "from-emerald-400 to-emerald-600" },
  mic: { Icon: Mic, tile: "from-emerald-500 to-emerald-700" },
  headphones: { Icon: Headphones, tile: "from-teal-500 to-emerald-800" },
  vinyl: { Icon: Disc3, tile: "from-zinc-700 to-zinc-950" },
  encore: { Icon: Flame, tile: "from-amber-400 to-orange-600" },
  headliner: { Icon: Trophy, tile: "from-amber-300 to-amber-600" },
  soldout: { Icon: Rocket, tile: "from-emerald-500 via-teal-600 to-zinc-900" },
};

const SIZES = { sm: { box: "w-7 h-7 rounded-lg", icon: "w-4 h-4" }, md: { box: "w-10 h-10 rounded-xl", icon: "w-5 h-5" }, lg: { box: "w-14 h-14 rounded-2xl", icon: "w-7 h-7" } };

export function GiftIcon({ id, size = "md" }: { id: string | null | undefined; size?: keyof typeof SIZES }) {
  const s = GIFT_STYLE[id ?? ""] ?? GIFT_STYLE.clap;
  const z = SIZES[size];
  return (
    <span className={`${z.box} inline-flex flex-none items-center justify-center bg-gradient-to-br ${s.tile} text-white shadow-sm ring-1 ring-black/5`} aria-hidden="true">
      <s.Icon className={z.icon} strokeWidth={2} />
    </span>
  );
}

/** GRID coin: emerald disc with a G mark. */
export function CoinIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={`${className} inline-block flex-none`} aria-hidden="true">
      <circle cx="12" cy="12" r="11" fill="#059669" />
      <circle cx="12" cy="12" r="8.5" fill="none" stroke="#a7f3d0" strokeWidth="1.2" />
      <path d="M15.2 9.4A4 4 0 1 0 16 13h-3.6" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Pulsing live dot. */
export function LiveDot({ className = "" }: { className?: string }) {
  return (
    <span className={`relative inline-flex w-2 h-2 ${className}`} aria-hidden="true">
      <span className="absolute inset-0 rounded-full bg-current opacity-60 motion-safe:animate-ping" />
      <span className="relative w-2 h-2 rounded-full bg-current" />
    </span>
  );
}
