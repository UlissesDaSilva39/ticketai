'use client';

import { Sidebar } from '@/components/sidebar/Sidebar';
import { HomeEventGrid } from './HomeEventGrid';
import {
  Image as ImageIcon,
  Calendar,
  Music,
  Sparkles,
  Users,
} from 'lucide-react';

export function HomeLoggedIn({
  user,
  events = [],
}: {
  user?: { name?: string };
  events?: any[];
}) {
  const name = user?.name ?? 'there';

  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="mx-auto max-w-[1400px] px-6 py-6 grid grid-cols-12 gap-6">
        {/* LEFT — SIDEBAR */}
        <div className="col-span-12 lg:col-span-3">
          <Sidebar />
        </div>

        {/* CENTER — FEED */}
        <div className="col-span-12 lg:col-span-6 flex flex-col gap-4">
          {/* Artist banner */}
          <div className="rounded-2xl bg-black text-white p-5 flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold">You have an artist page</div>
              <div className="mt-0.5 text-xs text-white/60">
                Manage your profile, bookings & releases
              </div>
            </div>
            <a
              href="/artist"
              className="rounded-full bg-white/10 px-4 py-1.5 text-xs font-medium hover:bg-white/20 transition"
            >
              View page
            </a>
          </div>

          {/* Composer */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <div className="flex items-start gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-black text-xs font-bold text-white shrink-0">
                {name[0]?.toUpperCase() ?? 'U'}
              </span>
              <input
                type="text"
                placeholder={`What's on your mind, ${name}?`}
                className="flex-1 rounded-full border border-gray-200 px-4 py-2 text-sm outline-none focus:border-black transition"
              />
            </div>
            <div className="mt-4 flex items-center gap-5 text-sm text-gray-500">
              <button className="flex items-center gap-1.5 hover:text-black transition">
                <ImageIcon className="h-4 w-4" />
                Photo
              </button>
              <button className="flex items-center gap-1.5 hover:text-black transition">
                <Calendar className="h-4 w-4" />
                Event
              </button>
              <button className="flex items-center gap-1.5 hover:text-black transition">
                <Music className="h-4 w-4" />
                Music
              </button>
              <a
                href="/feed"
                className="ml-auto rounded-full bg-black px-4 py-1.5 text-xs font-medium text-white hover:bg-gray-900 transition"
              >
                Post
              </a>
            </div>
          </div>

          {/* Tabs */}
          <div className="rounded-2xl border border-gray-200 bg-white p-1 flex">
            <a
              href="/feed"
              className="flex-1 rounded-xl bg-black py-2 text-center text-sm font-medium text-white"
            >
              For You
            </a>
            <a
              href="/feed?tab=following"
              className="flex-1 rounded-xl py-2 text-center text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
            >
              Following
            </a>
          </div>

          {/* Events */}
          <HomeEventGrid events={events} />

          {/* View full feed */}
          <a
            href="/feed"
            className="rounded-2xl border border-gray-200 bg-white p-4 text-center text-sm font-medium text-gray-700 hover:border-black transition"
          >
            View full feed on GRID
          </a>
        </div>

        {/* RIGHT — PEOPLE + OPPORTUNITIES */}
        <div className="col-span-12 lg:col-span-3 flex flex-col gap-4">
          {/* People to follow */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <div className="flex items-center gap-2 mb-4">
              <Users className="h-4 w-4 text-gray-400" />
              <div className="text-xs font-semibold tracking-wider text-gray-500">
                PEOPLE TO FOLLOW
              </div>
            </div>
            {[
              { name: 'DJ Carla', sub: 'House · London' },
              { name: 'Mike Producer', sub: 'Electronic · Berlin' },
              { name: 'Sarah A&R', sub: 'XYZ Records' },
            ].map((p) => (
              <div
                key={p.name}
                className="flex items-center gap-3 py-2.5 border-b border-gray-100 last:border-0"
              >
                <span className="grid h-9 w-9 place-items-center rounded-full bg-black text-[11px] font-bold text-white shrink-0">
                  {p.name[0]}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {p.name}
                  </div>
                  <div className="text-xs text-gray-500 truncate">{p.sub}</div>
                </div>
                <button className="rounded-full border border-gray-300 px-3 py-1 text-xs font-medium hover:bg-gray-50 transition">
                  Follow
                </button>
              </div>
            ))}
          </div>

          {/* Opportunities */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-4 w-4 text-fuchsia-500" />
              <div className="text-xs font-semibold tracking-wider text-gray-500">
                OPPORTUNITIES FOR YOU
              </div>
            </div>
            {[
              { title: 'Vocalist wanted',   match: '92%' },
              { title: 'DJ needed — MCR',   match: '89%' },
              { title: 'Producer collab',   match: '85%' },
            ].map((o) => (
              <a
                key={o.title}
                href="/opportunities"
                className="flex items-center justify-between py-2.5 border-b border-gray-100 last:border-0 hover:bg-gray-50 rounded-lg px-1 transition"
              >
                <span className="text-sm text-gray-700">{o.title}</span>
                <span className="text-xs font-medium text-fuchsia-600">{o.match}</span>
              </a>
            ))}
            <a
              href="/opportunities"
              className="mt-3 block text-xs font-medium text-black hover:underline"
            >
              View all opportunities →
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
