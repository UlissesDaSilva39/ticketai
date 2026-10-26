'use client';

import Link from 'next/link';
import { useState } from 'react';
import { INDUSTRY_NAV_COLUMNS, INDUSTRY_QUICK_ACTIONS } from '@/config/industryNav';

export function IndustryDropdown({ pathname }: { pathname?: string }) {
  const [open, setOpen] = useState(false);
  const isActive = pathname ? pathname.startsWith('/industry') || pathname.startsWith('/rider') : false;

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
          (isActive ? 'bg-neutral-100 text-neutral-900' : 'text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900')
        }
      >
        Industry
        <span className="text-[10px] opacity-60">▾</span>
      </button>

      {open && (
        <div className="absolute left-1/2 -translate-x-1/2 top-full pt-2 z-50">
          <div className="w-[900px] max-w-[95vw] rounded-2xl border border-gray-200 bg-white shadow-xl">
            <div className="grid grid-cols-4 gap-x-6 gap-y-4 p-6">
              {INDUSTRY_NAV_COLUMNS.map((col) => (
                <div key={col.category}>
                  <Link
                    href={col.categoryHref}
                    className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 hover:text-violet-600 mb-1"
                  >
                    {col.label}
                  </Link>
                  <div className="text-[10px] text-gray-400 mb-2 leading-tight">{col.description}</div>
                  <ul className="space-y-1">
                    {col.links.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className="block text-sm text-neutral-700 hover:text-violet-600 hover:bg-neutral-50 rounded px-2 py-1 -mx-2"
                        >
                          {link.label} →
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 bg-gray-50 rounded-b-2xl px-6 py-3 flex items-center justify-between">
              <div className="flex gap-4">
                {INDUSTRY_QUICK_ACTIONS.map((action) => (
                  <Link
                    key={action.href}
                    href={action.href}
                    className="text-sm font-medium text-neutral-700 hover:text-violet-600"
                  >
                    {action.icon} {action.label}
                  </Link>
                ))}
              </div>
              <Link href="/industry" className="text-sm font-semibold text-violet-600 hover:text-violet-700">
                Browse all →
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
