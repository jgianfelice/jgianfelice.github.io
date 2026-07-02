'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

const NAV = [
  { href: '/projects', label: 'Projects' },
  { href: '/certifications', label: 'Certifications' },
  { href: '/learning', label: 'Learning' },
  { href: '/logs', label: 'Logs' },
  { href: '/about', label: 'About' },
];

export default function Nav() {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const [open, setOpen] = useState(false);

  // Close the menu whenever the route changes.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-50 mix-blend-difference">
        <nav className="container-editorial flex items-center justify-between h-20">
          <Link
            href="/"
            className={`font-serif text-lg tracking-tight text-ink transition-opacity ${
              isHome ? 'opacity-0 pointer-events-none' : 'opacity-100'
            }`}
          >
            Justin Gianfelice
          </Link>

          {!isHome && (
            <>
              <div className="hidden md:flex items-center gap-8">
                {NAV.map((item) => {
                  const active = pathname?.startsWith(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`text-sm link-underline transition-colors ${
                        active ? 'text-ink' : 'text-muted hover:text-ink'
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </div>

              {/* Mobile toggle — just strokes, so it reads fine through the
                  blend against any backdrop. */}
              <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                aria-label={open ? 'Close menu' : 'Open menu'}
                aria-expanded={open}
                className="-mr-2 flex h-10 w-10 items-center justify-center text-ink md:hidden"
              >
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  {open ? (
                    <path d="M5 5l12 12M17 5L5 17" />
                  ) : (
                    <path d="M3 7h16M3 15h16" />
                  )}
                </svg>
              </button>
            </>
          )}
        </nav>
      </header>

      {/* Mobile menu overlay — kept OUT of the blended header so its panel
          renders as a solid surface, not an inverted one. */}
      {!isHome && (
        <div
          className={`fixed inset-0 z-40 md:hidden transition-opacity duration-300 ${
            open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        >
          <div
            className="absolute inset-0 bg-base/80 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <nav className="absolute inset-x-0 top-0 border-b border-line bg-surface/95 px-6 pb-8 pt-24 backdrop-blur-md">
            <ul className="flex flex-col">
              {NAV.map((item, i) => {
                const active = pathname?.startsWith(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="flex items-baseline gap-4 border-t border-line py-4 font-mono text-lg"
                    >
                      <span className="text-xs tabular-nums text-faint">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className={active ? 'text-accent' : 'text-ink'}>
                        {item.label}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      )}
    </>
  );
}
