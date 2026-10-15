export function Footer() {
  return (
    <footer className="mt-10 border-t border-neutral-800 py-6 text-center text-xs text-neutral-500">
      <div className="mb-3 flex flex-wrap justify-center gap-4">
        <a href="/terms">Terms of Service</a>
        <a href="/privacy">Privacy Policy</a>
        <a href="/refund">Refund Policy</a>
        <a href="/contact">Contact</a>
      </div>
      <p>Discover · Connect · Create · Book · Grow</p>
      <p className="mt-1">© 2026 GRID. All rights reserved.</p>
    </footer>
  );
}