'use client';

import Link from 'next/link';

export default function ProfileHeader({ profile, isOwnProfile, stats }: { profile: any, isOwnProfile: boolean, stats: any }) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
      <div className="h-32 bg-gradient-to-r from-emerald-600 to-emerald-900"></div>
      <div className="px-6 pb-6 relative">
        <div className="flex items-end justify-between -mt-12 mb-4">
          <div className="w-24 h-24 bg-zinc-800 rounded-full border-4 border-white dark:border-gray-900 flex items-center justify-center text-3xl font-bold text-white shadow-lg">
            {profile.full_name?.charAt(0) || 'U'}
          </div>
          {isOwnProfile && (
            <Link href="/profile/edit" className="bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-md text-sm font-medium">
              Edit profile
            </Link>
          )}
        </div>
        
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {profile.full_name || profile.username || 'User'}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">@{profile.username || 'guest'}</p>
        </div>

        <div className="flex gap-6 border-t border-gray-100 dark:border-gray-800 pt-4">
          <div className="flex flex-col items-center">
            <span className="text-lg font-bold text-gray-900 dark:text-white">{stats.posts}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold">Posts</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-lg font-bold text-gray-900 dark:text-white">{stats.events}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold">Events</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-lg font-bold text-gray-900 dark:text-white">{stats.followers}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold">Followers</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-lg font-bold text-gray-900 dark:text-white">{stats.following}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold">Following</span>
          </div>
        </div>
      </div>
    </div>
  );
}