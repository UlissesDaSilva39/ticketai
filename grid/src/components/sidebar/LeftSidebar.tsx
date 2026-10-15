import Link from "next/link";
import { Home, Music, Search, Ticket, Users, MessageSquare, UserCheck, Network, Sparkles, LayoutDashboard } from "lucide-react";

const library = [
  { label: "Home",          href: "/feed",          icon: Home },
  { label: "Artists",       href: "/artists",       icon: Music },
  { label: "Search",        href: "/search",        icon: Search },
  { label: "My Tickets",    href: "/tickets",       icon: Ticket },
  { label: "Friends",       href: "/friends",       icon: Users },
  { label: "Messages",      href: "/messages",      icon: MessageSquare },
  { label: "Following",     href: "/following",     icon: UserCheck },
  { label: "Network",       href: "/network",       icon: Network },
  { label: "Opportunities", href: "/opportunities", icon: Sparkles },
  { label: "Dashboard",     href: "/dashboard",     icon: LayoutDashboard },
];

export function LeftSidebar() {
  return (
    <aside className="feed-sidebar feed-sidebar--left">
      <div className="card">
        <div className="left-profile">
          <div className="avatar">D</div>
          <div>
            <div className="name">Profile</div>
            <div className="handle">@username</div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="library-label">Your Library</div>
        <ul className="library">
          {library.map(item => {
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link href={item.href}>
                  <span className="ico"><Icon size={16} /></span>
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="card">
        <div className="title" style={{ textTransform: "none", fontSize: 14, letterSpacing: 0 }}>
          Find events near you
        </div>
        <p className="side-sub">Browse by city, genre, and date.</p>
        <Link href="/discover" className="btn btn--block">Explore</Link>
      </div>

      <div className="card">
        <div className="title" style={{ textTransform: "none", fontSize: 14, letterSpacing: 0 }}>
          Grow on GRID
        </div>
        <p className="side-sub">Get verified, unlock booking tools and AI.</p>
        <button className="btn btn--dark btn--block">Upgrade to Pro</button>
      </div>
    </aside>
  );
}