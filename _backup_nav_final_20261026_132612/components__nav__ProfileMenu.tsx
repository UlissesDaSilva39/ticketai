'use client';

import { useRef, useState } from 'react';
import { PROFILE_MENU } from '@/config/navigation';
import { useClickOutside } from '@/hooks/useClickOutside';
import { ChevronDown } from 'lucide-react';
import type { NavbarUser } from './Navbar';

export function ProfileMenu({ user }: { user: NonNullable<NavbarUser> }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, () => setOpen(false));

  const displayName =
    user.displayName || user.username || user.email?.split('@')[0] || 'You';
  const initial = displayName[0]?.toUpperCase() ?? 'U';

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-full py-1 pl-1 pr-3 hover:bg-gray-100"
      >
        <span className="grid h-8 w-8 place-items-center rounded-full bg-black text-xs font-bold text-white">
          {initial}
        </span>
        <span className="text-sm font-medium text-gray-700">Profile</span>
        <ChevronDown className="h-3.5 w-3.5 text-gray-500" />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-[280px] rounded-2xl border border-gray-200 bg-white shadow-lg z-50">
          <div className="border-b border-gray-100 px-4 py-3">
            <div className="text-sm font-semibold text-gray-900">
              {displayName}
            </div>
            <div className="text-xs text-gray-500">
              {user.email ?? '@' + (user.username ?? 'user')}
            </div>
          </div>

          {PROFILE_MENU.sections.map((section) => (
            <div key={section.title} className="border-b border-gray-100 py-2 last:border-0">
              <div className="px-4 pb-1 pt-1 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                {section.title}
              </div>
              <ul>
                {section.items.map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-black"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="border-t border-gray-100 py-2">
            {PROFILE_MENU.footer.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-black"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
