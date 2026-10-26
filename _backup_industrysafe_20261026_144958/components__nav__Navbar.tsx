'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PRIMARY_NAV } from '@/config/navigation';
import { NavLink } from './NavLink';
import { NavDropdown } from './NavDropdown';
import { ProfileMenu } from './ProfileMenu';
import { NotificationBell } from './NotificationBell';
import { Logo } from './Logo';
import type { UserWithRole, Role } from '@/lib/roles';
import { getUserRole } from '@/lib/roles';

export type NavbarUser = UserWithRole;

/** Filter nav items by the user's role */
function visibleNavForRole(role: Role) {
  return PRIMARY_NAV.filter((item) => {
    if (!item.auth || item.auth.length === 0) return true;
    return item.auth.includes(role as any);
  });
}

export function Navbar({ user }: { user: NavbarUser }) {
  const pathname = usePathname() || '/';
  const role = getUserRole(user);
  const visibleNav = visibleNavForRole(role);

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
      <nav className="mx-auto flex h-16 max-w-[1400px] items-center gap-2 px-6">
        <Logo />
        <ul className="flex flex-1 items-center gap-1 ml-6">
          {visibleNav.map((item) =>
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
          {user ? (
            <>
              <NotificationBell />
              <ProfileMenu user={user} />
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-full px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="rounded-full bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-neutral-800"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

