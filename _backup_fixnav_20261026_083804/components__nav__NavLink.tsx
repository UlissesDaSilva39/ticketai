'use client';

import { usePathname } from 'next/navigation';

export function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const active = pathname === href;

  return (
    <a
      href={href}
      className={[
        'px-3 py-2 text-sm font-medium transition-colors',
        active ? 'text-black' : 'text-gray-700 hover:text-black',
      ].join(' ')}
    >
      {children}
    </a>
  );
}
