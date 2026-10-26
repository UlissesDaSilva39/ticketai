'use client';
import Link from 'next/link';
import { useState } from 'react';
import type { UserWithRole } from '@/lib/roles';
import { getUserRole, getDashboardHref, isFan, isClubMember, ROLE_LABELS } from '@/lib/roles';
import { CLUB_UPGRADE_URL, CLUB_MANAGE_URL } from '@/lib/club';

export function ProfileMenu({ user }: { user: UserWithRole }) {
  const [open, setOpen] = useState(false);
  const role = getUserRole(user);
  const dashboard = getDashboardHref(user);
  const fan = isFan(user);
  const club = isClubMember(user);

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-r from-violet-600 to-pink-500 text-white font-bold text-sm"
        aria-label="Profile menu"
      >
        {user?.name?.[0]?.toUpperCase() || 'D'}
      </button>

      {open && (
        <div className="absolute right-0 top-full pt-2 z-50">
          <div className="min-w-[240px] rounded-2xl border border-gray-200 bg-white p-2 shadow-lg">
            {user && (
              <div className="px-3 py-2 border-b border-gray-100 mb-1">
                <div className="font-semibold text-sm text-gray-900">{user.name}</div>
                <div className="text-xs text-gray-500">
                  {ROLE_LABELS[role]}
                  {club && <span className="ml-1 text-violet-600">· Club member</span>}
                </div>
              </div>
            )}

            <Link href="/profile" className="block rounded-lg px-3 py-2 text-sm text-gray-900 hover:bg-gray-100">
              Profile
            </Link>

            {dashboard && (
              <Link href={dashboard} className="block rounded-lg px-3 py-2 text-sm text-gray-900 hover:bg-gray-100">
                My {ROLE_LABELS[role].toLowerCase()} page
              </Link>
            )}

            <Link href="/my-tickets" className="block rounded-lg px-3 py-2 text-sm text-gray-900 hover:bg-gray-100">
              My Tickets
            </Link>

            {/* Role upgrade CTA - show for fans */}
            {fan && (
              <div className="border-t border-gray-100 mt-1 pt-1">
                <Link href="/artist/register" className="block rounded-lg px-3 py-2 text-sm font-medium text-violet-700 hover:bg-violet-50">
                  Become an artist →
                </Link>
                <Link href="/promoters/join" className="block rounded-lg px-3 py-2 text-sm font-medium text-violet-700 hover:bg-violet-50">
                  Become a promoter →
                </Link>
                <Link href="/venues/join" className="block rounded-lg px-3 py-2 text-sm font-medium text-violet-700 hover:bg-violet-50">
                  Become a venue →
                </Link>
              </div>
            )}

            {/* Club upgrade CTA - show for role users not in club */}
            {!fan && !club && (
              <div className="border-t border-gray-100 mt-1 pt-1">
                <Link href={CLUB_UPGRADE_URL} className="block rounded-lg px-3 py-2 text-sm font-semibold text-violet-700 bg-violet-50 hover:bg-violet-100">
                  ⭐ Upgrade to Club →
                </Link>
              </div>
            )}

            {/* Club manage - show for club members */}
            {!fan && club && (
              <div className="border-t border-gray-100 mt-1 pt-1">
                <Link href={CLUB_MANAGE_URL} className="block rounded-lg px-3 py-2 text-sm text-violet-700 hover:bg-violet-50">
                  Manage Club membership
                </Link>
              </div>
            )}

            <div className="border-t border-gray-100 mt-1 pt-1">
              <Link href="/settings" className="block rounded-lg px-3 py-2 text-sm text-gray-900 hover:bg-gray-100">
                Settings
              </Link>
              <Link href="/auth/signout" className="block rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100">
                Log out
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
