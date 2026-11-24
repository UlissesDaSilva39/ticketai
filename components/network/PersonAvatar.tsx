import { initials } from "@/lib/display";
import { openToLabels } from "@/lib/open-to";

/**
 * Profile photo with an "Open to…" ring and banner (like "#OPENTOWORK"),
 * shown when the member has chosen at least one Open-to option.
 */
export default function PersonAvatar({
  name,
  src,
  openTo,
  size = 64,
}: {
  name: string;
  src: string | null;
  openTo?: string[] | null;
  size?: number;
}) {
  const badges = openToLabels(openTo);
  const first = badges[0];
  const dim = { width: size, height: size };
  return (
    <span className="relative inline-block flex-shrink-0" style={dim} title={badges.map((b) => b.label).join(" · ") || undefined}>
      <span className={`block h-full w-full overflow-hidden rounded-full ${first ? "ring-[3px] ring-emerald-500 ring-offset-2 ring-offset-white dark:ring-offset-zinc-900" : ""}`}>
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt="" className="h-full w-full object-cover" />
        ) : (
          <span className="grid h-full w-full place-items-center bg-emerald-700 font-bold text-white" style={{ fontSize: Math.max(11, size / 3.2) }}>
            {initials(name)}
          </span>
        )}
      </span>
      {first && size >= 48 && (
        <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-emerald-600 px-1.5 py-px text-[8px] font-extrabold tracking-wide text-white shadow">
          {first.short}
        </span>
      )}
    </span>
  );
}
