interface Props {
  available: boolean;
  location?: string;
  bookedUntil?: string;
}

export default function AvailabilityBadge({ available, location, bookedUntil }: Props) {
  if (available) {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 text-xs font-bold">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        Available{location ? ` in ${location}` : ""}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-400 text-xs font-bold">
      <span className="w-2 h-2 rounded-full bg-gray-400"></span>
      Booked{bookedUntil ? ` until ${bookedUntil}` : ""}
    </span>
  );
}