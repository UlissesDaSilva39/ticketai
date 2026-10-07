import Link from "next/link";
import { priceFrom } from "@/lib/posts";

type Show = {
  id: string;
  title: string;
  start_date: string | null;
  hero_image: string | null;
  ticket_types: Array<{ name: string; price: number; quantity: number }> | null;
};

export default function UpcomingShows({ shows }: { shows: Show[] }) {
  if (shows.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-6 text-center">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
          Upcoming Shows
        </p>
        <p className="text-sm text-gray-500">No upcoming shows scheduled.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
          Upcoming Shows
        </p>
        <Link href="/search" className="text-xs text-gray-500 hover:text-black">
          See all
        </Link>
      </div>
      <ul>
        {shows.map((s) => {
          const from = priceFrom(s.ticket_types);
          const date = s.start_date
            ? new Date(s.start_date).toLocaleDateString("en-GB", {
                weekday: "short",
                day: "numeric",
                month: "short",
                timeZone: "UTC",
              })
            : "Date TBC";
          return (
            <li
              key={s.id}
              className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50"
            >
              <div className="w-14 h-14 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                {s.hero_image ? (
                  <img src={s.hero_image} alt="" className="w-full h-full object-cover" />
                ) : null}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{s.title}</p>
                <p className="text-xs text-gray-500">
                  {date}
                  {from !== null ? " - From \u00A3" + from.toFixed(2) : ""}
                </p>
              </div>
              <Link
                href={"/event/" + s.id}
                className="px-4 py-1.5 text-xs font-medium rounded-full bg-black text-white hover:bg-gray-800 shrink-0"
              >
                Tickets
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}