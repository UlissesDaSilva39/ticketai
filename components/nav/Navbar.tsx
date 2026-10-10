'use client';

import { PRIMARY_NAV } from '@/config/navigation';
import { Logo } from './Logo';
import { NavLink } from './NavLink';
import { NavDropdown } from './NavDropdown';
import { NotificationBell } from './NotificationBell';
import { ProfileMenu } from './ProfileMenu';

export type NavbarUser = {
  email: string | null;
  username: string | null;
  role: string | null;
  artistSlug: string | null;
  displayName: string | null;
  pendingRequestCount: number;
} | null;

export function Navbar({
  user,
  notificationCount = 0,
}: {
  user: NavbarUser;
  notificationCount?: number;
}) {
  const signedIn = !!user;

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
      <nav className="mx-auto flex h-16 max-w-[1400px] items-center gap-2 px-6">
        <Logo />

        <ul className="ml-6 hidden md:flex items-center gap-1">
          {PRIMARY_NAV.map((item) => {
            if (item.auth === 'user' && !signedIn) return null;
            return (
              <li key={item.key}>
                {'dropdown' in item && item.dropdown ? (
                  <NavDropdown
                    label={item.label}
                    dropdownKey={item.dropdown as any}
                    href={item.href}
                  />
                ) : (
                  <NavLink href={item.href}>{item.label}</NavLink>
                )}
              </li>
            );
          })}
        </ul>

        <div className="ml-auto flex items-center gap-3">
          {signedIn ? (
            <>
              <NotificationBell count={notificationCount} />
              <ProfileMenu user={user} />
            </>
          ) : (
            <>
              <a
                href="/login"
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-black"
              >
                Log in
              </a>
              <a
                href="/signup"
                className="rounded-full bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-900"
              >
                Sign up
              </a>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
