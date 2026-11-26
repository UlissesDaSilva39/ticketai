import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-zinc-900 text-gray-400 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <p className="text-white font-bold text-lg mb-3">GRID</p>
            <p className="text-xs">The music industry network. Find collaborators, book sessions, get paid.</p>
          </div>
          <div>
            <p className="text-white font-bold text-sm mb-3">Product</p>
            <ul className="space-y-2 text-xs">
              <li><Link href="/network" className="hover:text-emerald-400 transition-colors">Network</Link></li>
              <li><Link href="/jobs" className="hover:text-emerald-400 transition-colors">Jobs</Link></li>
              <li><Link href="/marketplace" className="hover:text-emerald-400 transition-colors">Marketplace</Link></li>
              <li><Link href="/events" className="hover:text-emerald-400 transition-colors">Events</Link></li>
              <li><Link href="/billboard" className="hover:text-emerald-400 transition-colors">Billboard</Link></li>
              <li><Link href="/pro" className="hover:text-emerald-400 transition-colors">Pricing</Link></li>
            </ul>
          </div>
          <div>
            <p className="text-white font-bold text-sm mb-3">Company</p>
            <ul className="space-y-2 text-xs">
              <li><Link href="/about" className="hover:text-emerald-400 transition-colors">About</Link></li>
              <li><Link href="/licensing" className="hover:text-emerald-400 transition-colors">Licensing</Link></li>
              <li><Link href="/join" className="hover:text-emerald-400 transition-colors">Join</Link></li>
              <li><a href="mailto:hello@grid.app" className="hover:text-emerald-400 transition-colors">Contact</a></li>
            </ul>
          </div>
          <div>
            <p className="text-white font-bold text-sm mb-3">Legal</p>
            <ul className="space-y-2 text-xs">
              <li><Link href="/terms" className="hover:text-emerald-400 transition-colors">Terms</Link></li>
              <li><Link href="/privacy" className="hover:text-emerald-400 transition-colors">Privacy</Link></li>
              <li><Link href="/cookies" className="hover:text-emerald-400 transition-colors">Cookies</Link></li>
              <li><Link href="/gdpr" className="hover:text-emerald-400 transition-colors">GDPR</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-zinc-800 pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
          <p>© 2026 GRID Music Ltd. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors">Instagram</a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors">Twitter</a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors">LinkedIn</a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors">YouTube</a>
          </div>
        </div>
      </div>
    </footer>
  );
}