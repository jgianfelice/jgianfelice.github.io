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
      {/* A soft top scrim keeps the mark and links legible as content scrolls
          under the fixed bar, without a hard header rule. */}
      <header className="fixed inset-x-0 top-0 z-50 bg-gradient-to-b from-base via-base/80 to-transparent">
        <nav className="container-editorial flex h-20 items-center justify-between">
          <Link
            href="/"
            className={`font-mono text-[0.72rem] font-medium uppercase tracking-[0.2em] text-ink transition-colors hover:text-accent ${
              isHome ? 'pointer-events-none opacity-0' : 'opacity-100'
            }`}
          >
            Justin&nbsp;Gianfelice
          </Link>

          {!isHome && (
            <>
              <div className="hidden items-center gap-7 md:flex">
                {NAV.map((item) => {
                  const active = pathname?.startsWith(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`link-underline font-mono text-[0.72rem] uppercase tracking-[0.16em] transition-colors ${
                        active ? 'text-accent' : 'text-muted hover:text-ink'
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                aria-label={open ? 'Close menu' : 'Open menu'}
                aria-expanded={open}
                className="-mr-2 flex h-10 w-10 items-center justify-center text-ink md:hidden"
              >
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  {open ? <path d="M5 5l12 12M17 5L5 17" /> : <path d="M3 7h16M3 15h16" />}
                </svg>
              </button>
            </>
          )}
        </nav>
      </header>

      {/* Mobile menu overlay — a solid surface, editorial list with the active
          item in Fraunces. */}
      {!isHome && (
        <div
          className={`fixed inset-0 z-40 md:hidden transition-opacity duration-300 ${
            open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
          }`}
        >
          <div
            className="absolute inset-0 bg-base/70 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <nav className="absolute inset-x-0 top-0 border-b border-line bg-elevated/95 px-6 pb-10 pt-24 backdrop-blur-md">
            <ul className="flex flex-col">
              {NAV.map((item) => {
                const active = pathname?.startsWith(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="group flex items-center justify-between border-t border-line py-5"
                    >
                      <span
                        className={`text-2xl ${
                          active
                            ? 'font-serif font-light italic text-accent'
                            : 'font-mono text-ink'
                        }`}
                      >
                        {item.label}
                      </span>
                      <span className="font-mono text-muted transition-transform duration-300 group-hover:translate-x-1">
                        →
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
