'use client';

import { Calendar, MapPin } from 'lucide-react';

type Event = {
  id: string;
  title: string;
  start_date: string;
  venue_name?: string | null;
  city?: string | null;
  image_url?: string | null;
  price_min?: number | null;
  price_max?: number | null;
};

function formatDate(iso: string) {
  const d = new Date(iso);
  const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${days[d.getDay()]} ${d.getDate()} ${months[d.getMonth()]}`;
}

export function HomeEventGrid({ events }: { events: Event[] }) {
  if (!events || events.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center">
        <Calendar className="mx-auto h-8 w-8 text-gray-400" />
        <div className="mt-3 text-sm font-medium text-gray-900">
          Nothing on the calendar yet
        </div>
        <p className="mt-1 text-xs text-gray-500">
          Follow artists or explore a city to see events here.
        </p>
        <a
          href="/london"
          className="mt-3 inline-block rounded-full bg-black px-4 py-1.5 text-xs font-medium text-white"
        >
          Explore London
        </a>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="text-xs font-semibold tracking-wider text-gray-500">
          HAPPENING THIS WEEK
        </div>
        <a href="/events" className="text-xs font-medium text-black hover:underline">
          See all
        </a>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {events.slice(0, 6).map((e) => (
          <a
            key={e.id}
            href={`/event/${e.id}`}
            className="group flex gap-3 rounded-xl border border-gray-100 p-3 hover:border-black transition"
          >
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-gray-900 truncate">
                {e.title}
              </div>
              <div className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                <Calendar className="h-3 w-3" />
                {formatDate(e.start_date)}
              </div>
              {e.venue_name && (
                <div className="mt-0.5 flex items-center gap-1 text-xs text-gray-500 truncate">
                  <MapPin className="h-3 w-3" />
                  {e.venue_name}
                  {e.city ? `, ${e.city}` : ''}
                </div>
              )}
            </div>
            {e.image_url ? (
              <img
                src={e.image_url}
                alt={e.title}
                className="h-16 w-16 rounded-lg object-cover"
              />
            ) : (
              <div className="h-16 w-16 rounded-lg bg-gradient-to-br from-fuchsia-500 to-cyan-400" />
            )}
          </a>
        ))}
      </div>
    </div>
  );
}
