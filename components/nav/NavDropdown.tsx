'use client';
import Link from 'next/link';
import { useState } from 'react';
import { DROPDOWN_MAP } from '@/config/navigation';
import type { NavItem } from '@/config/navigation';

export function NavDropdown({ item, pathname }: { item: NavItem; pathname?: string }) {
  const [open, setOpen] = useState(false);
  const key = item.dropdown;
  const dropdown = key ? DROPDOWN_MAP[key] : undefined;

  if (!dropdown) {
    return (
      <Link href={item.href} className="px-3 py-2 text-sm font-medium text-neutral-700 hover:text-neutral-900">
        {item.label}
      </Link>
    );
  }

  const isActive = pathname ? pathname.startsWith(item.href) : false;

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        className={
          'inline-flex items-center gap-1 rounded-full px-3 py-2 text-sm font-medium transition ' +
          (isActive ? 'text-neutral-900 bg-neutral-100' : 'text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100')
        }
      >
        {item.label}
        <span className="text-[10px] opacity-60">▾</span>
      </button>

      {open && (
        <div className="absolute left-0 top-full pt-2 z-50">
          <div className="min-w-[220px] rounded-2xl border border-gray-200 bg-white p-2 shadow-lg">
            {dropdown.sections.map((section) => (
              <div key={section.title} className="py-1">
                <div className="px-3 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                  {section.title}
                </div>
                {section.items.map((sub) => (
                  <Link
                    key={sub.href + sub.label}
                    href={sub.href}
                    className="block rounded-lg px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900"
                  >
                    {sub.label}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
