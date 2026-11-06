import Link from 'next/link';
import { Sidebar } from '@/components/sidebar/Sidebar';

export default function Discover() {
  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen">
      <div className="mx-auto max-w-[1400px] px-6 py-6 grid grid-cols-12 gap-6">
        <nav aria-label="Your library" className="col-span-12 lg:col-span-3">
          <Sidebar />
        </nav>
        <main className="col-span-12 lg:col-span-9 space-y-6">
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Discover Events</h1>
            <p className="text-gray-500 dark:text-gray-400">Browse by city, genre, and date. (Content coming soon)</p>
          </div>
        </main>
      </div>
    </div>
  );
}