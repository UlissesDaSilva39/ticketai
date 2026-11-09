import Link from "next/link";

export default function NotFound() {
  return (
    <div className="bg-[#f4f2ee] dark:bg-black min-h-screen flex items-center justify-center p-4">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-xl p-12 max-w-md text-center">
        <h1 className="text-6xl font-bold text-emerald-600 mb-4">404</h1>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Page Not Found</h2>
        <p className="text-gray-500 mb-8">This page doesn't exist or has been moved. Check the URL or return home.</p>
        <Link href="/home" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 py-3 rounded-lg inline-block transition-colors">
          Back to Home
        </Link>
      </div>
    </div>
  );
}