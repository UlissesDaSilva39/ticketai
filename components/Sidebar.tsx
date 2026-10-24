'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

// ============ SVG ICONS ============
const IconHome = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
const IconSearch = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
const IconTicket = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v2z"/><line x1="9" y1="12" x2="15" y2="12"/></svg>;
const IconUsers = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const IconMessage = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>;
const IconStar = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
const IconBriefcase = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>;
const IconGrid = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>;
const IconCompass = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>;

export default function Sidebar() {
  const pathname = usePathname();

  const discoverItems = [
    { name: 'Artists', href: '/discover/artists', icon: <IconUsers /> },
    { name: 'Venues', href: '/discover/venues', icon: <IconGrid /> },
    { name: 'Events', href: '/discover/events', icon: <IconSearch /> },
    { name: 'Promoters', href: '/discover/promoters', icon: <IconUsers /> },
    { name: 'Festivals', href: '/discover/festivals', icon: <IconUsers /> },
    { name: 'Labels', href: '/discover/labels', icon: <IconUsers /> },
  ];

  const libraryItems = [
    { name: 'Home', href: '/', icon: <IconHome /> },
    { name: 'My Tickets', href: '/tickets', icon: <IconTicket /> },
    { name: 'Friends', href: '/friends', icon: <IconUsers /> },
    { name: 'Messages', href: '/messages', icon: <IconMessage /> },
    { name: 'Following', href: '/following', icon: <IconStar /> },
    { name: 'Network', href: '/network', icon: <IconUsers /> },
    { name: 'Opportunities', href: '/opportunities', icon: <IconBriefcase /> },
    { name: 'Dashboard', href: '/dashboard', icon: <IconGrid /> },
  ];

  return (
    <aside style={{ 
      width: 260, 
      background: '#ffffff', 
      borderRight: '1px solid #e5e7eb', 
      padding: '24px 16px', 
      display: 'flex', 
      flexDirection: 'column', 
      position: 'fixed', 
      top: 64, 
      bottom: 0, 
      left: 0, 
      zIndex: 40,
      overflowY: 'auto'
    }}>
      
      {/* DISCOVER SECTION */}
      <div style={{ padding: '0 12px', marginBottom: 16, flexShrink: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
        <IconCompass />
        <h2 style={{ fontSize: 13, fontWeight: 800, margin: 0, color: '#6b7280', letterSpacing: '0.05em' }}>DISCOVER</h2>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 24 }}>
        {discoverItems.map(item => {
          const isActive = pathname === item.href || pathname.startsWith(item.href);
          return (
            <Link key={item.name} href={item.href} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: 8, textDecoration: 'none', background: isActive ? '#f3f4f6' : 'transparent', color: isActive ? '#111827' : '#6b7280', fontWeight: isActive ? 700 : 500, fontSize: 14 }}>
              <span style={{ color: isActive ? '#111827' : '#9ca3af' }}>{item.icon}</span>
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* DIVIDER */}
      <div style={{ height: 1, background: '#e5e7eb', margin: '0 12px 24px' }} />

      {/* YOUR LIBRARY SECTION */}
      <div style={{ padding: '0 12px', marginBottom: 16, flexShrink: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
        <h2 style={{ fontSize: 13, fontWeight: 800, margin: 0, color: '#6b7280', letterSpacing: '0.05em' }}>YOUR LIBRARY</h2>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
        {libraryItems.map(item => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          return (
            <Link key={item.name} href={item.href} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: 8, textDecoration: 'none', background: isActive ? '#f3f4f6' : 'transparent', color: isActive ? '#111827' : '#6b7280', fontWeight: isActive ? 700 : 500, fontSize: 14 }}>
              <span style={{ color: isActive ? '#111827' : '#9ca3af' }}>{item.icon}</span>
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* ADVERTISE BANNER */}
      <div style={{ marginTop: 24, marginBottom: 24, background: 'linear-gradient(135deg, #111827, #1f2937)', borderRadius: 12, padding: 20, color: 'white', flexShrink: 0 }}>
        <p style={{ fontSize: 11, fontWeight: 700, margin: '0 0 4px', color: '#9ca3af', letterSpacing: 0.5, textTransform: 'uppercase' }}>Sponsored</p>
        <h4 style={{ fontSize: 15, fontWeight: 800, margin: '0 0 8px', lineHeight: 1.2 }}>Promote your event here</h4>
        <p style={{ fontSize: 12, color: '#d1d5db', margin: '0 0 16px' }}>Reach thousands of promoters and artists on GRID.</p>
        <button onClick={() => window.location.href = '/advertise'} style={{ width: '100%', padding: '10px 0', borderRadius: 8, background: 'white', color: '#111827', border: 'none', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
          Advertise Now
        </button>
      </div>

      {/* PROFILE */}
      <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: 16, flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 12px', borderRadius: 8, cursor: 'pointer' }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#7c5cff', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 14 }}>D</div>
          <div>
            <p style={{ fontSize: 13, fontWeight: 700, margin: 0 }}>Profile</p>
            <p style={{ fontSize: 11, color: '#6b7280', margin: 0 }}>View settings</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
