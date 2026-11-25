export interface Route {
  name: string;
  path: string;
  expectText?: string;
  requiresAuth?: boolean;
}

export const ROUTES: Route[] = [
  { name: "Root", path: "/" },
  { name: "Landing", path: "/landing" },
  { name: "About", path: "/about" },
  { name: "FAQ", path: "/faq", expectText: "faq" },

  { name: "Login", path: "/login" },
  { name: "Register", path: "/register" },
  { name: "Signup", path: "/signup" },
  { name: "Verify", path: "/verify" },
  { name: "Premium", path: "/premium" },

  { name: "Grid Overview", path: "/grid" },
  { name: "Grid Discoveries", path: "/grid/discoveries" },
  { name: "Grid Analytics", path: "/grid/analytics" },

  { name: "Artists List", path: "/artists" },
  { name: "Artist Registration", path: "/artists/register" },
  { name: "My Artist Page", path: "/artists/me", requiresAuth: true },

  { name: "TicketAI Home", path: "/ticketai" },
  { name: "TicketAI Social", path: "/ticketai/social" },
  { name: "TicketAI Artist", path: "/ticketai/artist" },
  { name: "TicketAI Analytics", path: "/ticketai/analytics" },

  { name: "Social Feed", path: "/social" },
  { name: "Music Social", path: "/social/music" },

  { name: "HomeLoggedIn", path: "/home", requiresAuth: true },
  { name: "Dashboard", path: "/dashboard", requiresAuth: true },
  { name: "Notifications", path: "/notifications", requiresAuth: true },
];