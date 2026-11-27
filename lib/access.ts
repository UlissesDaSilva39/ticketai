// Which pages logged-out visitors may see. Everything else requires login.
//
// This is an ALLOW list: a new page is members-only unless it's added here.
// Public = marketing, sign up / log in, pricing, legal, and links people share
// (articles, newsletters, EPKs and public profiles, single events, smart links).
// Used by proxy.ts (the login gate) and ClientLayout (guest vs member top bar).
// Plain module: no imports, safe on the server, in the proxy and in the browser.

const PUBLIC_EXACT = new Set([
  "/",
  // account
  "/login", "/register", "/signup", "/forgot-password", "/reset-password", "/unauthorized",
  // pricing & marketing
  "/pro", "/premium", "/about", "/contact", "/faq", "/for-promoters", "/for-venues", "/advertise",
  // legal
  "/terms", "/privacy", "/cookies", "/gdpr", "/legal", "/refund-policy", "/refunds",
  // licensing explainer (buying, selling and "My licences" still require login)
  "/licensing",
]);

const SEG = "[^/]+";
const not = (...words: string[]) => `(?!(?:${words.join("|")})$)`;

// Shared links: a single item, never a directory or a members' tool.
const PUBLIC_PATTERNS: RegExp[] = [
  /^\/auth(\/|$)/,
  /^\/legal\/[^/]+$/,
  // newsletters & articles
  new RegExp(`^/articles/[0-9a-f-]{36}$`),
  new RegExp(`^/newsletters/${not("new")}${SEG}$`),
  // EPKs and public profiles
  new RegExp(`^/artists/${not("me")}${SEG}$`),
  new RegExp(`^/artist/${not("dashboard", "register")}${SEG}$`),
  new RegExp(`^/u/${SEG}$`),
  new RegExp(`^/people/${SEG}$`),
  new RegExp(`^/djs/${SEG}$`),
  new RegExp(`^/promoters/${not("join")}${SEG}$`),
  new RegExp(`^/venues/${not("join")}${SEG}$`),
  new RegExp(`^/venue/${not("dashboard")}${SEG}$`),
  new RegExp(`^/labels/${SEG}$`),
  new RegExp(`^/organizers/${SEG}$`),
  new RegExp(`^/records/artist/${SEG}$`),
  new RegExp(`^/shop/${SEG}$`),
  // single events and things linked from them
  new RegExp(`^/event/${SEG}$`),
  new RegExp(`^/events/${not("my-tickets", "commissions")}${SEG}$`),
  new RegExp(`^/clubs/${SEG}/${SEG}$`),
  new RegExp(`^/book/artist/${SEG}$`),
  new RegExp(`^/book/${SEG}/${SEG}$`),
  new RegExp(`^/licensing/deal/${SEG}$`),
  // GRID LIVE rooms (shared links; chatting and gifting still need login)
  new RegExp(`^/live/[0-9a-f-]{36}$`),
  // Backstage join pages (joining and reading posts still need login)
  new RegExp(`^/backstage/${SEG}$`),
  // other shareable links
  new RegExp(`^/smart/${SEG}$`),
  new RegExp(`^/share/analytics/${SEG}$`),
  new RegExp(`^/resale/${SEG}$`),
  new RegExp(`^/post/${SEG}$`),
  new RegExp(`^/tracks/${not("new", "collab", "purchases")}${SEG}$`),
  new RegExp(`^/playlists/${SEG}$`),
  new RegExp(`^/merch/${not("orders", "success", "cancel")}${SEG}$`),
  new RegExp(`^/stream/watch/${SEG}$`),
  new RegExp(`^/stream/${not("live", "upload", "watch")}${SEG}$`),
];

/** True when a logged-out visitor may open this page. */
export function isPublicPath(pathname: string): boolean {
  const p = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  // Files served from /public and generated metadata (robots.txt, sitemap.xml, icons…).
  if (/\.[a-z0-9]{2,12}$/i.test(p)) return true;
  if (PUBLIC_EXACT.has(p)) return true;
  return PUBLIC_PATTERNS.some((re) => re.test(p));
}
