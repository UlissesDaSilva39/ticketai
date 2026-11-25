import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="text-xs font-semibold text-gray-500 hover:text-emerald-600 mb-6 inline-block">Back to GRID</Link>

        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">About GRID</h1>
          <p className="text-lg text-gray-600 dark:text-zinc-400">
            Building the operating system for the UK music industry.
          </p>
        </div>

        <div className="prose prose-lg dark:prose-invert max-w-none">
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-8 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our mission</h2>
            <p className="text-gray-700 dark:text-zinc-300 mb-4">
              GRID exists to make the music industry work for independent artists. Too many producers, vocalists, and DJs spend more time on admin than making music. We're changing that.
            </p>
            <p className="text-gray-700 dark:text-zinc-300">
              GRID connects the dots: find collaborators, book sessions, sell your work, get paid, track your royalties. All in one place, built for the way real musicians actually work.
            </p>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-8 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Founder story</h2>
            <p className="text-gray-700 dark:text-zinc-300 mb-4">
              Ulisses Silva is a music producer and DJ based in London. After years of building tracks and playing gigs, he got tired of:
            </p>
            <ul className="space-y-2 text-gray-700 dark:text-zinc-300 ml-6">
              <li className="list-disc">Finding collaborators through Instagram DMs</li>
              <li className="list-disc">Chasing payments through WhatsApp</li>
              <li className="list-disc">Tracking royalties in spreadsheets</li>
              <li className="list-disc">Losing 30% of his earnings to middlemen</li>
            </ul>
            <p className="text-gray-700 dark:text-zinc-300 mt-4">
              So he built GRID: the platform he wished existed when he started.
            </p>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-8 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">What we're building</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="font-bold text-gray-900 dark:text-white mb-1">For producers</p>
                <p className="text-sm text-gray-600 dark:text-zinc-400">Find vocalists, book sessions, sell sample packs, get matched to gigs.</p>
              </div>
              <div>
                <p className="font-bold text-gray-900 dark:text-white mb-1">For vocalists</p>
                <p className="text-sm text-gray-600 dark:text-zinc-400">Get discovered, set your rate, book sessions, track your royalties.</p>
              </div>
              <div>
                <p className="font-bold text-gray-900 dark:text-white mb-1">For labels & studios</p>
                <p className="text-sm text-gray-600 dark:text-zinc-400">Post gigs, find talent, manage licensing, run promotions.</p>
              </div>
              <div>
                <p className="font-bold text-gray-900 dark:text-white mb-1">For venues & promoters</p>
                <p className="text-sm text-gray-600 dark:text-zinc-400">List events, sell tickets, track attendance, manage resale.</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-8 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Get in touch</h2>
            <div className="space-y-3">
              <p className="text-gray-700 dark:text-zinc-300">
                <strong>Email:</strong> <a href="mailto:hello@grid.app" className="text-emerald-600 hover:underline">hello@grid.app</a>
              </p>
              <p className="text-gray-700 dark:text-zinc-300">
                <strong>Company:</strong> GRID Music Ltd. · Registered in England & Wales
              </p>
              <p className="text-gray-700 dark:text-zinc-300">
                <strong>Office:</strong> London, UK
              </p>
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <Link href="/join" className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 py-3 rounded-lg">
            Join the waitlist →
          </Link>
        </div>
      </div>
    </div>
  );
}