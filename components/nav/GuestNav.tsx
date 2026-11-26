import Link from "next/link";

/** Top bar for logged-out visitors on public pages (articles, EPKs, pricing, legal…). */
export default function GuestNav() {
  return (
    <nav className="w-full bg-white dark:bg-zinc-950 border-b border-gray-200 dark:border-zinc-800 sticky top-0 z-50">
      <div className="max-w-[1280px] mx-auto px-4 flex justify-between items-center h-14 gap-4">
        <Link href="/" className="text-xl font-bold text-emerald-600 tracking-tight">GRID</Link>
        <div className="flex items-center gap-2 sm:gap-4">
          <Link href="/pro" className="hidden sm:inline text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-emerald-600">Pricing</Link>
          <Link href="/login" className="text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-emerald-600 px-2">Log in</Link>
          <Link href="/signup" className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold px-4 sm:px-5 py-2 rounded-full transition-colors">Sign up free</Link>
        </div>
      </div>
    </nav>
  );
}
