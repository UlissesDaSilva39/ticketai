'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PRIMARY_NAV } from '@/config/navigation';
import { NavLink } from './NavLink';
import { NavDropdown } from './NavDropdown';
import { ProfileMenu } from './ProfileMenu';
import { NotificationBell } from './NotificationBell';
import { Logo } from './Logo';

export type NavbarUser = {
  id: string;
  name: string;
  avatarUrl?: string | null;
} | null;

export function Navbar({ user }: { user: NavbarUser }) {
  const pathname = usePathname() || '/';

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
      <nav className="mx-auto flex h-16 max-w-[1400px] items-center gap-2 px-6">
        <Logo />
        <ul className="flex flex-1 items-center gap-1 ml-6">
          {PRIMARY_NAV.map((item) =>
            item.dropdown ? (
              <li key={item.key}>
                <NavDropdown item={item} pathname={pathname} />
              </li>
            ) : (
              <li key={item.key}>
                <NavLink href={item.href}>{item.label}</NavLink>
              </li>
            )
          )}
        </ul>
        <div className="flex items-center gap-2">
          <NotificationBell />
          <ProfileMenu user={user} />
        </div>
      </nav>
    </header>
  );
}
