import { LicenceStatus } from "@/lib/data/licensedTracks";

interface Props {
  status: LicenceStatus;
  territory?: string;
  className?: string;
}

const TONES = {
  green: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800",
  amber: "bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800",
  red: "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border-red-300 dark:border-red-800",
  gray: "bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 border-gray-300 dark:border-zinc-700",
};

const LABELS: Record<LicenceStatus, string> = {
  licensed: "Licensed",
  "preview-only": "Preview only",
  pending: "Pending",
  unlicensed: "Not licensed",
};

const TONE_MAP: Record<LicenceStatus, keyof typeof TONES> = {
  licensed: "green",
  "preview-only": "amber",
  pending: "gray",
  unlicensed: "red",
};

export default function LicenceBadge({ status, territory, className = "" }: Props) {
  const tone = TONE_MAP[status];
  const label = LABELS[status];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${TONES[tone]} ${className}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${
        tone === "green" ? "bg-emerald-500" :
        tone === "amber" ? "bg-amber-500" :
        tone === "red" ? "bg-red-500" : "bg-gray-500"
      }`} />
      {label}{status === "licensed" && territory ? ` · ${territory}` : ""}
    </span>
  );
}